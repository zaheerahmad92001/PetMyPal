import React from 'react';
import { View, Text, Platform, Alert, } from 'react-native';
import { Formik, Field, FormikProps } from 'formik';
import { Item, Input, Label, Container, Content } from 'native-base';
import _ from 'lodash';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import PMPHeader from '../../components/common/PMPHeader';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import { CustomInput, GetLocation, TimeModal, DateModal, HandleImage } from './customInput';
import { eventDetails } from './eventValidationSchema';
import styles from './styles';
import { getPersistToken, getCreateEventLoader } from '../../components/helpers/selectors/selectors';
import { petMyPalEventsApiService } from '../../services/PetMyPalEventsApiService';
import { server_key } from '../../constants/server';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorModal from '../../components/common/ErrorModal';
import CustomLoader from '../../components/common/CustomLoader';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { LongAboutParseHtml, ShortAboutParseHtml } from '../../components/helpers';
const { createEvent, editEvent, deleteEvent } = petMyPalEventsApiService



class CreateEvent extends React.Component {
    constructor(props) {
        super(props);
        const { item } = this.props.navigation.state.params ?? {};
        this.state = {
            EventName: item?.name ?? undefined,
            EventLocation: item?.location ?? undefined,
            EventDescripton: item?.description ?? undefined,
            showStartDateModel: false,
            showEndDateModel: false,
            showEndTimeModel: false,
            start_date: item?.start_date ? this.getFormatedDate(item?.start_date) : false,
            StartDate: item?.start_date ? this.getFormatedDate(item?.start_date) : moment().utc().format('MM/DD/YYYY'),
            showStartTimeModel: false,
            end_date: item?.end_date ? this.getFormatedDate(item?.end_date) : false,
            EndDate: item?.end_date ? this.getFormatedDate(item?.end_date) : undefined,
            id: item?.id ?? undefined,
            start_time: item?.start_time ?? '',
            StartTime: item?.start_time ?? new Date(),
            end_time: item?.end_time ?? '',
            EndTime: item?.end_time ?? undefined,
            EventImage: item?.cover ? item.cover : undefined,
            customImage: item?.cover ? { name: 'eventimage', type: 'image/jpeg', uri: item?.cover } : undefined,
            InProcess: false,
            isConfirm_Modal_visible: false,
            showErrorModal: false,
            errMsg: '',


        }
        this.formRef = React.createRef()
    }


