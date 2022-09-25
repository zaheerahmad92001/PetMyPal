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
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {THEME_BOLD_FONT, THEME_FONT} from '../../constants/fontFamily';
import {SERVER, server_key} from '../../constants/server';
import {ACCESS_TOKEN} from '../../constants/storageKeys';
import requestRoutes from '../../utils/requestRoutes';
import AsyncStorage from '@react-native-community/async-storage';
import {HEADER, TEXT_DARK} from '../../constants/colors';
// import { Modalize } from 'react-native-modalize';
import OneSignal from 'react-native-onesignal';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import PMP from '../../lib/model/pmp';
import NavigationService from '../../presentation/ControlPanel/NavigationService';
import FastImage from 'react-native-fast-image';
import DarkButton from '../../components/commonComponents/darkButton';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import Emoji from 'react-native-emoji';
import HTML from 'react-native-render-html';
import ImageView from 'react-native-image-viewing';
import BackIcon from 'react-native-vector-icons/Ionicons';
import MyIcon from 'react-native-vector-icons/FontAwesome5';
import {commonState } from '../../components/common/CommomState';
import { ShortAboutParseHtml } from '../../components/helpers';
const THRESHOLD = 100;

const {height: screenHeight, width: screenWidth} = Dimensions.get('window');

class GroupEditView extends React.Component {
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
      loading: true,
      loadingPets: false,
      imageViewer: false,
      joining: false,
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

      reaction: commonState.reaction,
      months: commonState.months,
      postIndex: 0,
      start: false,
      isRefreshing: false,
      feelingsData: commonState.feelingsData,
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

  onReceived(notification) {
  }

  onOpened(openResult) {
  }

