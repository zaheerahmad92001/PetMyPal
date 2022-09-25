import React, { useState } from 'react';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  RefreshControl,
  Animated,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import { Thumbnail, Container, Content, Icon } from 'native-base';
import Toast from 'react-native-simple-toast';
import { connect, useDispatch } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import ImageView from 'react-native-image-viewing';
import ImagePicker from 'react-native-image-picker';
import MultiImagePicker from 'react-native-image-crop-picker';
import MediaMeta from 'react-native-media-meta';
import RNFetchBlob from 'rn-fetch-blob'
import FAIcon from 'react-native-vector-icons/FontAwesome';


import {saveWorkSpace, followFollower } from '../../redux/actions/user';
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { HEADER, darkSky, PINK, White } from '../../constants/colors';
import PMP from '../../lib/model/pmp';
import NavigationService from '../../presentation/ControlPanel/NavigationService';
import Ic from 'react-native-vector-icons/FontAwesome5';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import ShareModal from '../shareModal/index';
import RenderItemCard from '../../components/common/RenderItemCard';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import CustomLoader from '../../components/common/CustomLoader';
import { NavigationEvents } from 'react-navigation';
import PostingModal from '../../components/common/PsotingModal';
import { maxVideoSize, maxVideoTime , welcomePMP , reportPostText,videoTimeSize} from '../../constants/ConstantValues';
import Reactions from '../../components/common/Reactions'
import styles from './styles';
import { petMyPalEventsApiService } from '../../services/PetMyPalEventsApiService';
import ErrorModal from '../../components/common/ErrorModal';

const {
  petOwnerNewsFeed,
  petOwnerData,
  ownerpets,
  petOwnerStories,
  petOwnerCreateStory,
  petOwnerFriendSuggestion,
  postReaction,
} = petMyPalApiService;
const { getAllEvents } = petMyPalEventsApiService;
import EventEmitter from '../../services/eventemitter';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { commonState } from '../../components/common/CommomState'
import { server_key } from '../../constants/server';
import ConfirmModal from '../../components/common/ConfirmModal';
import EditPost from '../../components/common/EditPost';

const timeOut = 5000
const THRESHOLD = 2000;


