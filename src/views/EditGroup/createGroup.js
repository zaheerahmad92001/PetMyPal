import React from 'react';
import { Dimensions, View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Platform } from 'react-native';
import { Item, Input, Label } from 'native-base';
import { Icon, Content, Container } from 'native-base';
import RadioForm from 'react-native-simple-radio-button';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import { Formik, Field, FormikProps } from 'formik';
import _ from 'lodash';

import styles from './styles';
import PMPHeader from '../../components/common/PMPHeader';
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import { deleteGroupAction } from '../../redux/actions/groups';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import CustomLoader from '../../components/common/CustomLoader';
import { petMyPalGroupApiService } from '../../services/PetMyPalGroupApiService';
import _DropDown from '../../components/common/dropDown';
import InfoModal from '../../components/common/InfoModal';
import { HEADER, TEXT_DARK, TEXT_INPUT_LABEL, PLACE_HOLDER, BLUE_NEW, darkSky, } from '../../constants/colors';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import { Capitalize } from '../../utils/RandomFuncs';
import { WORDS, DATE_EXTRACT, DELETED_GROUP, UPDATED_GROUP, FAIL_GROUP, INCORRECT_PASSWORD, CREATED_GROUP, AVATAR, COVER, LongAboutParseHtml } from '../../components/helpers/index';
import LoaderWrapper from '../../components/helpers/LoaderWrapper';
import { groupDetails } from './groupValidationSchema';
import { CustomInput, PetCategory } from './customInput';
import ExistingGroup from './existingGroup';
import { ExtractUrl } from '../../components/helpers/index';
import { getPersistToken, rootCommon } from '../../components/helpers/selectors/selectors';


const { deleteOwnerGroup, updateOwnerGroupData, getPetOwnerGroups, createPetOwnerGroup } = petMyPalGroupApiService;

var radio_btn_props = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' }
];
var radio_btn_props2 = [
    { label: 'No', value: 'No' },
    { label: 'Yes', value: 'Yes' },
 
];


class CreateEditGroup extends React.Component {
    constructor(props) {
        super(props);
        const NewGroup = this.props.navigation.getParam('newGroup');
        const EditGroup = this.props.navigation.getParam('group');

        this.state = {
            CommunityName: NewGroup ? '' : EditGroup?.name,
            URL: NewGroup ? '' : EditGroup?.username,
            About: NewGroup ? '' : EditGroup?.about,
            type: NewGroup ? 'public' : EditGroup?.privacy == '1' ? 'public' : 'private',
            confirm: NewGroup ? false : EditGroup?.join_privacy == '2' ? true : false,
            avatarImage: {},
            coverImage: {},
            newdate: new Date(new Date().getTime() - DATE_EXTRACT),
            date: new Date(new Date().getTime() - DATE_EXTRACT),
            token: undefined,
            loading: false,
            newGroup: NewGroup ?? {},
            website: undefined,
            group_id: EditGroup?.id ?? undefined,
            group: EditGroup ?? {},
            submit: false,
            show: false,
            dob: undefined,
            PetCategory: EditGroup?.category_id ?? '',
            Group_Status: undefined || '',
            infoText: undefined || '',
            holdCommunityData: {},
            isModal_Visible: false,
            loader: false,
            remainingWords: WORDS - (EditGroup?.about ? EditGroup?.about?.length : 0),
            password: undefined,
            showDelete: false,
            passwordError: false,
            radioSelection: false
        }
        this.NewGroup = NewGroup;
        this.EditGroup = EditGroup;
        this.formRef = React.createRef()

    }

    windowWidth = Dimensions.get('window').width;
    windowHeight = Dimensions.get('window').height;
    
