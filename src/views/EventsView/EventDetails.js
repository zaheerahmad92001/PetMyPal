import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import React from 'react';
import moment from "moment"
import AsyncStorage from '@react-native-community/async-storage';
import ImageView from 'react-native-image-viewing';
import { NavigationEvents } from 'react-navigation';

import { commonState } from '../../components/common/CommomState';
import PMPHeader from '../../components/common/PMPHeader';
import { pressInterestEvent, pressGoingEvent, allEvents } from '../../services/index';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { darkSky, PINK, } from '../../constants/colors';
import ShareModal from '../shareModal/index';
import ClockSvg from '../../assets/Event-Icons-svg/clock.svg';
import LocationSvg from '../../assets/Event-Icons-svg/location.svg';
import PersonPlusSvg from '../../assets/Event-Icons-svg/person-plus.svg';
import GroupSvg from '../../assets/Event-Icons-svg/woman-man.svg';
import InfoModal from '../../components/common/InfoModal';
import Reactions from '../../components/common/Reactions'
import { LongAboutParseHtml, ShortAboutParseHtml } from '../../components/helpers';
import { addEvents } from '../../redux/actions/events';
import { petMyPalEventsApiService } from '../../services/PetMyPalEventsApiService';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { saveBeforePostId } from '../../redux/actions/post'
import { Container, Content } from 'native-base';
import ConfirmModal from '../../components/common/ConfirmModal';
import EditPost from '../../components/common/EditPost';
import { reportPostText } from '../../constants/ConstantValues';
import ErrorModal from '../../components/common/ErrorModal';




const { eventNewsFeed } = petMyPalEventsApiService;
const { postReaction, } = petMyPalApiService;;
const timeOut = 5000

