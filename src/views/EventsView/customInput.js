import React from 'react';
import { TextInput, StyleSheet, Dimensions, Text, View, Platform, TouchableOpacity, Image } from 'react-native';
import moment from 'moment';
import { Input } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import RNGooglePlaces from 'react-native-google-places';
import _ from 'lodash';
import ImagePicker from 'react-native-image-picker';

import { DANGER, grey, TEXT_GREY, TEXT_INPUT_LABEL } from '../../constants/colors';
import _DropDown from '../../components/common/dropDown';
import { petsCategory } from '../../constants/ConstantValues';
import _DatePicker from '../../components/common/_DatePicker';
import TimePicker from '../../components/updated/TimePicker';



const CustomInput = (props) => {
    const {
        field: { name, onBlur, onChange, value },
        form: { errors, touched, setFieldTouched, setFieldValue },
        ...inputProps
    } = props;


    const hasError = errors[name] && touched[name];
    return (
        <View style={{paddingLeft:wp(0.5)}}>
            <Input
                style={[hasError ? StyleSheet.flatten([styles.textInput, { borderColor:hasError? DANGER:'#bebebe' }]) : props?.customHeight? StyleSheet.flatten([ styles.textInput,{height:value?.length>30?props.customHeight:38}]):styles.textInput]}
                value={value}
                onChangeText={(text) => {
                    onChange(name)(text)
                }}
                onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                }}

                multiline
                {...inputProps}
            />
            {hasError && <Text style={[styles.errorText, { marginTop: wp(2), }]}>{errors[name]}</Text>}
        </View>
    )
}
const DateModal = (props) => {

    const {
        field: { name, onBlur, onChange, value },
        form: { errors, touched, setFieldTouched, setFieldValue },
        title, minimumDate, defaultValue, disabled,
        ...inputProps
    } = props;
    const hasError = errors[name] && touched[name];
    const [showModal, setShowModal] = React.useState(false);
    function getFullDate(date) {
        if (date.includes('-')) {
            const t = moment(date).utc().format('MM/DD/YYYY');

            return t;
        }
        return date;


    }

    return (
        <>
            <TouchableOpacity 
            style={{width:'100%'}}
            onPress={() => setShowModal(true)}>
                <Text style={{ 
                    color: value ? 'black' : '#bebebe',
                    fontSize: RFValue(14), 
                    marginVertical: wp(2) }}>
                   {value ? getFullDate(value) : name == 'StartDate' ? moment().utc().format('MM/DD/YYYY') : 'Enter Date'}</Text>
            </TouchableOpacity>
            <_DatePicker
                minimumDate={minimumDate}
                date={value ? new Date(value) : new Date()}
                header={title}
                isVisible={showModal}
                onDateChange={(date) => { setFieldValue(name, moment.utc(date).local().format('MM/DD/YYYY')) }}
                onSelect={(date) => { value == undefined && setFieldValue(name, moment.utc(date).local().format('MM/DD/YYYY')); setShowModal(false) }}
                onClose={() => setShowModal(false)}

            />
            <View style={{ borderWidth: 0.5, width: wp(40), borderColor: hasError ?DANGER:'#bebebe' }} />

            {hasError && <Text style={[styles.errorText, { marginTop: wp(2) }]}>{errors[name]}</Text>}
        </>
    )
}
const TimeModal = (props) => {

    const {
        field: { name, onBlur, onChange, value },
        form: { errors, touched, setFieldTouched, setFieldValue },
        title, defaultValue, disabled,
        ...inputProps
    } = props;
    const hasError = errors[name] && touched[name];
    const [showModal, setShowModal] = React.useState(false);
    const setTime = (time) => {
        if (!_.isUndefined(time)) {
            setFieldValue(name, new Date(time));
        }
        else {

            setFieldValue(name, new Date());
            setShowModal(false);
        }

    }
    function getFormatedTime(time) {

        let timeFormat = moment.utc(time).local().format('YYYY-MM-DD HH:mm:ss');

        if (timeFormat == 'Invalid date') {
            return time.substr(0, 5);
        }
        let [date, _time] = timeFormat.split(' ')
        let [h, m, s] = _time.split(':')
        let Time = `${h}:${m}`;
        return Time;

    }
    const existingTimeFormat = (time) => {
        let timeFormat = moment.utc(time).local().format('YYYY-MM-DD HH:mm:ss');
        if (timeFormat == 'Invalid date') {
            return new Date();
        }
        return new Date(time);
    }

    return (
        <>
            <TouchableOpacity 
              style={{width:'100%'}}
              onPress={() => setShowModal(true)}>
                <Text style={{ 
                    color: value ? 'black' : '#bebebe',
                    fontSize: RFValue(14), marginBottom: wp(2.5), marginTop: wp(2) }}>
                    {value ? getFormatedTime(value) : name == 'StartTime' ? getFormatedTime(moment().local()) : 'Enter Time'}</Text>
            </TouchableOpacity>
            <TimePicker
                isVisible={showModal}
                time={value ? existingTimeFormat(value) : new Date()}
                header={title}
                onTimeChange={(time) => setTime(time)}
                onSelect={(time) => { value == undefined ? setTime() : setShowModal(false) }}
                onClose={() => setShowModal(false)}
                mode="time"
            />
            <View style={{ borderWidth: 0.5, width: wp(40), borderColor:hasError?DANGER :'#bebebe', marginTop: wp(-0.4) }} />
            {hasError && <Text style={[styles.errorText, { marginTop: wp(2) }]}>{errors[name]}</Text>}
        </>
    )
}

