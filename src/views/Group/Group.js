import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Thumbnail, Container, Content, Icon } from 'native-base';
import { SvgUri } from 'react-native-svg';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';
import ImageView from 'react-native-image-viewing';
import { Alert } from 'react-native';
import Toast from 'react-native-simple-toast';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NavigationEvents } from 'react-navigation';

import RenderItemCard from '../../components/common/RenderItemCard';
import { commonState } from '../../components/common/CommomState';
import { petMyPalGroupApiService } from '../../services/PetMyPalGroupApiService';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import EditPost from '../../components/common/EditPost';
import { reportPostText } from '../../constants/ConstantValues';
import ErrorModal from '../../components/common/ErrorModal';



const { 
   getPetOwnerGroupNewsFeed,
   postReaction, 
   joinGroup, 
   addFriendInList, 
   getFriendList ,
  } = petMyPalGroupApiService;
import EventEmitter from '../../services/eventemitter';
import styles from './styles';
import { userEdit,saveWorkSpace } from '../../redux/actions/user';
import { THEME_FONT } from '../../constants/fontFamily';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { HEADER, darkSky, } from '../../constants/colors';
import ShareModal from '../shareModal/index';
import WhatsYourMind from './../common/WhatsYourMind';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import InviteFriendModal from '../../components/common/InviteFriends';
import { server_key } from '../../constants/server';
import InfoModal from '../../components/common/InfoModal';
import { LongAboutParseHtml, ShortAboutParseHtml } from '../../components/helpers';
import ConfirmModal from '../../components/common/ConfirmModal';
import CustomLoader from '../../components/common/CustomLoader';
import NothingSvg from '../../assets/Pixxy/noPixxy.svg';
import Reactions from '../../components/common/Reactions'

const timeOut = 5000

class Group extends React.Component {

  constructor(props) {
    super(props);
    OneSignal.init('433c25e1-b94d-4f09-8602-bbe908a3761e', {
      kOSSettingsKeyAutoPrompt: true,
    });
    this.state = {
      joinStatus:null,
      groupPrivacy:null,
      loading: true,
      loadingPets: false,
      imageViewer: false,
      joining: false,
      isOwnGroup: false,
      isJoined: false,
      group: {},
      img: [],
      user: {},
      loadingSuggested: true,
      suggested: commonState.suggested,
      pets: [{}],
      newsFeed: [],
      loadingNewsFeed: true,
      more: false,
      lastPostId: '',
      token: '',
      visible: true,
      showModal: false,
      endOfData: false,
      group_id: '',
      reaction: commonState.reaction,
      months: commonState.months,
      postIndex: 0,
      start: false,
      isRefreshing: false,
      feelingsData: commonState.feelingsData,
      modalVisible: false,

      viewerContent: {
        reaction: {},
      },
      shareModalVisible: false,
      showInviteModal: false,
      followingList: [],
      aboutModal: false,

      isConfirm_Modal_visible:false,
      InProcess:false,
      infoMsg:'',
      joinLoader:false,
      selected_post_index:undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
      selected_Post_detail:undefined , // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
      selected_post:undefined, // for Delete Post 
      selected_index:undefined, // for Delete Post
      del_Modal_visible:false,
      InProcess:false,
      isPostReported:false,

      postText: undefined,
      showEditModal: false,
      postTextError: false,

    };
    this.checkGroupStatus = this.checkGroupStatus.bind(this);
    this.updateGroupNewsFeed = this.updateGroupNewsFeed.bind(this);
    this.endData = this.endData.bind(this);
    this.distanceFromEnd=0;

    EventEmitter.on('groupNewsFeed', this.updateGroupNewsFeed);
    EventEmitter.on('endgroupNewsFeed', this.endData);


    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.inFocusDisplaying(2);
  }

  componentWillReceiveProps() {
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
  }

  componentDidMount() {
    this.checkGroupStatus();
  }
  componentWillUnmount() {
    EventEmitter.off('groupNewsFeed', this.updateGroupNewsFeed);
    EventEmitter.off('endgroupNewsFeed', this.endData);
  }

