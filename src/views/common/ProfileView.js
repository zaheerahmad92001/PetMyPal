import React, { useState } from 'react';
import {
    Platform,
    Dimensions,
    View,
    SafeAreaView,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    StatusBar,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    RefreshControl,
} from 'react-native';
import {
    Thumbnail,
    Container,
    Header,
    Content,
    Left,
    Button,
    Body,
    Right,
    Card,
    Form,
    Input,
    Item,
    CardItem,
    Icon,
    Tab,
    Tabs,
} from 'native-base';
import styles from './stylesProfile';

import { connect } from 'react-redux';
import PropTypes, { element } from 'prop-types';
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import requestRoutes from '../../utils/requestRoutes';
import AsyncStorage from '@react-native-community/async-storage';
import { HEADER, TEXT_DARK } from '../../constants/colors';
import OneSignal from 'react-native-onesignal';
import VideoPlayer from 'react-native-video-controls';
import FastImage from 'react-native-fast-image';
import DarkButton from '../../components/commonComponents/darkButton';
import GreyButton from '../../components/commonComponents/greyButton';
import Emoji from 'react-native-emoji';
import ImagePicker from 'react-native-image-picker';
import HTML from 'react-native-render-html';
import PixxyPetView from '../PixxyPetView';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SliderBox } from 'react-native-image-slider-box';
import Ribbon_Icon from '../../assets/images/updated/ribbonDess.png';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import { TouchableWithoutFeedback } from 'react-native';
import { postTimeAndReaction } from '../../utils/DateFuncs';
import MatIcon from 'react-native-vector-icons/Ionicons';
import ShareModal from '../shareModal/index';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommentsView from './../ComponentsNew/commentsView'
import { commonState } from '../../components/common/CommomState'

class ProfileView extends React.Component {
    // modal = React.createRef();

    static navigationOptions = {
        header: null,
    };
    static propTypes = {
        user: PropTypes.object,
    };
    constructor(props) {
        super(props);
        OneSignal.init('433c25e1-b94d-4f09-8602-bbe908a3761e', {
            kOSSettingsKeyAutoPrompt: true,
        });
        this.state = {
            petProfileInfo: {
                details: { followers_count: 0 },
            },
            pixxy: [],
            loading: true,
            loadingPets: true,
            followLoading: false,
            isFollowed: false,
            ownPet: false,
            loadingSuggested: true,
            suggested: commonState.suggested,
            pets: [],
            newsFeed: [],
            loadingNewsFeed: true,
            more: false,
            lastPostId: '',
            token: '',
            visible: true,
            imageDisplay:
                typeof this.props.imageDisplay === 'undefined'
                    ? 'No Pic'
                    : this.props.imageDisplay,
            isVisible: this.props.isVisible,
            showModal: false,
            userProfilePic:
                this.props.user === null ? 'no pic' : this?.props?.user?.user_data?.avatar,
            disabled: false,
            homage: false,
            reaction: commonState.reaction,
            months: commonState.months,
            postIndex: null,
            start: false,
            isRefreshing: false,
            feelingsData: commonState.feelingsData,
            avatarSource: {},
            petAvatarImage: {},
            coverSource: {},
            petCoverImage: {},
            modalVisible: false,
            viewerContent: {
                reaction: {},
            },
            shareModalVisible: false,
        };

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.inFocusDisplaying(2);
    }

    renderItemCard = ({ item, index }) => {
        const { newsFeed, reaction } = this.state;
        let { time, feeling } = postTimeAndReaction(item.time);
        let { time: originalTime, feeling: originalFeeling } = postTimeAndReaction(
            item.shared_info && item.shared_info.time,
        );
        let photoList = [];
        if (item.photo_multi) {
            item.photo_multi.forEach(i => {
                photoList.push(i.image);

            });
        } else {
            if (item.postFile_full) {
                photoList.push(item.postFile_full);
            }
        }
        return  (
            <View
                style={{
                    paddingVertical: RFValue(10),
                    backgroundColor: 'white',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ marginRight: RFValue(2) }}
                        onPress={() => {
                            if (item.user_id == this?.props?.user?.user_data?.user_id) {
                                this.props.navigation.navigate('UserProfile');
                            } else {
                                this.props.navigation.navigate({
                                    routeName: 'Profile',
                                    key: 'Profile',
                                    params: { user_id: item.user_id },
                                });
                            }
                        }}>
                        <Thumbnail
                            source={{ uri: item.publisher.avatar }}
                            style={{ backgroundColor: '#F2F2F2' }}
                        />
                    </TouchableOpacity>
                    <View style={{ marginLeft: RFValue(10) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: RFValue(16), fontFamily: THEME_FONT }}>
                                item.publisher.name
                            </Text>
                                <Text
                                    style={{
                                        fontSize: RFValue(12),
                                        fontFamily: THEME_FONT,
                                        color: 'grey',
                                        marginLeft: RFValue(5),
                                    }}>
                                    shared a post
                </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <IonicIcon name="md-earth" size={15} style={{ marginRight: 3 }} />
                            <Text style={{ fontSize: RFValue(10), fontFamily: THEME_FONT }}>
                                {time}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginLeft: RFValue(70) }}>
                    {item.postText ?<HTML baseFontStyle={{ fontSize: RFValue(14) }} html={item.postText} /> : null}
                </View>