class PetOwnerView extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      confetti: false,
      ref: null,
      storyDescription: '',
      images: [],
      discriptionError: false,
      imageError: false,
      storyBox: false,
      imageViewer: false,
      newsFeed: this.props?.user?.newsFeed ?? [],
      stories: [],
      pets: [],
      token: '',
      visible: true,
      imageDisplay:
        typeof this.props.imageDisplay === 'undefined'
          ? 'No Pic'
          : this.props.imageDisplay,
      isVisible: this.props.isVisible,
      showModal: false,
      userProfilePic: this.props?.user?.user?.user_data?.avatar ?? '', 
      reaction: commonState.reaction,
      months: commonState.months,
      postIndex: null,
      feelingsData: commonState.feelingsData,
      scrollViewWidth: 0,
      currentXOffset: 0,
      modalVisible: false,
      viewerContent: {
        reaction: {},
      },
      endOfData: false,
      shareModalVisible: false,
      refreshControllerLoading: false,
      isConnected: true,
      renderAlertAfterConnectionUpdate: false,
      storyLoading: false,
      Paused: true,
      postFlag: false,
      scrollX: new Animated.Value(0),
      showScrollBtn: false,
      selected_post_index: undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
      selected_Post_detail: undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
      
      selected_post:undefined, // for Delete/update Post 
      selected_index:undefined, // for Delete/update Post

      followers: [],  /// just to save followrs in Redux 
      following: [],  /// just to save followrs in Redux

      del_Modal_visible:false,
      infoMsg:'Do you want to delete this post ?',
      InProcess:false,
      postText:undefined,
      showEditModal:false,
      postTextError:false,
      hide_welcomeImg:false,
      isPostReported:false,
    };

    this.scrollViewRef = React.createRef()
    this.scrollToTop = React.createRef();
    this.endData = this.endData.bind(this);
    this.updateNewsFeed = this.updateNewsFeed.bind(this);
    EventEmitter.on('updateNewsFeed', this.updateNewsFeed);
    EventEmitter.on('endNewsFeed', this.endData);
    this.distanceFromEnd = 0;
  }
  
  componentDidMount() {

    this.getAccessToken().then((TOKEN) => {
      this.setState({
        token: JSON.parse(TOKEN).access_token,
        user_id: JSON.parse(TOKEN).user_id,
        newsFeed: this.props?.user?.newsFeed ?? []
      }, () => {
        this.FetchPetOwnerData();
        this.handleConfetti();
        this.getFollowFollowing()    // to getFollow Follwing For Redux
      })
    })

  }
  

  componentWillReceiveProps(props) {

    if (this.props.navigation.getParam('willRefresh')) {
      this.setState({ postFlag: true });
      this.props.ownerpets(this.state?.token, NavigationService, PMP);
    }
    if (this.props.commentCount !== 0 && this.state.postIndex !== null) {
      let newsFeed = [...this.state.newsFeed];

      newsFeed[this.state.postIndex].post_comments =
        Number(this.state.newsFeed[this.state.postIndex].post_comments) +
        this.props.commentCount;
      this.setState({ newsFeed, postIndex: null});
      {
        async () => {
          const flag = await AsyncStorage.getItem('POST_F');
          this.state.postFlag = flag;
        };
      }
    }

    this.setState({ imageDisplay: props.imageDisplay });
    this.setState({
      isVisible: props.isVisible,
      userProfilePic: this.props?.user?.user?.user_data?.avatar 
        ? this.props.user?.user?.user_data?.avatar
        : '',
    });
  }

  componentWillUnmount() {
    this.reactionsTime;
    if (this.netinfoUnsubscribe) {
      this.netinfoUnsubscribe();
      this.netinfoUnsubscribe = null;
    }
  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

closeReprtModal=()=>{
 this.setState({isPostReported:false})
}


  async getFollowFollowing() {
    const { user_id, token } = this.state
    const formData = new FormData();

    formData.append('server_key', server_key);
    formData.append('type', 'followers,following');
    formData.append('user_id', user_id);
    const response = await petMyPalApiService.followFollowing(token, formData).catch((e) => {
      console.log('error while getting Follow Follwoing', e)
    })
    const { data } = response
    if (data?.api_status === 200) {
      let followers = data?.data?.followers
      let following = data?.data?.following

      let ff = {
        followers,
        following
      }
      this.props.followFollower(ff)
    }
  }

  async handleConfetti() {

    if (this.props.user?.user?.user_data?.birthday) { 

      let confet = await AsyncStorage.getItem('confet');
      confet = JSON.parse(confet);

      if (confet == null) {
        var today = moment().format('MM/DD/YYYY');

        today = today.split('/');
        var birth = moment(this.props.user?.user?.user_data?.birthday).format('MM/DD/YYYY');
        birth = birth.split('/');

        if (birth) {
          if (today[0] == birth[0] && today[1] == birth[1]) {
            this.setState({ confetti: true });
          }
        }
      }
    }
  }

  FetchPetOwnerData = async () => {
    const { user_id, token } = this.state

    this.props.getAllEvents(
      token,
      this.props.navigation,
      0,
    );
    petMyPalApiService.setAuth(token);
    this.props.petOwnerNewsFeed(
      token,
      'get_news_feed',
      false,
      'firstTimeLoadData',
    );

    this.props.petOwnerData(
      token,
      user_id
    );
    this.props.ownerpets(
      token,
      NavigationService,
      PMP,
    );
    this.props.petOwnerStories(token);
  };


  updateNewsFeed(updatedNewsFeed) {
    this.setState({ newsFeed: updatedNewsFeed });
  }

  endData(value) {
    this.setState({ endOfData: value });
  }

  ReactOnPost(index, item, reaction) {
    const { newsFeed } = this.state;
    newsFeed[index].reaction.is_reacted
      ? (newsFeed[index].reaction.count = newsFeed[index].reaction.count)
      : (newsFeed[index].reaction.count = newsFeed[index].reaction.count + 1);
    newsFeed[index].reactionVisible = false;
    newsFeed[index].reaction.type = reaction;
    newsFeed[index].reaction.is_reacted = true;
    this.setState({ newsFeed }, () =>
      this.props.postReaction(this.state.token, item.post_id, reaction)

    )
  }

  submitStory = () => {
    const { storyDescription } = this.state;
    if (storyDescription.trim().length == 0) {
      this.setState({
        discriptionError: true,
      });
    } else {
      this.setState({
        discriptionError: false,
      });
    }
    if (this.state.images.length === 0) {
      this.setState({
        imageError: true,
      });
    } else {
      this.setState({
        imageError: false,
      });
    }
    if (this.state.images.length > 0 && storyDescription.trim().length > 0) {
      this.createStory('create-story');
    }
  };

  createStory = async () => {
    const { token, images, storyDescription } = this.state;
    this.setState({ storyLoading: true });
    await petOwnerCreateStory(token, images, storyDescription).then(res => {
      if (res?.data?.api_status == 200) {
        this.setState({
          storyLoading: false,
          storyBox: false,
          images: [],
          storyDescription: '',
        });
        this.props.petOwnerStories(this.state.token);
      }
    });
  };

  goBack = () => { this.props.navigation.pop() };

  renderStory = ({ item, index }) => {
    const { token } = this.state;
    return (
      <View key={Number(new Date().toISOString())}>
        <View style={styles.st_outerView}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate({
                routeName: 'StoryView',
                key: 'StoryView',
                params: {
                  stories: item.stories,
                  token: token,
                },
              });
            }}>
            <Image
              source={{
                uri: item?.stories[0]?.user_data?.avatar
                  ? item?.stories[0]?.user_data?.avatar
                  : '',
              }}
              style={styles.storySubImg}
            />

            <Image
              source={{ uri: '' + item.stories[0]?.thumbnail }}
              style={styles.st_thumbnail}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.nameStyle}>{item.first_name}</Text>
      </View>
    );
  };

  scrollToItemPets(event) {
    const { timing } = Animated;
    if (Animated.event.nativeEvent.contentOffset.x > 0) {
      timing(this.state.scrollX, {
        toValue: 60,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      timing(this.state.scrollX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }


  renderItemPets = ({ item, index }) => {
    return (
      <View key={item.id} style={{ marginHorizontal: RFValue(6) }}>
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
                borderWidth: 1,
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
                borderColor:
                  item.deceased == 1
                    ? 'black'
                    : item.disabled == 1
                      ? 'orange'
                      : null,
                borderWidth:
                  item.deceased == 1 || item.disabled == 1 ? 3 : null,
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

// console.log('updating post', formData);
// console.log('selected_post', selected_post);
//   return false
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
    const { newsFeed } = this.state;
    return (
      <RenderItemCard
        nodeRef={(ref, id) => { }}
        getFeelingIcon={this.getFeelingIcon}
        item={item}
        index={index}
        state={this.state}
        props={this.props}
        handleTrends={this.handleTrendsNow}
        selectedPost={this.selectedPost}
        ReportPost={this.ReportPost}
        DeletePost={this.DeletePost}
        UpdatePost={this.UpdatePost}
        modalVisible={(photoList, item) => {
          this.setState({
            modalVisible: true,
            viewerContent: {
              photos: photoList,
              index,
              isPost: true,
              ...item,
            },
          });
        }}
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



  handleTrendsNow = (item) => {

    // console.log('here is item' , JSON.parse(item));

    let [mention, postRec] = JSON.parse(item)
    let userId = this.props.user.user.user_data.user_id
    let __mentions = postRec.mentions
    
  if(mention.includes('#')){

    let hashTag = mention.replace('#', '');
    let _header = mention;

    this.props.navigation.navigate('TrendingStory', {
      item: hashTag,
      header: _header,
    });
  }else if(mention.includes('@')){

    let id = ''
    let hashTag = mention.replace('@', '');
    __mentions?.map((e,i)=>{
      if(e.user_name.includes(hashTag)){
        id = e.user_id
      }
    })

    if(userId==id){
      this.props.navigation.navigate('UserProfile')
    }else{
      this.props.navigation.navigate({
        routeName: 'Profile',
        key: 'ProfileP',
        params: { user_id:id},
      });
    }
    // console.log('URL is',postRec.url.split('/').pop().split('_')[0]);
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

  selectedPost = (post, index) => {
    this.setState({
      selected_Post_detail: post,
      selected_post_index: index
    })
  }


  getFeelingIcon = value => {
    let e = this.state.feelingsData.filter(e => e.text === value);
    if (e.length === 0) return '';
    else return e[0].emoji;
  };

  onRefresh = () => {
    this.FetchPetOwnerData();
    this.props?.petOwnerFriendSuggestion(this.state.token);
    this.distanceFromEnd = 0;
  };

  getFilePathForPlatform = response => {
    if (Platform.OS === 'ios') {
      return response.uri;
    } else {
      return response.path && 'file://' + response.path;
    }
  };

  getFilePathForMediaInfo = (response) => {
    if (Platform.OS === 'ios') {
      return response.path.replace('file://', '')
    }
    else {
      return response.path.replace('file://', '')
    }
  }

  showToast = msg => { Toast.show(msg, Toast.SHORT); };

  openGallery = async () => {
    const imagesData = await MultiImagePicker.openPicker({
      multiple: true,
    });
    imagesData.forEach(img => {
      let [type, extension] = img.mime.split('/');
      if (
        extension == 'jpeg' ||
        extension == 'jpg' ||
        extension == 'gif' ||
        extension == 'png'
      ) {
        let myimages = [];
        myimages.push({ uri: img.path });
        myimages = [...myimages, ...this.state.images];
        this.setState({
          images: myimages,
          imageError: false,
        });
      } else {
        let v_size = 0;
        let v_time = 0;

        var filePath = this.getFilePathForMediaInfo(img);

        // RNFetchBlob.fs.stat(img.path)
        RNFetchBlob.fs.stat(filePath)
          .then(stats => {
            v_size = stats.size;
            // const path = img?.path.substring(7); // for ios
            // console.log('image path ', path)

            MediaMeta.get(filePath)
              .then(metadata => {
                v_time = metadata.duration / 1000;
                if (v_time <= Number(maxVideoTime) && v_size <= Number(maxVideoSize)) {
                  let myimages = [];
                  myimages.push({ uri: img.path });
                  myimages = [...myimages, ...this.state.images];
                  this.setState({
                    images: myimages,
                    imageError: false,
                  });
                } else {
                  this.showToast(videoTimeSize);
                }
              })
              .catch(err => console.error('error in metadata', err));
          })
          .catch(err => {
            console.log('eror image blob', err);
          });
      }

      // myimages.push({uri:img.path})
    });
  };

  openCamera() {
    ImagePicker.launchCamera(
      {mediaType: 'image',quality: 1},(response) => {
    if (response.didCancel) {} 
    else if (response.error) {} 
    else {
          let uri = this.getFilePathForPlatform(response);
          let images = [{ uri }, ...this.state.images];
          this.setState({
            images,
            imageError: false,
          });
        }
      },
    );
  }

  _handleScroll = event => {
    let newXOffset = event.nativeEvent.contentOffset.x;
    this.setState({ currentXOffset: newXOffset });
  };

  leftArrow = () => {
    let eachItemOffset =
      this.state.scrollViewWidth / this.props?.pets?.pets.length; // Divide by 10 because I have 10 <View> items
    let _currentXOffset = this.state.currentXOffset - eachItemOffset;
    this.scrollViewRef?.scrollTo({ x: _currentXOffset, y: 0, animated: true });
  };

  rightArrow = () => {
    let eachItemOffset =
      this.state.scrollViewWidth / this.props?.pets?.pets.length; // Divide by 10 because I have 10 <View> items
    let _currentXOffset = this.state.currentXOffset + eachItemOffset;
    this.scrollViewRef?.scrollTo({ x: _currentXOffset, y: 0, animated: true });
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

  removeImg = uri => {
    let newImgs = this.state.images;
    let images = newImgs.filter(i => i.uri !== uri);
    this.setState({
      images,
    });
  };

  renderConfetti = () => {
    const { userProfilePic } = this.state;
    return (
      <>
        {this.state.confetti && (
          <View
            key={Number(new Date().toISOString())}
            style={styles.confettiView}>
            <ImageBackground
              source={require('../../assets/images/imgpsh_fullsize_anim.png')}
              style={styles.confettiImageBackground}
              resizeMode="stretch">
              <LottieView
                source={require('../../assets/lottie/confetti-cannons.json')}
                autoPlay 
                loop
              />
              <TouchableOpacity
                style={styles.confettiCross}
                onPress={() => this.setState({ confetti: false })}>
                <Icon
                  type="AntDesign"
                  name="close"
                  style={{ marginTop: wp(5), marginLeft: wp(5) }}
                />
              </TouchableOpacity>
              <Image
                style={styles.confettiProfile}
                source={{
                  uri:
                    '' + userProfilePic
                      ? userProfilePic
                      : this.props.user?.user?.user_data?.avatar ?? '',
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
                {this.state?.newsFeed?.user_data?.full_name}
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
                  await AsyncStorage.setItem('confet', JSON.stringify(1));
                }}
                style={{ marginTop: 40 }}>
                Don't show again
              </Text>
            </ImageBackground>
          </View>
        )}
      </>
    );
  };

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

  hideWelcomImage=()=>{
   const{hide_welcomeImg} = this.state
   this.setState({hide_welcomeImg:!hide_welcomeImg})
  }

  

  render() {
    const {
      loading,
      loadingPets,
      loadingSuggested,
      storyBox,
      discriptionError,
      imageError,
      images,
      storyLoading,
      imageViewer,
      userProfilePic,
      del_Modal_visible,
      infoMsg,
      InProcess,
      postText,
      showEditModal,
      postTextError,
      hide_welcomeImg,
      isPostReported,
    } = this.state;

    console.log('newsFeed',this.state.newsFeed);
    return (

      <>
        {this.renderConfetti()}
        <ImageView
          images={this.state.st}
          imageIndex={0}
          visible={imageViewer}
          FooterComponent={({ imageIndex }) => (
            <View
              style={{
                backgroundColor: 'black',
                marginBottom: RFValue(20),
                opacity: 0.8,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  alignSelf: 'center',
                  marginVertical: RFValue(8),
                }}>
                {this.state.st[imageIndex].description}
              </Text>
            </View>
          )}
          presentationStyle="overFullScreen"
          onRequestClose={() => this.setState({ imageViewer: false })}
        />


        <Container style={styles.container}>

          {this.state.showScrollBtn && <TouchableOpacity onPress={() => this.scrollToTop?.scrollResponderScrollTo({ x: 0, y: 0, animated: true })} style={styles.scrollBtn}><Icon
            type="AntDesign"
            name="upcircle"
            style={{ marginTop: wp(5), marginLeft: wp(5), color: PINK }}
          /></TouchableOpacity>}
          <NavigationEvents onDidFocus={() => this.updateSinglePost()} />
          {storyBox ? <View style={styles.storyBoxView} /> : null}
          {storyBox ? (
            <View style={styles.onceUponView}>
              <Text style={styles.onceUponText}>Once Upon a Time</Text>
              <TextInput
                onChangeText={storyDescription =>this.setState({ storyDescription, discriptionError: false })}
                value={this.state.storyDescription}
                maxLength={50}
                multiline={true}
                textAlignVertical="top"
                placeholder={'What is going on'}
                style={discriptionError ? [styles.descError] : [styles.descStyle]}
              />

              <ScrollView horizontal>
                {images.map((i, n) => (
                  <View
                    key={Number(new Date().toISOString())}
                    style={{
                      marginLeft: RFValue(20),
                      marginVertical: RFValue(8),
                    }}>
                    <Image style={styles.imgStyle} source={{ uri: '' + i?.uri }} />

                    <TouchableOpacity
                      style={styles.removeImgStyle}
                      onPress={() => this.removeImg(i.uri)}>
                      <Icon style={{ fontSize: RFValue(20) }} name="close" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1,
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={{
                    flex: 3,
                    paddingVertical: wp(4),
                    borderWidth: 1,
                    marginLeft: RFValue(20),
                    marginRight: RFValue(7),
                    borderColor: imageError ? '#DB2E2E' : '#00000021',
                    borderRadius: RFValue(15),
                    alignItems: 'center',
                  }}
                  onPress={() => this.openCamera()}>
                  <Ic
                    style={{ alignSelf: 'center' }}
                    name="camera"
                    color="grey"
                    size={25}
                  />
                  <Text style={styles.textStyle}>Open Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 3,
                    paddingVertical: wp(4),
                    borderWidth: 1,
                    marginLeft: RFValue(7),
                    marginRight: RFValue(20),
                    borderColor: imageError ? '#DB2E2E' : '#00000021',
                    borderRadius: RFValue(15),
                    alignItems: 'center',
                  }}
                  onPress={() => this.openGallery()}>
                  <Ic name="file-image" color="grey" size={25} />
                  <Text style={styles.textStyle}>Open Gallery</Text>
                </TouchableOpacity>
              </View>
              {storyLoading ? (
                <CustomLoader />
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: RFValue(15),
                    justifyContent: 'space-evenly',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 4,
                    }}>
                    <TouchableOpacity
                      onPress={() => this.setState({ storyBox: false })}
                      style={styles.cancelBtn}>
                      <Text style={{ color: '#F596A0', fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 4,
                    }}>
                    <TouchableOpacity 
                      onPress={() => this.submitStory()}
                      style={styles.createBtn}>
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Create</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : null}
          {loading && loadingPets && loadingSuggested ? (
            <PlaceholderLoader />
          ) : (
            <>
              <Content
                enableResetScrollToCoords={false}
                scrollEventThrottle={300}
                onScroll={event => {
                  if (event.nativeEvent.contentOffset.y > THRESHOLD && !this.state.showScrollBtn) {
                    this.setState({ showScrollBtn: true })
                  }
                  else if (event.nativeEvent.contentOffset.y < THRESHOLD && this.state.showScrollBtn) {
                    this.setState({ showScrollBtn: false })
                  }}
                }
                innerRef={ref => (this.scrollToTop = ref)}
                onScrollEndDrag={event => {
                  let itemHeight = 402;
                  let currentOffset = Math.floor(
                    event.nativeEvent.contentOffset.y,
                  );
                  let currentItemIndex = Math.ceil(currentOffset / itemHeight);
                  if (this.distanceFromEnd) {
                    if (currentItemIndex >= this.distanceFromEnd) {
                      if (!this.props.user.newsFeedloader) {
                        this.distanceFromEnd = currentItemIndex + 3;
                        this.props.petOwnerNewsFeed(
                          this.state.token,
                          'get_news_feed',
                          true,
                          'moreLoadData',
                        );
                      }
                    }
                  } else {
                    this.distanceFromEnd = 3;
                  }
                }}

                nestedScrollEnabled={true}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                  <RefreshControl
                    colors={[HEADER, '#9Bd35A', '#689F38']}
                    refreshing={
                      this.props.user.createPostLoader
                        ? this.props.user.createPostLoader
                        : this.props.user.newsFeedloader
                    }
                    onRefresh={() => this.onRefresh()}
                    tintColor={darkSky}
                  />
                }>
                <View style={{ backgroundColor:White, paddingHorizontal: 20 }}>
                  <View
                    style={styles.nameView}>
                    <Text style={{ fontWeight: '700', fontSize: 23 }}>
                      Hello,{' '}
                      {this.props.user.user
                        ? this.props?.user?.user?.user_data?.first_name
                        : ''}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {this.props.navigation.navigate('UserProfile')}}
                      style={{ borderRadius: 15, overflow: 'hidden' }}>
                      <Avatar
                        source={{
                          uri:
                            '' + userProfilePic
                              ? userProfilePic
                              : this.props.user?.user?.user_data?.avatar ?? '',
                        }}
                        size={'medium'}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowTop3}>
                    <TouchableOpacity
                      onPress={() => {this.props.navigation.navigate('StatusView', { MyTimeLine: true})}}
                      style={{ flex: 1 }}>
                      <View style={styles.whatsOnYourMind}>
                        <Text style={styles.whatsOnYourMindText}>What's on your mind?</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
   {!hide_welcomeImg ?
              <View>
                <Icon 
                 name='close' type='AntDesign'
                 style={styles.closeIcon}
                //  onPress={()=>{}}
                 onPress={()=>this.hideWelcomImage()}

                />
                 <View style={styles.welcomeImgView}>
                   <Image source={welcomePMP} style={styles.welcomePMPImg}/>
                 </View>

                 {/* <View style={styles.dontShowView}>
                   <View style={styles.rowCenter}>
                     <Icon 
                      name={hide_welcomeImg ?'check-square': 'square'} type='Feather'
                      style={styles.checkIcon}
                      onPress={()=>this.hideWelcomImage()}
                     />
                     <Text style={styles.dontShowText}>{'Don`t show this again'}</Text>
                   </View>
                 </View> */}
              </View> : 
              null}


                {this.props?.pets?.pets?.length == 0 &&
                  !this.props?.pets?.petsLoader ? (
                  <Text
                    style={{
                      fontSize: 16,
                      alignSelf: 'center',
                      marginVertical: 10,
                    }}>
                    No Pets Found
                  </Text>
                ) : this.props.pets.petsLoader &&
                  this.props?.pets?.pets?.length == 0 ? (
                  <View
                    style={{
                      width: '100%',
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <LottieView
                      style={{ height: 50 }}
                      autoPlay
                      source={require('../../assets/lottie/loader-black.json')}
                    />
                  </View>
                ) : (
                  <>
                    <View
                      style={{
                        marginTop: wp(1),
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#F7F7F7',
                      }}>
                      {this.state.newsFeed.length > 3 ? (
                        <TouchableOpacity
                          style={{
                            alignItems: 'flex-start',
                            paddingHorizontal: 10,
                          }}
                          onPress={this.leftArrow}>
                          <FAIcon name="angle-left" color="#424242" size={32} />
                        </TouchableOpacity>
                      ) : null}

                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        ref={ref => (this.scrollViewRef = ref)}
                        contentContainerStyle={{ alignItems: 'center' }}
                        // pagingEnabled={true}
                        onContentSizeChange={(w, h) =>
                          this.setState({ scrollViewWidth: w })
                        }
                        scrollEventThrottle={16}
                        scrollEnabled={true} // remove if you want user to swipe
                        onScroll={this._handleScroll}>
                        <FlatList
                          disableVirtualization={true}
                          horizontal={true}
                          data={this.props?.pets?.pets}
                          renderItem={this.renderItemPets}
                          initialNumToRender={9}
                          maxToRenderPerBatch={9}
                          scrollEventThrottle={1}
                          windowSize={9}
                          onScroll={
                            this.props?.pets?.pets > 1
                              ? this.scrollToItemPets
                              : null
                          }
                          contentContainerStyle={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            paddingVertical: RFValue(10),
                          }}
                        />
                      </ScrollView>

                      {this.state.newsFeed.length > 3 ? (
                        <TouchableOpacity
                          style={{
                            alignItems: 'flex-end',
                            paddingHorizontal: 10,
                          }}
                          onPress={this.rightArrow}>
                          <FAIcon
                            name="angle-right"
                            color="#424242"
                            size={32}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </>
                )}

                <View
                  style={{
                    fontFamily: THEME_BOLD_FONT,
                    marginVertical: RFValue(6),
                    backgroundColor: 'white',
                  }}>
                  <Text style={styles.onceUponeTime}>Once Upon A Time</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <ScrollView horizontal={true}>
                      <View
                        style={{
                          marginVertical: RFValue(10),
                          marginLeft: RFValue(15),
                        }}>
                        <TouchableOpacity
                          onPress={() => this.setState({ storyBox: true })}
                          style={styles.addStoryView}>
                          <Image
                            source={{
                              uri: userProfilePic
                                ? '' + userProfilePic
                                : this.props?.user?.user?.user_data?.avatar
                                  ? '' + this.props?.user?.user?.user_data?.avatar
                                  : '',
                            }}
                            style={styles.imgBox}
                          />
                          <View
                            style={{ position: 'absolute', bottom: 5, right: 5 }}>
                            <View style={styles.addBtn}>
                              <Icon
                                name="add"
                                style={{
                                  alignSelf: 'center',
                                  fontSize: 25,
                                  paddingVertical: 1,
                                  paddingLeft: 1,
                                }}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <FlatList
                        scrollEnabled={true}
                        horizontal={true}
                        data={this.props.user.stories}
                        renderItem={this.renderStory}
                        initialNumToRender={1}
                        contentContainerStyle={{
                          flex: 1,
                          paddingVertical: RFValue(10),
                          marginLeft: 9,
                        }}
                      />
                    </ScrollView>
                  </View>
                </View>

                {this.state.newsFeed.length > 0 ? (
                  <>
                    <FlatList
                      ref={ref => {
                        Number;
                        this.flatListRef = ref;
                      }}
                      disableVirtualization={true}
                      scrollEnabled={true}
                      horizontal={false}
                      data={this.state.newsFeed}
                      extraData={this.state.newsFeed}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={this.renderItemCard}
                      removeClippedSubviews
                      initialNumToRender={8}
                      onEndReachedThreshold={0.5}
                    />
                  </>
                ) : this.state.endOfData ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: RFValue(18),
                      fontFamily: THEME_FONT,
                      textAlignVertical: 'center',
                    }}>
                    No News Feed Available
                  </Text>
                ) : (
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <LottieView
                      style={{ height: 80 }}
                      autoPlay
                      source={require('../../assets/lottie/loader-black.json')}
                    />
                  </View>
                )}


                {this.props.user.newsFeedloader ? (
                  <PlaceholderLoader down={true} />
                ) : this.state.newsFeed.length > 0 ? (
                  <View />
                ) : this.state.endOfData ? (
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
                        fontSize: RFValue(18),
                        fontFamily: THEME_FONT,
                        textAlignVertical: 'center',
                      }}>
                      No News Feed Available
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
              </Content>
            </>
          )}

          <PostingModal
            isVisible={this.state.postFlag}
            onBackButtonPress={() => this.closeModal()}
            info={'POSTING'}
            headerText={'POSTING'}
            postFlag={this.state.postFlag}
          />

          <ImageViewerModal
            viewerContent={this.state.viewerContent}
            modalVisible={this.state.modalVisible}
            updateState={this.updateState}
            handleComments={this.handleComments}
          />

          <ShareModal
            noNeedToLoadNewsFeed
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
        </Container>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    confet: state.user.confet,
    workspace: state.user.workspace,
    pets: state.mypets,
  };
};

export default connect(
  mapStateToProps,
  {
    saveWorkSpace,
    petOwnerNewsFeed,
    petOwnerData,
    ownerpets,
    petOwnerStories,
    petOwnerFriendSuggestion,
    postReaction,
    getAllEvents,
    followFollower,
  },
)(PetOwnerView);