  async checkGroupStatus() {
    const TOKEN = await AsyncStorage.getItem(ACCESS_TOKEN);
    const token = JSON.parse(TOKEN).access_token;
    const group_id = this.props.navigation.getParam('group').id;
    const GP=this.props.navigation.getParam('group').privacy;
    let isJoined = this.props.navigation.getParam('joinStatus')
    this.setState({
      group: this.props.navigation.getParam('group'),
      isOwnGroup:
        this?.props?.user?.user_data.user_id ===
        this.props.navigation.getParam('group').user_id,
      loading: false,
      token,
      group_id,
      joinStatus:isJoined,
      groupPrivacy:GP
    },()=>{
    this.getUserData();
    this.props.getPetOwnerGroupNewsFeed(token, group_id, 'get_group_posts', false, 'firstTimeLoadData');
    this.getInviteFriendList(token, group_id);
  })}

 async getUserData(){
   const formData = new FormData()
    formData.append('server_key', server_key);
    formData.append('user_id', this.props?.user?.user_data.user_id);
    formData.append('fetch', 'joined_groups');
    const response = await petMyPalApiService.getUserData(this.state.token, formData).catch((e) => {
      console.warn('Something went wrong to fetch user data!')
    });
    if(response.data?.api_status==200){
      this.setState({isJoined:response.data?.joined_groups?.some(item=>item.group_id==this.props.navigation.getParam('group')?.group_id)})
    }
  }
  getInviteFriendList = async (token, group_id) => {
    const formData = new FormData();
    formData.append('group_id', group_id);
    formData.append('server_key', server_key);

    const response = await getFriendList(token, formData);
    this.setState({ followingList: response?.data?.followings ?? [] })


  }
  updateGroupNewsFeed(data) {
    this.setState({ newsFeed: data, loadingNewsFeed: false, more: false });

  }
  endData(value) { this.setState({ endOfData: value })}

  ReactOnPost(index, item, reaction) {
    const { newsFeed } = this.state;
    newsFeed[index].reaction.is_reacted
      ? (newsFeed[index].reaction.count =
        newsFeed[index].reaction.count)
      : (newsFeed[index].reaction.count =
        newsFeed[index].reaction.count + 1);
    newsFeed[index].reactionVisible = false;
    newsFeed[index].reaction.type = reaction;
    newsFeed[index].reaction.is_reacted = true;
    this.setState({ newsFeed }, () =>
      this.props.postReaction(this.state.token, item.post_id, reaction)
    );

  }
  async requestHandlerJoinGroup(type) {
    if(type=='leave'){
      this.setState({InProcess:true})
    }else {
      this.setState({joinLoader:true})
    }
    try {
      const response =  await this.props.joinGroup(this.state.token, this.state.group_id);
      if(response.data.api_status==200){
      this.setState({ 
        isJoined: !this.state.isJoined,
        isConfirm_Modal_visible:false,
        InProcess:false,
        joinLoader:false
       },()=> {
         
        if(type!='leave'){
        this.props.getPetOwnerGroupNewsFeed(this.state.token, this.state.group_id, 'get_group_posts', false, 'firstTimeLoadData');
      }
        else{
            this.setState({newsFeed:[]})

        
      }
    })}}
    catch (e) {
      Alert.alert('', 'Request Failed !');
      console.log(e);
    }
  }

  goBack = () => {this.props.navigation.pop()};

  closeAboutModal = () => {
    this.setState({aboutModal: false})
  }

