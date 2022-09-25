import React from 'react';
import {
  Platform,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  SafeAreaView
} from 'react-native';
import styles from './styles';
import {
  Container,
  Button,
  Left,
  Right,
  Icon,
  Textarea,
} from 'native-base';

import { connect } from 'react-redux';
import { HEADER, BGCOLOR, darkSky } from '../../constants/colors';
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
import VideoPlayer from 'react-native-video-controls';
import Emoji from 'react-native-emoji';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableWithoutFeedback } from 'react-native';
import { Alert } from 'react-native';
import MediaMeta from 'react-native-media-meta';
import RNFetchBlob from 'rn-fetch-blob'

import { maxVideoSize, maxVideoTime, videoTimeSize, options } from '../../constants/ConstantValues';
import { commonState } from '../../components/common/CommomState'
import CustomLoader from '../../components/common/CustomLoader';
import Toast from 'react-native-simple-toast'

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
      visible: false,
      feelings: false,
      feelingValue: '',
      feelingEmoji: '',
      feelingsData: commonState.feelingsData,
      imgSizeChecking: false,
    };
  }

  componentDidMount() { }

  goBack = () => {
    this.props.navigation.pop();
  };
  toggleOverlay = () => {
    this.setState({ visible: !this.state.visible })
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
    publish[0][value] = !publish[0][value];
    this.setState({ share_id: value });
  }

  showToast = (msg) => {
    Toast.show(msg, Toast.SHORT);
  };

  uploadNewPhoto = () => {
    var scope = this;
    let postArray = this.state.postArray;

    // ImagePicker.launchCamera(
      ImagePicker.showImagePicker(
      {
        mediaType: 'image',
        videoQuality: 'high',
        quality: 1,
      },
      response => {
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
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {

        let v_size = 0
        let v_time = 0
        this.setState({ imgSizeChecking: true })

        var filePath = this.getFilePathForMediaInfo(response);

        RNFetchBlob.fs.stat(filePath)
          .then((stats) => {
            v_size = stats.size
            MediaMeta.get(filePath)
              .then((metadata) => {
                v_time = metadata.duration / 1000

                if (v_time <= Number(maxVideoTime) && v_size <= Number(maxVideoSize)) {
                  var uri = this.getFilePathForPlatform(response);
                  postArray = postArray.concat({ uri });
                  scope.setState({
                    imgSizeChecking: false,
                    imageUri: uri,
                    videoCount: 1,
                    postArray,
                  });

                } else {
                  scope.showToast(videoTimeSize)
                  scope.setState({ imgSizeChecking: false })
                }

              })
              .catch((err) => {
                this.setState({ imgSizeChecking: false })
                console.error(err)
              });

          })
          .catch((err) => {
            this.setState({ imgSizeChecking: false })
            console.log('eror image blob', err)
          })
      }
    },
    );
  };

  
  getFilePathForPlatform = response => {
    if (Platform.OS === 'ios') {
      return response.uri;
    } else {
      return response.path && 'file://' + response.path;
    }
  };

  getFilePathForMediaInfo =(response)=>{
    if (Platform.OS === 'ios') { 
      return response.uri.replace('file://','')}
      else {
      return response.path
    }
  }


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
    const { event } = this.props.navigation.state.params
    this.setState({ saving: true });
    const scope = this;
    const {
      statusText,
      imageUri,
      postArray,
      feelingValue,
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
        data.append('feeling', feelingValue);
        data.append('feeling_type', 'feelings')
        data.append('postText', statusText);
        data.append('user_id', JSON.parse(token).user_id);
        data.append('event_id', event.id);
        let access_token = JSON.parse(token).access_token
        data.append('s', access_token);
        data.append('server_key', server_key);

      })
      .then(async () => {
        // return fetch(SERVER + requestRoutes[type].route)
        return fetch(URL, {
          method: "POST",
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
            this.setState({ saving: false });
            console.log(error, "error", data);
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
      statusText,
      postArray,
      saving,
      imgSizeChecking
    } = this.state;

    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        <SafeAreaView />
        <View
          style={{
           // height: screenHeight * 0.09,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <Left style={{ flex: 1, }}>
            <Button
              transparent
              onPress={() => {
                this.goBack();
              }}>
              <Icon
                name={'chevron-back'}
                type="Ionicons"
                style={{ fontSize: 30, color: darkSky }}
              />
            </Button>
          </Left>
          <Right
            style={styles.rightSide}>
            <Button
              transparent
              disabled={this.state.statusText === '' ? true : false}
              onPress={() => {
                this.requestHandlerCreatePost('new_post');
              }}>
              <Text
                style={
                  !statusText
                    ? { fontFamily: THEME_FONT, fontSize: RFValue(18) }
                    : styles.activePost
                }>
                Post
              </Text>
            </Button>
          </Right>
        </View>
        {saving ? (
          <CustomLoader />
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



            <TextInput
              onChangeText={statusText => {
                this.setState({ statusText });
              }}
              placeholder={"What's in your mind ?"}
              placeholderTextColor={"#ced3df"}
              multiline={true}
              style={{ marginHorizontal: 5, fontSize: 18 }}
            />
            {imgSizeChecking ?
              <CustomLoader /> :
              null}

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
                        <TouchableOpacity key={index}
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
                        <View key={index}
                          style={styles.imgOuterView}>
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
                        <View
                          key={index}
                          style={styles.videoView}>
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
                                ?
                                styles.videoSelected
                                : [
                                  styles.imageThumbnail,
                                  { backgroundColor: 'black' },
                                ]
                            }
                            resizeMode="cover"
                            ref={ref => { this.player = ref; }}
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
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 16,
                  justifyContent: 'space-between',
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
                    color: '#f59ba5',
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
                    color: '#f59ba5',
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
                    color: '#f59ba5',
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
