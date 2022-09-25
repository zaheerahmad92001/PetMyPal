
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    RefreshControl,
} from 'react-native';
import _ from 'lodash';
import styles from './styles';
import { Thumbnail, Container, Content, Icon } from 'native-base';
import { connect } from 'react-redux';
import { userEdit, saveWorkSpace } from '../../redux/actions/user';
import { RFValue } from 'react-native-responsive-fontsize';
import ImageView from 'react-native-image-view';
import { THEME_FONT } from '../../constants/fontFamily';
import { server_key } from '../../constants/server';
import InfoModal from '../../components/common/InfoModal';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import WhatsYourMind from './../common/WhatsYourMind';
import { HEADER } from '../../constants/colors';
import OneSignal from 'react-native-onesignal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import { TouchableWithoutFeedback } from 'react-native';
import ShareModal from '../shareModal/index';
import RenderItemCard from '../../components/common/RenderItemCard';
import { followingsImg, followersImg, reportPostText } from '../../constants/ConstantValues'
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { NavigationEvents } from 'react-navigation';
import { LongAboutParseHtml, ShortAboutParseHtml } from '../../components/helpers';
import { commonState } from '../../components/common/CommomState';
import Reactions from '../../components/common/Reactions'
import { saveBeforePostId } from '../../redux/actions/post'
import ConfirmModal from '../../components/common/ConfirmModal';
import EditPost from '../../components/common/EditPost';
import ErrorModal from '../../components/common/ErrorModal';




const timeOut = 5000
class UserProfile extends React.Component {

    setMenuRef = ref => { this._menu = ref };

