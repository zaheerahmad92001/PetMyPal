import React, {useState} from 'react';
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
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styles from './styles';
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
} from 'native-base';
import {connect} from 'react-redux';
import PropTypes, {element} from 'prop-types';
import {userEdit, userSave, saveWorkSpace} from '../../redux/actions/user';
import {savePets} from '../../redux/actions/pets';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {THEME_BOLD_FONT, THEME_FONT} from '../../constants/fontFamily';
import {SERVER, server_key} from '../../constants/server';
import {ACCESS_TOKEN} from '../../constants/storageKeys';
import requestRoutes from '../../utils/requestRoutes';
import AsyncStorage from '@react-native-community/async-storage';
import ImageView from 'react-native-image-viewing';
import {HEADER, TEXT_LIGHT, TEXT_DARK} from '../../constants/colors';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import PMP from '../../lib/model/pmp';
import NavigationService from '../../presentation/ControlPanel/NavigationService';
import FastImage from 'react-native-fast-image';
import Emoji from 'react-native-emoji';
import HTML from 'react-native-render-html';
import ImagePicker from 'react-native-image-picker';
import MultiImagePicker from 'react-native-image-crop-picker';
import DarkButton from '../../components/commonComponents/darkButton';
import Ic from 'react-native-vector-icons/FontAwesome5';
import {STATUS} from '../../constants/firebaseConstants';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SliderBox} from 'react-native-image-slider-box';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import ShareModal from '../shareModal/index';
import {postTimeAndReaction} from '../../utils/DateFuncs';
import {Alert} from 'react-native';
import PMPHeader from '../../components/common/PMPHeader';

const THRESHOLD = 100;
import CommentsView from './../../views/ComponentsNew/commentsView';

const {height: screenHeight, width: screenWidth} = Dimensions.get('window');

class ViewPost extends React.Component {
  // modal = React.createRef();

  static navigationOptions = {
    headerShown: false,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);