const GetLocation = (props) => {
    const {
        field: { name, onBlur, onChange, value },
        form: { errors, touched, setFieldTouched, setFieldValue },
        defaultValue,
        ...inputProps
    } = props;

    const hasError = errors[name] && touched[name];

    const locationInfo = async () => {
        RNGooglePlaces.openAutocompleteModal()
            .then(place => {
                setFieldValue(name, place.address)
            })
            .catch(error => console.log(error.message));
    };
    return (
        <>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                <TouchableOpacity onPress={() => locationInfo()} style={{ alignItems: 'flex-start', marginTop: wp(2) }}>
                    <Text style={{ color: value ? 'black' : '#B3B2B2', marginBottom: wp(2.5), marginLeft: wp(0),fontSize: RFValue(14) }}>
                        {value ?? 'Enter Location'}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ borderWidth: 0.5, width: '100%', borderColor: hasError ? DANGER :'#bebebe' }} />
            {hasError && <Text style={[styles.errorText, { marginTop: wp(2) }]}>{errors[name]}</Text>}
        </>

    )
}
const HandleImage = (props) => {
    const {
        field: { name, onBlur, onChange, value },
        form: { errors, touched, setFieldTouched, setFieldValue },
        defaultValue, EventImage, handleImage,
        ...inputProps
    } = props;

    const hasError = errors[name] && touched[name];
    function handleImageChange() {
        const options = {
            title: 'Select Cover Image',
            storageOptions: {
                skipBackup: true,
                path: 'image',
            },
        };

        ImagePicker.showImagePicker(options, response => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const image = {
                    name: response.fileName,
                    type: 'image/jpeg',
                    uri: response.uri,
                };
                handleImage(image)
                // console.log(image.uri)

                setFieldValue(name, response.uri)
            }
        });
    };

    return (
        <View>
            <Text style={styles.bottomText}>Cover</Text>

            <View style={{ marginTop: 4 }}>
                <TouchableOpacity
                    onPress={() => handleImageChange()}
                    style={[styles.profileAvatar, { overflow: 'hidden' }]}>
                    <Image style={value ? styles.profileAvatar : styles.imageIcon} source={value ? { uri: value } : require('../../assets/images/updated/camraIcon.png')} />

                </TouchableOpacity>
            </View>
            {hasError && <Text style={[styles.errorText, { marginTop: wp(2) }]}>{errors[name]}</Text>}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    textInput: {
        height:38,
        borderColor: '#bebebe',
        borderBottomWidth: 1,
        fontSize: RFValue(14),
        width: wp(91.5),
        borderRadius: 5,
        // paddingHorizontal: 5,
        paddingVertical: wp(2),
        marginTop: wp(Platform.OS == 'ios' ? 1 : 0),
        marginLeft: wp(-1.5),

    },
    errorText: {
        fontSize: 10,
        color: 'red',
        // alignSelf: 'flex-start',
        width: '100%',
        textAlign: 'left'

    },
    errorInput: {
        borderColor: 'red',
    },
    bottomText: {
        color: TEXT_INPUT_LABEL,
        fontSize: RFValue(14),
        //marginLeft: wp(1),
        marginTop: wp(2),
        marginBottom: wp(Platform.OS == 'android' ? -1 : 0),
    },
    imageIcon: {
        height: wp(9),
        width: wp(10),

        alignSelf: 'center',
    },
    profileAvatar: {
        backgroundColor: '#DADADA',
        borderRadius: RFValue(5),
        width: '100%',
        height: RFValue(130),
        justifyContent: 'center',
    },

})
export { CustomInput, DateModal, TimeModal, GetLocation, HandleImage };