class EventDetails extends React.Component {
  constructor(props) {
    super(props);
    const { item } = this.props.navigation.state.params;
    this.ownEvent = this.props?.myEvents.some(i => i?.id == item?.id);

    this.state = {
      loading: false,
      eventDate: moment.duration().add({ days: 0, hours: 0, minutes: 0, seconds: 0 }),
      days: 0,
      hours: 0,
      ref: null,
      images: [],
      imageViewer: false,
      st: [],
      newsFeed: [],
      loadingNewsFeed: true,
      more: false,
      token: undefined,
      reaction: commonState.reaction,
      postIndex: null,
      feelingsData: commonState.feelingsData,
      modalVisible: false,
      viewerContent: {
        reaction: {},
      },
      selected_post_index: undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
      selected_Post_detail: undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)

      selected_post: undefined, // for Delete Post 
      selected_index: undefined, // for Delete Post
      del_Modal_visible: false,
      infoMsg: 'Do you want to delete this post ?',
      InProcess: false,
      postText: undefined,
      showEditModal: false,
      postTextError: false,
      isPostReported:false,

      shareModalVisible: false,
      aboutModal: false,
      myEvent: this.props.myEvents?.some(val => val?.id == item?.id)
    }
    this.distanceFromEnd = 0;
  }

  componentDidMount() {
    const { item } = this.props.navigation.state.params;
    this.getAccessToken().then((TOKEN) => {
      this.setState({ token: JSON.parse(TOKEN).access_token, })
    })

    const beforeId = undefined
    this.props.saveBeforePostId(beforeId) // redux call to clear previous store value

    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.requestHandlerNewsFeed();
    });
    var formatedDate = moment(item?.start_date, 'MM-DD-YYYY').isValid() ? moment(item?.start_date, 'MM-DD-YYYY').format() : moment(item?.start_date, 'YYYY-MM-DD').format();


    let diff = new Date(formatedDate) - new Date();// * it is actually total time in seconds and we are saving it as days in state.
    if (diff < 0 && new Date(formatedDate).getDate() == new Date().getDate() && new Date(formatedDate).getFullYear() == new Date().getFullYear() && new Date(formatedDate).getMonth() == new Date().getMonth()) {
      let [hours, minutes] = item?.start_time.split(':');
      if (hours > new Date().getHours()) {
        hours = Number(hours) - Number(new Date().getHours())
        minutes = Number(minutes) - Number(new Date().getMinutes())
        diff = ((hours * 60 * 60) + (minutes * 60)) * 1000;
      }
    }
    this.setState({ days: diff })
  }

  async getNewsFeedForEvent(id) {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    this.props.eventNewsFeed(JSON.parse(token).access_token, id, 'get_event_posts', false, 'firstTimeLoadData')
  }

  commonApiCall(data) {
    this.commonApiInterval = setTimeout(() => {
      allEvents((data) => {
        let obj = {
          allEvents: data.events,
          myEvents: data.my_events,
          pastEvents: data.past_events,
          InterestedEvents: data.interested_events,
          InvitedEvents: data.invited_events,
          GoingEvents: data.going_events
        }
        this.props.addEvents(obj)
        this.setState({ loading: false })
      })
    }, 100)
  }

  buttonShow() {
    const { item } = this.props.navigation.state.params;
    if (!this.ownEvent) {
      const { item, btnShow, goingShow, interestShow, color } = this.props.navigation.state.params
      if (btnShow && interestShow && goingShow) {
        return (
          <View style={{ width: '100%', flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
            {interestShow && <TouchableOpacity
              style={styles.defaultButton}
              onPress={() => {
                this.setState({ loading: true })
                pressInterestEvent(item.id, (status) => {
                  this.commonApiCall();

                })
              }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#20ACE2' }}>Interested</Text>

            </TouchableOpacity>
            }
            {goingShow &&
              <TouchableOpacity
                onPress={() => {
                  this.setState({ loading: true })
                  pressGoingEvent(item.id, (status) => {

                    this.commonApiCall();
                  })
                }}
                style={styles.shadowButton}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>Going</Text>

              </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('InviteFriends', { event: item })
              }}
              style={styles.inviteButton}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>Invite</Text>

            </TouchableOpacity>
          </View>
        )
      } else if (interestShow || goingShow) {
        return (
          <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: '5%', marginTop: 20, justifyContent: 'space-between' }}>


            {interestShow && <TouchableOpacity
              style={styles.colorButton}
              onPress={() => {
                this.setState({ loading: true })
                pressInterestEvent(item.id, (status) => {
                  this.commonApiCall();
                })
              }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>Not Interested</Text>

            </TouchableOpacity>
            }
            {goingShow &&
              <TouchableOpacity
                onPress={() => {
                  this.setState({ loading: true })
                  pressGoingEvent(item.id, (status) => {
                    this.commonApiCall();
                  })
                }}
                style={styles.colorButton}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>Not Going</Text>

              </TouchableOpacity>
            }
          </View>
        )
      } else
        return null
    }
    else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('InviteFriends', { event: item })
          }}
          style={[styles.inviteButton, { flexGrow: 1, alignSelf: 'flex-end', paddingHorizontal: wp(5), marginRight: wp(5), marginTop: wp(2) }]}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>Invite</Text>

        </TouchableOpacity>
      )
    }
  }

  closeReprtModal=()=>{
    this.setState({isPostReported:false})
   }

  closeAboutModal = () => {
    this.setState({
      aboutModal: false
    })
  }
  componentWillUnmount() {
    this.commonApiInterval;
    this.focusListener;
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
      this.setState({isPostReported:true})
    }
    console.log('here is reported response', data);
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
    const { newsFeed } = this.state;
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
        //         this.props.postReaction(
        //           this.state.token,
        //           item.post_id,
        //           'Like',
        //         )
        //       );
        //     };
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

  updateState = state => { this.setState(state) };

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  async requestHandlerNewsFeed() {
    const { item } = this.props.navigation.state.params;
    const { more, newsFeed, token } = this.state

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

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('type', 'get_event_posts');
    formData.append('limit', 9);
    formData.append('id', item.id)
    more ? formData.append('after_post_id', after_post_id) : null;
    more && beforePostId && beforePostId != 0 ? formData.append('before_post_id', beforePostId) : null;

    const response = await petMyPalApiService.getUserNewsFeed(token, formData)
      .catch(e => {
        console.log('error while getting NewsFeeds ', e);
      });

    let result = [];
    const { data } = response;
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
        arr = more ? arr.concat(result) : result;

        this.setState({ newsFeed: arr, loadingNewsFeed: false, more: false });
        return false
      }

      data?.data?.forEach(element => {
        element = { ...element, reactionVisible: false };
        result.push(element);
      });

      let arr = newsFeed;
      arr = more ? arr.concat(result) : result;
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

    } else {
      this.setState({ newsFeed: [], loadingNewsFeed: true, more: false });
    }


    // try {
    //   const response = await fetch(
    //     SERVER +
    //     '/api/posts' +
    //     '?access_token=' +
    //     JSON.parse(token).access_token,
    //     {
    //       method: 'POST',
    //       body: data,
    //       headers: {},
    //     },
    //   );
    //   const responseJson = await response.json();
    //   if (responseJson.api_status === 200) {
    //     responseJson.data.forEach(element => {
    //       element = { ...element, reactionVisible: false };
    //       result.push(element);
    //     });

    //     this.setState({ newsFeed: result, loadingNewsFeed: false, more: false });
    //   } else {
    //     alert('Network Error');
    //     this.setState({ newsFeed: [], loadingNewsFeed: true, more: false });
    //   }
    // } catch (error) {
    //   console.log(error)

    //   this.setState({ newsFeed: [], loadingNewsFeed: true, more: false });
    //   alert(error);
    // }
  }

  goBack = () => { this.props.navigation.pop() };

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
    console.log('here is token', token);
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

  getFeelingIcon = value => {
    let e = this.state.feelingsData.filter(e => e.text === value);
    if (e.length === 0) return '';
    else return e[0].emoji;
  };

  getFullDate(date) {
    return moment(date, 'MM-DD-YYYY').isValid() ? moment(date, 'MM-DD-YYYY').format("ll").split(',')[0] : moment(date, 'YYYY-MM-DD').format("ll").split(',')[0];
  }

  getFullTime(time) { return moment(time, 'HH:mm:ss').format('HH:mm') }

  render() {
    const { item } = this.props.navigation.state.params;
    const {
      loading,
      days,
      imageViewer,
      more,
      del_Modal_visible,
      infoMsg,
      InProcess,
      postText,
      showEditModal,
      postTextError,
      isPostReported,
    } = this.state
    return (
      <Container style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        <NavigationEvents onDidFocus={() => this.updateSinglePost()} />
        <PMPHeader
          ImageLeftIcon={'arrow-back'}
          LeftPress={() => this.props.navigation.pop()}
          centerText={"Event"}
        />

        {loading &&
          <View style={{ position: 'absolute', top: wp(15), width: '100%', justifyContent: 'center', zIndex: 1 }}><PlaceholderLoader /></View>}
        <Content
          showsVerticalScrollIndicator={false}
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
                if (!more) {
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

        >
          {this.state.myEvent && <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateEvent', { item: item })} style={styles.editContainer}>
            <Image
              style={styles.profileImg}
              source={require('./../../assets/images/updated/EditPic.png')}
            />
          </TouchableOpacity>}
          <View style={styles.bodyContainer} key={item?.id}>

            <View style={{ backgroundColor: '#20ACE2', paddingHorizontal: 12, paddingVertical: 20, paddingBottom: 90 }}>

              {days > 0 &&
                <CountDown
                  until={Math.abs(days) / 1000}
                  size={30}
                  onFinish={() => console.log('Finished')}
                  digitStyle={{ backgroundColor: 'transparent', height: wp(10), width: wp(20), marginTop: wp(5) }}
                  digitTxtStyle={{ color: 'white' }}
                  timeToShow={['D', 'H', 'M', 'S']}
                  timeLabels={{ d: 'Days', h: 'Hrs', m: 'Min', s: 'Sec' }}
                  timeLabelStyle={{ color: 'white', fontWeight: 'bold', marginTop: -5 }}

                />}
            </View>

            <View style={{ borderRadius: 10, paddingHorizontal: '5%', overflow: 'hidden', marginTop: wp(-16) }}>
              <Image source={{ uri: item?.cover }}
                style={{ width: '100%', height: 140, borderRadius: 10 }} />
            </View>
            <Text style={[styles.text, { paddingHorizontal: '5%' }]}>{item?.name}</Text>
            <View style={{ paddingHorizontal: '5%', alignItems: 'flex-start', marginTop: wp(0.5) }}>
              <View style={styles.infoContainer}>
                <View style={styles.infoSubContainer}>
                  <ClockSvg width={18} height={18} />
                  <Text style={{ marginLeft: 10, color: 'gray', fontWeight: 'bold', fontSize: 13 }}>{this.getFullDate(item?.start_date ?? 0)}</Text>
                  <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 13 }}>{' ' + this.getFullTime(item?.start_time)}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'gray' }}>{' '}-{' '}</Text>
                  <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 13 }}>{this.getFullDate(item?.end_date ?? 0)}</Text>
                  <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 13 }}>{' ' + this.getFullTime(item?.end_time)}</Text>
                </View>
              </View>

              <View style={[styles.infoSubContainer, { marginTop: wp(3) }]}>
                <LocationSvg width={21} height={21} />
                <Text style={{ marginLeft: 8, color: 'gray' }}>{item?.location}</Text>
              </View>
              <View style={{ marginTop: wp(3) }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate({
                  routeName: 'Profile',
                  key: 'Profile',
                  params: { user_id: item?.user_data?.user_id, item: item?.user_data },
                })} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <GroupSvg width={21} height={21} />
                  <Text style={{ marginLeft: 8, color: 'gray' }}>{item?.user_data?.name}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(3) }}>
                  <PersonPlusSvg width={20} height={20} />

                  <Text style={{ marginLeft: 8, color: darkSky }}>{item?.interested_count ?? 0}{' '}Interested<Text style={{ color: PINK }}>{'  '}{item?.going_count ?? 0}{''} Going</Text></Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => this.setState({ aboutModal: true })} style={{ width: '100%' }}>
                <View style={{ marginTop: 12, width: '100%', alignItems: 'center' }}>
                  <Text style={{ color: 'gray' }}  >{ShortAboutParseHtml(item?.description)}</Text>
                </View>
              </TouchableOpacity>
            </View>
            {this.buttonShow()}
          </View>
          <View>
            <View style={styles.whatOnYourMind}>
              <View style={styles.innerView}>
                <TouchableOpacity
                  onPress={() => { this.props.navigation.navigate('EventPostScreen', { event: item }) }}
                  style={{ flex: 1 }}>
                  <View style={styles.btnView}>
                    <Text style={styles.btnText}>What's on your mind?</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              disableVirtualization={true}
              windowSize={2}
              initialNumToRender={10000}
              removeClippedSubviews={true}
              scrollEnabled={true}
              horizontal={false}
              data={this.state.newsFeed}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItemCard}
            />
          </View>

        </Content>

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
        <InfoModal
          isVisible={this.state.aboutModal}
          onBackButtonPress={() => this.closeAboutModal()}
          info={LongAboutParseHtml(item?.description)}
          headerText={''}
          policy={''}
          leftAlign={true}
          onPress={() => this.closeAboutModal()}
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
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  bodyContainer: {
    marginTop: 10,
    overflow: 'hidden',
    paddingBottom: '5%',
    marginHorizontal: '5%',
    borderRadius: 15,
    shadowColor: "#20ACE2",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 8,
    backgroundColor: 'white',

  },
  colorButton: {
    width: '100%',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(244, 125, 138, 0.8)",
    shadowColor: "#000",
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 9,
    marginVertical: 5,
  },
  infoContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },

  infoSubContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  defaultButton: {
    width: '29%',
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#20ACE2',
    justifyContent: 'center',
    alignItems: 'center'
  },

  shadowButton: {
    width: '29%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#20ACE2",
    marginLeft: '2%'
  },
  inviteButton: {
    width: '29%',
    height: 50,
    right: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PINK,
    marginLeft: '5%'
  },

  profileImg: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },

  editContainer: {
    position: 'absolute',
    right: 14,
    top: 0,
    zIndex: 999,
    elevation: 10
  },
  whatOnYourMind: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    marginVertical: 30,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  innerView: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginVertical: 20
  },
  btnView: {
    borderRadius: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#C7CCDA',
    overflow: 'hidden',
    height: 70
  },
  btnText: {
    color: '#C7CCDA',
    marginLeft: 10
  },

})

const mapStateToProps = state => ({
  user: state.user.user,
  myEvents: state.events?.events?.myEvents,
  beforePostId: state.post.beforePostId
});

export default connect(mapStateToProps, {
  addEvents,
  eventNewsFeed,
  postReaction,
  saveBeforePostId
})(EventDetails);