                <View
                    style={{
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#e2e2e2',
                        borderRadius: 5,
                        padding: 10,
                        marginTop: 10,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ marginRight: RFValue(2) }}
                            onPress={() => {
                                if (
                                    item.shared_info.user_id == this?.props?.user?.user_data?.user_id
                                ) {
                                    this.props.navigation.navigate('UserProfile');
                                } else if (item.shared_info.user_id == '0') {
                                    this.props.navigation.navigate({
                                        routeName: 'Page',
                                        key: 'Page',
                                        params: { page: item.publisher },
                                    });
                                } else {
                                    this.props.navigation.navigate({
                                        routeName: 'Profile',
                                        key: 'Profile',
                                        params: { user_id: item.shared_info.user_id },
                                    });
                                }
                            }}>
                            <Thumbnail
                                source={{ uri: item.shared_info.publisher.avatar }}
                                style={{ backgroundColor: '#F2F2F2' }}
                            />
                        </TouchableOpacity>
                        <View style={{ marginLeft: RFValue(10) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: RFValue(16), fontFamily: THEME_FONT }}>
                                    {item.shared_info.publisher.name}
                                </Text>
                                {item.postFeeling ? (
                                    <>
                                        <Text
                                            style={{
                                                fontSize: RFValue(12),
                                                fontFamily: THEME_FONT,
                                                color: 'grey',
                                                marginLeft: RFValue(5),
                                            }}>
                                            {originalFeeling} {item.postFeeling}
                                        </Text>
                                        <Emoji
                                            name={this.getFeelingIcon(item.postFeeling)}
                                            style={{
                                                fontSize: 16,
                                                marginLeft: 5,
                                            }}
                                        />
                                    </>
                                ) : null}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <IonicIcon name="md-earth" size={15} style={{ marginRight: 3 }} />
                                <Text style={{ fontSize: RFValue(10), fontFamily: THEME_FONT }}>
                                    {originalTime}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginLeft: RFValue(70) }}>
                        {item?.shared_info?.postText ? <HTML
                            baseFontStyle={{ fontSize: RFValue(14) }}
                            html={item?.shared_info?.postText}
                        /> : null}
                    </View>
                 </View>
            </View>
        )
    };


    handlePetAvatar = () => {
        const options = {
            title: 'Select Pet Avatar',
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
            }
            else {
                const source = { uri: 'data:image/jpeg;base64,' + response.data };
                const image = {
                    name: response.fileName,
                    type: response.type,
                    uri: response.uri,
                };
                this.setState({
                    avatarSource: source,
                    petAvatarImage: image,
                });
                this.requestHandlerUpdatePet('update-user-data', 'avatar');
            }
        });
    };

    handlePetCover = () => {
        const options = {
            title: 'Select Pet Cover',
            // customButtons: [{ name: 'fb', title: 'Remove Cover Photo' }],
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
            }
            else {
                const source = { uri: 'data:image/jpeg;base64,' + response.data };
                const image = {
                    name: response.fileName,
                    type: response.type,
                    uri: response.uri,
                };
                this.setState({
                    coverSource: source,
                    petCoverImage: image,
                });
                this.requestHandlerUpdatePet('update-user-data', 'cover');
            }
        });
    };

    async requestHandlerUpdatePet(type, pic) {
        this.setState({ saving: true });
        this.getAccessToken().then(async token => {
            var coverPhoto = {};
            var profilePhoto = {};
            const data = new FormData();
            if (pic === 'cover') {
                data.append('pet_cover', this.state.petCoverImage);
            }
            if (pic === 'avatar') {
                data.append('pet_avatar', this.state.petAvatarImage);
            }
            data.append('server_key', server_key);
            data.append('pet_id', this.state.petProfileInfo.user_id);
            try {
                const response = await fetch(
                    SERVER +
                    requestRoutes[type].route +
                    '?access_token=' +
                    JSON.parse(token).access_token,
                    {
                        method: requestRoutes[type].method,
                        body: data,
                        headers: {},
                    },
                );
                const responseJson = await response.json();
                if (responseJson.api_status === 200) {
                } else {
                    if (pic === 'cover') {
                        alert('Cover Update Failed');
                    } else {
                        alert('Avatar Update Failed');
                    }
                    this.setState({ saving: false });
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    updateState = state => {
        this.setState(state);
    };

    render() {
        const {
            followLoading,
            isFollowed,
            disabled,
            petProfileInfo,
        } = this.state;
        return (
            <>
                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                    <View style={{
                        borderColor: '#0000', // if you need 
                        // overflow: 'hidden',
                        borderWidth: 1,
                        elevation: 5,
                        shadowColor: '#0000',
                        shadowOpacity: 12,
                        // shadowRadius: 10,
                        marginTop: hp(-8),
                        backgroundColor: '#fff',
                        height: hp(48),
                        borderRadius: 20,
                        width: wp(88)
                    }}>
                        <View style={{ flexDirection: 'row', flex: 1, height: hp(2), justifyContent: 'space-between' }}>
                            <View style={{ flex: 3 }}>
 
                            </View>
                            <View
                                style={
                                    { flex: 3, marginTop: hp(-11) }
                                }>

                                <TouchableOpacity>
                                    <Image
                                        style={styles.profileImg}
                                        source={{uri:'https://sandy.petmypal.biz/admin/public/uploads/pets/W9kUUvhx5eee6c9d0d530.png'}}
                                    />
                                </TouchableOpacity>
                            </View>



                            <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'flex-end', marginTop: hp(-2) }} >
                                <TouchableOpacity
                                    style={
                                        styles.editBtnContainer
                                    }
                                >
                                    <Image
                                        style={styles.profileImg}
                                        source={require('./../../assets/images/updated/EditPic.png')}
                                    />
                                </TouchableOpacity>

                            </View>



                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 12 }}>
                            <View style={{}}>

                                <Text style={{ color: '#182A53', fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>
                                    petProfileInfo.full_name
                                    <Text style={{ color: true ? '#FFAF3E' : '#182A53', fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>
                                        'Deactivated'
                        </Text>
                                </Text>
                                <Text style={{ color: '#8B94A9', textAlign: 'center' }}>
                                        petProfileInfo.pet_info.pet_sub_type_text
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginHorizontal: 30 }}>
                            <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <View style={{ flexDirection: 'column', flex: 3, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <View style={styles.infoIconContainer}>
                                            <Image
                                                style={styles.infoIcon}
                                                source={{
                                                    uri:
                                                        'https://res.cloudinary.com/n4beel/image/upload/v1595413810/gender_lgrprr.png',
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'column', flex: 7, justifyContent: 'center' }}>
                                        <Text style={styles.infoDetailText}>
                                            'Male'
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <View style={{ flexDirection: 'column', flex: 3, alignItems: 'flex-end', justifyContent: 'center' }}>
                                            <View style={styles.infoIconContainer}>
                                                <Image
                                                    style={styles.infoIcon}
                                                    source={{
                                                        uri:
                                                            'https://res.cloudinary.com/n4beel/image/upload/v1595414113/age_fuqgy0.png',
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'column', flex: 7, justifyContent: 'center' }}>
                                            <Text style={styles.infoDetailText}>
                                                petProfileInfo.age_text
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <View style={{ flexDirection: 'column', flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={{
                                            height: RFValue(15),
                                            width: RFValue(15),
                                            marginRight: 6,
                                            alignSelf: 'center',
                                        }}
                                        source={require('./../../assets/images/updated/followers-green.png')}
                                        />

                                    </View>
                                    <View style={{ flexDirection: 'column', flex: 7, justifyContent: 'center' }}>
                                        <TouchableOpacity>
                                            <Text
                                                style={{
                                                    ...styles.infoDetailText,
                                                }}>
                                                    Followers
                                                 </Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <View style={{ flexDirection: 'column', flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            style={{
                                                height: RFValue(15),
                                                marginRight: 6,
                                                width: RFValue(15),
                                            }}
                                            source={require('./../../assets/images/updated/followings-orange.png')}
                                            />    
                                    </View>
                                        <View style={{ flexDirection: 'column', flex: 7, justifyContent: 'center' }}>
                                            <TouchableOpacity>
                                                <Text
                                                    style={{
                                                        ...styles.infoDetailText,
                                                    }}>Followings</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>




                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, alignItems: 'center' }}>
                                <View style={styles.btn}>
                                   
                                        <GreyButton disabled={disabled} onPress={() => this.followPet('follow-user')}>
                                            Unfollow
                                        </GreyButton>
                                 
                                                <DarkButton disabled={disabled} bgColor={'#CACACA'} onPress={() => this.followPet('follow-user')}>
                                                    Follow
                                                </DarkButton>
                                         
                                </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 24, marginVertical: 20, alignItems: 'center' }}>

                            <Text style={{ color: '#465575' }}>
                              petProfileInfo.about
                            </Text>

                        </View>
                    </View>

                </View>
            </>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    workspace: state.user.workspace,
});

const mapDispatchToProps = dispatch => ({
    saveLoginUser: user => dispatch(userEdit(user)),
    saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProfileView);