    constructor(props) {
        super(props);
        OneSignal.init('433c25e1-b94d-4f09-8602-bbe908a3761e', {
            kOSSettingsKeyAutoPrompt: true,
        });
        this.state = {
            loading: true,
            loadingPets: true,
            imageViewer: false,
            aboutModal: false,
            img: [],
            loadingSuggested: true,
            pets: [...this.props.myPets],
            newsFeed: [],
            loadingNewsFeed: true,
            more: false,
            lastPostId: '',
            token: '',
            user_id: '',
            currentUser: this?.props?.user?.user_data,

            visible: true,
            imageDisplay:
                typeof this.props.imageDisplay === 'undefined'
                    ? 'No Pic'
                    : this.props.imageDisplay,
            isVisible: this.props.isVisible,
            showModal: false,
            userProfilePic: this.props.user === null ? null : this.props?.user?.user_data?.avatar,
            reaction: commonState.reaction,
            feelingsData: commonState.feelingsData,

            postIndex: null,
            start: false,
            isRefreshing: false,

            scrollViewWidth: 0,
            currentXOffset: 0,
            modalVisible: false,
            viewerContent: {
                reaction: {},
            },
            shareModalVisible: false,
            showPopUp: false,
            fullImageArray: [],
            selected_post_index: undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
            selected_Post_detail: undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
            selected_post: undefined, // for Delete Post 
            selected_index: undefined, // for Delete Post
            del_Modal_visible: false,
            infoMsg: 'Do you want to delete this post ?',
            InProcess: false,
            isPostReported: false,
            postText: undefined,
            showEditModal: false,
            postTextError: false,
        };

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.inFocusDisplaying(2);
    }
    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
        OneSignal.inFocusDisplaying(2);
    }

    onReceived(notification) { }

    onOpened(openResult) { }

    onIds(device) { }

    componentDidMount() {

        this.getAccessToken()
            .then(TOKEN => {
                this.setState({
                    token: JSON.parse(TOKEN).access_token,
                    user_id: JSON.parse(TOKEN)?.user_id,
                });
            })
            .then(() => {
                this.requestHandlerNewsFeed();
                this.requestHandlerFetchUser();
            });
    }

    componentWillReceiveProps(props) {
        if (this.props.commentCount !== 0 && this.state.postIndex !== null) {
            let newsFeed = [...this.state.newsFeed];
            newsFeed[this.state.postIndex].post_comments =
                Number(this.state.newsFeed[this.state.postIndex].post_comments) +
                this.props.commentCount;
            this.setState({
                newsFeed,
                postIndex: null,
            });
        }
        this.setState({ imageDisplay: props.imageDisplay });
        this.setState({
            isVisible: props.isVisible,
            userProfilePic: props.user?.user_data?.avatar
                ? props.user?.user_data?.avatar
                : null,
        });
    }

    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        return access_token;
    }

    async requestHandlerFetchUser() {
        const { token } = this.state;
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('user_id', this.state.user_id);
        formData.append('fetch', 'user_data,family,liked_pages,joined_groups');

        const response = await petMyPalApiService
            .getUserData(token, formData)
            .catch(e => {
                console.log('error while getting user Data', e);
            });
        const { data } = response;

        if (data?.api_status === 200) {
            this.props.saveLoginUser({ ...data });
            this.setState({
                currentUser: data?.user_data,
                loading: false,
            });
        } else {
            this.setState({ loading: true });
            console.log('error while getting user Data', data);
        }
    }


    async requestHandlerPostReaction(post, reaction) {
        const { token } = this.state
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('post_id', post.post_id);
        formData.append('action', 'reaction');
        formData.append('reaction', reaction);

        const response = await petMyPalApiService._postReaction(token, formData).catch((error) => {
            console.log('error whil send Reaction on post', error)
        })
        const { data } = response

    }




    async requestHandlerNewsFeed() {

        const formData = new FormData();
        const { token, newsFeed, more } = this.state;
        let beforePostId = null
        let after_post_id = null

        if (more) {
            let postType = newsFeed[newsFeed?.length - 1].postType
            if (postType == 'advertisement' || postType == 'custom_post') {
                after_post_id = newsFeed[newsFeed?.length - 2].post_id
            } else {
                after_post_id = newsFeed[newsFeed?.length - 1].post_id
            }
            beforePostId = this.props?.beforePostId
        }

        formData.append('server_key', server_key);
        formData.append('type', 'get_user_posts');
        formData.append('limit', 9);
        formData.append('id', this.state.user_id);
        more ? formData.append('after_post_id', after_post_id) : null;
        more && beforePostId != 0 ? formData.append('before_post_id', beforePostId) : null;

        const response = await petMyPalApiService.getUserNewsFeed(token, formData).catch(e => {
            console.log('error while getting UserNewFee', e);
        });

        let result = [];
        const { data } = response;

        if (data?.api_status === 200) {
            
            if (data?.data?.length == 1 && more) {  // more will save from NoPost found when brand new user created
                let postType = data?.data?.postType
                if (postType == 'advertisement' || postType == 'custom_post') {
                    this.setState({ loadingNewsFeed: false, more: false })
                    return false
                }

                data?.data?.forEach(element => {
                    element = { ...element, reactionVisible: false };
                    result.push(element);
                });

                let arr = newsFeed;
                arr = arr.concat(result);
                this.setState({ newsFeed: arr, loadingNewsFeed: false, more: false });
                return false
            }

            data?.data.forEach(element => {
                element = { ...element, reactionVisible: false };
                result.push(element);
            });

            let arr = this.state.newsFeed;
            arr = arr.concat(result);
            this.setState({ newsFeed: arr, loadingNewsFeed: false, more: false });

            // to check either any post is shared or not  
            let beforeId = undefined
            if (data?.data[0]?.before_post_id != 0) {
                beforeId = data?.data[0]?.before_post_id
            } else if (beforePostId && beforePostId != 0) {
                beforeId = beforePostId;// redux value
            } else {
                beforeId = arr[0]?.post_id
            }
            this.props.saveBeforePostId(beforeId)  // redux fun call
            // end 

        } else {
            this.setState({ newsFeed: [], loadingNewsFeed: false, more: false });
            console.log('error while getting userNewsFee', data);
        }
    }

    goBack = () => { this.props.navigation.pop() };

    hideMenu = () => { this._menu.hide() };

    showMenu = () => { this._menu.show() };

    navigateTo = pageName => {
        this.hideMenu();
        this.props.navigation.navigate({
            routeName: pageName,
            key: pageName,
        });
    };

    renderItemPets = ({ item, index }) => {
        return (
            <View key={item.id} style={{ marginHorizontal: RFValue(7) }}>
                {index === 0 ? (
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('PetAddView');
                        }}>
                        <View
                            style={{
                                width: RFValue(60),
                                height: RFValue(70),
                                borderRadius: wp(3),
                                backgroundColor: '#F0F1F4',
                                borderColor: '#F0F1F4',
                                alignSelf: 'center',
                                borderWidth: RFValue(1),
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Icon
                                name="add"
                                style={{ textAlign: 'center', color: '#8B94A9' }}
                                color={'#8B94A9'}
                            />
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: RFValue(12),
                                    fontFamily: THEME_FONT,
                                    color: '#8B94A9',
                                }}>
                                Add Pet
                            </Text>
                        </View>

                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: RFValue(12),
                                fontFamily: THEME_FONT,
                                color: '#8B94A9',
                            }}
                        />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate({
                                routeName: 'PetProfile',
                                key: 'PetProfile',
                                params: { item },
                            });
                        }}>
                        <Thumbnail
                            square
                            source={{ uri: '' + item.avatar }}
                            style={{
                                width: RFValue(60),
                                height: RFValue(70),
                                borderRadius: wp(3),
                                borderWidth: item.disabled == 1 || item.deceased == 1 ? 3 : null,
                                borderColor:
                                    item.deceased == 1 ? 'black' :
                                        item.disabled == 1 ? 'orange' :
                                            null,
                            }}
                        />
                        <Text
                            numberOfLines={1}
                            style={{
                                textAlign: 'center',
                                fontSize: RFValue(12),
                                fontWeight: '600',
                                width: RFValue(60),

                            }}>
                            {item.first_name}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    cardPressed = uri => {
        this.props.onImageDataChange([{ uri: uri }]);
    };

    reactions = (item, index) => {
        return (
            <Reactions
                item={item}
                index={index}
                ReactOnComment={(index, item, reaction) => this.ReactOnPost(index, item, reaction)} />
        )
    }

    ReactOnPost(index, item, reaction) {
        const { newsFeed, token } = this.state;
        newsFeed[index].reaction.is_reacted
            ? (newsFeed[index].reaction.count = newsFeed[index].reaction.count)
            : (newsFeed[index].reaction.count = newsFeed[index].reaction.count + 1);
        newsFeed[index].reactionVisible = false;
        newsFeed[index].reaction.type = reaction;
        newsFeed[index].reaction.is_reacted = true;
        this.setState({ newsFeed }, () =>
            this.requestHandlerPostReaction(item, reaction)
            //  this.props.postReaction(token, item.post_id, reaction)

        )
    }

    getFeelingIcon = value => {
        let e = this.state.feelingsData.filter(e => e.text === value);
        if (e?.length === 0) return '';
        else return e[0].emoji;
    };

    ReportPost = async (item) => {
        const { token } = this.state
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('post_id', item?.post_id);
        formData.append('action', 'report');

        const response = await petMyPalApiService._postReaction(token, formData).catch((error) => {
            console.log('error whil send Reaction on post', error)
        })
        const { data } = response
        if (data?.api_status == 200) {
            this.setState({ isPostReported: true })
        }
        console.log('here is reported response', data);
    }

    closeReprtModal = () => {
        this.setState({ isPostReported: false })
    }

    DeletePost = async (item, index) => {
        setTimeout(() => {
            this.setState({
                del_Modal_visible: true,
                selected_post: item,
                selected_index: index
            })
        }, 500);

    }

    closeDeleteModal = () => {
        this.setState({ del_Modal_visible: false, })
    }

    handleDeletePost = async () => {
        const { token, newsFeed, selected_post, selected_index } = this.state
        this.setState({ InProcess: true })
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('type', 'delete_post');
        formData.append('id', selected_post.post_id);

        const response = await petMyPalApiService.deletePost(token, formData).catch((error) => {
            console.log('error whil deleting a post', error)

        })
        const { data } = response
        if (data.api_status == 200) {
            newsFeed.splice(selected_index, 1)
            this.setState({ newsFeed, InProcess: false, del_Modal_visible: false })
        }
    }

    UpdatePost = async (item, index) => {
        setTimeout(() => {
            this.setState({
                showEditModal: true,
                selected_post: item,
                selected_index: index,
                postText: item?.Orginaltext
            })
        }, 500);
    }

    handleCancelBtn = () => {
        this.setState({
            showEditModal: false,
            postTextError: false,
        })
    }

    handleUpdateBtn = async () => {
        const { token, newsFeed, selected_post, selected_index, postText } = this.state
        if (postText.trim().length > 0) {
            this.setState({ InProcess: true })
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('type', 'edit_post');
            formData.append('id', selected_post.post_id);
            formData.append('text', postText);

            const response = await petMyPalApiService.updatePost(token, formData).catch((error) => {
                console.log('error whil updating a post', error)

            })
            const { data } = response
            if (data.api_status == 200) {
                let tempnewsFeed = newsFeed.slice()
                tempnewsFeed[selected_index].Orginaltext = postText
                this.setState({ newsFeed: tempnewsFeed, InProcess: false, showEditModal: false })
            }
        } else {
            this.setState({ postTextError: true })
        }
    }




    renderItemCard = ({ item, index }) => {
        const { newsFeed, reaction } = this.state;
        return (
            <RenderItemCard
                nodeRef={(ref, id) => { }}
                getFeelingIcon={this.getFeelingIcon}
                item={item}
                index={index}
                state={this.state}
                props={this.props}
                selectedPost={this.selectedPost}
                ReportPost={this.ReportPost}
                DeletePost={this.DeletePost}
                UpdatePost={this.UpdatePost}


                // openComments={(item, index) => {
                //     this.setState(
                //         { postIndex: index },
                //         this.props.onCommentDataChange(item.get_post_comments, item),
                //         this.props.commentOpen(),
                //     );
                // }}
                modalVisible={(photoList, item) =>
                    this.setState({
                        modalVisible: true,
                        viewerContent: {
                            photos: photoList,
                            index,
                            isPost: true,
                            ...item,
                        },
                    })
                }
                // is_reacted={item => {
                //     item.reaction.is_reacted
                //         ? () => {
                //             item.reaction.is_reacted = false;
                //             item.reaction.count = item.reaction.count - 1;
                //             item.reaction.type = '';
                //             this.setState({ newsFeed });
                //         }
                //         : () => {
                //             item.reaction.count = item.reaction.count + 1;
                //             item.reaction.type = 'Like';
                //             item.reaction.is_reacted = true;
                //             this.setState({ newsFeed }, () =>
                //                 this.requestHandlerPostReaction(item,'Like' ),
                //             );
                //         };
                // }}
                onPressOut={() => { this.hidePostReaction() }}
                onLongPress={() => {
                    newsFeed[index].reactionVisible = true;
                    this.setState({ newsFeed });
                }}
                reactions={() => this.reactions(item, index)}
                shareModalVisible={() =>
                    this.setState({
                        shareModalVisible: true,
                        viewerContent: {
                            index,
                            ...item,
                        },
                    })
                }
            />
        );
    };
    onRefresh = () => {
        this.setState(
            {
                isRefreshing: true,
                newsFeed: [],
                loadingNewsFeed: true,
                more: false,
            },
            () => {
                this.requestHandlerNewsFeed().then(() => {
                    this.setState({ isRefreshing: false });
                });
            },
        );
    };

    _handleScroll = event => {
        let newXOffset = event.nativeEvent.contentOffset.x;
        this.setState({ currentXOffset: newXOffset });
    };

    leftArrow = () => {
        let eachItemOffset = this.state.scrollViewWidth / this.props?.myPets.length; // Divide by 10 because I have 10 <View> items
        let _currentXOffset = this.state.currentXOffset - eachItemOffset;
        this.refs.scrollView.scrollTo({ x: _currentXOffset, y: 0, animated: true });
    };

    rightArrow = () => {
        let eachItemOffset = this.state.scrollViewWidth / this.props.myPets.length; // Divide by 10 because I have 10 <View> items
        let _currentXOffset = this.state.currentXOffset + eachItemOffset;
        this.refs.scrollView.scrollTo({ x: _currentXOffset, y: 0, animated: true });
    };

    updateState = state => { this.setState(state) };

    updateUserData = () => { this.requestHandlerFetchUser() };

    handleComments = () => {
        const { viewerContent } = this.state  /// when open imageveiw get Selected item
        this.setState({ modalVisible: false },
            function () {
                this.props.navigation.navigate({
                    routeName: 'PostDetail',
                    key: 'PostDetail',
                    params: viewerContent,
                });
            })
    }

    closeAboutModal = () => {
        this.setState({
            aboutModal: false
        })
    }

    selectedPost = (post, index) => {
        this.setState({
            selected_Post_detail: post,
            selected_post_index: index
        })
    }

    hidePostReaction = (i) => {
        const { newsFeed } = this.state
        this.removeTimeOut = setTimeout(() => {
            let tempNewsFeed = newsFeed.slice()
            tempNewsFeed.map((item, i) => {
                tempNewsFeed[i].reactionVisible = false
            })

            this.setState({ newsFeed: tempNewsFeed })
            clearTimeout(this.removeTimeOut)
        }, timeOut);

    }

    render() {
        const {
            pets,
            loading,
            loadingPets,
            loadingSuggested,
            newsFeed,
            loadingNewsFeed,
            more,
            aboutModal,
            currentUser,
            del_Modal_visible,
            infoMsg,
            InProcess,
            postText,
            showEditModal,
            postTextError,
            isPostReported,

        } = this.state;

        let year = '';
        let month = '';
        if (currentUser.registered) {
            [month, year] = currentUser.registered.split('/');
        }
        var aboutDetails = this.props.user.user_data?.about != 'null' && this.props.user.user_data?.about ? this.props.user.user_data?.about : ''



        return (
            <Container style={styles.container}>
                <NavigationEvents onDidFocus={() => this.updateUserData()} />
                <InfoModal
                    isVisible={aboutModal}
                    onBackButtonPress={() => this.closeAboutModal()}
                    info={LongAboutParseHtml(this.props.user.user_data?.about)}
                    headerText={''}
                    policy={''}
                    leftAlign={true}
                    onPress={() => this.closeAboutModal()}
                />
                {loading && loadingPets && loadingSuggested ? (
                    <View
                        style={{
                            position: 'absolute',
                            top: wp(15),
                            width: '100%',
                            justifyContent: 'center',
                            zIndex: 1,
                        }}>
                        <PlaceholderLoader />
                    </View>
                ) : (
                    <Content
                        enableResetScrollToCoords={false}
                        scrollEventThrottle={300}
                        onScrollEndDrag={event => {
                            let itemHeight = 402;
                            let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
                            let currentItemIndex = Math.ceil(currentOffset / itemHeight);
                            if (this.distanceFromEnd) {
                                if (currentItemIndex >= this.distanceFromEnd) {
                                    if (!this.state.more) {
                                        this.distanceFromEnd = currentItemIndex + 5;
                                        this.setState({ more: true }, () => {
                                            this.requestHandlerNewsFeed();
                                        });
                                    }
                                }
                            } else {
                                this.distanceFromEnd = 4;
                            }
                        }}
                        nestedScrollEnabled={true}
                        contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
                        refreshControl={
                            <RefreshControl
                                colors={[HEADER, '#9Bd35A', '#689F38']}
                                refreshing={this.state.isRefreshing}
                                onRefresh={() => this.onRefresh()}
                            />
                        }>
                        <View>
                            <View style={styles.coverImgContainer}>
                                <TouchableOpacity onPress={this.goBack} style={styles.header}>
                                    <Icon
                                        name={'chevron-back'}
                                        type="Ionicons"
                                        style={
                                            currentUser.cover
                                                ? [styles.iconStyle]
                                                : [styles.blackIcon]
                                        }
                                    />
                                </TouchableOpacity>

                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        let array = [];
                                        array.push(
                                            {
                                                source: {
                                                    uri: currentUser.cover
                                                        ? currentUser.cover
                                                        : 'https://res.cloudinary.com/n4beel/image/upload/v1595058775/pattern_2_xhmx4n.png',
                                                }
                                            })
                                        this.setState({
                                            fullImageArray: array,
                                            isPost: false,
                                        })
                                    }}
                                >
                                    <Image
                                        style={styles.coverImg}
                                        source={{
                                            uri: currentUser.cover
                                                ? currentUser.cover
                                                : 'https://res.cloudinary.com/n4beel/image/upload/v1595058775/pattern_2_xhmx4n.png',
                                        }}
                                    />
                                </TouchableWithoutFeedback>
                            </View>

                            <View style={styles.cardView}>
                                <View style={styles.outerView}>
                                    <View style={{ flex: 3 }} />
                                    <View style={styles.profileImgView}>
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                let array = [];
                                                array.push(
                                                    {
                                                        source: {
                                                            uri: currentUser.avatar
                                                                ? currentUser.avatar
                                                                : currentUser.gender === 'female'
                                                                    ? 'https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600134.jpg'
                                                                    : 'https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600175.jpg',
                                                        }
                                                    })
                                                this.setState({
                                                    fullImageArray: array,
                                                    isPost: false,
                                                })
                                            }}>
                                            <View style={styles.imgOuterView}>
                                                <Image
                                                    style={styles.profileImg}
                                                    source={{
                                                        uri: currentUser.avatar
                                                            ? currentUser.avatar
                                                            : currentUser.gender === 'female'
                                                                ? 'https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600134.jpg'
                                                                : 'https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600175.jpg',
                                                    }}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>

                                    <View style={styles.EditView}>
                                        <TouchableOpacity
                                            onPress={() => this.showMenu()}
                                            style={styles.editBtnContainer}>
                                            <Icon name={'more-vertical'} type={'Feather'} />
                                        </TouchableOpacity>

                                        <View style={styles.menuView}>
                                            <Menu
                                                ref={this.setMenuRef}
                                            //   button={<Text onPress={this.showMenu}>Show menu</Text>}
                                            >
                                                <MenuItem
                                                    onPress={() => this.navigateTo('EditProfile')}>
                                                    Edit Profile
                                                </MenuItem>
                                                <MenuDivider />
                                                {/* <MenuItem onPress={()=>this.navigateTo('PreviousOrder')}>Previous Order</MenuItem> */}
                                            </Menu>
                                        </View>
                                    </View>
                                </View>

                                <Text style={styles.nameText}>{currentUser.full_name}</Text>
                                <Text style={styles.memberSince}> Member Since: {year}</Text>

                                <View style={{ marginHorizontal: 30 }}>
                                    <View style={styles.rowView}>
                                        <View style={styles.followingFollwerRow}>
                                            <Image
                                                style={styles.followerIcon}
                                                resizeMode={'contain'}
                                                source={followersImg}
                                            />
                                            <View>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.props.navigation.navigate({
                                                            routeName: 'Followers',
                                                            key: 'Followers',
                                                            params: {
                                                                currentUserId: this?.props?.user?.user_data
                                                                    .user_id,
                                                                key: 0,
                                                            },
                                                        })
                                                    }>
                                                    <View style={styles.countView}>
                                                        <Text style={styles.infoDetailText}>
                                                            {currentUser.details.followers_count
                                                                ? currentUser.details.followers_count
                                                                : 0}
                                                        </Text>
                                                        <Text style={styles.followersText}>Followers</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={styles.followingFollwerRow}>
                                            <Image
                                                style={styles.followerIcon}
                                                resizeMode={'contain'}
                                                source={followingsImg}
                                            />
                                            <View>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.props.navigation.navigate({
                                                            routeName: 'Followers',
                                                            key: 'Followers',
                                                            params: {
                                                                currentUserId: this?.props?.user?.user_data
                                                                    ?.user_id,
                                                                key: 1,
                                                            },
                                                        })
                                                    }>
                                                    <Text style={styles.infoDetailText}>
                                                        {currentUser.details.following_count
                                                            ? currentUser.details.following_count
                                                            : 0}
                                                    </Text>
                                                    <Text style={styles.followersText}>Following</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.myPetsView}>
                                    {/* <Text style={styles.petText}>My Pets</Text> */}
                                </View>
                                {pets?.length === 0 && loadingPets === false ? (
                                    <Text style={styles.notFound}>No Pets Found</Text>
                                ) : (
                                    <View style={styles.leftArrow}>
                                        {pets?.length > 3 ? (
                                            <TouchableOpacity
                                                style={styles.leftButton}
                                                onPress={this.leftArrow}>
                                                <FAIcon name="angle-left" color="#424242" size={32} />
                                            </TouchableOpacity>
                                        ) : null}

                                        <ScrollView
                                            showsHorizontalScrollIndicator={false}
                                            horizontal={true}
                                            contentContainerStyle={{ alignItems: 'center' }}
                                            ref="scrollView"
                                            onContentSizeChange={(w, h) =>
                                                this.setState({ scrollViewWidth: w })
                                            }
                                            scrollEventThrottle={16}
                                            scrollEnabled={true} // remove if you want user to swipe
                                            onScroll={this._handleScroll}>
                                            <FlatList
                                                disableVirtualization={true}
                                                horizontal={true}
                                                data={pets}
                                                renderItem={this.renderItemPets}
                                                initialNumToRender={4}
                                                maxToRenderPerBatch={4}
                                                windowSize={4}
                                                keyExtractor={(item, index) => index.toString()}
                                                contentContainerStyle={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flex: 1,
                                                    paddingVertical: RFValue(10),
                                                }}
                                            />
                                        </ScrollView>
                                        {pets?.length > 3 ? (
                                            <TouchableOpacity
                                                style={{
                                                    alignItems: 'flex-end',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                }}
                                                onPress={this.rightArrow}>
                                                <FAIcon name="angle-right" color="#424242" size={32} />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                )}
                                <TouchableOpacity onPress={() => this.setState({ aboutModal: true })} style={{
                                    color: '#465575',
                                    marginTop: aboutDetails.length > 100 ? 10 : 0,
                                    marginHorizontal: 10,
                                    marginBottom: aboutDetails.length > 100 ? 10 : 0,
                                }}>
                                    <View style={{ width: '100%', alignItems: 'center' }}><Text

                                        style={{ width: '100%', textAlign: 'left' }}>{ShortAboutParseHtml(this.props.user.user_data?.about)}</Text></View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ marginBottom: RFValue(10) }}>
                            <WhatsYourMind
                                StatusView={() => {
                                    this.props.navigation.navigate('StatusView', {
                                        MyTimeLine: true,
                                    });
                                }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            {!loadingNewsFeed ? (
                                <FlatList
                                    disableVirtualization={true}
                                    windowSize={2}
                                    initialNumToRender={10000}
                                    removeClippedSubviews={true}
                                    scrollEnabled={true}
                                    horizontal={false}
                                    contentContainerStyle={{
                                        flex: 1,
                                        paddingVertical: RFValue(10),
                                    }}
                                    data={newsFeed}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this.renderItemCard}
                                />
                            ) : (
                                <PlaceholderLoader />
                            )}
                        </View>

                        {more ? (
                            <PlaceholderLoader down={true} />
                        ) : newsFeed?.length < 0 ? (
                            <View
                                style={{
                                    flex: 1,
                                    height: RFValue(250),
                                    backgroundColor: '#FFFFFF',
                                    marginVertical: RFValue(5),
                                    justifyContent: 'center',
                                }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: RFValue(20 - 2),
                                        fontFamily: THEME_FONT,
                                        textAlignVertical: 'center',
                                    }}>
                                    No Post Found
                                </Text>
                            </View>
                        ) : null}

                    </Content>

                )}
                <ImageView
                    glideAlways
                    animationType="slide"
                    images={this.state.fullImageArray}
                    isVisible={this.state.fullImageArray?.length > 0 ? true : false}
                    onClose={() => this.setState({ fullImageArray: [] })}
                    isSwipeCloseEnabled={false}

                />
                <ImageViewerModal
                    viewerContent={this.state.viewerContent}
                    modalVisible={this.state.modalVisible}
                    updateState={this.updateState}
                    handleComments={this.handleComments}

                />
                <ShareModal
                    viewerContent={this.state.viewerContent}
                    modalVisible={this.state.shareModalVisible}
                    updateState={this.updateState}
                    navigation={this.props.navigation}
                />
                <ConfirmModal
                    isVisible={del_Modal_visible}
                    info={infoMsg}
                    DoneTitle={'Delete'}
                    onDoneBtnPress={this.handleDeletePost}
                    CancelTitle={'Cancel'}
                    onCancelBtnPress={this.closeDeleteModal}
                    processing={InProcess}
                />
                <EditPost
                    onChangeText={(v) => this.setState({ postText: v })}
                    value={postText}
                    showEditModal={showEditModal}
                    handleUpdateBtn={this.handleUpdateBtn}
                    handleCancelBtn={this.handleCancelBtn}
                    InProcess={InProcess}
                    postTextError={postTextError}
                />
                <ErrorModal
                    isVisible={isPostReported}
                    onBackButtonPress={() => this.closeReprtModal()}
                    info={reportPostText}
                    postReport={true}
                    heading={'Woof!'}
                    onPress={() => this.closeReprtModal()}
                />
                {/* <ImageView
                    images={img}
                    imageIndex={0}
                    visible={imageViewer}
                    presentationStyle="overFullScreen"
                    onRequestClose={() => this.setState({ imageViewer: false })}
                /> */}
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    workspace: state.user.workspace,
    myPets: state.mypets.pets,
    beforePostId: state.post.beforePostId
});

const mapDispatchToProps = dispatch => ({
    saveLoginUser: user => dispatch(userEdit(user)),
    saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
    saveBeforePostId: (postId) => dispatch(saveBeforePostId(postId))
});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserProfile);