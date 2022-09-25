import React from 'react';
import {
  Platform,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import styles from './styles';
import {
  Container,
  Button,
  Left,
  Body,
  Right,
  Thumbnail,
  Icon,
} from 'native-base';
import { Picker } from '@react-native-picker/picker'; 
import { connect } from 'react-redux';
import { HEADER, BGCOLOR } from '../../constants/colors';
import PropTypes from 'prop-types';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import ImagePicker from 'react-native-image-picker';
import MultiImagePicker from 'react-native-image-crop-picker';
import PMPHeader from '../../components/common/PMPHeader';
import { RFValue } from 'react-native-responsive-fontsize';
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
import AsyncStorage from '@react-native-community/async-storage';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import requestRoutes from '../../utils/requestRoutes';
import VideoPlayer from 'react-native-video-controls';
import Emoji from 'react-native-emoji';
import { TouchableWithoutFeedback } from 'react-native';
import { Alert } from 'react-native';
import { commonState } from '../../components/common/CommomState';

const options = {
  title: 'Upload Image',
  chooseFromLibraryButtonTitle: 'Upload from gallery',
  takePhotoButtonTitle: 'Upload from camera',
  mediaType: 'photo',
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class StatusView extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      share_id: '',
      imageUri: '',
      statusText: '',
      publish: commonState.publish,
      postArray: [],
      videoCount: 0,
      requestCount: 0,
      saving: false,
      feelings: false,
      feelingValue: '',
      feelingEmoji: '',
      feelingsData: commonState.feelingsData,
    };
  }

  componentDidMount() { }

  goBack = () => {
    this.props.navigation.pop();
  };

  renderItem = ({ item, index }) => {
    return (
      <View style={{ marginHorizontal: RFValue(7) }}>
        <TouchableOpacity
          onPress={() => {
            this.removeItem(item, index);
          }}
          style={{
            paddingHorizontal: 10,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: HEADER,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: RFValue(18 - 2),
              fontFamily: THEME_FONT,
              textAlign: 'center',
              textAlignVertical: 'center',
            }}>
            {item.type}
          </Text>
          <Icon
            name={'close'}
            type="MaterialIcons"
            style={{
              fontSize: RFValue(18 - 2),
              color: '#222326',
              textAlign: 'center',
              textAlignVertical: 'center',
              paddingLeft: 10,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  onShareChange(value) {
    const { publish } = this.state;
    publish[0][value] = true;
    this.setState({ share_id: value });
  }

  uploadNewPhoto = () => {
    var scope = this;
    let postArray = this.state.postArray;

    ImagePicker.launchCamera(
      {
        mediaType: 'image',
        videoQuality: 'high',
        quality: 1,
      },
      response => {
        // Same code as in above section!

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          var uri = this.getFilePathForPlatform(response);
          postArray = postArray.concat({ uri });

          scope.setState({
            indicator: false,
            icon: 'check',
            title: 'Uploading',
            imageUri: uri,
            postArray,
          });
        }
      },
    );
  };

  uploadNewVideo = () => {
    var scope = this;
    let postArray = this.state.postArray;
    ImagePicker.launchCamera(
      {
        mediaType: 'video',
        videoQuality: 'high',
        quality: 1,
      },
      response => {
        // Same code as in above section!

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          var uri = this.getFilePathForPlatform(response);
          postArray = postArray.concat({ uri });
          scope.setState({
            indicator: false,
            icon: 'check',
            title: 'Uploading',
            imageUri: uri,
            videoCount: 1,
            postArray,
          });
        }
      },
    );
  };

  uploadGalleryPhoto = async () => {
    let postArray = this.state.postArray;
    const images = await MultiImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    });
    images.forEach(i => postArray.push({ uri: i.path }));
    this.setState({
      postArray,
    });
  };

  getFilePathForPlatform = response => {
    if (Platform.OS === 'ios') {
      return response.uri;
    } else {
      return response.path && 'file://' + response.path;
    }
  };

  async requestHandlerSharePost(type, id) {
    let URL = SERVER + '/posts?access_token=';
    let data = new FormData();

    this.getAccessToken()
      .then(token => {
        URL = URL + JSON.parse(token).access_token;
        data.append('server_key', server_key);
        data.append('type', type);
        data.append('user_id', JSON.parse(token).user_id);
        data.append('id', id);
        // type share_post_on_timeline
        // id 204
      })
      .then(async () => {
        return fetch(URL, {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(response => response.json())
          .then(json => {
            this.setState({ saving: false });

            if (json.api_status === 200) {
              this.props.saveWorkSpace({ ...{ show: true, updateNewsFeed: true } });
              this.props.navigation.pop();
            } else {
              console.log('FAIL', json);
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
  }

  async requestHandlerCreatePost(type) {
    this.setState({ saving: true });
    const scope = this;
    const {
      statusText,
      imageUri,
      postArray,
      feelingValue,
      feelingEmoji,
    } = this.state;
    const URL = SERVER + '/app_api.php?application=phone&type=new_post';
    let data = new FormData();
    var photo = {};

    this.getAccessToken()
      .then(token => {
        if (postArray.length === 1) {
          if (
            postArray[0].uri.includes('jpeg') ||
            postArray[0].uri.includes('jpg') ||
            postArray[0].uri.includes('gif') ||
            postArray[0].uri.includes('png')
          ) {
            photo = {
              uri: imageUri,
              type: 'image/jpeg',
              name: 'photo.jpg',
            };
            data.append('postFile', photo);
          } else {
            photo = {
              name: 'video.mp4',
              uri: imageUri,
              type: 'video/mp4',
            };
            data.append('postVideo', photo);
          }
        } else {
          postArray.forEach((item, i) => {
            if (
              item.uri.includes('jpeg') ||
              item.uri.includes('jpg') ||
              item.uri.includes('gif') ||
              item.uri.includes('png')
            ) {
              data.append('postPhotos[]', {
                uri: item.uri,
                type: 'image/jpeg',
                name: `filename${i}.jpg`,
              });
            } else {
              if (this.state.requestCount === 0) {
                scope.setState({ requestCount: 1 });
                photo = {
                  name: 'video.mp4',
                  uri: imageUri,
                  type: 'video/mp4',
                };
                data.append('postVideo', photo);
              } else {
                Alert.alert('', 'You can upload more than one video');
              }
            }
          });
        }
        data.append('feeling_type', 'feelings');
        data.append('feeling', feelingValue);
        data.append('postText', statusText);
        data.append('user_id', JSON.parse(token).user_id);
        {
          this.props.navigation.getParam('page_id')
            ? data.append('page_id', this.props.navigation.getParam('page_id'))
            : null;
        }
        {
          this.props.navigation.getParam('group_id')
            ? data.append(
              'group_id',
              this.props.navigation.getParam('group_id'),
            )
            : null;
        }
        {
          this.props.navigation.getParam('pet_id')
            ? data.append('pet_id', this.props.navigation.getParam('pet_id'))
            : null;
        }
        data.append('s', JSON.parse(token).access_token);
        data.append('server_key', server_key);

      })
      .then(async () => {
        return fetch(URL, {
          method: requestRoutes[type].method,
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(response => response.json())
          .then(json => {
            this.setState({ saving: false });

            if (json.api_status === '200') {
              this.props.saveWorkSpace({ ...{ show: true, updateNewsFeed: true } });
              this.props.navigation.pop();
            } else {
              alert('Failed to Post. Try again');
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
  }
  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  removeImg = uri => {
    let newImgs = this.state.postArray;
    let postArray = newImgs.filter(i => i.uri !== uri);
    this.setState({
      postArray,
    });
  };

  render() {
    const {
      share_id,
      imageUri,
      publish,
      statusText,
      postArray,
      saving,
    } = this.state;

    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />

        <View
          style={{
            height: screenHeight * 0.09,
            backgroundColor: '#FFFFFF',
            borderBottomColor: BGCOLOR,
            borderWidth: 0,
            flexDirection: 'row',
            borderBottomWidth: 2,
            borderBottomColor: 'black',
          }}>
          <Left style={{ flex: 1, marginLeft: 5 }}>
            <Button
              transparent
              onPress={() => {
                this.goBack();
              }}>
              <Icon
                name={'chevron-back'}
                type="Ionicons"
                style={{ fontSize: 30, color: 'white' }}
              />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Text
              style={{
                fontFamily: THEME_FONT,
                fontSize: RFValue(20 - 2),
                fontWeight: 'bold',
              }}>
              Create Post
            </Text>
          </Body>
          <Right
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginRight: 10,
            }}>
            <Button
              transparent
              disabled={this.state.statusText === '' ? true : false}
              onPress={() => {
                this.requestHandlerCreatePost('new_post');
              }}>
              <Text
                style={
                  !statusText
                    ? { fontFamily: THEME_FONT, fontSize: RFValue(20 - 2) }
                    : {
                      fontFamily: THEME_FONT,
                      fontSize: RFValue(20 - 2),
                      color: HEADER,
                    }
                }>
                Post
              </Text>
            </Button>
          </Right>
        </View>
        {saving ? (
          <ActivityIndicator
            size={'large'}
            color={HEADER}
            style={{ flex: 1, justifyContent: 'center' }}
          />
        ) : (
            <ScrollView
              scrollEventThrottle={16}
              contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: 'white',
                marginTop: 5,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row' }}>
                <Thumbnail
                  source={{
                    uri: this.props.navigation.getParam('petProfileInfo')
                      ? this.props.navigation.getParam('petProfileInfo').avatar
                      : this.props.navigation.getParam('page')
                        ? this.props.navigation.getParam('page').avatar
                        : this.props.navigation.getParam('group')
                          ? this.props.navigation.getParam('group').avatar
                          : this?.props?.user?.user_data?.avatar,
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: RFValue(20 - 2),
                      fontFamily: THEME_FONT,
                      fontWeight: 'bold',
                      paddingHorizontal: 10,
                      marginBottom: -10,
                    }}>
                    {this.props.navigation.getParam('petProfileInfo')
                      ? this.props.navigation.getParam('petProfileInfo').name
                      : this.props.navigation.getParam('page')
                        ? this.props.navigation.getParam('page').name
                        : this.props.navigation.getParam('group')
                          ? this.props.navigation.getParam('group').name
                          : this?.props?.user?.user_data.name}
                  </Text>
                  <Picker
                    mode="dropdown"
                    style={{ width: screenWidth * 0.44, paddingHorizontal: 10 }}
                    selectedValue={share_id}
                    onValueChange={this.onShareChange.bind(this)}>
                    <Picker.Item label="Publish on" value="Publish on" />

                    {!publish[0]['On profile'] ? (
                      <Picker.Item label="On profile" value="On profile" />
                    ) : null}
                  </Picker>
                </View>
              </View>

              <View
                style={{
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {publish[0]['On a page'] ? (
                  <View
                    style={{
                      marginHorizontal: RFValue(7),
                      marginVertical: RFValue(5),
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        (publish[0]['On a page'] = false),
                          this.setState({ publish });
                      }}
                      style={{
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: 'black',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: RFValue(16 - 2),
                          fontFamily: THEME_FONT,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                        }}>
                        On a page
                    </Text>
                      <Icon
                        name={'circle-with-cross'}
                        type="Entypo"
                        style={{
                          fontSize: RFValue(16 - 2),
                          color: '#222326',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          paddingLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
                {publish[0]['On pixy'] ? (
                  <View
                    style={{
                      marginHorizontal: RFValue(7),
                      marginVertical: RFValue(5),
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        (publish[0]['On pixy'] = false), this.setState({ publish });
                      }}
                      style={{
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: 'black',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: RFValue(16 - 2),
                          fontFamily: THEME_FONT,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                        }}>
                        On pixy
                    </Text>
                      <Icon
                        name={'circle-with-cross'}
                        type="Entypo"
                        style={{
                          fontSize: RFValue(16 - 2),
                          color: '#222326',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          paddingLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
                {publish[0]['On profile'] ? (
                  <View
                    style={{
                      marginHorizontal: RFValue(7),
                      marginVertical: RFValue(5),
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        (publish[0]['On profile'] = false),
                          this.setState({ publish });
                      }}
                      style={{
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: 'black',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: RFValue(16 - 2),
                          fontFamily: THEME_FONT,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                        }}>
                        On profile
                    </Text>
                      <Icon
                        name={'circle-with-cross'}
                        type="Entypo"
                        style={{
                          fontSize: RFValue(16 - 2),
                          color: '#222326',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          paddingLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
                {publish[0]['On my groups'] ? (
                  <View
                    style={{
                      marginHorizontal: RFValue(7),
                      marginVertical: RFValue(5),
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        (publish[0]['On my groups'] = false),
                          this.setState({ publish });
                      }}
                      style={{
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: 'black',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: RFValue(16 - 2),
                          fontFamily: THEME_FONT,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                        }}>
                        On my groups
                    </Text>
                      <Icon
                        name={'circle-with-cross'}
                        type="Entypo"
                        style={{
                          fontSize: RFValue(16 - 2),
                          color: '#222326',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          paddingLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
                {publish[0]['On my page'] ? (
                  <View
                    style={{
                      marginHorizontal: RFValue(7),
                      marginVertical: RFValue(5),
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        (publish[0]['On my page'] = false),
                          this.setState({ publish });
                      }}
                      style={{
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: 'black',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: RFValue(16 - 2),
                          fontFamily: THEME_FONT,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                        }}>
                        On my page
                    </Text>
                      <Icon
                        name={'circle-with-cross'}
                        type="Entypo"
                        style={{
                          fontSize: RFValue(16 - 2),
                          color: '#222326',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          paddingLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>

              <TextInput
                onChangeText={statusText => {
                  this.setState({ statusText });
                }}
                placeholder={"What's in your mind ?"}
                multiline={true}
                style={{ marginHorizontal: 5, marginTop: 10, fontSize: 18 }}
              />
              {this.state.feelingValue ? (
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: RFValue(16 - 2),
                      color: 'white',
                      padding: 5,
                      fontFamily: THEME_FONT,
                      backgroundColor: HEADER,
                    }}>
                    Feeling
                </Text>
                  <Text
                    style={{
                      fontSize: RFValue(16 - 2),
                      padding: 5,
                      fontFamily: THEME_FONT,
                    }}>
                    {this.state.feelingValue}
                  </Text>
                  <Emoji
                    name={this.state.feelingEmoji}
                    style={{
                      fontSize: 20,
                    }}
                  />
                </View>
              ) : null}
              {this.state.feelings ? (
                <>
                  <TouchableWithoutFeedback
                    onPress={() => this.setState({ feelings: false })}>
                    <View style={styles.backdrop} />
                  </TouchableWithoutFeedback>
                  <View style={styles.modal}>
                    <Text style={styles.feelingHeading}>
                      What are you feeling ?
                  </Text>
                    <FlatList
                      style={{
                        height: screenHeight * 0.4,
                      }}
                      scrollEnabled={true}
                      data={this.state.feelingsData}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity  key={index}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={() =>
                              this.setState({
                                feelings: false,
                                feelingValue: item.text,
                                feelingEmoji: item.emoji,
                              })
                            }>
                            <Emoji
                              name={item.emoji}
                              style={{
                                fontSize: 20,
                                marginRight: 5,
                              }}
                            />
                            <Text
                              style={{
                                fontSize: RFValue(14 - 2),
                                fontFamily: THEME_FONT,
                                color: 'grey',
                              }}>
                              {item.text}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                </>
              ) : null}

              {postArray.length > 0 ? (
                <>
                  <FlatList
                    scrollEnabled={false}
                    data={postArray}
                    renderItem={({ item, index }) => {
                      if (
                        item.uri.includes('jpeg') ||
                        item.uri.includes('jpg') ||
                        item.uri.includes('gif') ||
                        item.uri.includes('png')
                      ) {
                        return (
                          <View  key={index}
                            style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                            <View>
                              <Image
                                style={
                                  postArray.length === 1
                                    ? [
                                      styles.imageThumbnail1,
                                      { backgroundColor: 'black' },
                                    ]
                                    : [
                                      styles.imageThumbnail,
                                      { backgroundColor: 'black' },
                                    ]
                                }
                                source={{ uri: item.uri }}
                              />
                              <TouchableOpacity
                                style={styles.removeImgIcon}
                                onPress={() => this.removeImg(item.uri)}>
                                <Icon
                                  style={{ fontSize: RFValue(25 - 2) }}
                                  name="close"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      } else {
                        return (
                          <View  key={item.id}
                            style={{
                              flex: 1,
                              flexDirection: 'column',
                              height: 300,
                            }}>
                            <VideoPlayer
                              showOnStart={false}
                              disablePlayPause={true}
                              disableFullscreen={true}
                              disableBack={true}
                              seekColor={HEADER}
                              paused={true}
                              source={{ uri: item.uri }}
                              style={
                                postArray.length === 1
                                  ? {
                                    flex: 1,
                                    width: screenWidth,
                                    height: 300,
                                    alignSelf: 'center',
                                    backgroundColor: 'black',
                                  }
                                  : [
                                    styles.imageThumbnail,
                                    { backgroundColor: 'black' },
                                  ]
                              }
                              resizeMode="cover"
                              //onLoad={() => { this._video.seek(2) }}
                              ref={ref => {
                                this.player = ref;
                              }}
                            //poster={{uri:"http://placehold.it/200x200?text=2"}}
                            />
                          </View>
                        );
                      }
                    }}
                    //Setting the number of column
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </>
              ) : null}
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Text
                  style={{
                    backgroundColor: 'white',
                    position: 'absolute',
                    bottom: RFValue(60),
                    alignSelf: 'center',
                    justifyContent: 'flex-start',
                    fontFamily: THEME_BOLD_FONT,
                    fontSize: RFValue(18 - 2),
                    zIndex: 200,
                    color: '#707070',
                  }}>
                  Add to your post
              </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 15,
                    borderColor: HEADER,
                    borderWidth: 1,
                    paddingVertical: 12,
                    borderRadius: 25,
                    justifyContent: 'space-around',
                  }}>
                  <Icon
                    onPress={() =>
                      this.state.videoCount === 1 || postArray.length > 0
                        ? Alert.alert('', 'You can only upload one Video')
                        : this.uploadNewVideo()
                    }
                    name={'video'}
                    type={'Feather'}
                    style={{
                      color: '#707070',
                      marginHorizontal: 10,
                      fontSize: RFValue(28 - 2),
                    }}
                  />
                  <Icon
                    onPress={() =>
                      this.state.videoCount === 1
                        ? Alert.alert('', 'You cannot upload photos with video')
                        : this.uploadGalleryPhoto()
                    }
                    name="picture"
                    type="AntDesign"
                    style={{
                      color: '#707070',
                      marginHorizontal: 10,
                      fontSize: RFValue(28 - 2),
                    }}
                  />
                  <Icon
                    onPress={() =>
                      this.state.videoCount === 1
                        ? Alert.alert('', 'You cannot upload photos with video')
                        : this.uploadNewPhoto()
                    }
                    type={'SimpleLineIcons'}
                    name={'camera'}
                    style={{
                      color: '#707070',
                      marginHorizontal: 10,
                      fontSize: RFValue(28 - 2),
                    }}
                  />
                  <Icon
                    onPress={() =>
                      this.setState({ feelings: !this.state.feelings })
                    }
                    name={'emoticon-happy-outline'}
                    type={'MaterialCommunityIcons'}
                    style={{
                      color: '#707070',
                      marginHorizontal: 10,
                      fontSize: RFValue(28 - 2),
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          )}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StatusView);
