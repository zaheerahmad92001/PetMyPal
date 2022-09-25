import React from 'react';
import {
  Platform,
  Dimensions,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import styles from './styles';
import {
  Container,
  Button,
  Left,
  Body,
  Right,
  Icon,
} from 'native-base';

import MultiImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import { HEADER, darkSky, black } from '../../constants/colors';
import PropTypes from 'prop-types';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import ImagePicker from 'react-native-image-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import Ic from 'react-native-vector-icons/FontAwesome5';
import requestRoutes from '../../utils/requestRoutes';
import VideoPlayer from 'react-native-video-controls';
import Emoji from 'react-native-emoji';
import { commonState } from '../../components/common/CommomState';
import CustomLoader from '../../components/common/CustomLoader';
import MediaMeta from 'react-native-media-meta';
import RNFetchBlob from 'rn-fetch-blob'
import { maxVideoSize, maxVideoTime, videoTimeSize } from '../../constants/ConstantValues';
import Toast from 'react-native-simple-toast'


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

class PixxyCreateView extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      access_token: '',
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
      pet_id: '',
    };
  }

  componentDidMount() {
    this.setState({ pet_id: this.props.navigation.getParam('pet_id') });
  }

  goBack = () => {this.props.navigation.pop()};

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

  showToast = (msg) => {
    Toast.show(msg, Toast.SHORT);
  };

  // onShareChange(value) {
  //   const { publish } = this.state;
  //   publish[0][value] = true;
  //   this.setState({ share_id: value });
  // }

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

  
  uploadGalleryPhoto = async () => {
    // alert(this.state.postArray.length)
    let postArray = this.state.postArray;
    const images = await MultiImagePicker.openPicker({
      multiple: true,
      // mediaType: 'photo',
    });

    images.forEach((i) => {
    let [type, extension] = i.mime.split('/') 
    console.log('extension', extension)
    if(
      extension == 'jpeg' ||
      extension == 'jpg' ||
      extension == 'gif' ||
      extension == 'png' 
     ){
       postArray.push({ uri: i.path })
       this.setState({postArray});
    }else{
      let v_size = 0
      let v_time = 0

      var filePath = this.getFilePathForMediaInfo(i);

      RNFetchBlob.fs.stat(filePath)
      .then((stats) => {
        v_size = stats.size
        // console.log('img.path',i?.path.substring(7) , 'size', v_size)
        // const path = i?.path.substring(7) // for ios
        MediaMeta.get(filePath)
          .then((metadata) => {
            v_time = metadata.duration / 1000
            // console.log('v_time',v_time)
            if (v_time <= Number(maxVideoTime) && v_size <= Number(maxVideoSize)) {

                postArray.push({ uri: i.path })
                this.setState({postArray});

            } else {
              this.showToast(videoTimeSize)
            }
          })
          .catch(err => console.error('error in metadata' , err));
      })
      .catch((err) => {
        console.log('eror image blob', err)
      })

    }

     });
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
      return response.path.replace('file://','')}
      else {
      return response.path.replace('file://','')
    }
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
  

    const URL =
      'https://petmypal.com/app_api.php?application=phone&type=new_post';
    let data = new FormData();
    var photo = {};

    this.getAccessToken()
      .then(token => {
        this.setState({ access_token: token });
        if (postArray.length === 1) {
          if (
            postArray[0]?.uri.includes('jpeg') ||
            postArray[0]?.uri.includes('jpg') ||
            postArray[0]?.uri.includes('gif') ||
            postArray[0]?.uri.includes('png')
          ) {
            photo = {
              uri: postArray[0]?.uri,
              type: 'image/jpeg',
              name: 'photo.jpg',
            };
            data.append('postPhotos[]', photo);
          } else {
            photo = {
              name: 'video.mp4',
              // uri: imageUri,
              uri: postArray[0]?.uri,
              type: 'video/mp4',
            };
            data.append('postPhotos[]', photo);
            // data.append('postVideo', photo);
          }
        } else {
          postArray.forEach((item, i) => {
            if (
              item.uri.includes('jpeg') ||
              item.uri.includes('jpg') ||
              item.uri.includes('gif') ||
              item.uri.includes('png')
            ) {
              data.append(`postPhotos[${i}]`, {
                uri: item.uri,
                type: 'image/jpeg',
                name: `filename${i}.jpg`,
              });
            } else {
              // if (this.state.requestCount === 0) {
              //   scope.setState({ requestCount: 1 });

                data.append(`postPhotos[${i}]`, {
                  uri: item.uri,
                  type: 'video/mp4',
                  name: 'video.mp4',
                })
                // photo = {
                //   name: 'video.mp4',
                //   uri: imageUri,
                //   type: 'video/mp4',
                // };
                // data.append('postVideo', photo);
              // } else {
              //   alert('You can upload more than one video');
              // }
            }
          });
        }
        // data.append('feeling_type', 'feelings');
        // data.append('feeling', feelingValue);
        data.append('description', statusText);
        data.append('user_id', this.state.pet_id);
        data.append('access_token', JSON.parse(token).access_token);
        data.append('type', 'create');
        data.append('server_key', server_key);
      })
      .then(async () => {      
        return fetch(
          SERVER +
          requestRoutes[type].route +
          '?access_token=' +
          JSON.parse(this.state.access_token).access_token,
          {
            method: requestRoutes[type].method,
            body: data,
            params: {
              access_token: JSON.parse(this.state.access_token).access_token
            },
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
          .then(response => response.json())
          .then(json => {
            this.setState({ saving: false });

            console.log('api response ' , json)

            if (json.api_status === '200' || json.api_status === 200) {
              this.props.saveWorkSpace({ ...{ show: true, updateNewsFeed: true } });
              // this.props.navigation.pop();
              this.props.navigation.navigate({
                routeName: 'PetProfile',
                key: 'PetProfile',
                params: { willRefresh: true },
              });
              //this.requestHandlerSharePost("share_post_on_timeline",json.post_data.id)
            } else {
              alert('Failed to Post. Try again');
            }
          })
          .catch(error => {
            this.setState({ saving: false });
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
        <SafeAreaView />

        <View
          style={{
            height: screenHeight * 0.09,
            backgroundColor: '#FFFFFF',
            borderWidth: 0,
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#00000021',
          }}>
          <Left style={{ 
              flexDirection: 'row',
              
               }}>
            <Button
              transparent
              onPress={() => {
                this.goBack();
              }}>
              <Icon
                name={'chevron-back'}
                type="Ionicons"
                style={{ fontSize: 30,marginLeft: wp(-1), color: darkSky }}
              />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Text
              style={styles.createPixxyText}>
              Create Pixxy
            </Text>
          </Body>
          <Right
            style={{
              
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Button
              transparent
              // disabled={}
              onPress={() => {
                // statusText && postArray.length > 0
                 postArray.length > 0
                  ? this.requestHandlerCreatePost('pixxy')
                  : null;
              }}>
              <Text
                style={
                  postArray.length > 0
                    ? {
                      fontFamily: THEME_FONT,
                      fontSize: RFValue(16), 
                      color: HEADER,
                    }
                    : { fontFamily: THEME_FONT, fontSize: RFValue(16),color:black }
                }>
                POST
              </Text>
            </Button>
          </Right>
        </View>
        {saving ? (
          <CustomLoader/>
        ) : (
          <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS == "ios" ? 10 : 15}
          behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1         }} >
            <ScrollView
              scrollEventThrottle={16}
              contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: 'white',
                paddingVertical: 6,
              }}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <View
                style={styles.onPageView}>
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
                placeholder={"What's on your mind?"}
                multiline={true}
                style={{  fontSize: 18 }}
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
                  <Text
                    style={{
                      fontSize: RFValue(16 - 2),
                      color: 'grey',
                      marginBottom: 10,
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontFamily: THEME_FONT,
                    }}>
                    What are you feeling ?
                </Text>
                  <FlatList
                    style={{
                      height: 60,
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
                </>
              ) : null}

              {postArray.length > 0 ? (
                <>
                  <FlatList
                    scrollEnabled={true}
                    data={postArray}
                    renderItem={({ item, index }) => {
                      if (
                        item.uri.includes('jpeg') ||
                        item.uri.includes('jpg') ||
                        item.uri.includes('gif') ||
                        item.uri.includes('png')
                      ) {
                        return (
                          <View   key={index} style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
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
                          <View  key={index}
                            style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                              <View>
                            <VideoPlayer
                              showOnStart={false}
                              disableVolume={true}
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
                            />
                            </View>
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
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </>
              ) : null}


              <View style={{ flex: 1, justifyContent: 'flex-end',paddingTop:10 }}>
                <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
                <TouchableOpacity
                  style={[styles.uploadPhotoBtn,{marginLeft:RFValue(7),marginRight:RFValue(0)}]}
                  onPress={() => {
                    this.uploadNewPhoto()
                    }
                  }>

                  <Ic style={{ alignSelf: 'center' }}
                    name="camera"
                    color="white"
                    size={25}
                  />
                  <Text style={styles.btnText}>Open Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.uploadPhotoBtn]}
                  onPress={() => {
                    this.uploadGalleryPhoto()
                  }}>
                  <Ic
                    name="file-image"
                    color="white"
                    size={25}
                  />
                  <Text  style={styles.btnText}>Open Gallery</Text>
                </TouchableOpacity>
              </View>
              </View>
            </ScrollView>
            </KeyboardAvoidingView>
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
)(PixxyCreateView);