    componentDidMount() {
        this.getAccessToken();
    }
    getAccessToken = async () => {

    }
    getAccessToken = async () => {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN);
        this.setState({ token: JSON.parse(token).access_token })
    }

    getFormatedDate(date) {
        var formatedDate = moment(date, 'MM-DD-YYYY').format('MM/DD/YYYY');
        // var formatedDate =  moment().utc().format('MM/DD/YYYY')
        if (formatedDate == 'Invalid date') {
            formatedDate = moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
        }
        return formatedDate;
    }

    componentWillUnmount() {
        this.hideConfirmModal;
    }

    goBack = () => { this.props.navigation.pop() };

    renderButtons = () => {
        let jsx = [];

        if (_.isUndefined(this.state.id)) {
            jsx.push(<>
                <View
                    style={{
                        height: 42,
                        marginVertical: wp(7),
                        width: '100%',
                        alignSelf: 'center',
                        marginBottom: RFValue(10),
                    }}>
                    <SkyBlueBtn
                        title={'Publish'}
                        onPress={() => this.formRef.current?.handleSubmit()}
                        btnContainerStyle={styles.btnContainerStyle}
                    />
                </View></>)

        }
        else {

            jsx.push(<>
                <SkyBlueBtn
                    title={'Save Event'}
                    onPress={() => this.formRef.current?.handleSubmit()}
                    btnContainerStyle={{
                        ...styles.btnContainerStyle,
                        marginVertical: wp(7),
                        marginBottom: RFValue(10)
                    }} />

                <SkyBlueBtn
                    title={'Delete Event'}
                    onPress={() => this.openConfirmModal()}
                    btnContainerStyle={styles.btnContainerStyle}
                />
            </>)
        }
        return this.props.createEventLoader ?
            <View style={{ marginTop: wp(1) }}>
                <CustomLoader
                    loaderContainer={{ marginTop: 15, }}
                /></View>
            : jsx;
    }
    checkDateTimeDifference() {
        const { StartDate, StartTime, EndDate, EndTime } = this.formRef.current.values;
        
        if (new Date(StartDate).getTime() == new Date(EndDate).getTime()) {
            var startTime = moment(StartTime, "H:mm:ss");
            var endTime = moment(EndTime, "H:mm:ss");
            const diffInMin = moment(endTime).diff(moment(startTime), 'minutes');
            console.log(diffInMin)
            if (diffInMin < 0) {
                 this.formRef.current?.setErrors({
                   StartTime:
                     'Start time must be before end time.',
                 });
                
            }
           else if (diffInMin>=0 && diffInMin < 29) {
                this.formRef.current?.setErrors({ StartTime: 'Start time and End time difference must be 30 minutes. ' })
            }
            else {

                this.submitForm();
            }

        }
        else if (new Date(StartDate).getTime() > new Date(EndDate).getTime()) {
            this.formRef.current?.setErrors({ StartDate: 'Start Date must be before End Date. ' })

        }

        else {
            var Difference_In_Time = new Date(EndDate).getTime() - new Date(StartDate).getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            if (Difference_In_Days > 365) {
                this.formRef.current?.setErrors({ EndDate: 'Event span cannot be more than one year.' })

            }
            else {

                this.submitForm();
            }
        }
    }
    submitForm = () => {
        if (_.isUndefined(this.state.id)) {

            this.createEvent()
        }
        else {
            this.editEvent();
        }
    }
    createEvent() {
        const { StartDate, EndDate, StartTime, EndTime, EventImage, EventLocation, EventDescripton, EventName } = this.formRef.current?.values;

        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('event_name', EventName);
        formData.append('event_location', EventLocation);
        formData.append('event_description', EventDescripton);
        formData.append('event_start_date', moment(StartDate, 'MM/DD/YYYY').format('YYYY-MM-DD'));
        formData.append('event_end_date', moment(EndDate, 'MM/DD/YYYY').format('YYYY-MM-DD'));
        formData.append('event_start_time', moment(StartTime, 'H:mm').format('H:mm'));
        formData.append('event_end_time', moment(EndTime, 'H:mm').format('H:mm'));
        formData.append('event_cover', this.state.customImage);

        this.props.createEvent(this.state.token, formData, this.props.navigation)
    }
    editEvent() {
        const { StartDate, EndDate, StartTime, EndTime, EventImage, EventLocation, EventDescripton, EventName } = this.formRef.current?.values;

        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('type', 'edit');
        formData.append('event_name', EventName);
        formData.append('event_location', EventLocation);
        formData.append('event_description', EventDescripton);
        formData.append('event_start_date', moment(StartDate, 'MM/DD/YYYY').format('YYYY-MM-DD'))
        formData.append('event_end_date', moment(EndDate, 'MM/DD/YYYY').format('YYYY-MM-DD'));
        formData.append('event_start_time', moment(StartTime, 'H:mm').format('H:mm'));
        formData.append('event_end_time', moment(EndTime, 'H:mm').format('H:mm'));
        formData.append('event_id', this.state.id);
        formData.append('event-cover', this.state.customImage);
        console.log(formData, 'formData');

        this.props.editEvent(this.state.token, formData, this.props.navigation);


    }
    async deleteEvent() {
        this.setState({ InProcess: true })

        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('type', 'delete');
        formData.append('event_id', this.state.id);
        const response = await this.props.deleteEvent(this.state.token, formData, this.props.navigation)
        const { data } = response;
        if (data?.api_status == 200) {
            this.hideConfirmModal = setTimeout(() => {
                this.closeConfirmModal()
                this.props.navigation.pop(2)
            }, 1000);
        } else {
            this.closeConfirmModal()
            this.openErrorModal = setTimeout(() => {
                this.setState({
                    showErrorModal: true,
                    errMsg: data?.errors?.error_text
                })
            }, 1000);
        }
    }

    handleImage = (image) => {
        const coverImage = {
            name: image.name,
            type: 'image/jpeg',
            uri: image.uri
        }
        this.setState({ customImage: coverImage })

    }

    closeConfirmModal = () => {
        this.setState({
            isConfirm_Modal_visible: false,
            InProcess: false,
        })
    }

    openConfirmModal = () => {
        this.setState({
            isConfirm_Modal_visible: true,
            infoMsg: 'Are you sure you want to remove this event.',
        })
    }

    closeErrorModal = () => { this.setState({ showErrorModal: false }) }

    render() {
        const { InProcess, infoMsg, isConfirm_Modal_visible, showErrorModal, errMsg } = this.state
        return (
            <Container>
                <PMPHeader
                    centerText={'My Pages'}
                    ImageLeftIcon={'arrow-back'}
                    LeftPress={() => this.goBack()}
                    centerText={this.state?.id ? 'Edit Event' : 'Create Event'}
                />
                <Content>
                    {this.state.loading &&
                        <View style={{ position: 'absolute', top: wp(30), width: '100%', justifyContent: 'center', zIndex: 1 }}><PlaceholderLoader /></View>}
                    <View style={styles.viewForInput}>
                        <Formik
                            initialValues={this.state}
                            onSubmit={values => { this.checkDateTimeDifference() }}
                            validationSchema={eventDetails}
                            innerRef={this.formRef}

                        >
                            {({ handleSubmit, errors, isValid, values, touched, isValidating }) => {


                                return (
                                    <>

                                        <Label key={1} style={styles.bottomText}>
                                            Event Name
                                        </Label>
                                        <Field
                                            key={2}
                                            component={CustomInput}
                                            name='EventName'
                                            placeholderTextColor={'#bebebe'}
                                            placeholder="Enter Event Name"
                                            keyboardType="ascii-capable"
                                            defaultValue={this.state.EventName}
                                            maxLength={31}

                                        />


                                        <Label key={3} style={styles.bottomText}>
                                            Event Location
                                        </Label>
                                        <Field
                                            key={4}
                                            component={GetLocation}
                                            name='EventLocation'
                                            placeholderTextColor={'#bebebe'}
                                            placeholder="Enter Location"
                                            defaultValue={this.state.EventLocation}

                                        />

                                        <View key={5} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ width: wp(40), alignItems: 'flex-start' }}>
                                                <Label style={styles.bottomText}>Start Date</Label>
                                                <Field
                                                    component={DateModal}
                                                    name="StartDate"
                                                    title={'Start Date'}
                                                    minimumDate={moment(new Date())}
                                                    defaultValue={moment(this.state.StartDate)}


                                                />
                                            </View>

                                            <View key={7} style={{ width: wp(40), alignItems: 'flex-start' }}>
                                                <Label style={styles.bottomText}>Start Time</Label>
                                                <Field
                                                    component={TimeModal}
                                                    name="StartTime"
                                                    title={'Start Time'}
                                                    defaultValue={this.state.StartTime}
                                                />
                                            </View>
                                        </View>
                                        <View key={8} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ width: wp(40), alignItems: 'flex-start' }}>
                                                <Label style={styles.bottomText}>End Date</Label>
                                                <Field
                                                    component={DateModal}
                                                    name="EndDate"
                                                    title={'End Date'}
                                                    defaultValue={moment(this.state.EndDate)}
                                                    minimumDate={moment(values?.StartDate ?? new Date())}


                                                />
                                            </View>
                                            <View key={9} style={{ width: wp(40), alignItems: 'flex-start' }}>
                                                <Label style={styles.bottomText}>End Time</Label>
                                                <Field

                                                    component={TimeModal}
                                                    name="EndTime"
                                                    title={'End Time'}
                                                    defaultValue={this.state.EndTime}

                                                />
                                            </View>
                                        </View>

                                        <Label key={10} style={styles.bottomText}>
                                            Event Description
                                        </Label>
                                        <Field
                                            key={11}
                                            component={CustomInput}
                                            name='EventDescripton'
                                            placeholderTextColor={'#bebebe'}
                                            placeholder="Enter Description"
                                            keyboardType="default"
                                            defaultValue={LongAboutParseHtml(this.state.EventDescripton)}
                                            maxLength={200}
                                            multiline
                                            customHeight='auto'
                                        />
                                        <Field
                                            key={12}
                                            component={HandleImage}
                                            name="EventImage"
                                            handleImage={this.handleImage}


                                        />
                                        {this.renderButtons()}

                                    </>
                                )
                            }}

                        </Formik>

                    </View>

                </Content>
                <ConfirmModal
                    isVisible={isConfirm_Modal_visible}
                    info={infoMsg}
                    DoneTitle={'Ok'}
                    onDoneBtnPress={() => this.deleteEvent()}
                    CancelTitle={'Cancel'}
                    onCancelBtnPress={this.closeConfirmModal}
                    processing={InProcess}
                />
                <ErrorModal
                    isVisible={showErrorModal}
                    onBackButtonPress={() => this.closeErrorModal()}
                    info={errMsg}
                    heading={'Hoot!'}
                    onPress={() => this.closeErrorModal()}
                />
            </Container>

        )



    }

}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        token: getPersistToken(state),
        createEventLoader: getCreateEventLoader(state)

    }
}
export default connect(mapStateToProps, { createEvent, editEvent, deleteEvent })(CreateEvent);
