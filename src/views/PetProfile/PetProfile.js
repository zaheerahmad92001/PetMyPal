import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Container, Content,Icon} from 'native-base';
import Modal from 'react-native-modal';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import LottieView from 'lottie-react-native';
import moment from 'moment';

import { widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import { connect } from 'react-redux';
import {followFollower} from '../../redux/actions/user';
import { Divider } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize';
import {server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import {darkSky, HEADER } from '../../constants/colors';
import OneSignal from 'react-native-onesignal';
import ImagePicker from 'react-native-image-picker';
import ImageView from 'react-native-image-view';
import { NavigationEvents } from 'react-navigation';

import PixxyPetView from '../PixxyPetView';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Ribbon_Icon from '../../assets/images/updated/ribbonDess.png';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import { TouchableWithoutFeedback } from 'react-native';
import ShareModal from '../shareModal/index';
import RenderItemCard from '../../components/common/RenderItemCard';
import { CreatepostPayHomage } from '../../services/index';
import { commonState } from '../../components/common/CommomState';
import styles from './styles';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import ConfirmModal from '../../components/common/ConfirmModal';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { Platform } from 'react-native';
import EventEmitter from '../../services/eventemitter';
import InfoModal from '../../components/common/InfoModal';
import {
  cause_Of_Death,
  defaultImage,
  blackLoader,
  followersImg,
  genderIcon,
  ageIcon,
  reportPostText
} from '../../constants/ConstantValues';
import { LongAboutParseHtml, ShortAboutParseHtml } from '../../components/helpers';
import { PINK } from '../../constants/colors'
import Reactions from '../../components/common/Reactions'
import { saveBeforePostId } from '../../redux/actions/post'
import EditPost from '../../components/common/EditPost';
import ErrorModal from '../../components/common/ErrorModal';

const { postReaction ,ownerpets, getPetDataAfterUpdate } = petMyPalApiService;
const timeOut = 5000
let bgHeight = 320;

class PetProfile extends React.Component {
  
  constructor(props) {
    super(props);
    OneSignal.init('433c25e1-b94d-4f09-8602-bbe908a3761e', {
      kOSSettingsKeyAutoPrompt: true,
    });
    this.state = {
      petProfileInfo: '',
      confetti: false,
      pixxy: [],
      followLoading: false,
      isFollowed: false,
      ownPet: false,
      suggested: commonState.suggested,
      pets: [],
      newsFeed: [],
      loadingNewsFeed: true,
      more: false,
      token: '',
      visible: true,
      imageDisplay:
        typeof this.props.imageDisplay === 'undefined'
          ? 'No Pic'
          : this.props.imageDisplay,

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
      payHomageStory: '',
      payHomageLoading: false,
      petCoverImage: {},
      modalVisible: false,
      viewerContent: {
        reaction: {},
      },
      shareModalVisible: false,

      followers: [],
      following: [],

      isConfirm_Modal_visible: false,
      dec_Modal_visible: false,
      unfollowMsg: '',
      unfollowUserId: '',
      unfollowInProcess: false,
      user: [],
      saving: false,
      homageError: false,

      isModal_Visible: false,
      passPolicy: false,
      infoText: '',
      headerText: '',
      aboutModal: '',
      newsFeed_active: true,
      pixxy_active: false,
      petProfileData: '',
      emitterData: false,
      currentInstance: this,
      fullImageArray: [],
      selected_post_index: undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
      selected_Post_detail: undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)

      selected_post:undefined, // for Delete Post 
      selected_index:undefined, // for Delete Post
      del_Modal_visible:false,
      infoMsg:'Do you want to delete this post ?',
      InProcess:false,
      isPostReported:false,

      postText:undefined,
      showEditModal:false,
      postTextError:false,
    };
    EventEmitter.on('UpdatedPetData', this.updatePetState);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.inFocusDisplaying(2);

  }
  static getDerivedStateFromProps(props, state) {

    if (props.navigation.getParam('changePet') && state.petProfileInfo?.user_id) {
      if (props.navigation.getParam('item').user_id != state.petProfileInfo?.user_id) {
        state.currentInstance.petProfileData()

      }
    }
    return null;
  }
  componentDidMount() {
    var pet_details = this.props.navigation.getParam('item');
    const pet_dob = pet_details?.pet?.dob

    const beforeId = undefined
    this.props.saveBeforePostId(beforeId) // redux call to clear previous store value
    
    this.petProfileData('new');
    this.handleConfet(pet_details);
    this.updateData();
  }


  componentDidUpdate(props, state) {
    if (this.props.commentCount != 0 && this.state.postIndex !== null) {
      let newsFeed = [...this.state.newsFeed];

      newsFeed[this.state.postIndex].post_comments =
        Number(this.state.newsFeed[this.state.postIndex].post_comments) + this.props.commentCount;

      this.setState({
        newsFeed,
        postIndex: null,
      });
    }
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
    OneSignal.inFocusDisplaying(2);
    EventEmitter.off('UpdatedPetData', this.updatePetState);
    this.focusListener;
    this.apiCallTimer;
    this.setState({ emitterData: false })

  }

  updatePetState = () => {
    this.petProfileData('new');
    this.updateData();
  }

  petProfileData = (type) => {
    let ownPet;
    if (
      this.props.user?.user_data?.user_id ===
      this.props.navigation.getParam('item')?.parent_id
    ) {
      ownPet = true;
    }

    this.getAccessToken()
      .then(TOKEN => {
        this.setState({
          petProfileInfo: type == 'new' ? '' : this.props.navigation.getParam('item'), //! TODO will take of it later
          token: JSON.parse(TOKEN).access_token,
          ownPet,
        });
      })
      .then(() => {
        this.getUpdatePetData()
        if (!ownPet) {
          // this.getFollowFollowing()   // zaheer stop it bcoz same function call on PetOwnerView to store data in Redux
        }
        this.requestHandlerNewsFeed();
        this.requestHandlerGetPixxy();
      });

    // this.handleConfet(pet_details); // zhaeer ahmad move it to ComponentDidMount
    this.isPetFollowed();
  }

  getUpdatePetData = async () => {

    const returndata = await this.props.getPetDataAfterUpdate(this.state.token, server_key, this.props.navigation.getParam('item').user_id);
    if (returndata?.api_status == 200) {
      // console.log('here is reutrn data', returndata)
      this.handleConfet(returndata?.user_data)
      this.setState({ petProfileInfo: returndata?.user_data });
    }
  }


  isPetFollowed = () => {
    const petProfileInfo = this.props.navigation.getParam('item');
    let logedInUserFollowFollowing = this.props?.followFollowers;
    let logedInUserFollowing = logedInUserFollowFollowing?.following;

    for (let i = 0; i < logedInUserFollowing?.length; i++) {
      let userId = logedInUserFollowing[i]?.user_id;
      if (userId == petProfileInfo?.user_id) {
        this.setState({ isFollowed: true });
        break;
      }
    }
  };

  // zaheer stop it bcoz same function call on PetOwnerView to store data in Redux
  // getFollowFollowing = async () => {
  //   const { token } = this.state;
  //   const petProfileInfo = this.props.navigation.getParam('item');
  //   const formData = new FormData();

  //   formData.append('server_key', server_key);
  //   formData.append('type', 'followers,following');
  //   formData.append('user_id', petProfileInfo?.user_id);
  //   const response = await petMyPalApiService.followFollowing(token, formData).catch(e => {
  //       console.log('error while getting PetFollowers', e.errors.error_text);
  //     });
  //   const { data } = response;
  //   console.log('here follow following response' , data)
  //   if (data.api_status === 200) {
  //     let followers = data?.data?.followers;   // pet has just followers
  //     this.setState({
  //       followers: followers,
  //     });
  //   } else {
  //     console.log('error while getting PetFollowers', data?.errors?.error_text);
  //   }
  // };

  async handleConfet(pet_details) {

    let confet = await AsyncStorage.getItem('cpet');
    confet = JSON.parse(confet);

    if (confet == null) {
      var today = moment().format('MM/DD/YYYY');

      today = today.split('/');

      var birth = moment(pet_details.birthday).format('MM/DD/YYYY');
      // var birth = moment(pet_details.pet.dob).format('MM/DD/YYYY');   // zaheer ahmad change it
      birth = birth.split('/');

      // console.log('birthday' , birth , 'today', today, 'pet_details',pet_details )

      if (birth) {
        if (today[0] == birth[0] && today[1] == birth[1]) {
          this.setState({ confetti: true });
        }
      }
    }
  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  openConfirmModal = () => {
    const petProfileInfo = this.props.navigation.getParam('item');
    this.setState({
      isConfirm_Modal_visible: true,
      unfollowMsg: `Do You Want to Unfollow ${petProfileInfo?.full_name?.trim()}?`,
      unfollowUserId: petProfileInfo?.user_id,
    });
  };

  closeConfirmModal = () => {
    this.setState({ isConfirm_Modal_visible: false });
  };

  closeModal = () => {
    this.setState({isModal_Visible: false});
  };

  closeAboutModal = () => {
    this.setState({aboutModal: false})
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
      this.props.postReaction(token, item.post_id, reaction)

    )
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
    formData.append('id', this.props.navigation.getParam('item')?.user_id);
    more ? formData.append('after_post_id', after_post_id) : null;
    more && beforePostId != 0 ? formData.append('before_post_id', beforePostId) : null;

   console.log('data sending to server' , formData);
    const response = await petMyPalApiService.getUserNewsFeed(token, formData).catch(e => {console.log('error while getting NewsFeeds ', e)});

    let result = [];
    const { data } = response;
    if (data.api_status === 200) {
    
      if (data?.data?.length == 1 && more) {  // more will save from NoPost found when brand new user created
        let postType = data?.data?.postType
        if(postType == 'advertisement' || postType == 'custom_post'){
          this.setState({ loadingNewsFeed: false, more: false })
         return false
        }

        let apiResult = data?.data[0]
        if (apiResult?.publisher) {
          data?.data.forEach(element => {
            element = { ...element, reactionVisible: false };
            result.push(element);
          });

          let arr = newsFeed;
          arr = more ? arr.concat(result) : result;
          this.setState({ newsFeed: arr, loadingNewsFeed: false, more: false });

          return false
        }
        return false
      }

      let apiResult = data?.data[0]
      if (apiResult?.publisher) {
        data?.data?.forEach(element => {
          element = { ...element, reactionVisible: false };
          result.push(element);
        });
        let arr = this.state.newsFeed;

        arr = this.state.more ? arr.concat(result) : result;
        this.setState({ newsFeed: arr, loadingNewsFeed: false, more: false });

        // to check either any post is shared or not 
        let beforeId = undefined
        if (data?.data[0]?.before_post_id != 0) {
          beforeId = data?.data[0]?.before_post_id
        } else if (beforePostId && beforePostId != 0 ) {
          beforeId = beforePostId;// redux value
        } else {
          beforeId = arr[0]?.post_id
        }
        this.props.saveBeforePostId(beforeId)  // redux fun call
        // end

      } else {
        this.setState({ 
          // newsFeed: [],
           loadingNewsFeed: false, more: false });
      }
    } else {
      this.setState({ newsFeed: [], more: false });
    }
  }

  async requestHandlerGetPixxy() {
    const { token } = this.state;
    const formData = new FormData();
    formData.append('server_key', server_key);
    const response = await petMyPalApiService
      .getPixxy(token, formData)
      .catch(e => {
        console.log('error while getting pixy ', e);
      });
    const { data } = response;
    if (data.api_status === 200) {
      this.setState({ pixxy: data.pixxys });
    } else {
      this.setState({ pixxy: [] });
    }
  }

  goBack = () => { this.props.navigation.pop() };

  followPet = async () => {
    const scope = this;
    this.setState({ unfollowInProcess: true, followLoading: true });
    const petProfileInfo = this.props.navigation.getParam('item');

    let logedInUserFollowFollowing = this.props?.followFollowers;
    let logedInUserFollowing = logedInUserFollowFollowing?.following;
    let logedInUserFollower = logedInUserFollowFollowing?.followers;

    const { token } = this.state;

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('user_id', petProfileInfo?.user_id);
    const response = await petMyPalApiService
      .followUser(token, formData)
      .catch(e => {
        console.log('errro while Following pet ', e.errors.error_text);
      });
    const { data } = response;
    // console.log('here is Follow following response' , data)
    if (data.api_status === 200) {
      if (data.follow_status === 'followed') {
        let logedInUserFollowFollowing = this.props?.followFollowers;
        logedInUserFollowFollowing?.following.push(petProfileInfo);

        this.props.followFollower(logedInUserFollowFollowing);
        // scope.getFollowFollowing();  // zaheer stop it bcoz same function call on PetOwnerView to store data in Redux

        scope.setState({
          isFollowed: true,
          isConfirm_Modal_visible: false,
          unfollowInProcess: false,
          followLoading: false,
        });
      } else if (data.follow_status === 'unfollowed') {
        let temp = [];
        logedInUserFollowing.forEach(element => {
          if (element.user_id === petProfileInfo?.user_id) {
            return true;
          } else {
            temp.push(element);
          }
        });
        let ff = {
          followers: logedInUserFollower,
          following: temp,
        };
        this.props.followFollower(ff);

        // scope.getFollowFollowing(); // zaheer stop it bcoz same function call on PetOwnerView to store data in Redux

        scope.setState({
          isConfirm_Modal_visible: false,
          isFollowed: false,
          unfollowInProcess: false,
          followLoading: false,
        });
      }
    } else {
      this.setState({
        isConfirm_Modal_visible: false,
        unfollowInProcess: false,
        followLoading: false,
      });
    }
  };

  reactions = (item, index) => {
    return (
      <Reactions
        item={item}
        index={index}
        ReactOnComment={(index, item, reaction) => this.ReactOnPost(index, item, reaction)} />
    )
  }

  getFeelingIcon = value => {
    let e = this.state.feelingsData.filter(e => e.text === value);
    if (e.length === 0) return '';
    else return e[0].emoji;
  };

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
    const { newsFeed, reaction ,petProfileInfo} = this.state;
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
        postsOf={petProfileInfo.user_id}
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
        
        onPressOut={() => { this.hidePostReaction() }}
        onLongPress={() => {
          newsFeed[index].reactionVisible = true;
          this.setState({ newsFeed });
        }}
        reactions={() => this.reactions(item, index)}
        shareModalVisible={(value) => {this.setState({
            shareModalVisible: true,
            viewerContent: {
              index,
              ...item,
            },
          })
          console.log('item selected', value);
        }
        }
      />
    );
  };

  onRefresh = () => {
    this.distanceFromEnd = 0,
      this.getUpdatePetData();
    this.setState({
      isRefreshing: true,
      newsFeed: [],
      more: false,
      suggested: [{}, {}, {}, {}],
    },
      () => {
        this.requestHandlerNewsFeed().then(() => {
          this.setState({ isRefreshing: false });
        });
      },
    );
  };

  uploadCoverStory = () => {
    const options = {
      title: 'Select Pet Cover',
      storageOptions: {
        skipBackup: true,
        path: 'image',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        const source = { uri: 'data:image/jpeg;base64,' + response.data };
        const image = {
          name: response.fileName,
          type: response.type,
          uri: response.uri,
          // data:response.data
        };

        this.setState({
          coverSource: source,
          petCoverImage: image,
        }, () => this.requestHandlerUpdatePet('update-pet-data', 'cover'));
      }
    });
  };

  async requestHandlerUpdatePet(type, pic) {
    const { token, petCoverImage, petProfileInfo } = this.state;
    this.setState({ saving: true });
    const formData = new FormData();
    if (pic === 'cover') {
      formData.append('cover', petCoverImage);
    }
    formData.append('server_key', server_key);
    formData.append('pet_id', petProfileInfo?.user_id);

    const response = await petMyPalApiService
      .updatePetData(token, formData)
      .catch(e => {
        this.setState({ saving: false });
      });
    const { data } = response;
    if (data.api_status == 200) {
      const returndata = await this.props.getPetDataAfterUpdate(token, server_key, this.props.navigation.getParam('item').user_id);
      if (returndata?.api_status == 200) {
        this.setState({ saving: false, petProfileInfo: returndata?.user_data });
      }
      else {
        // !something went wrong
        this.setState({ saving: false });
      }
    }
  }

  handlePayHomage = () => {
    const petProfileInfo = this.props.navigation.getParam('item');
    const { token, payHomageStory } = this.state;
    const { user_data } = this.props.user;

    if (payHomageStory) {
      this.setState({ payHomageLoading: true });
      CreatepostPayHomage(
        this.state.payHomageStory,
        petProfileInfo?.user_id,
        () => {

          this.setState({
            homage: false,
            payHomageLoading: false,
            isModal_Visible: true,
            infoText: 'Your Homage Has Been Submitted',
          });

          setTimeout(() => {
            this.requestHandlerNewsFeed();
            this.requestHandlerGetPixxy();
          }, 3000);
        },
      );
    } else {
      this.setState({ homageError: true });
    }
  };

  updateState = state => { this.setState(state) };

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

  updateData = () => { this.onRefresh() };


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

  renderNewsFeed = () => {
    const {
      loadingNewsFeed,
      petProfileInfo,
      newsFeed,
      more,

    } = this.state
    
    return (
      <View>
        {this.state.ownPet ? (
          <View style={styles.ownPetView}>
            <View style={styles.statusView}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate({
                    routeName: 'StatusView',
                    params: {
                      pet_id: petProfileInfo?.user_id,
                      petProfileInfo,
                    },
                  });
                }}
                style={{ flex: 1 }}>
                <View style={styles.whatsInYourMind}>
                  <View style={styles.thoughtsView}>
                    <Text style={styles.text}>
                      What's on your mind ?
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {!loadingNewsFeed ? (

          <FlatList
            disableVirtualization={true}
            windowSize={2}
            initialNumToRender={10000}
            removeClippedSubviews={true}
            scrollEnabled={false}
            horizontal={false}
            data={newsFeed}
            extraData={this.state}
            scrollEventThrottle={16}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItemCard}
          />
        ) : (
          <PlaceholderLoader />
        )}
        {more ? (
          <PlaceholderLoader down={true} />
        ) : newsFeed.length == 0 ? (
          <View style={styles.noPostView}>
            <Text style={styles.noPostFound}>No Post Found</Text>
          </View>
        ) : null
        }
      </View>
    )
  }

  handleTabs = (val) => {
    if (val == 'newsfeed') {
      this.setState({ newsFeed_active: true, pixxy_active: false })
    } else {
      this.setState({ pixxy_active: true, newsFeed_active: false })
    }
  }

  closeAboutModal() {
    this.setState({ aboutModal: false })
  }

  renderConfetti = () => {
    const { petProfileInfo } = this.state;
    return (
      <>
        {this.state.confetti && (
          <View style={styles.confettiView}>
            <ImageBackground
              source={require('../../assets/images/imgpsh_fullsize_anim.png')}
              style={styles.imgBackground}
              resizeMode="stretch">
              <LottieView
                source={require('../../assets/lottie/confetti-cannons.json')}
                autoPlay
                loop
              />

              <TouchableOpacity
                style={styles.closeView}
                onPress={() => this.setState({ confetti: false })}>
                <Icon
                  type="AntDesign"
                  name="close"
                  style={{ marginTop: wp(5), marginLeft: wp(5) }}
                />
              </TouchableOpacity>

              <Image
                style={styles.imgStyle}
                source={{
                  uri: this.state.avatarSource?.uri
                    ? this.state.avatarSource?.uri
                    : petProfileInfo?.avatar
                      ? petProfileInfo?.avatar
                      : 'https://sandy.petmypal.biz/admin/public/uploads/pets/W9kUUvhx5eee6c9d0d530.png',
                }}
              />

              <Image
                source={require('../../assets/images/birthday-congrats.png')}
                style={{ marginTop: -25 }}
                resizeMode="contain"
              />

              <Text
                style={{
                  fontFamily: 'DancingScript-Bold',
                  fontSize: 40,
                  color: '#FFAF3E',
                }}>
                Happy Birthday
              </Text>
              <Text
                style={{
                  fontFamily: 'DancingScript-Bold',
                  fontSize: 40,
                  color: '#FFAF3E',
                }}>
                {petProfileInfo?.full_name}
              </Text>
              <Text
                style={{
                  fontFamily: 'DancingScript-Bold',
                  fontSize: 20,
                  color: '#465575',
                }}>
                From pals at PetMyPal
              </Text>

              <Text
                onPress={async () => {
                  this.setState({ confetti: false });
                  await AsyncStorage.setItem('cpet', JSON.stringify(2));
                }}
                style={{ marginTop: 40 }}>
                Don't show again
              </Text>
            </ImageBackground>
          </View>
        )}
      </>
    )
  }

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


  render() {
    const {
      ownPet,
      followLoading,
      isFollowed,
      petProfileInfo,
      homage,
      isConfirm_Modal_visible,
      unfollowInProcess,
      unfollowMsg,
      saving,
      homageError,
      isModal_Visible,
      passPolicy,
      headerText,
      infoText,
      newsFeed_active,
      pixxy_active,
      del_Modal_visible,
      infoMsg,
      InProcess,
      postText,
      showEditModal,
      postTextError,
      isPostReported,

    } = this.state;

    var coverPic = this.props?.petDetails?.cover; //// comming from index file

    return (
      <Container style={styles.container}>
        <NavigationEvents onDidFocus={() => this.updateSinglePost()} />
        {this.state.confetti &&
          this.renderConfetti()
        }
        <>
          <Content
            enableResetScrollToCoords={false}
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
                    this.distanceFromEnd = currentItemIndex + 4;
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
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({
                  modalVisible: true,
                  viewerContent: {
                    photos: [
                      this.state.coverSource?.uri
                        ? this.state.coverSource.uri
                        : petProfileInfo?.cover
                          ? petProfileInfo.cover
                          : 'https://res.cloudinary.com/n4beel/image/upload/v1595058775/pattern_2_xhmx4n.png',
                    ],
                    isPost: false,
                  },
                })
              }>
              <LinearGradient
                style={styles.linearGradient}
                colors={['#FFFFFF00', '#182A539E']}
              />
            </TouchableWithoutFeedback>

            <View>
              <ImageBackground
                key={petProfileInfo?.cover ?? ''}
                style={styles.imgBG}
                source={{
                  uri: this.state?.coverSource.uri
                    ? this.state?.coverSource.uri
                    : petProfileInfo?.cover
                      ? petProfileInfo.cover
                      : 'https://res.cloudinary.com/n4beel/image/upload/v1595058775/pattern_2_xhmx4n.png',
                }}
              >
                <View
                  style={
                    petProfileInfo.deceased === '1'
                      ? {
                        backgroundColor: 'rgba(52, 52, 52, 0.3)',
                        height: bgHeight,
                      }
                      : {}
                  }>
                  {petProfileInfo.deceased === '1' ? (
                    <View style={styles.deceaseBox}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.textStyle}>
                            {petProfileInfo?.full_name}is no more with us
                          </Text>
                          <Text
                            style={{
                              ...styles.dText,
                              fontSize: RFValue(11),
                              marginBottom: RFValue(10),
                            }}>
                            {petProfileInfo?.cause_of_death == '10' ? 'Passed away on' : `Died by ${cause_Of_Death[(petProfileInfo?.cause_of_death)]?.label} on`} {moment(petProfileInfo.deceased_date).format('MM/DD/YYYY')}
                          </Text>
                        </View>
                        <View style={styles.homePageOuter}>
                          <SkyBlueBtn
                            title={'Pay Homage'}
                            onPress={() => this.setState({ homage: true })}
                            btnContainerStyle={styles.btnContainerStyle}
                            titleStyle={styles.titleStyle}
                          />
                        </View>
                      </View>

                      <Text
                        style={{
                          ...styles.dText,
                          marginTop: 8,
                          fontWeight: 'bold',
                        }}>
                        Note by{' '}
                        {petProfileInfo &&
                          petProfileInfo.petowner_profile &&
                          petProfileInfo.petowner_profile.full_name
                          ? petProfileInfo.petowner_profile.full_name
                          : ''}{' '}
                        ({petProfileInfo.full_name}Owner)
                      </Text>

                      <Text
                        style={{
                          ...styles.dText,
                          fontSize: RFValue(11),
                          marginBottom: RFValue(10),
                        }}>
                        {ShortAboutParseHtml(petProfileInfo.deceased_note)}
                      </Text>

                      {/* <Text
                          style={{
                            ...styles.dText,
                            fontSize: RFValue(11),
                            marginBottom: RFValue(10),
                          }}>
                          {
                            cause_Of_Death[(petProfileInfo?.cause_of_death)]
                              ?.label
                          }
                        </Text> */}
                    </View>
                  ) : null}

                  <View style={styles.coverImgContainer}>
                    <TouchableOpacity
                      onPress={this.goBack}
                      style={styles.header}>
                      <Icon
                        name="chevron-back-outline"
                        type={'Ionicons'}
                        style={
                          defaultImage != coverPic
                            ? [styles.iconStyle]
                            : [styles.blackIcon]
                        }
                      />
                    </TouchableOpacity>

                    {ownPet ? (
                      <TouchableOpacity
                        style={{
                          height: hp(5)
                        }}
                        onPress={this.uploadCoverStory}>
                        <MIcon
                          name="camera"
                          size={25}
                          color={defaultImage != coverPic ? darkSky : darkSky}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                {saving && (
                  <View style={styles.loaderStyle}>
                    <LottieView
                      style={{ height: 50, alignSelf: 'center' }}
                      autoPlay
                      source={blackLoader}
                    />
                  </View>
                )}
              </ImageBackground>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View
                style={
                  ownPet
                    ? [styles.cardView, { paddingBottom: 25 }]
                    : [styles.cardView]
                }>
                <View style={styles.outerView}>
                  <View style={{ flex: 3 }}>
                    {petProfileInfo.deceased === '1' ? (
                      <View style={styles.ribbonImg}>
                        <Image
                          style={styles.ribbon}
                          source={Ribbon_Icon}
                          resizeMode={'contain'}
                        />
                      </View>
                    ) : petProfileInfo.disabled === '1' ? (
                      <View style={styles.dontDistrubView}>
                        <MaterialIcons
                          name="do-not-disturb-alt"
                          size={25}
                          color={'#F92F2F'}
                        />
                      </View>
                    ) : (
                      <View style={styles.DisturbView} />
                    )}
                  </View>

                  <View style={styles.profileImgView}>
                    <TouchableOpacity
                      onPress={() => {
                        let array = [];
                        array.push(
                          {
                            source: {
                              uri: this.state.avatarSource?.uri
                                ? this.state.avatarSource?.uri
                                : petProfileInfo?.avatar
                                  ? petProfileInfo?.avatar
                                  : '',
                            }
                          })
                        this.setState({
                          fullImageArray: array,
                          isPost: false,
                        })
                        console.log('image array', array);
                      }}>
                      <View style={styles.imgOuterView}>
                        <Image
                          style={styles.profileImg}
                          source={{
                            uri: this.state.avatarSource?.uri
                              ? this.state.avatarSource?.uri
                              : petProfileInfo?.avatar
                                ? petProfileInfo?.avatar
                                : '',
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  {ownPet ? (
                    <View style={styles.EditView}>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate({
                            routeName: 'EditPet',
                            key: 'EditPet',
                            params: {
                              petProfileInfo,
                              coverprofile: this.props.petDetails.cover,
                            },
                          });
                        }}
                        style={styles.editBtnContainer}>
                        <Image
                          style={styles.profileImg}
                          source={require('./../../assets/images/updated/EditPic.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.EditView} />
                  )}
                </View>

                <View style={styles.UPOuterView}>
                  <View>
                    {petProfileInfo.name ?
                      <View>
                        <Text
                          numberOfLines={2}
                          style={styles.fullNameText}>
                          {petProfileInfo.name}
                          {/* {petProfileInfo.full_name} */}
                          <Text
                            onPress={() => {
                              if (
                                petProfileInfo?.petowner_profile?.user_id ==
                                this.props.user?.user_data?.user_id
                              ) {
                                this.props.navigation.navigate('UserProfile');
                              } else {
                                this.props.navigation.navigate({
                                  routeName: 'Profile',
                                  key: 'Profile',
                                  params: {
                                    user_id:
                                      petProfileInfo?.petowner_profile?.user_id,
                                  },
                                });
                              }
                            }}
                            style={[
                              styles.deactivateText,
                              {
                                color:
                                  petProfileInfo.disabled === '1'
                                    ? '#FFAF3E'
                                    : '#182A53',
                              },
                            ]}>
                            {/* (
                              {petProfileInfo.disabled === '1'
                                ? 'Deactivated'
                                : '@' + petProfileInfo.parent_name}
                              ) */}
                          </Text>
                        </Text>
                      </View>
                      : null
                    }
                    <Text style={styles.petSubTypeText}>
                      {petProfileInfo &&
                        petProfileInfo.pet_info &&
                        petProfileInfo.pet_info.pet_sub_type_text}
                    </Text>
                    <Text style={[styles.petSubTypeText, { color: PINK }]}>
                      {petProfileInfo?.lost_data?.lost_since_unix ?
                        // `Lost Since ${moment.unix(petProfileInfo?.lost_data?.lost_since_unix).format('MMM Do YYYY')}`
                        `Lost Since: ${moment(petProfileInfo?.lost_data?.lost_date, 'YYYY-MM-DD',).format('MMM Do YYYY')}`
                        : null
                      }
                    </Text>
                  </View>
                </View>

                <View style={{ marginHorizontal: 10, marginTop: wp(5) }}>
                  <View style={styles.petProfileView}>
                    <View style={styles.rowView}>
                      <View style={{ ...styles.genderIcon }}>
                        <Image
                          resizeMode={'contain'}
                          style={styles.infoIcon}
                          source={{ uri: genderIcon }}
                        />
                      </View>
                      <View style={styles.genderTextView}>
                        <Text
                          style={{
                            ...styles.infoDetailText,
                            marginLeft: wp(3),
                          }}>
                          {petProfileInfo &&
                            petProfileInfo.gender == 'male'
                            ? 'Male'
                            : 'Female'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowView}>
                      <View
                        style={{ ...styles.genderIcon, marginRight: wp(2.0) }}>
                        <Image
                          style={styles.infoIcon}
                          source={{ uri: ageIcon }}
                        />
                      </View>
                      <View style={styles.genderTextView}>
                        <Text style={{ ...styles.infoDetailText }}>
                          {petProfileInfo.age_text}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.petProfileView}>
                    <View style={styles.rowView}>
                      <View style={[styles.genderIcon]}>
                        <Image
                          style={{ ...styles.followersIcon }}
                          source={followersImg}
                          resizeMode={'contain'}
                        />
                      </View>
                      <View style={[styles.genderTextView]}>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate({
                              routeName: 'Followers',
                              key: 'Followers',
                              params: {
                                currentUserId: this.state.petProfileInfo
                                  ?.user_id,
                                hideFollowing: true,
                                key: 0,
                              },
                            });
                          }}>
                          <Text
                            style={[
                              styles.infoDetailText,
                              { marginLeft: wp(3) },
                            ]}>
                            {petProfileInfo?.followers_data &&
                              petProfileInfo?.followers_data.length > 0
                              ? petProfileInfo?.followers_data.length
                              : 0}{' '}
                            Followers
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        if (
                          petProfileInfo?.petowner_profile?.user_id ==
                          this.props.user?.user_data?.user_id
                        ) {
                          this.props.navigation.navigate('UserProfile');
                        } else {
                          this.props.navigation.navigate({
                            routeName: 'Profile',
                            key: 'Profile',
                            params: {
                              user_id:
                                petProfileInfo?.petowner_profile?.user_id,
                            },
                          });
                        }
                      }}
                      style={[styles.rowView, { marginLeft: -3 }]}>
                      <Image
                        resizeMode="contain"
                        style={{
                          width: 23,
                          height: 23,
                          borderRadius: 50,
                          marginRight: wp(3),
                        }}
                        source={{
                          uri:
                            // petProfileInfo?.petowner_profile?.user_id ==
                            // this.props.user?.user_data?.user_id ?
                            //  this.props.user?.user_data?.avatar 
                            petProfileInfo?.petowner_profile?.avatar,
                        }}
                      />

                      <View style={styles.genderTextView}>
                        <Text style={styles.infoDetailText}>
                          {petProfileInfo.disabled === '1'
                            ? 'Deactivated'
                            : petProfileInfo.parent_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {ownPet ? null : (
                  <View style={styles.followingView}>
                    {/* {ownPet ? null : ( */}
                    <View style={styles.btn}>
                      {followLoading ? (
                        <ActivityIndicator
                          size={'large'}
                          color={HEADER}
                          style={{ marginVertical: RFValue(5), flex: 1 }}
                        />
                      ) : followLoading === false && isFollowed === true ? (
                        <TouchableOpacity
                          onPress={() => this.openConfirmModal()}
                          style={styles.followingBtn}>
                          <Text
                            numberOfLines={1}
                            style={styles.followingStyle}>
                            Following
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.followPet()}
                          style={styles.followBtn}>
                          <Text numberOfLines={1} style={styles.followStyle}>
                            Follow
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}

                {petProfileInfo.about ?
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <TouchableOpacity style={{ color: '#465575', marginTop: petProfileInfo?.about?.length > 100 ? 10 : 0, marginHorizontal: 15, marginBottom: petProfileInfo?.about?.length > 100 ? 0 : 5 }} onPress={() => this.setState({ aboutModal: true })}>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={{ marginTop: wp(5) }}>{ShortAboutParseHtml(petProfileInfo?.about ?? '')}</Text>
                      </View>
                      {/* <HTML baseFontStyle={{ fontSize: RFValue(17),fontWeight: 'bold', color: '#465575', marginTop: petProfileInfo?.about?.length > 100 ? 10 : 0, marginHorizontal: 15, marginBottom: petProfileInfo?.about?.length > 100 ? 0 : 10 }} html={aboutDetails} /> */}
                    </TouchableOpacity>
                  </View> : null}

              </View>
            </View>

            <View style={styles.tabsView}>
              <TouchableOpacity
                onPress={() => this.handleTabs('newsfeed')}
                style={
                  newsFeed_active ?
                    styles.activeTab :
                    styles.inactiveTab
                }
              >
                <Text style={
                  newsFeed_active ?
                    styles.activeTabText :
                    styles.inActiveTabText
                }>News Feed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.handleTabs('pixxy')}
                style={
                  pixxy_active ?
                    styles.activeTab :
                    styles.inactiveTab
                }
              >
                <Text style={
                  pixxy_active ?
                    styles.activeTabText :
                    styles.inActiveTabText
                }>Pixxy</Text>
              </TouchableOpacity>
            </View>
            <Divider
              style={{ marginTop: 10, }}
            />


            {newsFeed_active ?

              this.renderNewsFeed()
              :
              <PixxyPetView
                parent_id={this.props.navigation.getParam('item')?.parent_id}
                pet_id={this.props.navigation.getParam('item')?.user_id}
                navigation={this.props.navigation}
              />
            }

          </Content>
        </>
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
          own_pet={this.props.navigation.getParam('item')?.user_id}

        />
        <InfoModal
          isVisible={isModal_Visible}
          info={infoText}
          headerText={headerText}
          policy={passPolicy}
          onPress={() => this.closeModal()}
        />
        <InfoModal
          isVisible={this.state.aboutModal}
          onBackButtonPress={() => this.closeAboutModal()}
          info={LongAboutParseHtml(petProfileInfo?.about)}
          headerText={''}
          policy={''}
          leftAlign={true}
          onPress={() => this.closeAboutModal()}
        />

        <ConfirmModal
          isVisible={isConfirm_Modal_visible}
          onPress={this.closeConfirmModal}
          info={unfollowMsg}
          DoneTitle={'Ok'}
          onDoneBtnPress={this.followPet}
          CancelTitle={'Cancel'}
          onCancelBtnPress={this.closeConfirmModal}
          processing={unfollowInProcess}
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
         <ErrorModal
            isVisible={isPostReported}
            onBackButtonPress={() => this.closeReprtModal()}
            info={reportPostText}
            postReport={true}
            heading={'Woof!'}
            onPress={() => this.closeReprtModal()}
          />

        {homage ? (
          <Modal
            isVisible={homage}
            onBackdropPress={() => this.setState({ homage: !homage })}
            animationInTiming={500}
            animationOutTiming={1000}
            backdropTransitionInTiming={500}
            backdropTransitionOutTiming={1000}
            avoidKeyboard={false}>
            <View style={styles.modalView}>
              <View>
                <View style={{ marginTop: 20 }}>
                  <View style={styles.imgBgView}>
                    <View style={styles.imgBgViewInn}>
                      <ImageBackground
                        style={styles.profileImg}
                        imageStyle={{ borderRadius: RFValue(10) }}
                        source={{
                          uri: this.state.avatarSource?.uri
                            ? this.state.avatarSource?.uri
                            : petProfileInfo?.avatar
                              ? petProfileInfo?.avatar
                              : 'https://sandy.petmypal.biz/admin/public/uploads/pets/W9kUUvhx5eee6c9d0d530.png',
                        }}>
                        <View style={styles.rowEnd}>
                          <View style={styles.ribbonOuterView}>
                            <Image
                              style={styles.ribbonStyle}
                              source={Ribbon_Icon}
                            />
                          </View>
                        </View>
                      </ImageBackground>
                    </View>
                  </View>
                  <View style={styles.nameView}>
                    <Text style={styles.nameStyle}>{petProfileInfo.full_name}</Text>
                  </View>
                </View>
                <TextInput
                  placeholder={
                    'Pay Homepage to ' +
                    petProfileInfo.full_name +
                    'on her demise.'
                  }
                  value={this.state.payHomageStory}
                  onChangeText={payHomageStory =>
                    this.setState({ payHomageStory, homageError: false })
                  }
                  maxLength={32}
                  multiline={true}
                  textAlignVertical="top"
                  style={
                    homageError ? [styles.textInputError] : [styles.textInput]
                  }
                />
              </View>
              <View style={[styles.btnOuterView, { marginVertical: 0, marginTop: wp(5), marginBottom: -1 }]}>
                <View style={styles.btnInnerView}>
                  {this.state.payHomageLoading ? (
                    <ActivityIndicator
                      size={'large'}
                      color={HEADER}
                      style={{ marginVertical: RFValue(5), flex: 1 }}
                    />
                  ) : (
                    <View style={{ flexDirection: 'row' }}>
                      <SkyBlueBtn
                        title="Submit"
                        onPress={() => this.handlePayHomage()}
                        btnContainerStyle={[styles.submitBtn, { width: '50%', borderBottomRightRadius: 0, borderBottomLeftRadius: 20, borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}
                      />
                      <SkyBlueBtn
                        title="Cancel"
                        onPress={() => this.setState({ homage: false })}
                        btnContainerStyle={[styles.CancelbtnView, { width: '50%', borderBottomRightRadius: 20, borderBottomLeftRadius: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>
            {Platform.OS == 'ios' ? <KeyboardSpacer /> : null}
          </Modal>
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  followFollowers: state.user?.follow_followers,
  petProfile: state.mypets?.petProfile,
  workspace: state.user?.workspace,
  beforePostId: state.post.beforePostId
});


export default connect(
  mapStateToProps, {
  followFollower,
  ownerpets,
  getPetDataAfterUpdate,
  postReaction,
  saveBeforePostId
},
)(PetProfile);