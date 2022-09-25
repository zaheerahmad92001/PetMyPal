import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    findNodeHandle,
} from 'react-native';
import {
    Container,
    Content,
    Icon,
    Thumbnail,
} from 'native-base';
import { connect } from 'react-redux';
import _ from 'lodash';
import { userEdit, saveWorkSpace, followFollower } from '../../redux/actions/user';
import { RFValue } from 'react-native-responsive-fontsize';
import { THEME_FONT } from '../../constants/fontFamily';
import {server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import { PINK,White } from '../../constants/colors';
import OneSignal from 'react-native-onesignal';;
import ImageView from 'react-native-image-view';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import { TouchableWithoutFeedback } from 'react-native';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import ShareModal from '../shareModal/index';
import { widthPercentageToDP as wp, } from 'react-native-responsive-screen';
import RenderItemCard from '../../components/common/RenderItemCard';
import { commonState } from '../../components/common/CommomState';
import { NavigationEvents } from 'react-navigation';
import { followingsImg, followersImg, no_data_default_img,reportPostText} from '../../constants/ConstantValues'
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { Capitalize } from '../../utils/RandomFuncs';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorModal from '../../components/common/ErrorModal';
import styles from './styles';
import InfoModal from '../../components/common/InfoModal';
import { LongAboutParseHtml, ShortAboutParseHtml } from '../../components/helpers';
import CustomLoader from '../../components/common/CustomLoader';
import Reactions from '../../components/common/Reactions'
import {saveBeforePostId} from '../../redux/actions/post'
import EditPost from '../../components/common/EditPost';



const timeOut = 5000
let temp = false

class Profile extends React.Component {
    state = {

        aboutModal: false,
        newsFeed: [],
        selectedItem: '',
        followRequest: false,
        token: undefined,
        currentUserId: undefined,
        fullImageArray: [],
        selected_post_index: undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
        selected_Post_detail: undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
        requestStatus: false,
      selected_post:undefined, // for Delete Post 
      selected_index:undefined, // for Delete Post
      del_Modal_visible:false,
      infoMsg:'Do you want to delete this post ?',
      InProcess:false,
      isPostReported:false,

      postText:undefined,
      showEditModal:false,
      postTextError:false,
    }

    constructor(props) {
        super(props);
        OneSignal.init('433c25e1-b94d-4f09-8602-bbe908a3761e', {
            kOSSettingsKeyAutoPrompt: true,
        });

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.inFocusDisplaying(2);

        this.state = commonState;
        this.distanceFromEnd = 0;
        this._nodes = new Map();
        this.contentRef = React.createRef();

    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
        OneSignal.inFocusDisplaying(2);
        this.focusListener;
    }

    onReceived(notification) {
        // console.log('Notification received: ', notification);
    }

    onOpened(openResult) {

    }

    onIds(device) {
    }
    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.fetchUserData();
        })
        this.fetchUserData();



    }
    fetchUserData() {
        this.setState({ followLoading: true })
        let r = Math.random().toString(36).substring(7);
        this.setState({
            currentUserId: this.props.navigation.getParam('user_id'), // user id whoes profile you visit
            selectedItem: this.props.navigation.getParam('item'), // this prop comming from SearchView (we test only this)
            isFollowed: this.props.navigation.getParam('isUserFollowed'), // invite follow followers
            // followRequest: this.props.navigation.getParam('followRequest'),// coming from notification
            randomKey: r /// important 
        });
        if (this.state.selectedItem?.is_following == 2) {
            this.setState({ requestStatus: true })

        }

        this.getAccessToken().then(TOKEN => {
            this.setState({ token: JSON.parse(TOKEN).access_token });
            this.getUserData()
            this.checkUserIsFollowed()
            this.requestHandlerFetchUserPets();
            this.requestHandlerNewsFeed();
        });
    }



    closeConfirmModal = () => {
        this.setState({ isConfirm_Modal_visible: false })
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

        this.setState({
            currentUserId: this.props.navigation.getParam('user_id'),
            selectedItem: this.props.navigation.getParam('item'),
            isFollowed: this.props.navigation.getParam('isUserFollowed'),
        });
        this.getAccessToken().then(TOKEN => {
            this.setState({ token: JSON.parse(TOKEN).access_token });
            this.getUserData()
            this.checkUserIsFollowed()
            this.requestHandlerFetchUserPets();
            this.requestHandlerNewsFeed();

        });

    }


    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        return access_token;
    }

    getUserData = async () => {
        const { token, currentUserId } = this.state
        //    let id = this.props.navigation.getParam('user_id')
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('user_id', currentUserId);
        formData.append('fetch', 'user_data,family,liked_pages,joined_groups,followers,following');
        const response = await petMyPalApiService.getUserData(token, formData).catch((e) => {
            this.setState({
                isConfirm_Modal_visible: false,
                isErrorModal_Visible: true,
                errorMessage: Capitalize(e.errors.error_text)
            });
        })
        const { data } = response;
        if (data?.api_status == 200) {
            if (data?.user_data?.is_following == 2) {
                this.setState({ requestStatus: true })
            }
            if (data?.user_data?.is_following == 0) {
                this.setState({ requestStatus: false, isFollowed: false })
            }
            if (data?.user_data?.is_requested == 1) {
                this.setState({ followRequest: true })
            }

            this.setState({
                loading: false,
                currentUser: data.user_data,
                myFollowing: data.following,
                myFollowers: data.followers,
                followLoading: false

            });
        }
        else { this.goBack()}

    }

    followUser = async () => {
        const scope = this
        this.setState({ unfollowInProcess: true, followLoading: true })

        let logedInUserFollowFollowing = this.props.followFollowers
        let logedInUserFollowing = logedInUserFollowFollowing?.following
        let logedInUserFollower = logedInUserFollowFollowing?.followers

        const { token, currentUser, currentUserId, selectedItem } = this.state

        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('user_id', currentUserId);

        const response = await petMyPalApiService.followUser(token, formData).catch((e) => {
            this.setState({
                isErrorModal_Visible: true,
                errorMessage: Capitalize(e.errors.error_text)
            });
        })
        const { data } = response
        if (data?.api_status === 200) {
            if (data.follow_status === 'followed') {
                let logedInUserFollowFollowing = this.props?.followFollowers
                logedInUserFollowFollowing?.following?.push(selectedItem)
                this.props.saveFollowFollowers(logedInUserFollowFollowing)
                scope.checkUserIsFollowed()
                scope.getUserData()

            } else if (data.follow_status === 'unfollowed') {

                let temp = []
                logedInUserFollowing?.forEach((element) => {

                    if (element?.user_id === currentUserId) {

                        return false
                    } else {
                        temp.push(element)
                    }
                });
                let ff = {
                    followers: logedInUserFollower,
                    following: temp
                }
                this.props.saveFollowFollowers(ff)

                this.checkUserIsFollowed()
                scope.getUserData()

            }
            else if (data.follow_status === "requested") {
                // this.setState({requestStatus:true})
                scope.checkUserIsFollowed()
                scope.getUserData()

            }

        } else {
            this.setState({
                isConfirm_Modal_visible: false,
                unfollowInProcess: false,
                isErrorModal_Visible: true,
                errorMessage: Capitalize(data.errors.error_text)
            });
        }
    }
    checkUserIsFollowed = async () => {
        const { token, currentUserId } = this.state
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('type', 'followers,following');
        formData.append('user_id', this?.props?.user?.user_data?.user_id);

        const response = await petMyPalApiService.followFollowing(token, formData).catch((e) => {
            this.setState({
                isConfirm_Modal_visible: false,
                isErrorModal_Visible: true,
                errorMessage: Capitalize(e.errors.error_text)
            });
        })
        const { data } = response
        var checkUserisFollowed = false;
        if (data.api_status === 200) {
            const { following, followers } = data?.data
            if (following.length == 0) {
                checkUserisFollowed = false
            }

            //  zaheer ahamd remove this 

            // followers.forEach(item => {
            //     if (item?.user_id == currentUserId) {
            //         checkUserisFollowed = true

            //     }
            // })

            if (checkUserisFollowed == false) {
                following.forEach(item => {
                    if (item?.user_id == currentUserId) {
                        checkUserisFollowed = true
                        this.setState({ requestStatus: false })

                    }
                })

            }


            // for (let i = 0; i < following.length; i++) {

            //     if (following[i]?.user_id == currentUserId) {
            //         temp = true
            //         break;
            //     } else {
            //         temp = false
            //     }
            // }


            this.setState({
                isFollowed: checkUserisFollowed,
                followLoading: false,
                isConfirm_Modal_visible: false,
                unfollowInProcess: false
            })

        } else {
            this.setState({
                isErrorModal_Visible: true,
                errorMessage: Capitalize(data.errors.error_text)
            })
        }
    }

    async requestHandlerFetchUserPets() {
        const { token } = this.state

        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('user_id', this.props.navigation.getParam('user_id'));

        const response = await petMyPalApiService.getUserPets(token, formData).catch((e) => {
            this.setState({ pets: [], loadingPets: false });
        })
        const { data } = response;
        if (data.api_status === 200) {
            this.setState({ pets: data.pets, loadingPets: false });
        } else {
            this.setState({ pets: [], loadingPets: false });
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
        const { token, newsFeed, more } = this.state
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
        formData.append('id', this.props.navigation.getParam('user_id'));
        more ? formData.append('after_post_id', after_post_id) : null;
        more && beforePostId != 0 ? formData.append('before_post_id', beforePostId) : null;

        const response = await petMyPalApiService.getUserNewsFeed(token, formData).catch((e) => {
            console.log(e);
            this.setState({ newsFeed: [], loadingNewsFeed: false, more: false });
        })

        let result = [];
        const { data } = response
        if (data.api_status === 200) {

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
                this.setState({ newsFeed: arr,loadingNewsFeed: false,more: false,})
                return false
        }

            data.data.forEach(element => {
                element = { ...element, reactionVisible: false };
                result.push(element);
            });
            let arr = this.state.newsFeed;
            arr = arr.concat(result);
            this.setState({ newsFeed: arr,loadingNewsFeed: false,more: false,})

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


            setTimeout(() => {
                if (this.props.navigation.getParam('post_id')) {
                    data.data.forEach((el, idx) => {
                        if (el.post_id == this.props.navigation.getParam('post_id')) {
                            this.scrollToElement(el.post_id);
                        }
                    })
                }
            }, 2000)
        } else {
            this.setState({ newsFeed: [], loadingNewsFeed: false, more: false });
        }
    }

    scrollToElement = (indexOf) => {
        const node = this._nodes.get(indexOf);
        const position = findNodeHandle(node);
        this.contentRef?.scrollResponderScrollTo({ x: 0, y: position, animated: true });
    }
    
    goBack = () => { this.props.navigation.pop() };

    showCoverViewerModal = () => {
        let array = [];
        const { currentUser } = this.state
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
    }

    showImgViewerModal = () => {
        let array = [];
        const { currentUser } = this.state
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
    }


    renderItem = ({ item }) => {
        return (
            <View style={{ marginHorizontal: RFValue(7) }}>
                <TouchableOpacity>
                    <Thumbnail
                        source={{ uri: "" + item.avatar }}
                        style={{ backgroundColor: '#F2F2F2', alignSelf: 'center' }}
                    />
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: RFValue(14 - 2),
                            fontFamily: THEME_FONT,
                        }}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    renderItemPets = ({ item, index }) => {
        return (
            <View
                key={index}
                style={{ marginHorizontal: RFValue(10) }}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate({
                            routeName: 'PetProfile',
                            key: 'PetProfile',
                            params: { item },
                        });
                    }}>
                    <Thumbnail
                        //   small={true}
                        square
                        source={{ uri: "" + item.avatar }}
                        style={styles.petImg}
                    />
                    <Text
                        numberOfLines={1}
                        style={{
                            textAlign: 'center',
                            fontSize: RFValue(12),
                            color: '#182A53',
                            fontWeight: 'bold',
                            width: RFValue(60),

                        }}>
                        {item.first_name}
                    </Text>
                </TouchableOpacity>
            </View>
        );
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

        )
    }

    getFeelingIcon = value => {
        let e = this.state.feelingsData.filter(e => e.text === value);
        if (e.length === 0) return '';
        else return e[0].emoji;
    };

    selectedPost = (post, index) => {
        this.setState({
            selected_Post_detail: post,
            selected_post_index: index
        })
    }

    updateSinglePost = async () => {
        const {
          selected_post_index,
          selected_Post_detail,
          newsFeed,
          token,
        } = this.state
    
        const tempPosts = newsFeed.slice(0)
        let index = selected_post_index
        let post = selected_Post_detail
    
        if (post?.post_id) {   // just to avoid unnecessory server call when just Navigate to this screen
          const formData = new FormData();
          formData.append('server_key', server_key);
          formData.append('fetch', 'post_data,post_comments,post_liked_users,post_liked_users');
          formData.append('post_id', post?.post_id);
          const response = await petMyPalApiService.getSinglePost(token, formData).catch((err) => {
            console.log('error while getting single post', err)
          })
    
          const { data } = response
          if (data?.api_status === 200) {
            tempPosts[index].get_post_comments = data?.post_comments
            tempPosts[index].reaction = data?.post_data?.reaction
            tempPosts[index].post_share = data?.post_data?.post_share
            tempPosts[index].post_comments = data?.post_data?.post_comments
    
            this.setState({ newsFeed: tempPosts })
          }
        }
    
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

 ReportPost = async (item)=>{
    const { token } = this.state
    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('post_id', item?.post_id);
    formData.append('action', 'report');

    const response = await petMyPalApiService._postReaction(token, formData).catch((error) => {
        console.log('error whil send Reaction on post', error)
    })
    const { data } = response
    if(data?.api_status==200){
      this.setState({isPostReported:true})
    }
    console.log('here is reported response',data);
}

closeReprtModal=()=>{
    this.setState({isPostReported:false})
   }

DeletePost = async (item , index)=>{
    setTimeout(() => {
      this.setState({ 
        del_Modal_visible:true,
        selected_post:item , 
        selected_index:index
      })
    },500);
    
  }
  
  closeDeleteModal =()=>{
    this.setState({ del_Modal_visible:false,})
  }
  
  handleDeletePost = async ()=>{
    const {token , newsFeed , selected_post , selected_index} = this.state
    this.setState({InProcess:true})
    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('type','delete_post');
    formData.append('id', selected_post.post_id);
  
    const response = await petMyPalApiService.deletePost(token , formData).catch((error)=>{
      console.log('error whil deleting a post', error)
  
    })
    const {data} =response
    if(data.api_status==200){
       newsFeed.splice(selected_index ,1)
      this.setState({newsFeed , InProcess:false , del_Modal_visible:false}) 
    }
  }

  UpdatePost= async(item, index)=>{
    setTimeout(() => {
      this.setState({ 
        showEditModal:true,
        selected_post:item , 
        selected_index:index,
        postText:item?.Orginaltext
      })
    },500);
  }
  
  handleCancelBtn=()=>{
    this.setState({
      showEditModal:false , 
      postTextError:false,
    })
  }
  
  handleUpdateBtn= async ()=>{
    const {token , newsFeed , selected_post , selected_index, postText} = this.state
    if(postText.trim().length>0){
    this.setState({InProcess:true})
    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('type','edit_post');
    formData.append('id', selected_post.post_id);
    formData.append('text', postText);
  
    const response = await petMyPalApiService.updatePost(token , formData).catch((error)=>{
      console.log('error whil updating a post', error)
  
    })
    const {data} =response
    if(data.api_status==200){
      let tempnewsFeed = newsFeed.slice()
      tempnewsFeed[selected_index].Orginaltext = postText
      this.setState({newsFeed:tempnewsFeed , InProcess:false , showEditModal:false}) 
    }
  }else{
   this.setState({postTextError:true})
  }
  
  }

    renderItemCard = ({ item, index }) => {
        const { newsFeed, reaction } = this.state;
        return (
            <RenderItemCard
                nodeRef={(ref, id) => { }}
                nodeRef={(id, ref) => this._nodes.set(id, ref)}
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
                //          }
                //         : () => {
                //             item.reaction.count = item.reaction.count + 1;
                //             item.reaction.type = 'Like';
                //             item.reaction.is_reacted = true;
                //             this.setState({ newsFeed }, () =>
                //             this.requestHandlerPostReaction(item,'Like' ),
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

    acceptRequest = (type) => {
        this.setState({ followLoading: true })
        petMyPalApiService.confirmRequest(this.state.token, server_key, this.state.currentUserId, type).then(response => {
            if (response.data?.api_status == 200) {
                this.setState({ isFollowed: false, followLoading: false, requestStatus: false, followRequest: false })

            }
        })


    }


    openConfirmModal = () => {
        const { currentUser } = this.state
        this.setState({
            isConfirm_Modal_visible: true,
            unfollowMsg: `Do You Want to Unfollow ${currentUser?.full_name?.trim()}?`,
            unfollowUserId: currentUser?.user_id,
            followingName: currentUser.full_name
        })
    }


    _handleScroll = event => {
        let newXOffset = event.nativeEvent.contentOffset.x;
        this.setState({ currentXOffset: newXOffset });
    };

    leftArrow = () => {
        let eachItemOffset = this.state.scrollViewWidth / 10; // Divide by 10 because I have 10 <View> items
        let _currentXOffset = this.state.currentXOffset - eachItemOffset;
        this.refs.scrollView.scrollTo({ x: _currentXOffset, y: 0, animated: true });
    };

    rightArrow = () => {
        let eachItemOffset = this.state.scrollViewWidth / 10; // Divide by 10 because I have 10 <View> items
        let _currentXOffset = this.state.currentXOffset + eachItemOffset;
        this.refs.scrollView.scrollTo({ x: _currentXOffset, y: 0, animated: true });
    };

    updateState = state => {
        this.setState(state);
    };
    closeAboutModal = () => {
        this.setState({
            aboutModal: false
        })
    }
    updateShareCount = (id) => {
        var updateNewsFeed = this.state.newsFeed
        updateNewsFeed.forEach((item) => {

            if (item.post_id == id) {
                if (item?.shared_info?.post_share) {
                    item.shared_info.post_share = Number(item.shared_info.post_share) + 1
                }
                else {
                    item.post_share = Number(item.post_share) + 1
                }
            }

        });
        this.setState({ newsFeed: updateNewsFeed })
    }

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

    closeErrorModal = () => {
        this.setState({ isErrorModal_Visible: false })
    }

    render() {

        const {
            pets,
            loading,
            loadingPets,
            newsFeed,
            loadingNewsFeed,
            followLoading,
            more,
            currentUser,
            isFollowed,
            isErrorModal_Visible,
            errorMessage,
            myFollowers,
            isConfirm_Modal_visible,
            unfollowMsg,
            unfollowInProcess,
            randomKey,
            del_Modal_visible,
            infoMsg,
            InProcess,
            postText,
            showEditModal,
            postTextError,
           isPostReported,

        } = this.state;

        let year = ''
        let month = ''
        if (currentUser.registered) {
            [month, year] = currentUser.registered.split('/')
        }

        
        return (
            <Container style={{ flex: 1 }}>
                {loading && <View style={{ position: 'absolute', top: wp(30), width: '100%', justifyContent: 'center', zIndex: 1 }}><PlaceholderLoader /></View>}

                <Content
                    enableResetScrollToCoords={false}
                    innerRef={c => (this.contentRef = c)}
                    scrollEventThrottle={300}
                    onScrollEndDrag={event => {
                        let itemHeight = 402;
                        let currentOffset = Math.floor(
                            event.nativeEvent.contentOffset.y,
                        );
                        let currentItemIndex = Math.ceil(currentOffset / itemHeight);
                        if (this.distanceFromEnd) {
                            if (currentItemIndex >= this.distanceFromEnd) {
                                if (!this.state.more) {
                                    this.distanceFromEnd = currentItemIndex + 5
                                    this.setState({ more: true }, () => {
                                        this.requestHandlerNewsFeed()
                                    });
                                }
                            }
                        } else {
                            this.distanceFromEnd = 4

                        }
                    }}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
                    scroll
                //  refreshControl={
                //      <RefreshControl
                //          colors={[HEADER, '#9Bd35A', '#689F38']}
                //          refreshing={this.state.isRefreshing}
                //          onRefresh={() => this.onRefresh()}
                //      />
                //  }
                >
             <NavigationEvents onDidFocus={() => this.updateSinglePost()} />
                    <View>
                        <View style={styles.coverImgContainer}>
                            <TouchableOpacity
                                onPress={this.goBack}
                                style={styles.header}>
                                <Icon
                                    name={'chevron-back-outline'}
                                    type={'Ionicons'}
                                    style={currentUser.cover ? [styles.iconStyle] : [styles.blackIcon]}
                                />
                            </TouchableOpacity>

                            <TouchableWithoutFeedback
                                onPress={() => this.showCoverViewerModal()}>
                                <View style={styles.coverImageView}>
                                    <Image
                                        style={styles.coverImg}
                                        source={{
                                            uri: currentUser.cover
                                                ? currentUser.cover
                                                : 'https://res.cloudinary.com/n4beel/image/upload/v1595058775/pattern_2_xhmx4n.png',
                                        }}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        <View style={styles.cardView}>
                            <View style={styles.outerView}>
                                <View style={styles.imgView}>
                                    <TouchableWithoutFeedback
                                        onPress={() => this.showImgViewerModal()}>
                                        <View style={styles.imgOuterView}>
                                            <Image
                                                style={styles.profileImg}
                                                resizeMode={'contain'}
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

                            </View>

                            <View style={styles.nameView}>
                                <Text
                                    style={styles.nameStyle}>
                                    {currentUser.full_name}
                                </Text>
                                <Text style={styles.memberSince}> Member Since: {year}</Text>
                            </View>

                            <View style={{ marginHorizontal: 30 }}>
                                <View style={styles.rowView}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate({
                                                routeName: 'Followers',
                                                key: randomKey,
                                                // key: 'Followers',
                                                params: {
                                                    currentUserId: this.state.currentUserId,
                                                    key: 0,
                                                },
                                            })
                                        } style={styles.followingFollwerRow}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image
                                                style={styles.followerIcon}
                                                resizeMode={'contain'}
                                                source={followersImg}
                                            />
                                            <Text style={styles.infoDetailText}>
                                                {myFollowers.length > 0 ?
                                                    myFollowers.length : 0
                                                }
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.followersText}>Followers</Text>

                                        </View>

                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate({
                                                routeName: 'Followers',
                                                key: randomKey,
                                                // key: 'Followers',
                                                params: {
                                                    currentUserId: this.state.currentUserId,
                                                    key: 1,
                                                },
                                            })
                                        } style={styles.followingFollwerRow}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image
                                                style={styles.followerIcon}
                                                resizeMode={'contain'}
                                                source={followingsImg}
                                            />
                                            <Text style={styles.infoDetailText}>
                                                {currentUser.details.following_count
                                                    ? currentUser.details.following_count
                                                    : 0}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.followersText}>Following</Text>


                                        </View>
                                    </TouchableOpacity>

                                </View>

                                <View
                                    style={styles.buttonView}>
                                    <View style={styles.btnHeight}>
                                        {followLoading ?
                                            <CustomLoader loaderContainer={{ marginTop: -5 }} />
                                            :
                                            followLoading === false && isFollowed ?
                                                <TouchableOpacity
                                                    style={styles.followBtn}
                                                    onPress={() => this.openConfirmModal()}>
                                                    <Text
                                                        style={{ ...styles.messageText, color: White }}>
                                                        Following
                                                    </Text>
                                                </TouchableOpacity>

                                                : this.state.followRequest ?
                                                    <TouchableOpacity
                                                        style={[styles.messageBtn, { backgroundColor: PINK, borderColor: PINK }]}
                                                        onPress={() => this.acceptRequest('accept')} >
                                                        <Text
                                                            style={styles.messageText}>
                                                            Accept
                                                        </Text>
                                                    </TouchableOpacity>

                                                    :
                                                    this.state.requestStatus ?
                                                        <TouchableOpacity
                                                            style={[styles.messageBtn, { backgroundColor: PINK, borderWidth: 0 }]}
                                                            onPress={() => this.followUser()}
                                                        >
                                                            <Text
                                                                style={styles.messageText}>
                                                                Requested
                                                            </Text>
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity
                                                            style={styles.messageBtn}
                                                            onPress={() => this.followUser()}>
                                                            <Text
                                                                style={styles.messageText}>
                                                                Follow
                                                            </Text>
                                                        </TouchableOpacity>
                                        }
                                    </View>

                                    <View style={styles.btnHeight}>
                                        <TouchableOpacity
                                            style={styles.messageBtn}
                                            onPress={() => {
                                                this.props.navigation.navigate({
                                                    routeName: 'Chat',
                                                    key: 'Chat',
                                                    params: {
                                                        userId: this.props.navigation.getParam('user_id',),
                                                    },
                                                });
                                            }}>
                                            <Text style={styles.messageText}>Message</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>



                            <View style={styles.myPetsView}>
                                <Text style={styles.petText}>My Pets</Text>
                            </View>
                            {pets.length === 0 && loadingPets === false ? (
                                <Text
                                    style={styles.notFound}>No Pet Found
                                </Text>
                            ) : (
                                <View
                                    style={styles.leftArrowView}>
                                    {pets.length > 3 ? (
                                        <TouchableOpacity
                                            style={styles.leftButton}
                                            onPress={this.leftArrow}>
                                            <FAIcon
                                                name="angle-left"
                                                color="#424242"
                                                size={32}
                                            />
                                        </TouchableOpacity>
                                    ) : null}

                                    <Text>{ }</Text>

                                    <ScrollView
                                        showsHorizontalScrollIndicator={false}
                                        horizontal={true}
                                        contentContainerStyle={{ alignItems: 'center' }}
                                        // pagingEnabled={true}
                                        ref="scrollView"
                                        onContentSizeChange={(w, h) =>
                                            this.setState({ scrollViewWidth: w })
                                        }
                                        scrollEventThrottle={16}
                                        scrollEnabled={true} // remove if you want user to swipe
                                        onScroll={this._handleScroll}
                                    >

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
                                                paddingHorizontal: wp(4),
                                            }}
                                        />
                                    </ScrollView>
                                    <InfoModal
                                        isVisible={this.state.aboutModal}
                                        onBackButtonPress={() => this.closeAboutModal()}
                                        info={LongAboutParseHtml(this.state.selectedItem?.about)}
                                        headerText={''}
                                        policy={''}
                                        leftAlign={true}
                                        onPress={() => this.closeAboutModal()}
                                    />
                                    {pets.length > 3 ? (
                                        <TouchableOpacity
                                            style={styles.rightButton}
                                            onPress={this.rightArrow}>
                                            <FAIcon
                                                name="angle-right"
                                                color="#424242"
                                                size={32}
                                            />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                            )}
                            <TouchableOpacity style={{ color: '#465575', marginTop: LongAboutParseHtml(this.state.selectedItem?.about)?.length > 100 ? 10 : 0, marginHorizontal: 15, marginBottom: this.state.selectedItem?.about?.length > 100 ? 0 : 5 }} onPress={() => this.setState({ aboutModal: true })}>
                                <View style={{ width: '100%', alignItems: 'center' }}><Text>{ShortAboutParseHtml(this.state.selectedItem?.about)}</Text></View>
                            </TouchableOpacity>
                        </View>

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
                                data={newsFeed}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItemCard}
                            />
                        ) : (
                            <PlaceholderLoader />
                        )}
                    </View>

                    {more ? (
                        <PlaceholderLoader down={true} />
                    ) : newsFeed.length > 0 ? (
                        <View />
                    ) : !loadingNewsFeed ? (
                        <View
                            style={styles.noFeed}>
                            <Text
                                style={styles.noFeedText}>
                                No Post Found
                            </Text>
                            <Image
                                resizeMode={'contain'}
                                source={{ uri: no_data_default_img }}
                                style={styles.defaultImg}
                            />
                        </View>
                    ) : null}

                    {/* </ScrollViewIndicator> */}
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
                        petData={true}
                        updateShareCount={this.updateShareCount}
                        handleComments={this.handleComments}

                    />
                    <ShareModal
                        viewerContent={this.state.viewerContent}
                        modalVisible={this.state.shareModalVisible}
                        updateState={this.updateState}
                        petData={true}
                        updateShareCount={this.updateShareCount}
                        navigation={this.props.navigation}
                    />
                    <ErrorModal
                        isVisible={isErrorModal_Visible}
                        onBackButtonPress={() => this.closeErrorModal()}
                        info={errorMessage}
                        heading={'Hoot!'}
                        onPress={() => this.closeErrorModal()}
                    />
                    <ErrorModal
                        isVisible={isPostReported}
                        onBackButtonPress={() => this.closeReprtModal()}
                        info={reportPostText}
                        postReport={true}
                        heading={'Woof!'}
                        onPress={() => this.closeReprtModal()}
                      />
                    <ConfirmModal
                        isVisible={isConfirm_Modal_visible}
                        info={unfollowMsg}
                        DoneTitle={'Ok'}
                        onDoneBtnPress={this.followUser}
                        CancelTitle={'Cancel'}
                        onCancelBtnPress={this.closeConfirmModal}
                        processing={unfollowInProcess}
                        img={currentUser.avatar}
                        name={currentUser.full_name}

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
                onChangeText={(v)=>this.setState({postText:v})}
                value={postText}
                showEditModal={showEditModal}
                handleUpdateBtn={this.handleUpdateBtn}
                handleCancelBtn={this.handleCancelBtn}
                InProcess={InProcess}
                postTextError={postTextError}
             />

                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return ({
       user: state.user.user,
       workspace: state.user.workspace,
       followFollowers: state.user?.follow_followers,
       beforePostId: state.post.beforePostId,
    });
}

const mapDispatchToProps = dispatch => ({
    saveLoginUser: (user) => dispatch(userEdit(user)),
    saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
    saveFollowFollowers: (ff) => dispatch(followFollower(ff)),
    saveBeforePostId:(postId)=>dispatch(saveBeforePostId(postId))


});
export default connect(mapStateToProps, mapDispatchToProps,)(Profile);