    this.state = {
      ref: null,
      storyDescription: '',
      images: [],
      imageError: false,
      imageViewer: false,
      loading: true,
      loadingPets: true,
      postId: '',
      loadingSuggested: true,
      stories: [],
      st: [],
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
        this.props.user === null
          ? null
          : this?.props?.user?.user_data.avatar,
      reaction: {
        Like:
          'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/like.gif',
        Love:
          'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/love.gif',
        HaHa:
          'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/haha.gif',
        Wow:
          'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/wow.gif',
        Sad:
          'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/sad.gif',
        Angry:
          'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/angry.gif',
      },
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      postIndex: null,
      start: false,
      isRefreshing: false,
      feelingsData: [
        {emoji: 'blush', text: 'happy'},
        {emoji: 'heart_eyes', text: 'loved'},
        {emoji: 'pensive', text: 'sad'},
        {emoji: 'confused', text: 'confused'},
        {emoji: 'smiley', text: 'funny'},
        {emoji: 'angry', text: 'angry'},
        {emoji: 'confused', text: 'confused'},
        {emoji: 'broken_heart', text: 'broken'},
        {emoji: 'expressionless', text: 'expressionless'},
        {emoji: 'tired_face', text: 'tired'},
        {emoji: 'sleeping', text: 'sleepy'},
        {emoji: 'innocent', text: 'blessed'},
        {emoji: 'exploding_head', text: 'socked'},
        {emoji: 'smirk', text: 'smirk'},
      ],
      scrollViewWidth: 0,
      currentXOffset: 0,
      modalVisible: false,
      viewerContent: {
        reaction: {},
      },
      shareModalVisible: false,
    };
  }

  componentDidMount() {
    this.getAccessToken().then(TOKEN => {
      this.setState({
        token: JSON.parse(TOKEN).access_token,
        user_id: JSON.parse(TOKEN).user_id,
      });
      this.FetchPost('get-post-data');
      console.log('props', this.props.navigation.getParam('item'));
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
    this.getAccessToken().then(TOKEN => {
      this.setState({
        token: JSON.parse(TOKEN).access_token,
        user_id: JSON.parse(TOKEN).user_id,
      });
    });
  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  async FetchPost(type) {
    this.getAccessToken().then(async token => {


      const data = new FormData();
      data.append('server_key', server_key);
      data.append('fetch', 'post_data');
      data.append('post_id', this.props.POST_ID);
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
       
      } catch (error) {
        console.log(error);
        Alert.alert(
          '',
          'Fail to fetch post!',
          [{text: 'OK', onPress: () => this.goBack()}],
          {cancelable: false},
        );
        this.setState({loadingPets: true});
      }
    });
  }

  goBack = () => {
    this.props.navigation.pop();
  };

  renderItemCard = ({item, index}) => {
    const {newsFeed, reaction} = this.state;
    let {time, feeling} = postTimeAndReaction(item.time);
    let {time: originalTime, feeling: originalFeeling} = postTimeAndReaction(
      item.shared_info && item.shared_info.time,
    );
    let photoList = [];
    let fileList = [];
    if (item?.photo_pixxy?.length > 0) {
      item.photo_pixxy.forEach(i => {
        photoList.push(i.image);
      });
    } else if (item?.photo_multi?.length > 0) {
      item.photo_multi.forEach(i => {
        photoList.push(i.image);
      });
    } else if (item.postPhoto) {
      photoList.push(item.postPhoto);
    } else if (
      item?.postFile_full?.includes('jpeg') ||
      item?.postFile_full?.includes('jpg') ||
      item?.postFile_full?.includes('gif') ||
      item?.postFile_full?.includes('png')
    ) {
      photoList.push(item.postFile_full);
    }
    return item.shared_info ? (
      <View
      key={index}
        style={{
          backgroundColor: 'white',
          marginBottom: 6,
          borderTopColor: '#ffff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,

          elevation: 9,
        }}>
        <View
          style={{
            paddingVertical: RFValue(10),
            paddingHorizontal: wp(4),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                marginRight: RFValue(8),
                overflow: 'hidden',
                borderRadius: wp(3),
              }}
              onPress={() => {
                if (item.user_id == this?.props?.user?.user_data.user_id) {
                  this.props.navigation.navigate('UserProfile');
                } else {
                  this.props.navigation.navigate({
                    routeName: 'Profile',
                    key: 'Profile',
                    params: {user_id: item.user_id},
                  });
                }
              }}>
              <Thumbnail
                square
                source={{uri: ""+ item.publisher.avatar}}
                style={{backgroundColor: '#F2F2F2'}}
              />
            </TouchableOpacity>
            <View style={{marginLeft: RFValue(10)}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: RFValue(16),
                    fontFamily: THEME_FONT,
                    fontWeight: 'bold',
                  }}>
                  {item.publisher.name}
                </Text>
                <>
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      fontFamily: THEME_FONT,
                      color: 'grey',
                      marginLeft: RFValue(5),
                    }}>
                    shared a post
                  </Text>
                </>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <IonicIcon name="md-earth" size={15} style={{marginRight: 3}} /> */}
                <Text style={{fontSize: RFValue(10), fontFamily: THEME_FONT}}>
                  {time}
                </Text>
              </View>
            </View>
          </View>
          <View style={{marginLeft: RFValue(70)}}>
            {item.postText ? (
              <HTML
                baseFontStyle={{fontSize: RFValue(14)}}
                html={item.postText}
              />
            ) : null}
          </View>

          <View
            style={{
              borderRadius: 5,
              padding: 10,
              marginTop: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  marginRight: RFValue(8),
                  overflow: 'hidden',
                  borderRadius: wp(3),
                }}
                onPress={() => {
                  if (
                    item.shared_info.user_id ==
                    this?.props?.user?.user_data.user_id
                  ) {
                    this.props.navigation.navigate('UserProfile');
                  } else if (item.shared_info.user_id == '0') {
                    this.props.navigation.navigate({
                      routeName: 'Page',
                      key: 'Page',
                      params: {page: item.publisher},
                    });
                  } else {
                    this.props.navigation.navigate({
                      routeName: 'Profile',
                      key: 'Profile',
                      params: {user_id: item.shared_info.user_id},
                    });
                  }
                }}>
                <Thumbnail
                  square
                  source={{uri: ""+ item.shared_info.publisher.avatar}}
                  style={{backgroundColor: '#F2F2F2'}}
                />
              </TouchableOpacity>
              <View style={{marginLeft: RFValue(10)}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: RFValue(16), fontFamily: THEME_FONT}}>
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: RFValue(10), fontFamily: THEME_FONT}}>
                    {originalTime}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{marginLeft: RFValue(70)}}>
              {item?.shared_info?.postText ? (
                <HTML
                  baseFontStyle={{fontSize: RFValue(14)}}
                  html={item.shared_info.postText}
                />
              ) : null}
            </View>

            <View
              style={{
                marginLeft: RFValue(70),
                marginTop: RFValue(5),
                borderBottomColor: '#F2F2F2',
                borderBottomWidth: 1,
              }}>
              {photoList.length > 0 ? (
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      modalVisible: true,
                      viewerContent: {
                        photos: photoList,
                        index,
                        isPost: true,
                        ...item,
                      },
                    })
                  }>
                  <View>
                    <SliderBox images={photoList} />
                  </View>
                </TouchableWithoutFeedback>
              ) : null}
              {item?.postFile_full?.includes('.mp4') ||
              item?.postFile_full?.includes('.mp3') ? (
                <VideoPlayer
                  disableFullscreen={true}
                  disableBack={true}
                  seekColor={HEADER}
                  paused={true}
                  tapAnywhereToPause={true}
                  source={{uri: ""+ item.postFile_full}}
                  style={{
                    flex: 1,
                    width: '100%',
                    height: 250,
                    alignSelf: 'center',
                    backgroundColor: 'black',
                  }}
                />
              ) : null}
              {item.reactionVisible ? this.reactions(item, index) : null}
            </View>
          </View>
          <View style={{marginLeft: wp(4)}}>
            <View
              style={{
                flex: 1,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: wp(35),
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Button
                  onPress={
                    item.reaction.is_reacted
                      ? () => {
                          item.reaction.is_reacted = false;
                          item.reaction.count = item.reaction.count - 1;
                          item.reaction.type = '';
                          this.setState(
                            {newsFeed},
                            // () => this.requestHandlerPostReaction("post-actions", '', item)
                          );
                        }
                      : () => {
                          item.reaction.count = item.reaction.count + 1;
                          item.reaction.type = 'Like';
                          item.reaction.is_reacted = true;
                          this.setState({newsFeed}, () =>
                            this.requestHandlerPostReaction(
                              'post-actions',
                              'Like',
                              item,
                            ),
                          );
                        }
                  }
                  onLongPress={() => {
                    newsFeed[index].reactionVisible = true;
                    this.setState({newsFeed});
                  }}
                  onPressOut={() => {
                    newsFeed[index].reactionVisible = false;
                  }}
                  transparent>
                  {item.reaction.is_reacted ? (
                    <FastImage
                      style={styles.imgIcon1}
                      source={{
                        uri: reaction[item.reaction.type],
                      }}
                    />
                  ) : (
                    <IonicIcon name="heart-outline" color="#424242" size={20} />
                  )}
                  <Text
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                    style={{
                      fontSize: RFValue(12),
                      fontFamily: THEME_FONT,
                      textAlign: 'center',
                     
                    }}>
                    {' ' + item.reaction.count}
                  </Text>
                </Button>
                <View
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    height: hp(4),
                    justifyContent: 'center',
                  }}>
                  <Button
                    style={{
                      alignSelf: 'center',
                      backgroundColor: '#FDEDEE',
                      paddingHorizontal: 15,
                    }}
                    onPress={() => {
                      this.setState(
                        {postIndex: index},
                        //   this.props.onCommentDataChange(item.get_post_comments, item),
                        this.props.commentOpen(),
                      );
                    }}
                    //onPress={() => { this.onOpen()}}
                    transparent>
                    <MIcon name="comment-outline" color="#424242" size={20} />
                    <Text
                      adjustsFontSizeToFit
                      minimumFontScale={0.5}
                      style={{fontSize: RFValue(12), fontFamily: THEME_FONT}}>
                      {' ' + item.post_comments}
                    </Text>
                  </Button>
                </View>
              </View>
              <Button
                transparent
                onPress={() =>
                  this.setState({
                    shareModalVisible: true,
                    viewerContent: {
                      index,
                      ...item,
                    },
                  })
                }>
                <IonicIcon
                  name="md-share-social-outline"
                  color="#424242"
                  size={20}
                />
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                  style={{
                    fontSize: RFValue(12),
                    fontFamily: THEME_FONT,
                    textAlign: 'center',
                  }}>
                  {' ' + item.post_shares}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    ) : (
      <View
      key={index}
        style={{
          backgroundColor: 'white',
          marginBottom: 6,
          borderTopColor: '#ffff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,

          elevation: 9,
        }}>
        <View
          style={{
            paddingVertical: RFValue(10),
            paddingHorizontal: wp(4),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                marginRight: RFValue(8),
                overflow: 'hidden',
                borderRadius: wp(3),
              }}
              onPress={() => {
                if (item.user_id == this?.props?.user?.user_data.user_id) {
                  this.props.navigation.navigate('UserProfile');
                } else {
                  this.props.navigation.navigate({
                    routeName: 'Profile',
                    key: 'Profile',
                    params: {user_id: item.user_id},
                  });
                }
              }}>
              <Thumbnail
                square
                source={{uri: ""+ item.publisher.avatar}}
                style={{backgroundColor: '#F2F2F2'}}
              />
            </TouchableOpacity>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: RFValue(16),
                    fontFamily: THEME_FONT,
                    fontWeight: 'bold',
                  }}>
                  {item.publisher.name}
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
                      {feeling} {item.postFeeling}
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <IonicIcon name="md-earth" size={15} style={{marginRight: 3}} /> */}
                <Text style={{fontSize: RFValue(10), fontFamily: THEME_FONT}}>
                  {time}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5,
            }}>
            {item.postText ? (
              <HTML
                baseFontStyle={{
                  fontSize: 14,
                  flex: 8,
                  flexWrap: 'wrap',
                  fontWeight: 'normal',
                  color: '#465575',
                }}
                html={item.postText}
              />
            ) : null}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '100%', borderRadius: 13, overflow: 'hidden'}}>
              {photoList.length > 0 ? (
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      modalVisible: true,
                      viewerContent: {
                        photos: photoList,
                        index,
                        isPost: true,
                        ...item,
                      },
                    })
                  }>
                  <View>
                    <SliderBox images={photoList} />
                  </View>
                </TouchableWithoutFeedback>
              ) : null}
            {item.postFile_full.includes('.mp4') ||
              item?.postFile_full?.includes('.mp3') ? (
                <VideoPlayer
                  disableFullscreen={true}
                  disableBack={true}
                  seekColor={HEADER}
                  paused={true}
                  tapAnywhereToPause={true}
                  source={{uri: ""+ item.postFile_full}}
                  style={{
                    flex: 1,
                    width: '100%',
                    height: 250,
                    alignSelf: 'center',
                    backgroundColor: 'black',
                  }}
                />
              ) : null}
              {item.reactionVisible ? this.reactions(item, index) : null}
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                flex: 1,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: wp(35),
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Button
                  onPress={
                    item.reaction.is_reacted
                      ? () => {
                          item.reaction.is_reacted = false;
                          item.reaction.count = item.reaction.count - 1;
                          item.reaction.type = '';
                          this.setState(
                            {newsFeed},
                            // () => this.requestHandlerPostReaction("post-actions", '', item)
                          );
                        }
                      : () => {
                          item.reaction.count = item.reaction.count + 1;
                          item.reaction.type = 'Like';
                          item.reaction.is_reacted = true;
                          this.setState({newsFeed}, () =>
                            this.requestHandlerPostReaction(
                              'post-actions',
                              'Like',
                              item,
                            ),
                          );
                        }
                  }
                  onLongPress={() => {
                    newsFeed[index].reactionVisible = true;
                    this.setState({newsFeed});
                  }}
                  onPressOut={() => {
                    newsFeed[index].reactionVisible = false;
                  }}
                  transparent>
                  {item.reaction.is_reacted ? (
                    <FastImage
                      style={styles.imgIcon1}
                      source={{
                        uri: reaction[item.reaction.type],
                      }}
                    />
                  ) : (
                    <IonicIcon name="heart-outline" color="#424242" size={20} />
                  )}
                  <Text
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                    style={{
                      fontSize: RFValue(12),
                      fontFamily: THEME_FONT,
                      textAlign: 'center',
                      
                    }}>
                    {' ' + item.reaction.count}
                  </Text>
                </Button>
                <View
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    height: hp(4),
                    justifyContent: 'center',
                  }}>
                  <Button
                    style={{
                      alignSelf: 'center',
                      backgroundColor: '#FDEDEE',
                      paddingHorizontal: 15,
                    }}
                    onPress={() => {
                      this.setState(
                        {postIndex: index},
                        //   this.props.onCommentDataChange(item.get_post_comments, item),
                        this.props.commentOpen(),
                      );
                    }}
                    //onPress={() => { this.onOpen()}}
                    transparent>
                    <MIcon name="comment-outline" color="#F596A0" size={20} />
                    <Text
                      adjustsFontSizeToFit
                      minimumFontScale={0.5}
                      style={{
                        fontSize: RFValue(12),
                        color: '#F596A0',
                        fontFamily: THEME_FONT,
                      }}>
                      {' ' + item.post_comments}
                    </Text>
                  </Button>
                </View>
              </View>
              <Button
                transparent
                onPress={() =>
                  this.setState({
                    shareModalVisible: true,
                    viewerContent: {
                      index,
                      ...item,
                    },
                  })
                }>
                <IonicIcon
                  name="md-share-social-outline"
                  color="#424242"
                  size={20}
                />
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                  style={{
                    fontSize: RFValue(12),
                    fontFamily: THEME_FONT,
                    textAlign: 'center',
                  }}>
                  {' ' + item.post_shares}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    );
  };

  async requestHandlerPostReaction(type, reaction, post) {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('post_id', this.props.ID);
    data.append('action', 'reaction');
    data.append('reaction', reaction);
    try {
      const response = await fetch(
        SERVER +
          requestRoutes[type].route +
          '?access_token=' +
          this.state.token,
        {
          method: requestRoutes[type].method,
          body: data,
          headers: {},
        },
      );
      const responseJson = await response.json();
      if (responseJson.api_status === 200) {
        //this.setState({})
      } else {
        //this.setState({});
      }
    } catch (error) {
      console.log(error);
    }
  }

  reactions = (item, index) => {
    const {newsFeed} = this.state;
    const scope = this;
    setTimeout(function() {
      (newsFeed[index].reactionVisible = false), scope.setState({newsFeed});
    }, 10000);

    return (
      <View
        style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity
          onPress={() => {
            newsFeed[index].reaction.is_reacted
              ? (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count)
              : (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count + 1);
            newsFeed[index].reactionVisible = false;
            newsFeed[index].reaction.type = 'Like';
            newsFeed[index].reaction.is_reacted = true;
            this.setState({newsFeed}, () =>
              this.requestHandlerPostReaction(
                'post-actions',
                item.reaction.type,
                item,
              ),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/like.gif',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            newsFeed[index].reaction.is_reacted
              ? (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count)
              : (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count + 1);
            newsFeed[index].reactionVisible = false;
            newsFeed[index].reaction.type = 'Love';
            newsFeed[index].reaction.is_reacted = true;
            this.setState({newsFeed}, () =>
              this.requestHandlerPostReaction(
                'post-actions',
                item.reaction.type,
                item,
              ),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/love.gif',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            newsFeed[index].reaction.is_reacted
              ? (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count)
              : (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count + 1);
            newsFeed[index].reactionVisible = false;
            newsFeed[index].reaction.type = 'HaHa';
            newsFeed[index].reaction.is_reacted = true;
            this.setState({newsFeed}, () =>
              this.requestHandlerPostReaction(
                'post-actions',
                item.reaction.type,
                item,
              ),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/haha.gif',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            newsFeed[index].reaction.is_reacted
              ? (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count)
              : (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count + 1);
            newsFeed[index].reactionVisible = false;
            newsFeed[index].reaction.type = 'Wow';
            newsFeed[index].reaction.is_reacted = true;
            this.setState({newsFeed}, () =>
              this.requestHandlerPostReaction(
                'post-actions',
                item.reaction.type,
                item,
              ),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/wow.gif',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            newsFeed[index].reaction.is_reacted
              ? (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count)
              : (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count + 1);
            newsFeed[index].reactionVisible = false;
            newsFeed[index].reaction.type = 'Sad';
            newsFeed[index].reaction.is_reacted = true;
            this.setState({newsFeed}, () =>
              this.requestHandlerPostReaction(
                'post-actions',
                item.reaction.type,
                item,
              ),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/sad.gif',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            newsFeed[index].reaction.is_reacted
              ? (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count)
              : (newsFeed[index].reaction.count =
                  newsFeed[index].reaction.count + 1);
            newsFeed[index].reactionVisible = false;
            newsFeed[index].reaction.type = 'Angry';
            newsFeed[index].reaction.is_reacted = true;
            this.setState({newsFeed}, () =>
              this.requestHandlerPostReaction(
                'post-actions',
                item.reaction.type,
                item,
              ),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/angry.gif',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  getFeelingIcon = value => {
    let e = this.state.feelingsData.filter(e => e.text === value);
    if (e.length === 0) return '';
    else return e[0].emoji;
  };

  onRefresh = () => {
    this.setState(
      {
        isRefreshing: true,
        newsFeed: [],
        loadingNewsFeed: true,
        more: false,
        suggested: [{}, {}, {}, {}],
      },
      () => {
        this.requestHandlerNewsFeed('get_news_feed_posts').then(() => {
          this.setState({isRefreshing: false});
          // this.requestHandlerFriendSuggestion('get-friend-suggestion');
          this.requestHandlerFetchUserPets('get-user-pets');
          this.fetchStories('get-user-stories');
        });
      },
    );
  };
  updateState = state => {
    this.setState(state);
  };
  render() {
    const {loadingPets, newsFeed, imageViewer} = this.state;
    return (
      <>
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
          images={this.state.st}
          imageIndex={0}
          visible={imageViewer}
          FooterComponent={({imageIndex}) => (
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
          onRequestClose={() => this.setState({imageViewer: false})}
        />
        <Container style={styles.container}>
          <PMPHeader
            centerText={'Post'}
            ImageLeftIcon={'arrow-back'}
            LeftPress={() => this.goBack()}
          />
          {loadingPets ? (
            <ActivityIndicator
              size={'large'}
              color={HEADER}
              style={{flex: 1, justifyContent: 'center'}}
            />
          ) : (
            <FlatList
              ref={ref => {
                this.flatListRef = ref;
              }}
              // style={{paddingHorizontal: 10}}
              disableVirtualization={true}
              scrollEnabled={true}
              horizontal={false}
              data={newsFeed}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItemCard}
            />
          )}
        </Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  workspace: state.user.workspace,
  ID: state.post.id,
});

const mapDispatchToProps = dispatch => ({
  saveLoginUser: user => dispatch(userEdit(user)),
  saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
  savePets: pets => dispatch(savePets(pets)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewPost);