  addFriend = async (user_id, name) => {

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('group_id', this.state.group_id);
    formData.append('user_id', user_id);

    console.log('data sending to server' , formData);
    const response = await addFriendInList(this.state.token, formData);
    const {data} = response
    console.log('here is response ' , data); 
    if (response?.data?.api_status == '200') {
      this.setState({ followingList: this.state.followingList.filter(item => item.user_id != user_id) });
      Toast.show(`${name} is added successfully!`, Toast.SHORT)
    }

  }
  renderItemPets = ({ item, index }) => {
    return (
      <View style={{ marginHorizontal: RFValue(7) }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate({
              routeName: 'PetProfile',
              key: 'PetProfile',
              params: { item },
            });
          }}>
          <Thumbnail
            source={{ uri: "" + item.avatar }}
            style={{ backgroundColor: '#F2F2F2', alignSelf: 'center' }}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: RFValue(12),
              fontFamily: THEME_FONT,
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

  selectedPost =(post,index)=>{ 
    this.setState({
      selected_Post_detail:post,
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

  hidePostReaction =(i)=>{
    const {newsFeed } = this.state
        this.removeTimeOut = setTimeout(() => {
            let tempNewsFeed = newsFeed.slice()
            tempNewsFeed.map((item, i) => {
              tempNewsFeed[i].reactionVisible = false
            })

            this.setState({ newsFeed: tempNewsFeed })
            clearTimeout(this.removeTimeOut)
        },timeOut);

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
    // console.log('here is reported response',data);
}

closeReprtModal=()=>{
  this.setState({isPostReported:false})
 }

DeletePost = async (item , index)=>{
  setTimeout(() => {
    this.setState({ 
      del_Modal_visible:true,
      infoMsg:'Do you want to delete this post ?',
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
    const { newsFeed , group_id } = this.state;
    return (
      <RenderItemCard
      nodeRef={(ref,id)=>{}}
        getFeelingIcon={this.getFeelingIcon}
        item={item}
        index={index}
        state={this.state}
        props={this.props}
        selectedPost ={this.selectedPost}
        ReportPost={this.ReportPost}
        DeletePost={this.DeletePost}
        UpdatePost={this.UpdatePost}
        postsOf={group_id}

        // openComments={(item, index) => {
        //   this.setState(
        //     { postIndex: index },
        //     this.props.onCommentDataChange(item.get_post_comments, item),
        //     this.props.commentOpen(),
        //   );
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
        //   item.reaction.is_reacted
        //     ? () => {
        //       item.reaction.is_reacted = false;
        //       item.reaction.count = item.reaction.count - 1;
        //       item.reaction.type = '';
        //       this.setState({ newsFeed });
        //     }
        //     : () => {
        //       item.reaction.count = item.reaction.count + 1;
        //       item.reaction.type = 'Like';
        //       item.reaction.is_reacted = true;
        //       this.setState({ newsFeed }, () =>
        //         this.props.postReaction(this.state.token, item.post_id, 'Like')
        //       );
        //     };
        // }}
        onPressOut={() => {this.hidePostReaction()}}
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
    this.distanceFromEnd = 0
    this.setState({ isRefreshing: true },
      () => {
        this.props.getPetOwnerGroupNewsFeed(this.state.token, this.state.group_id, 'get_group_posts', false, 'firstTimeLoadData');
        setTimeout(() => {
          this.setState({ isRefreshing: false })

        }, 2000)
      },
    );
  };

  updateState = state => { this.setState(state)};

  closeModal = (state) => {this.setState({ showInviteModal: state })}

  openConfirmModal =()=>{
    this.setState({ 
      isConfirm_Modal_visible:true,
      infoMsg:'Are you sure you want to leave this group?',
    })
  }
  closeConfirmModal=()=>{
    this.setState({ 
      isConfirm_Modal_visible:false,
      InProcess:false
    })
  }

  render() {

    const {
      isJoined,
      loading,
      newsFeed,
      imageViewer,
      group,
      img,
      isRefreshing,
      isOwnGroup,
      isConfirm_Modal_visible,
      joinLoader,
      del_Modal_visible,
      infoMsg,
      InProcess,
      postText,
      showEditModal,
      postTextError,
      isPostReported,

    } = this.state;

    return (
      <Container style={styles.container}>
        <ImageViewerModal
          viewerContent={this.state.viewerContent}
          modalVisible={this.state.modalVisible}
          updateState={this.updateState}
        />
        <ShareModal
          viewerContent={this.state.viewerContent}
          modalVisible={this.state.shareModalVisible}
          updateState={this.updateState}
          navigation={this.props.navigation}
        />
        <ImageView
          images={img}
          imageIndex={0}
          visible={imageViewer}
          presentationStyle="overFullScreen"
          onRequestClose={() => this.setState({ imageViewer: false })}
        />
        <InviteFriendModal
          addFriend={this.addFriend}
          closeModal={this.closeModal}
          following={this.state.followingList}
          showModal={this.state.showInviteModal} navigation={this.props.navigation} />
        {loading ? (
          <PlaceholderLoader />
        ) : (
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
                    if (!this.props.groups.moreData) {
                      this.distanceFromEnd = currentItemIndex + 5
                      this.props.getPetOwnerGroupNewsFeed(this.state.token, this.state.group_id, 'get_group_posts', true, 'moreData');

                    }
                  }
                } else {
                  this.distanceFromEnd = 4
                }
              }}
              nestedScrollEnabled={true}
              contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
              refreshControl={
                <RefreshControl
                  colors={[HEADER, '#9Bd35A', '#689F38']}
                  refreshing={isRefreshing}
                  onRefresh={() => this.onRefresh()}
                />
              }>
                 <NavigationEvents onDidFocus={() => this.updateSinglePost()} />
              <View>
                <View style={styles.coverImgContainer}>
                  <TouchableOpacity
                    onPress={this.goBack}
                    style={{
                      position: 'absolute',
                      zIndex: 500,
                      top: 10,
                      left: 10,
                    }}>
                    <Icon
                      name={'chevron-back'}
                      type="Ionicons"
                      style={{ fontSize: 30, color: darkSky }}
                    />
                  </TouchableOpacity>
                  <Image
                    style={styles.coverImg}
                    source={{
                      uri: group?.cover?.replace(/\s/g, '')
                        ? group?.cover?.replace(/\s/g, '')
                        : 'https://res.cloudinary.com/n4beel/image/upload/v1595058775/pattern_2_xhmx4n.png',
                    }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View
                  style={{
                    borderColor: '#0000', // if you need
                    borderWidth: 1,
                    elevation: 5,
                    shadowColor: '#0000',
                    shadowOpacity: 12,
                    marginTop: hp(-14),
                    backgroundColor: '#fff',
                    height: hp(35),
                    borderRadius: 20,
                    width: wp(88),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{}} />
                    <View style={{}} />
                    <View style={{ flexDirection: 'row', marginTop: hp(-2) }}>
                      <View
                        style={{
                          marginRight: 20,
                          width: RFValue(35),
                          height: RFValue(35),
                        }}>
                        {isOwnGroup && (
                          <TouchableOpacity
                            onPress={() => {

                              this.props.navigation.navigate({
                                routeName: 'EditGroup',
                                key: 'EditGroup',
                                params: { group, newGroup: false },
                              });
                            }}>
                            <Image
                              style={styles.profileImg}
                              source={require('./../../assets/images/updated/EditPic.png')}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={{ marginHorizontal: wp(6) }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={{
                          width: 80,
                          height: 80,
                          overflow: 'hidden',
                          borderRadius: 10,

                        }}>
                        {group?.avatar?.includes('.svg') ?
                          <SvgUri
                            width="100%"
                            height="100%"
                            uri={group?.avatar}
                          /> :
                          <Image
                            style={styles.profileImg}
                            source={{
                              uri: group?.avatar?.replace(/\s/g, '')
                                ? group?.avatar?.replace(/\s/g, '')
                                : 'https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600134.jpg',
                            }}
                          />}
                      </View>
                      <View style={{ marginLeft: wp(3), width: '70%' }}>
                        <Text

                          style={{
                            color: '#182A53',
                            fontSize: 20,
                            fontWeight: 'bold',
                            width: wp(50)
                          }}>
                          {group.group_title}
                        </Text>
                        <Text style={{ color: '#8B94A9', fontWeight: '400' }}>
                          Members:{' '}{group?.members ?? '1'}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginVertical: hp(3),
                        }}>
                        <View
                          style={{
                            flex: 3,
                            flexDirection: 'row',
                            justifyContent: 'center',
                          }}>
                    
                        </View>
                        <View
                          style={{
                            flex: 3,
                            flexDirection: 'row',
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity onPress={() => this.setState({ showInviteModal: !this.state.showInviteModal })} style={styles.joinBtn}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>
                              Invite
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            flex: 3,
                          }}>
                          {isOwnGroup ? null : (
                            <View>
                              {/* {this.props?.groups?.joinedGroupLoader ? ( */}
                              {joinLoader ? (
                                <CustomLoader loaderContainer={{top:-5}}/>
                              ) : isJoined == true ? (
                                <TouchableOpacity
                                  onPress={()=>this.openConfirmModal()}
                                  style={styles.joinBtn}>
                                <Text style={styles.btnHeading}>Leave</Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity onPress={() => {this.requestHandlerJoinGroup('join');}}
                                  style={styles.joinBtn}>
                                  <Text style={styles.btnHeading}>Join</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    <InfoModal
                      isVisible={this.state.aboutModal}
                      onBackButtonPress={() => this.closeAboutModal()}
                      info={LongAboutParseHtml(group.about)}
                      headerText={''}
                      policy={''}
                      leftAlign={true}
                      onPress={() => this.closeAboutModal()}
                    />
                    <TouchableOpacity onPress={() => this.setState({ aboutModal: true, marginTop: group?.about?.length > 100 ? 10 : 0, marginBottom: group?.about?.length > 100 ? 0 : 10 })} style={{ flexDirection: 'row' }}>
                      {group.about ? (
                        <View style={{  width: '100%', alignItems:'center'}}><Text  style={{ color: 'gray' }}>
                          {ShortAboutParseHtml(group?.about)}
                        </Text></View> 
                      ) : null}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {this.state.isOwnGroup || this.state.joinStatus || this.state.groupPrivacy==1 ? (
                <View style={{ marginBottom: RFValue(10) }}>
                  <WhatsYourMind
                    StatusView={() => {
                      this.props.navigation.navigate({
                        routeName: 'StatusView',
                        params: { group_id: group.group_id, group },
                      });
                    }}
                  />
                </View>
              ) : null}
                <View style={{ flex: 1 }}>
                  {!isJoined && group.join_privacy!=1 ? <View style={styles.noData}>
                    <NothingSvg width={wp(70)} height={wp(70)} />
                  </View> : newsFeed?.length > 0 ? (
                  <FlatList
                    disableVirtualization={true}
                    windowSize={2}
                    initialNumToRender={10000}
                    removeClippedSubviews={true}
                    scrollEnabled={true}
                    horizontal={false}
                    data={newsFeed}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItemCard}
                  />
                ) :
                // this.state.endOfData ?

                <View style={styles.noData}>
                <NothingSvg width={wp(70)} height={wp(70)} />
               </View> 
                // : 
                //    <View style={{ width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                //       <LottieView style={{ height: 80 }} autoPlay source={require('../../assets/lottie/loader-black.json')} />
                //    </View>
                }
              </View>
              {this.props.groups.moreData ? (
                <PlaceholderLoader down={true} />
              ) : newsFeed.length < 0 ? (
                <View
                  style={{
                    flex: 1,
                    height: RFValue(150),
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
                    No Posts Found
                  </Text>
                </View>
              ) : null}
            </Content>
          </>
        )}

        <ConfirmModal
          isVisible={isConfirm_Modal_visible}
          info={infoMsg}
          DoneTitle={'Ok'}
          onDoneBtnPress={()=>this.requestHandlerJoinGroup('leave')}
          CancelTitle={'Cancel'}
          onCancelBtnPress={()=>this.closeConfirmModal()}
          processing={InProcess}
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
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  workspace: state.user.workspace,
  groups: state.groups,
  following: state?.friends?.friends?.following
});


export default connect(
  mapStateToProps,
  { 
    saveWorkSpace,
    userEdit,
    getPetOwnerGroupNewsFeed, 
    postReaction, 
    joinGroup
   },
)(Group);