    componentDidMount() {
       this.getAccessToken();
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.navigation.getParam('group') && _.isEmpty(this.state.group)) {

            this.handleStateAfterNavigation();
        }
    }
    getAccessToken = async () => {
        const token= await AsyncStorage.getItem(ACCESS_TOKEN);
        this.setState({token: JSON.parse(token).access_token})
    }

    handleStateAfterNavigation = () => {
        const EditGroup = this.props.navigation.getParam('group');
        this.setState({
            CommunityName: EditGroup?.name,
            URL: EditGroup?.username,
            About: EditGroup?.about,
            type: EditGroup?.privacy == '1' ? 'public' : 'private',
            confirm: EditGroup?.join_privacy == '2' ? true : false,
            remainingWords: WORDS - (EditGroup?.about ? EditGroup?.about?.length : 0),
            PetCategory: EditGroup?.category_id,
            group_id: EditGroup?.id,
            group: EditGroup,
            loading: false,
            newGroup: {}

        })
}
    setBirthDate = () => {
        this.setState({
            show: false,
            submit: true,
            dob: `${this.state.newdate.getDate()}-${this.state.newdate.getMonth() +
                1}-${this.state.newdate.getFullYear()}`,
        });
    };
    createGroup = async (data) => {
        const { About, CommunityName, PetCategory } = data;
        const { type, confirm, token } = this.state;
        this.setState({ loader: true })
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('group_name', CommunityName);
        formData.append('group_url', ExtractUrl(CommunityName));
        formData.append('about', About);
        formData.append('privacy', type == 'public' ? 1 : 2);
        formData.append('join_privacy', confirm == true ? 2 : 1)
        formData.append('category', PetCategory);
        const response = await this.props.createPetOwnerGroup(token, formData);
        const responseJson = await response;
        const { api_status, group_data, ...rest } = responseJson?.data;
        if (api_status == 200) {

            this.setState({
                holdCommunityData: group_data,
                isModal_Visible: true,
                infoText: 'Community Has Been Created',
                Group_Status: CREATED_GROUP,
                loader: false
            });

        } else {
            this.setState({
                loader: false,
                isModal_Visible: true,
                infoText: 'Community Name Is Taken',
                Group_Status: FAIL_GROUP
            });
        }
    }
    updateGroup = () => {
        if (this.formRef.current?.dirty || !_.isEmpty(this.state.coverImage) || !_.isEmpty(this.state.avatarImage) || this.state.radioSelection) {
            this.formRef.current?.handleSubmit();

        }
    }
    updateExistingGroup = async (values) => {
        const { About, CommunityName, PetCategory, } = values;
        const { coverImage, avatarImage, type, confirm,token } = this.state
        this.setState({ loader: true });
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('group_id', this.state.group_id);
        formData.append('group_name', CommunityName);
        formData.append('group_url', ExtractUrl(CommunityName));
        formData.append('about', About);
        formData.append('privacy', type == 'public' ? 1 : 2);
        formData.append('category', PetCategory);
        formData.append('join_privacy', confirm === true ? 2 : 1)
        !_.isEmpty(avatarImage) && formData.append('avatar', avatarImage);
        !_.isEmpty(coverImage) && formData.append('cover', coverImage);
        const response = await this.props.updateOwnerGroupData(token, formData);
        console.log(response,formData,token);
        const responseJson = await response;

        const { api_status, group_data, ...rest } = responseJson?.data;
        if (api_status == 200) {
            this.setState({
                loader: false,
                isModal_Visible: true,
                infoText: 'Community Has Been Updated',
                Group_Status: UPDATED_GROUP,
                radioSelection: false
            });
        }
        else if(rest?.errors?.error_id== 3){
            this.setState({
                loader: false,
                isModal_Visible: true,
                infoText: 'Community Name Is Already Exist',
                Group_Status: FAIL_GROUP
            });

        }
        else {
            this.setState({
                loader: false,
                isModal_Visible: true,
                infoText: 'Fail To Update Data',
                Group_Status: FAIL_GROUP
            });
        }

}

    componentWillUnmount() {

        this.setState({ newGroup: {}, group: {} })
        this.communityTimer;
        this.focusListener;
    }
    handleGroupType = (type) => {

        this.setState({ type: type, radioSelection: true })
    }
    handleImageChange = (imageType) => {
        const options = {
            title: 'Select ' + imageType,
            storageOptions: {
                skipBackup: true,
                path: 'image',
            },
        };

        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.warn('User cancelled image picker');
            } else if (response.error) {
                console.error('ImagePicker Error: ', response.error);
            } else {
                const image = {
                    name: response?.fileName ?? 'image',
                    type: 'image/jpeg',
                    uri: response.uri,
                };
                switch (imageType) {
                    case AVATAR:
                        this.setState({
                            avatarImage: image,
                            submit: true,
                        });
                        break;
                    case COVER:
                        this.setState({
                            coverImage: image,
                            submit: true,
                        });
                        break;
                    default:
                        break;
                }
            }
        });
    };
    handleImageStatus(type) {

        if (type == COVER) {
            return this.state.coverImage?.uri ?? this.state.group?.cover
        }
        else {
            return this.state.avatarImage?.uri ?? this.state.group?.avatar

        }
    }

    handlePassword =(text)=>{
        this.setState({
            password: text,
            passwordError: false,
            Group_Status:'',
        })
    }
    cancelButtonPress =()=>{
        this.setState({
            showDelete:false,
        })
    }

    navigateTo = () => {
        const routes = this.props.navigation.dangerouslyGetParent().state.routes ;
        const { holdCommunityData, token, Group_Status } = this.state
        if (typeof Group_Status == 'string') {
            if (Group_Status == CREATED_GROUP) {
                this.setState({ isModal_Visible: false, loading: false,infoText:undefined }, () => {
                    this.props.navigation.navigate({
                        routeName: 'Group',
                        key: 'Group',
                        params: { group: holdCommunityData },
                    })
                })


            }
            else if (Group_Status == FAIL_GROUP) {
                this.setState({ isModal_Visible: false})

            }

            else if (Group_Status == UPDATED_GROUP) {
               this.setState({ isModal_Visible: false }, () =>{
                   if(routes[routes.length-1].routeName=='EditGroup'&&routes[routes.length-2].routeName=='Group'){
                    this.props.navigation.pop(2);

                   }
                   else{
                    this.props.navigation.pop(1);
                   }
               })

                this.props.getPetOwnerGroups(token, this.props?.user?.user_data?.user_id, 'my_groups');
            }

            else if (Group_Status == DELETED_GROUP) {

                this.setState({ isModal_Visible: false }, () => {
                    if(routes[routes.length-1].routeName=='EditGroup'&&routes[routes.length-2].routeName=='Group'){
                        this.props.navigation.pop(2);
                    }else{
                        this.props.navigation.pop(1);
                    }
                })
                this.props.deleteGroupAction(this.state.group_id);
            }
            else if (Group_Status == INCORRECT_PASSWORD) {
                this.setState({ isModal_Visible: false })
            }
            this.setState({ isModal_Visible: false })
        }
    }

    renderButtons = (handleSubmit) => {
        const { group, newGroup } = this.state;

        let jsx = [];
        if (_.isEmpty(this.state.group)) {
            jsx.push(<View style={{ width: '100%', alignItems: 'center' }}><SkyBlueBtn
                onPress={() => { handleSubmit() }}
                title={'Create'}
                btnContainerStyle={styles.btnContainerStyle}
            /></View>)
        }
        else {
            jsx.push(<View
                style={styles.AvatarButtons}>
                <Text style={styles.NameText}>Avatar & Cover Photo</Text><View style={{ marginTop: wp(2), justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.bottomText}>Cover</Text>
                        <TouchableOpacity
                            onPress={() => this.handleImageChange(COVER)}
                            style={styles.coverAvatar}>
                            <Image style={styles.coverAvatar} source={{ uri: "" + this.handleImageStatus(COVER) }} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.bottomText}>Avatar</Text>

                        <TouchableOpacity onPress={() => this.handleImageChange(AVATAR)} style={styles.profileAvatar}>
                            <Image style={styles.profileAvatar} source={{ uri: "" + this.handleImageStatus(AVATAR) }} /></TouchableOpacity>
                    </View>
                </View>
            </View>)
        }
        return jsx;

    }
    deleteGroup = async type => {
        if (_.isUndefined(this.state.password)) {
            this.setState({
                passwordError: true,
            });
        } else {
            this.setState({ loader: true })
            const responseJson = await this.props.deleteOwnerGroup(this.state.token, this.state.group_id, this.state.password);
            if (responseJson?.data?.api_status == 200) {
                this.setState({
                    loader: false,
                    showDelete: false,
                    infoText: 'Community Has Been Deleted',
                    Group_Status: DELETED_GROUP,


                }, () => {
                    this.communityTimer=setTimeout(() => {
                        this.setState({ isModal_Visible: true })

                    }, 2000)
                })

            } else {
                this.setState({
                    loader: false,
                    Group_Status: INCORRECT_PASSWORD,
                    showDelete: true
                });

            }
        }
    };
    showDeleteModal = () => {
        this.setState({ showDelete: true })
    }
    renderLoader = () => {
        return (
            <LoaderWrapper style={{ position: 'relative' }} ><CustomLoader /></LoaderWrapper>
        )
    }
    
    render() {

        const { isModal_Visible, infoText, showDelete, Group_Status, loader } = this.state;
        return (
            <Container style={{ flex: 1 }}>
                {this.state.loading ? <LoaderWrapper><CustomLoader /></LoaderWrapper> :
                    <>
                        <PMPHeader
                            centerText={_.isEmpty(this.state.group) ? 'Create New Community' : 'Edit Community'}
                            ImageLeftIcon={'arrow-back'}
                            LeftPress={() => this.props.navigation.goBack()}
                            headerStyle={{ fontSize: 10 }}
                        />

                        <Content contentContainerStyle={{paddingBottom:_.isEmpty(this.state.group)?wp(8):0}} >
                            {!_.isEmpty(this.state.group) && <ExistingGroup showDeleteModal={this.showDeleteModal} updateGroup={this.updateGroup} group={this.state} />}
                            <Formik
                                initialValues={this.state}
                                onSubmit={values => { _.isEmpty(this.state.group) ? this.createGroup(values) : this.updateExistingGroup(values) }}
                                validationSchema={groupDetails}
                                innerRef={this.formRef}
                            >
                                {({ handleSubmit, errors, isValid, values, touched, isValidating }) => {

                                    return (
                                        <>
                                            <Label style={{ color: TEXT_INPUT_LABEL, fontSize: RFValue(14), marginLeft: wp(6), marginTop: wp(2) }}>
                                                Community Name
                                            </Label>
                                            <Field
                                                component={CustomInput}
                                                name='CommunityName'
                                                placeholderTextColor={'#bebebe'}
                                                placeholder="Community Name"
                                                keyboardType="ascii-capable"
                                                defaultValue={this.state.name}
                                                maxLength={31}
                                                
                                            />
                                            {!_.isEmpty(this.state.group) && // ! hiding it while creating community
                                                <>
                                                    <Label style={{ color: TEXT_INPUT_LABEL, fontSize: RFValue(14), marginLeft: wp(6), marginTop: wp(2) }}>
                                                        Community Web Site Link
                                                    </Label>

                                                    <Field
                                                        component={CustomInput}
                                                        // name='CommunityName'
                                                        placeholderTextColor={'#bebebe'}
                                                        placeholder="Community URL"
                                                        keyboardType="default"
                                                        value={`${SERVER}/community/${values?.CommunityName == undefined ? values.URL : values?.CommunityName.toString().toLowerCase().replace(/[^A-Z0-9_]/gi, '')}`}
                                                        disabled
                                                        multiline
                                                      


                                                    /></>}
                                            <Label style={{ color: TEXT_INPUT_LABEL, fontSize: RFValue(14), marginLeft: wp(6), marginTop: wp(2),marginBottom:wp(1) }}>Pet Caory</Label>
                                            <Field
                                                component={PetCategory}
                                                name='PetCategory'
                                                defaultValue={this.state.group?.category_id}
                                                
                                            />
                                            <Label style={{ color: TEXT_INPUT_LABEL, fontSize: RFValue(14), marginLeft: wp(6), marginTop: wp(2),marginBottom:wp(Platform.OS=='android'?-1:0) }}>
                                                About Community
                                            </Label>
                                            <Field
                                                component={CustomInput}
                                                name='About'
                                                placeholderTextColor={'#bebebe'}
                                                placeholder="About"
                                                keyboardType="default"
                                                defaultValue={LongAboutParseHtml(this.state.about)}
                                                maxLength={200}
                                                multiline
                                                

                                            />
                                            <Text style={{ color: darkSky  , marginTop: wp(2), marginLeft: wp(6),fontSize:12 }}>{`Remaining words ${WORDS - values?.About?.length ?? this.state.About?.length}`}</Text>
                                            <View style={{ marginHorizontal: wp(6) }}>
                                                <Text style={[styles.aboutText, { color: TEXT_INPUT_LABEL }]}>Community Type</Text>
                                                <RadioForm
                                                    style={{ marginTop: 5 }}
                                                    radio_props={radio_btn_props}
                                                    initial={this.state.type == 'public' ? 0 : 1}
                                                    formHorizontal={true}
                                                    labelHorizontal={true}
                                                    labelColor={'red'}
                                                    buttonColor={'#40c4ff'}
                                                    selectedButtonColor={'#40c4ff'}
                                                    onPress={(value) => this.handleGroupType(value)}
                                                    buttonInnerColor={'red'}
                                                    buttonOuterColor={'black'}
                                                    animation={true}
                                                    buttonWrapStyle={{ marginLeft: 10 }}
                                                    buttonSize={10}
                                                    labelStyle={{ fontSize: RFValue(14), color: 'black', paddingRight: 20 }}
                                                />
                                                <Text style={styles.aboutText}>
                                                    Confirm request when someone joining this community ?
                                                </Text>
                                                <RadioForm
                                                     style={{ marginTop: 4 }}
                                                    radio_props={radio_btn_props2}
                                                    initial={this.state.confirm ? 1 : 0}
                                                    formHorizontal={true}
                                                    labelHorizontal={true}
                                                    labelColor={'red'}
                                                    buttonColor={'#40c4ff'}
                                                    selectedButtonColor={'#40c4ff'}
                                                    onPress={(type) => this.setState({ confirm: type == "Yes" ? true : false, radioSelection: true })}
                                                    buttonInnerColor={'red'}
                                                    buttonOuterColor={'black'}
                                                    animation={true}
                                                    buttonWrapStyle={{ marginLeft: 10 }}
                                                    buttonSize={10}
                                                    labelStyle={{ fontSize: RFValue(14), color: TEXT_DARK, paddingRight: 20 }}
                                                />
                                            </View>
                                            {this.state.loader ? this.renderLoader() : this.renderButtons(handleSubmit)}
                                        </>
                                    )
                                }}

                            </Formik>


                        </Content>
                        <InfoModal
                            // useNativeDriver
                            // animationInTiming={700}
                            // animationOutTiming={1000}
                            isVisible={isModal_Visible ? isModal_Visible : showDelete}
                            info={infoText}
                            showDelete={showDelete}
                            processing={loader}
                            userPassword={this.handlePassword}
                            DoneTitle={'Confirm'}
                            CancelTitle={'Cancel'}
                            Group_Status={Group_Status}
                            onDoneBtnPress={() => this.deleteGroup('delete_group')}
                            onCancelBtnPress={this.cancelButtonPress}
                            onPress={() => this.navigateTo()}
                        >
                      </InfoModal>
                    </>
                    
                    }
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
});

export default connect(mapStateToProps,
    { saveWorkSpace, deleteGroupAction, deleteOwnerGroup, updateOwnerGroupData, getPetOwnerGroups, createPetOwnerGroup },
)(CreateEditGroup);