  onIds(device) {
  }
  componentDidMount() {
    this.setState({
      group: this.props.navigation.getParam('group'),
      loading: false,
    });
    this.getAccessToken()
      .then(TOKEN => {
        this.setState({token: JSON.parse(TOKEN).access_token});
      })
      .then(() => {
        this.requestHandlerNewsFeed('get_news_feed_posts');
        this.requestHandlerFetchUser('get-user-data');
      });
  }
  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  async requestHandlerFetchUser(type) {
    this.getAccessToken().then(async token => {

      const data = new FormData();
      data.append('server_key', server_key);
      data.append('user_id', this.props.navigation.getParam('user_id'));
      data.append('fetch', 'user_data,family,liked_pages,joined_groups');

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
          //   this.props.saveLoginUser({...responseJson});
          this.setState({loading: false, user: responseJson.user_data});
        } else {
          this.setState({loading: true});
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  async requestHandlerFetchUserPets(type) {
    this.getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
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
          let arr = this.state.pets;
          arr = arr.concat(responseJson.pets);
          this.setState({pets: arr, loadingPets: false});
        } else {
          PMP.logout().then(function() {
            alert('Session Expired. Please Login to continue again');
            NavigationService.navigate('AuthNavigator');
            // NavigationService.navigate('AccountRecovery');
          });
          this.setState({pets: [], loadingPets: true});
        }
      } catch (error) {
        this.setState({pets: [], loadingPets: true});
        console.log(error);
      }
    });
  }

  async requestHandlerFriendSuggestion(type) {
    this.getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('limit', 4);
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
          this.setState({
            suggested: responseJson.friends,
            loadingSuggested: false,
          });
        } else {
          this.setState({suggested: [], loadingSuggested: true});
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  async requestHandlerPostReaction(type, reaction, post) {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('post_id', post.post_id);
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
  async requestHandlerNewsFeed(type) {
    this.getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', 'get_user_posts');
      data.append('limit', 8);
      data.append('id', this.props.navigation.getParam('group').user_id);
      this.state.more
        ? data.append(
            'after_post_id',
            this.state.newsFeed[this.state.newsFeed.length - 1].post_id,
          )
        : null;
      let result = [];
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
          responseJson.data.forEach(element => {
            element = {...element, reactionVisible: false};
            result.push(element);
          });
          let arr = this.state.newsFeed;
          arr = arr.concat(result);
          this.setState({newsFeed: arr, loadingNewsFeed: false, more: false});
        } else {
          this.setState({newsFeed: [], loadingNewsFeed: true, more: false});
        }
      } catch (error) {
        console.log(error);
        alert('Network Error');
      }
    });
  }
  async requestHandlerJoinGroup(type) {
    this.setState({joining: true});
    this.getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('group_id', this.state.group.id);

      console.log(
        SERVER +
          requestRoutes[type].route +
          '?access_token=' +
          this.state.token,
        data,
      );
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
          this.setState({joining: false});
          // window.location.reload(false);
        } else {
          this.setState({joining: false});
        }
      } catch (error) {
        console.log(error);
        alert('Network Error');
        this.setState({joining: false});
      }
    });
  }

  goBack = () => {
    this.props.navigation.pop();
  };
  renderItem = ({item}) => {
    return (
      <View style={{marginHorizontal: RFValue(7)}}>
        <TouchableOpacity>
          <Thumbnail
            source={{uri: ""+ item.avatar}}
            style={{backgroundColor: '#F2F2F2', alignSelf: 'center'}}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: RFValue(12),
              fontFamily: THEME_FONT,
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  renderItemPets = ({item, index}) => {
    return (
      <View style={{marginHorizontal: RFValue(7)}}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate({
              routeName: 'PetProfile',
              key: 'PetProfile',
              params: {item},
            });
          }}>
          <Thumbnail
            //   small={true}
            source={{uri: ""+ item.avatar}}
            style={{backgroundColor: '#F2F2F2', alignSelf: 'center'}}
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
    const {newsFeed} = this.state;
    const scope = this;
    setTimeout(function() {
      (newsFeed[index].reactionVisible = false), scope.setState({newsFeed});
    }, 4000);

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

  renderItemCard = ({item, index}) => {
    const {newsFeed, reaction, months} = this.state;
    let time = '';
    let feeling = '';
    const scope = this;
    let unixTime = parseInt(item.time);
    let postDate = new Date(unixTime * 1000);
    let currentDate = new Date();
    if (postDate.getDate() === currentDate.getDate()) {
      feeling = 'is feeling';
      if (postDate.getHours() === currentDate.getHours()) {
        let min = currentDate.getMinutes() - postDate.getMinutes();
        if (min === 0) {
          time = 'Just now';
        } else {
          time = min + ' min ago';
        }
      } else if (currentDate.getHours() - postDate.getHours() <= 12) {
        time = currentDate.getHours() - postDate.getHours() + ' hr ago';
      }
    } else {
      feeling = 'was feeling';
      let year = postDate.getFullYear();
      let month = months[postDate.getMonth()];
      let date = postDate.getDate();
      if (currentDate.getFullYear === postDate.getFullYear) {
        time = `${date} ${month} at ${postDate.toLocaleTimeString()}`;
      } else {
        time = `${date} ${month} ${year} ${postDate.toLocaleTimeString()}`;
      }
    }

    if (
      item.postFile.includes('jpeg') ||
      item.postFile.includes('jpg') ||
      item.postFile.includes('gif') ||
      item.postFile.includes('png')
    ) {
      return (
        <Card  key={index}>
          <CardItem>
            <Left>
              <Thumbnail
                source={{uri: ""+ item.publisher.avatar}}
                style={{backgroundColor: '#F2F2F2'}}
              />
              <Body>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: RFValue(16), fontFamily: THEME_FONT}}>
                    {item.publisher.name}
                  </Text>
                </View>
                {item.postFeeling ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        fontFamily: THEME_FONT,
                        color: 'grey',
                      }}>
                      {feeling}{item.postFeeling}
                    </Text>
                    <Emoji
                      name={this.getFeelingIcon(item.postFeeling)}
                      style={{
                        fontSize: 16,
                        marginLeft: 5,
                      }}
                    />
                  </View>
                ) : null}
                <Text
                  style={{fontSize: RFValue(10), fontFamily: THEME_FONT}}
                  note>
                  {time}
                </Text>
              </Body>
            </Left>
          </CardItem>
          <View
            style={{
              paddingVertical: RFValue(5),
              paddingHorizontal: RFValue(20),
              fontSize: RFValue(14),
              fontFamily: THEME_FONT,
            }}>
            {item.postText ? <HTML html={item.postText} /> : null}
          </View>
          <TouchableOpacity
            onPress={() =>
              this.setState({img: [{uri: item.postFile}], imageViewer: true})
            }>
            <CardItem cardBody>
              {item.postFileName === 'photo.jpg' ? (
                <Image
                  source={{uri: ""+ item.postFile}}
                  style={{
                    height: 200,
                    width: null,
                    flex: 1,
                    backgroundColor: '#F2F2F2',
                  }}
                />
              ) : null}
            </CardItem>
          </TouchableOpacity>
          {item.reactionVisible ? this.reactions(item, index) : null}
          <CardItem>
            <Left style={{justifyContent: 'flex-start'}}>
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
                  <Icon name="thumbs-up" />
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
            </Left>
            <Body style={{flex: 1.5}}>
              <Button
                style={{alignSelf: 'center'}}
                onPress={() => {
                  // this.setState(
                  //   {postIndex: index},
                  //   this.props.onCommentDataChange(
                  //     item.get_post_comments,
                  //     item,
                  //   ),
                  //   this.props.commentOpen(),
                  // );
                }}
                //onPress={() => { this.onOpen()}}
                transparent>
                <Icon name="chatbubbles" />
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                  style={{fontSize: RFValue(12), fontFamily: THEME_FONT}}>
                  {' ' + item.post_comments}
                </Text>
              </Button>
            </Body>
            <Right style={{justifyContent: 'flex-end'}}>
              <Button transparent>
                <Icon name="share" />
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
            </Right>
          </CardItem>
        </Card>
      );
    } else {
      return (
        <Card  key={index}>
          <CardItem>
            <Left>
              <Thumbnail
                source={{uri: ""+ item.publisher.avatar}}
                style={{backgroundColor: '#F2F2F2'}}
              />
              <Body>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: RFValue(16), fontFamily: THEME_FONT}}>
                    {item.publisher.name}
                  </Text>
                </View>
                {item.postFeeling ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        fontFamily: THEME_FONT,

                        color: 'grey',
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
                  </View>
                ) : null}
                <Text
                  style={{fontSize: RFValue(10), fontFamily: THEME_FONT}}
                  note>
                  {time}
                </Text>
              </Body>
            </Left>
          </CardItem>
          <View
            style={{
              paddingVertical: RFValue(5),
              paddingHorizontal: RFValue(20),
              fontSize: RFValue(14),
              fontFamily: THEME_FONT,
            }}>
            {item.postText ? <HTML html={item.postText} /> : null}
          </View>
          {item.postFileName === 'video.mp4' ? (
            <VideoPlayer
              disableFullscreen={true}
              disableBack={true}
              seekColor={HEADER}
              paused={true}
              tapAnywhereToPause={true}
              source={{uri: ""+ item.postFile}}
              style={{
                flex: 1,
                width: screenWidth,
                height: 250,
                alignSelf: 'center',
                backgroundColor: 'black',
              }}
              //onLoad={() => { this._video.seek(2) }}
              ref={ref => {
                this.player = ref;
              }}
              //poster={{uri:"http://placehold.it/200x200?text=2"}}
            />
          ) : null}
          {item.reactionVisible ? this.reactions(item, index) : null}
          <CardItem>
            <Left style={{justifyContent: 'flex-start'}}>
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
                  <Icon name="thumbs-up" />
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
            </Left>
            <Body style={{flex: 1.5}}>
              <Button
                style={{alignSelf: 'center'}}
                onPress={() => {
                  // this.setState(
                  //   {postIndex: index},
                  //   this.props.onCommentDataChange(
                  //     item.get_post_comments,
                  //     item,
                  //   ),
                  //   this.props.commentOpen(),
                  // );
                }}
                //onPress={() => { this.onOpen()}}
                transparent>
                <Icon name="chatbubbles" />
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                  style={{fontSize: RFValue(12), fontFamily: THEME_FONT}}>
                  {' ' + item.post_comments}
                </Text>
              </Button>
            </Body>
            <Right style={{justifyContent: 'flex-end'}}>
              <Button transparent>
                <Icon name="share" />
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
            </Right>
          </CardItem>
        </Card>
      );
    }
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
        });
        this.requestHandlerFriendSuggestion('get-friend-suggestion');
      },
    );
  };

  render() {
    const {
      suggested,
      pets,
      loading,
      loadingPets,
      loadingSuggested,
      newsFeed,
      imageViewer,
      loadingNewsFeed,
      visible,
      more,
      img,
      userProfilePic,
    } = this.state;
    return (
      <Container style={styles.container}>
        <ImageView
          images={img}
          imageIndex={0}
          visible={imageViewer}
          presentationStyle="overFullScreen"
          onRequestClose={() => this.setState({imageViewer: false})}
        />
        {loading && loadingPets && loadingSuggested ? (
          <PlaceholderLoader />
        ) : (
          <>
            <Content
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
                       this.distanceFromEnd = currentItemIndex+5
                     this.setState({more: true}, () => {
                    this.requestHandlerNewsFeed('get_news_feed_posts');
                  });
                }
              }
              }else{
                 this.distanceFromEnd = 4
              }
            }}
              nestedScrollEnabled={true}
              contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}}
              refreshControl={
                <RefreshControl
                  colors={[HEADER, '#9Bd35A', '#689F38']}
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => this.onRefresh()}
                />
              }>
              <View>
                <TouchableOpacity
                  onPress={this.goBack}
                  style={{
                    position: 'absolute',
                    zIndex: 500,
                    top: 266,
                    right: 15,
                    borderRadius: 100,
                    backgroundColor: TEXT_DARK,
                    width: 36,
                    height: 36,
                  }}>
                  <MyIcon
                    // type="FontAwesome"
                    name="pencil-alt"
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      marginTop: 8,
                      textAlign: 'center',
                    }}
                  />
                </TouchableOpacity>
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
                        style={{ fontSize: 30, color: 'white' }}
                      />
                  </TouchableOpacity>
                  <Image
                    style={styles.coverImg}
                    source={{
                      uri: this.state.group.cover
                        ? this.state.group.cover
                        : 'https://res.cloudinary.com/n4beel/image/upload/v1595058775/pattern_2_xhmx4n.png',
                      // : "https://www.searchenginejournal.com/wp-content/uploads/2018/07/The-Smart-Marketer%E2%80%99s-Guide-to-Google-Alerts-760x400.png"
                    }}
                  />
                </View>
                <View style={styles.profileImgContainer}>
                  <View style={styles.profileImgBox}>
                    <Image
                      style={styles.profileImg}
                      source={{
                        uri: this.state.group.avatar
                          ? this.state.group.avatar
                          : 'https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600134.jpg',
                      }}
                    />
                  </View>
                </View>

                <View style={styles.userDetails}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  />
                  <Text style={styles.description}>
                    {this.state.group.group_title}
                  </Text>
                  <Text style={{marginVertical: 10}}>
                    {ShortAboutParseHtml(this.state.group?.about)}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                {this.state.joining ? (
                  <ActivityIndicator
                    size={'large'}
                    color={HEADER}
                    style={{flex: 1, justifyContent: 'center'}}
                  />
                ) : this.state.group.is_joined === 'yes' ? (
                  <DarkButton
                    onPress={() => {
                      this.requestHandlerJoinGroup('join-group');
                    }}>
                    Leave Community
                  </DarkButton>
                ) : (
                  <DarkButton
                    onPress={() => {
                      this.requestHandlerJoinGroup('join-group');
                    }}>
                    Join
                  </DarkButton>
                )}
              </View>

              <View style={{flex: 1, marginHorizontal: RFValue(10)}}>
                {!loadingNewsFeed ? (
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
                ) : (
                  <PlaceholderLoader />
                )}
              </View>

              {more ? (
                <PlaceholderLoader down={true} />
              ) : newsFeed.length < 0 ? (
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
                    No Post Found
                  </Text>
                </View>
              ) : null}
            </Content>
          </>
        )}
      </Container>
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
)(GroupEditView);
