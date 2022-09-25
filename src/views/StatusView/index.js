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
  PermissionsAndroid,
  ImageBackground,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Alert,
  
} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Overlay, Divider, CheckBox } from 'react-native-elements';
import { AudioUtils } from 'react-native-audio';
import DocumentPicker from 'react-native-document-picker';
import RNGooglePlaces from 'react-native-google-places';
import LinearGradient from 'react-native-linear-gradient';
import VideoPlayer from 'react-native-video-controls';
import FastImage from 'react-native-fast-image';
import { Modalize } from 'react-native-modalize';
import Modal from 'react-native-modal';
import Emoji from 'react-native-emoji';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import MultiImagePicker from 'react-native-image-crop-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Icon } from 'native-base';
import { connect } from 'react-redux';
import Toast from 'react-native-simple-toast'


import styles from './styles';
import { darkSky, HEADER } from '../../constants/colors';
import { saveWorkSpace } from '../../redux/actions/user';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import GroupPagePixxy from '../GroupPagePixxy';
import Mention from '../common/InputMention';
import { commonState } from '../../components/common/CommomState';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
const { createNewPost } = petMyPalApiService;
import PMPHeader from '../../components/common/PMPHeader';
import CustomLoader from '../../components/common/CustomLoader';
import PostingModal from '../../components/common/PsotingModal';
import MediaMeta from 'react-native-media-meta';
import RNFetchBlob from 'rn-fetch-blob'

import { maxVideoSize, maxVideoTime, videoTimeSize, options } from '../../constants/ConstantValues';
import ErrorModal from '../../components/common/ErrorModal';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import VideoSvg from '../../assets/postIcons/video.svg';
import DocumentSvg from '../../assets/postIcons/document.svg';
import GifSvg from '../../assets/postIcons/gif.svg';
import MusicSvg from '../../assets/postIcons/music-note.svg';
import PaletteSvg from '../../assets/postIcons/palette.svg';
import PicSvg from '../../assets/postIcons/pic.svg';
import SmileSvg from '../../assets/postIcons/smile.svg';
import PinSvg from '../../assets/postIcons/pin.svg';
import EventEmitter from '../../services/eventemitter';


class StatusView extends React.Component {
  modal = React.createRef();
  videoModal = React.createRef();

  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    const { petProfileInfo, page, group } = this.props?.navigation?.state?.params;

    this.state = {
      share_id: '',
      imageUri: '',
      statusText: '',
      viewerContent: {
        pets: petProfileInfo ? [{ Timeline: true, pet: petProfileInfo }] : [],
        group: group ? [group] : [],
        page: page ? [page] : [],
      },
      forApiData: {
        pets: petProfileInfo
          ? [JSON.stringify({ Timeline: true, pet_id: petProfileInfo.id })]
          : [],
        group: group ? [group] : [],
        page: page ? [page] : [],
      },
      shareModalVisible: false,
      publish: commonState.publish,
      postArray: [],
      fileArray: [],
      videoCount: 0,
      requestCount: 0,
      saving: false,
      visible: false,
      feelings: false,
      feelingValue: '',
      feelingEmoji: '',
      feelingsData: commonState.feelingsData,
      currentTime: 0.0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
      audioPath: `${AudioUtils.DocumentDirectoryPath
        }/voice/voice${Date.now()}.aac`,
      hasPermission: undefined,
      page: '',
      pageName: '',
      music: '',
      location: '',
      address: '',
      audio: '',
      modalize: false,
      gifs: [],
      gifUrl: '',
      artColors: '',
      artColor1: '',
      artColor2: '',
      artColorId: '',
      artImageUri: '',
      artTextColor: 'black',
      showArtModal: false,
      artWrittenText: 'Hello Go Ahead',
      lat: '',
      lng: '',
      shareGroup: [],
      sharePage: [],
      sharePets: [],
      postFlag: false,
      video: {
        uri: '',
        path: ''
      },
      imgSizeChecking: false,
      showErrorModal:false,
      errMsg:'',

    };
  }

  componentDidMount() {
    if(Platform.OS=='android'){
    this.requestLocationPermission()}
    this.fetchGifs('good');
    this.fetchArts();
  }
  componentWillUnmount() {
    EventEmitter.off('InitialStateofPets', true);
    EventEmitter.off('UpdatedPetData',true);
    this.fetchGifsTimer;
  }

  closeErrorModal =()=>{
    this.setState({showErrorModal :false})
  }
  contentUploadIssue (msg){
    this.setState({
      errMsg:msg,
      showErrorModal:true
    })
  }

  fetchGifs = async (toSearch) => {
    
    const controller = new AbortController();
    const { signal } = controller;
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?&hash=2b49475b756c73b0e995&q=${toSearch}&api_key=DBJgK1vzdugwSZGRIE5o3G6CiQbVAaBl&limit=60&_=1617384196304`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        signal
      },
    ).catch(error => {
      console.log(error);
    });
    this.fetchGifsTimer=setTimeout(() => controller.abort(), 5000);
    const finalData = await response.json();
    this.setState({ gifs: finalData.data });

  };

  fetchArts = async () => {
    const form = new FormData();
    form.append('server_key', server_key);
    const response = await fetch(SERVER + '/api/get-site-settings', {
      method: 'POST',
      body: form,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).catch(e => console.log(e));
    const data = await response.json();

    this.setState({ artColors: data.config.post_colors });
  };


  goBack = () => {
    this.props.navigation.pop();
  };

  toggleOverlay = () => {
    this.setState({ visible: !this.state.visible });
  };


  ModelForPost() {
    const { publish } = this.state;
    return (
      <Overlay
        isVisible={this.state.visible}
        overlayStyle={{
          top: wp(45),
          justifyContent: 'space-between',
          position: 'absolute',
          left: wp(8),
        }}
        onBackdropPress={this.toggleOverlay}>
        <View>
          <CheckBox
            containerStyle={styles.checkBox}
            title="On pixy                   "
            iconRight
            checked={publish[0]['On pixy']}
            onPress={() => this.onShareChange('On pixy')}
          />
          <CheckBox
            containerStyle={styles.checkBox}
            title="On profile               "
            iconRight
            checked={publish[0]['On profile']}
            onPress={() => this.onShareChange('On profile')}
          />
          <CheckBox
            containerStyle={styles.checkBox}
            title="On my groups       "
            iconRight
            checked={publish[0]['On my groups']}
            onPress={() => this.onShareChange('On my groups')}
          />
          <CheckBox
            containerStyle={styles.checkBox}
            title="On my page          "
            iconRight
            checked={publish[0]['On my page']}
            onPress={() => this.onShareChange('On my page')}
          />
        </View>
      </Overlay>
    );
  }


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

  


  uploadNewVideo = async () => {
    var scope = this;
    let postArray = this.state.postArray;

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response);
      }else {

        console.log('image picker response')        

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
                    indicator: false,
                    imgSizeChecking: false,
                    icon: 'check',
                    title: 'Uploading',
                    imageUri: uri,
                    videoCount: 1,
                    postArray,
                  });

                } else {
                  this.showToast(videoTimeSize)
                  scope.setState({
                    imgSizeChecking: false,
                  })
                }

              })
              .catch((err) => {
                this.setState({ imgSizeChecking: false })
                console.error('meta data error',err)
              });

          })
          .catch((err) => {
            this.setState({ imgSizeChecking: false })
            console.log('eror image blob', err)
          })
      }
    })

  };


  uploadGalleryPhoto = async () => {
    let postArray = this.state.postArray;
    const images = await MultiImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    });
    images.forEach((i) => {postArray.push({ uri: i.path })});
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

getFilePathForMediaInfo =(response)=>{
  console.log('response image', response)
  if (Platform.OS === 'ios') { 
    return response.uri.replace('file://','')}
    else {
    return response.path
  }
}


  showToast = (msg) => {
    Toast.show(msg, Toast.SHORT);
  };


  multiPostCheck() {
    if ((_.size(this.state.shareGroup) > 0 || _.size(this.state.sharePage) > 0 || _.size(this.state.sharePets) > 0)) { return true } else { return false }
  }

  async requestHandlerCreatePost(type) {
    this.setState({ postFlag: true })
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    const { MyTimeLine } = this.props?.navigation?.state?.params;
    const { statusText, imageUri, postArray, feelingValue, shareGroup, sharePage, sharePets } = this.state;

    let data = new FormData();
    var photo = {};
    _.size(shareGroup) > 0 && _.map(shareGroup, (item) => {
      data.append('group[]', item?.id);
    })
    _.size(sharePage) > 0 && _.map(sharePage, (item) => {
      data.append('page[]', item?.page_id);
    })
    _.size(sharePets) > 0 && _.map(sharePets, (item) => {
      data.append('pets[]', JSON.stringify(item));
    })

    if (MyTimeLine) {
      data.append('MyTimeLine', MyTimeLine)
    }

    if (postArray.length === 1) {
      if (
        postArray[0].uri.includes('jpeg') ||
        postArray[0].uri.includes('jpg') ||
        postArray[0].uri.includes('gif') ||
        postArray[0].uri.includes('png')
      ) {
        photo = {
          uri: postArray[0].uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        };
        data.append(postArray.length > 1 ? 'postPhotos[]' : 'postPhotos', photo);
        // data.append(this.multiPostCheck()?'postPhotos[]':'postPhotos', photo);
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
    if (this.state.page != '') {
      let pdf = {
        name: this.state.page[0].name,
        uri: this.state.page[0].uri,
        type: this.state.page[0].type,
      };
      data.append('postFile', pdf);
    }


    !_.isEmpty(feelingValue) && data.append('feeling_type', 'feelings');
    !_.isEmpty(feelingValue) && data.append('feeling', feelingValue);
    !_.isEmpty(statusText) && data.append('postText', statusText.trim());
    !_.isEmpty(this.state.artColorId.toString()) && data.append('post_color', this.state.artColorId);
    data.append('user_id', JSON.parse(token)?.user_id);
    !_.isEmpty(this.state.gifUrl) && data.append('postSticker', this.state.gifUrl);
    !_.isEmpty(this.state.address) && data.append('postMap', this.state.address);
    !_.isEmpty(this.state.lat) && data.append('latitude', this.state.lat);
    !_.isEmpty(this.state.lng) && data.append('longitude', this.state.lng);

    if (this.state.music != '') {
      let audio = {
        name: this.state.music[0].name,
        uri: this.state.music[0].uri,
        type: this.state.music[0].type,
      };
      data.append('postMusic', audio);
    }
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
        ? data.append('recipient_id', this.props.navigation.getParam('pet_id'))
        : null;
    }
    let access_token = JSON.parse(token).access_token;
    data.append('s', access_token);
    data.append('server_key', server_key);

    // console.log('data sending to server', data);

    // return false


    const response = await this.props.createNewPost(access_token, data, this.multiPostCheck());
    this.props.saveWorkSpace({ ...{ show: true, updateNewsFeed: true } });
    EventEmitter.emit('InitialStateofPets', true)
    if (response?.api_status == 200) (
      this.setState({ postFlag: false }, () => {
        if(this.props.navigation.getParam('pet_id')){
          EventEmitter.emit('UpdatedPetData',true);
        }
        this.goBack();
      })
    )


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
  removeVideo = uri => {
    let newVideo = this.state.postArray;
    let postArray = newVideo.filter(i => i.uri !== uri);
    this.setState({
      postArray,
      videoCount: 0
    });
  };
  updateState = state => {
    this.setState({ shareModalVisible: state.shareModalVisible ?? this.state.shareModalVisible })
    if (state?.forApiData) {
      const { group, page, pets } = state?.forApiData;
      this.setState({ shareGroup: group, sharePage: page, sharePets: pets });

    }
  };

  documentPicker = async check => {
    if (check == 0) {
      try {
        const results = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.audio],
        });
        this.setState({ music: results });
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
        } else {
          throw err;
        }
      }
    } else if (check == 1) {
      try {
        const results = await DocumentPicker.pickMultiple({
          type: [
            DocumentPicker.types.pdf,
          ],
        });

        this.setState({ page: results, pageName: results[0].name });
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
        } else {
          throw err;
        }
      }
    } else {
      try {
        const results = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.audio],
        });
        this.setState({ music: results[0].uri });
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
        } else {
          throw err;
        }
      }
    }
  };


  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Pet My Pal',
          message: 'Pet My Pal App access to your location ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getLocation = async () => {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        let imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${place.address
          }&zoom=15&size=400x300&maptype=roadmap&markers=color:red%7Clabel:A%7C${place.location.address
          }&key=AIzaSyB1ATljOQdQSbKf_-icbQbfQqBqZlmwD0I`;
        this.setState({
          location: imagePreviewUrl,
          lat: place.location.latitude,
          lng: place.location.longitude,
          address: place.address,
        });
      })
      .catch(error => console.log(error.message));
  };

  renderGifs = ({ item, index }) => {
    const f = Object.entries(item[1].images);
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          this.setState({ gifUrl: f[0][1].url });
          this.modal.current?.close();
        }}
      >
        <FastImage
          source={{ uri: "" + f[0][1].url }}
          style={{ width: wp(33), height: wp(33) }}
          resizeMode="cover"
          onProgress={() => <CustomLoader />}
        />
      </TouchableOpacity>
    );
  };

  onOpen = () => {
    this.modal.current?.open();
  };

  renderSmallArt = () => {
    return (
      <ScrollView
        horizontal={true}
        style={{
          height: screenHeight * 0.1,
          position: 'absolute',
          bottom: 4,
          left: 0
        }}
        contentContainerStyle={{
          alignItems: 'flex-end'
        }}
      >
        {Object.entries(this.state.artColors).map((item, i) => {
          if (item[1].image != '') {
            return (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  this.setState({
                    artImageUri: item[1].image,
                    artColor1: '',
                    artColor2: '',
                    artTextColor: item[1].text_color,
                    artColorId: item[1].id,
                  })
                }>
                <FastImage
                  source={{ uri: "" + item[1].image }}
                  style={styles.artColors}
                  onProgress={() => (
                    <CustomLoader />
                  )}
                />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  this.setState({
                    artColor1: item[1].color_1,
                    artColor2: item[1].color_2,
                    artImageUri: '',
                    artTextColor: item[1].text_color,
                    artColorId: item[1].id,
                  })
                }>
                <LinearGradient
                  colors={[item[1].color_1, item[1].color_2]}
                  style={styles.artColors}
                />
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>
    );
  };
  searchGifs = (text) => {
    if (text.length >= 2) {
      this.fetchGifs(text);
    }
  }
  render() {
    const {
      viewerContent,
      shareModalVisible,
      publish,
      statusText,
      postArray,
      forApiData,
      saving,
      feelingValue,
      gifUrl,
      imgSizeChecking,
      showErrorModal,
      errMsg
    } = this.state;

    const { MyTimeLine } = this.props?.navigation?.state?.params;
    return (
      <Container style={styles.container}>

        <StatusBar
          backgroundColor={'white'}
          barStyle={'dark-content'}
          translucent={false}
        />
        <PMPHeader
          ImageLeftIcon={true}
          LeftPress={() => this.goBack()}
          centerText={'Status'}
          RightText={'POST'}
          disabled={statusText == '' && postArray.length == 0 && feelingValue == '' && gifUrl == '' ? true : false}
          RightPress={() => this.requestHandlerCreatePost()}
        />

        {this.ModelForPost()}

        <GroupPagePixxy
          viewerContent={viewerContent}
          forApiData={forApiData}
          modalVisible={shareModalVisible}
          updateState={this.updateState}
          shareOnPixxy={postArray?.length === 1 ? true : false}
        />

        {saving ? (
          <CustomLoader />
        ) : (
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS == "ios" ? 10 : 15}
            behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1 }}

          >
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
              <View
                style={styles.wrapView}>
                {MyTimeLine && (
                  <TouchableOpacity
                    style={styles.timelineText}>
                    <View
                      style={styles.rowCenter}>
                      <Text style={styles.text}>My Timeline</Text>
                    </View>
                  </TouchableOpacity>
                )}

                {viewerContent.pets.map((item, index) => {
                  return(
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      let arrayOfPost = viewerContent;
                      arrayOfPost.pets.splice(index, 1);
                      let arrayOfPostData = forApiData;
                      arrayOfPostData.pets.splice(index, 1);
                      this.setState({
                        viewerContent: arrayOfPost,
                        forApiData: arrayOfPostData,
                      });
                      
                      EventEmitter.emit('removeIds', { 
                      })
                    }}
                    style={styles.timeLineBtn}>

                    <View
                      key={index}
                      style={styles.rowCenter}>
                      <Text
                        style={styles.text}>
                        {item.pet.full_name}
                        {item.Timeline ? ' Timeline' : ' Pixxy'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  )
              })}

                {viewerContent.group.map((item, index) => (
                  
                  <TouchableOpacity
                    key={index}
                    onPress={() => {

                      let arrayOfPost = viewerContent;
                      arrayOfPost.group.splice(index, 1);
                      let arrayOfPostData = forApiData;
                      arrayOfPostData.group.splice(index, 1);
                      this.setState({
                        viewerContent: arrayOfPost,
                        forApiData: arrayOfPostData,
                      });
                      EventEmitter.emit('removeIds', { id: item.id, index: undefined, type: 'group' })
                    }}
                    style={styles.timeLineBtn}>
                    <View
                      key={index}
                      style={styles.rowCenter}>
                      <Text
                        style={styles.text}>
                        {item.group_title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {viewerContent.page.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      let arrayOfPost = viewerContent;
                      arrayOfPost.page.splice(index, 1);
                      let arrayOfPostData = forApiData;
                      arrayOfPostData.page.splice(index, 1);
                      this.setState({
                        viewerContent: arrayOfPost,
                        forApiData: arrayOfPostData,
                      });
                    }}
                    style={styles.timeLineBtn}>
                    <View
                      key={index}
                      style={styles.rowCenter}>
                      <Text
                        style={styles.text}>
                        {item.page_title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  onPress={() => this.setState({ shareModalVisible: true })}
                  style={styles.timeLineBtn}>
                  <View style={styles.rowCenter}>
                    <Text
                      style={styles.text}>
                      {'+ Add More'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>



              <View
                style={styles.publish}>
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
                      style={styles.tags}>
                      <Text style={styles.tagText}>On a page</Text>
                      <Icon
                        name={'circle-with-cross'}
                        type="Entypo"
                        style={styles.tagIcon}
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
                      style={styles.tags}>
                      <Text style={styles.tagText}>On pixy</Text>
                      <Icon
                        name={'circle-with-cross'}
                        type="Entypo"
                        style={styles.tagIcon}
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
                      style={styles.tags}>
                      <Text style={styles.tagText}>On profile</Text>
                      <Icon
                        name={'circle-with-cross'}
                        type="Entypo"
                        style={styles.tagIcon}
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
                      style={styles.tags}>
                      <Text style={styles.tagText}>On my groups</Text>
                      <Icon
                        name={'circle-with-cross'}
                        type="Entypo"
                        style={styles.tagIcon}
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
                      style={styles.tags}>
                      <Text style={styles.tagText}>On my page</Text>
                      <Icon
                        name={'circle-with-cross'}
                        type="Entypo"
                        style={styles.tagIcon}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
              <Divider style={{ backgroundColor: '#ced3df', marginTop: 10 }} />

              <Mention
                onChangeText={statusText => {
                  this.setState({ statusText });
                }}
                placeholder={"What's in your mind ?"}
                placeholderTextColor={'#ced3df'}
                multiline={true}
                style={styles.mentionTextField}
              />
              {imgSizeChecking ?
                <CustomLoader />
                : null}

              <View style={{ marginBottom: 10 }} />
              {this.state.feelingValue ? (
                <View
                  style={styles.feelingView}>
                  <Text style={styles.feeling}> Feeling</Text>
                  <Text
                    style={{
                      fontSize: RFValue(14),
                      padding: 5,
                    }}>
                    {this.state.feelingValue}
                  </Text>

                  <Emoji name={this.state.feelingEmoji} style={{ fontSize: 20 }} />
                </View>
              ) : null}
              {this.state.page != '' && (
                <View
                  style={styles.pageView}>
                  <Image
                    source={require('../../assets/images/pdf.png')}
                    style={{ height: 100, width: 100 }}
                  // style={styles.imgStyle}
                  />
                  <Text>{this.state.pageName}</Text>
                </View>
              )}

              {this.state.gifUrl != '' && (
                <TouchableOpacity
                  onPress={() => this.setState({ gifUrl: '' })}
                  style={styles.imgStyle}>
                  <FastImage

                    source={{ uri: "" + this.state.gifUrl }}
                    style={{ width: wp(40), height: wp(40) }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}

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
                          <View
                            key={index}
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
                                source={{ uri: "" + item.uri }}
                                resizeMode="contain"
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
                            style={styles.palyerView}>
                            <VideoPlayer
                              showOnStart={false}
                              disableVolume
                              disableFullscreen={true}
                              disableBack={true}
                              seekColor={HEADER}
                              paused={true}
                              source={{ uri: item.uri }}
                              style={
                                postArray.length === 1
                                  ? styles.post_array
                                  : [
                                    styles.imageThumbnail,
                                    { backgroundColor: 'black' },
                                  ]
                              }
                              resizeMode="cover"
                              ref={ref => {
                                this.player = ref;
                              }}
                            />
                            <TouchableOpacity
                              style={styles.removeImgIcon}
                              onPress={() => this.removeVideo(item.uri)}>
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
              {this.state.music != '' && (
                <View
                  style={styles.playerView}>
                  <VideoPlayer
                    paused={true}
                    source={{ uri: "" + this.state.music[0].uri }}
                    audioOnly={true}
                    style={{
                      width: screenWidth,
                      height: 300,
                      alignSelf: 'center',
                      backgroundColor: 'black',
                    }}
                    resizeMode="cover"
                    ref={ref => {
                      this.player = ref;
                    }}
                  />
                </View>
              )}

              {this.state.location != '' && (
                <FastImage
                  style={{ width: 'auto', height: 200 }}
                  resizeMode="cover"
                  source={{ uri: "" + this.state.location }}
                />
              )}
              <View
                style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={styles.iconBody}
                    onPress={() => {
                      this.state.videoCount > 1 || this.state.postArray.length > 0 ?
                        this.contentUploadIssue('Pictures and videos cannot be uploaded together.')
                        :
                        this.uploadNewVideo()
                    }
                    }>

                    <VideoSvg width={25} height={25} />
                    <Text style={styles.iconText}>Video</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.iconBody, { marginHorizontal: 10 }]}
                    onPress={() =>
                      this.state.videoCount === 1
                        ? this.contentUploadIssue('Pictures and videos cannot be uploaded together.')
                        : this.uploadGalleryPhoto()
                    }>

                    <PicSvg width={25} height={25} />
                    <Text style={styles.iconText}>Image</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconBody}
                    onPress={() => this.onOpen()}>
                    <GifSvg width={25} height={25} />
                    <Text style={styles.iconText}>GIF</Text>
                  </TouchableOpacity>

                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <TouchableOpacity
                    style={styles.iconBody}
                    onPress={() => this.documentPicker(0)}>
                    <MusicSvg width={25} height={25} />
                    <Text style={styles.iconText}>Music</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.iconBody, { marginHorizontal: 10 }]}
                    onPress={() =>
                      this.setState({ feelings: !this.state.feelings })
                    }>
                    <SmileSvg width={25} height={25} />
                    <Text style={styles.iconText}>Emoji</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconBody}
                    onPress={() => this.documentPicker(1)}>
                    <DocumentSvg width={25} height={25} />
                    <Text style={styles.iconText}>Document</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <TouchableOpacity
                    style={styles.iconBody}
                    onPress={() => this.getLocation()}>
                    <PinSvg width={25} height={25} />
                    <Text style={styles.iconText}>Location</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.iconBody, { marginLeft: 10 }]}
                    onPress={() => this.setState({ showArtModal: true })}>
                    <PaletteSvg width={25} height={25} />
                    <Text style={styles.iconText}>Art</Text>
                  </TouchableOpacity>
                </View>
                <Modalize
                  modalStyle={styles.modalStyle}
                  useNativeDriver={true}
                  overlayStyle={styles.overlayStyle}
                  handleStyle={styles.handleStyle}
                  modalHeight={heightPercentageToDP(60)}
                  ref={this.modal}

                  HeaderComponent={
                    <View style={styles.headerComponent}>
                      <TextInput
                        onChangeText={(text) => this.searchGifs(text)}
                        placeholder="Search Gifs"
                        style={styles.textInput}
                      />
                    </View>
                  }
                  flatListProps={{
                    data: Object.entries(this.state.gifs),
                    renderItem: this.renderGifs,
                    keyExtractor: item => item[1].id,
                    showsVerticalScrollIndicator: false,
                    scrollEventThrottle: 16,
                    numColumns: 3,

                  }}

                />

                <Modal 
                 style={{ justifyContent: 'center', alignItems: 'center' }} 
                  animationIn="fadeInDown" 
                  useNativeDriver={true} 
                  animationInTiming={700} 
                  animationOutTiming={1500} 
                  isVisible={this.state.showArtModal} >
                  <View>

                    {this.state.artImageUri == '' &&
                      this.state.artColor1 == '' ? (
                      <View
                        style={styles.artColor}>
                        <TextInput
                          multiline
                          placeholder={this.state.artWrittenText}
                          placeholderTextColor={this.state.artTextColor}
                          value={
                            this.state.artWrittenText != 'Hello Go Ahead' ?
                              this.state.artWrittenText : ''
                          }
                          onChangeText={text =>
                            this.setState({
                              artWrittenText: text,
                              statusText: text,
                            })
                          }
                          style={styles.artTextField}
                        />
                        {this.renderSmallArt()}
                      </View>
                    ) : this.state.artImageUri != '' ? (
                      <ImageBackground
                        source={{ uri: "" + this.state.artImageUri }}
                        style={styles.artImageDesign}>
                        <TextInput
                          placeholder={this.state.artWrittenText}
                          placeholderTextColor={this.state.artTextColor}
                          value={
                            this.state.artWrittenText != 'Hello Go Ahead' ?
                              this.state.artWrittenText : ''
                          }
                          onChangeText={text =>
                            this.setState({
                              artWrittenText: text,
                              statusText: text,
                            })
                          }
                          style={styles.artTextField}

                        />
                        {this.renderSmallArt()}
                      </ImageBackground>
                    ) : (
                      <LinearGradient
                        colors={[this.state.artColor1, this.state.artColor2]}
                        style={styles.linearGradient}>
                        <TextInput
                          placeholder={this.state.artWrittenText}
                          placeholderTextColor={this.state.artTextColor}
                          value={
                            this.state.artWrittenText != 'Hello Go Ahead' ?
                              this.state.artWrittenText : ''
                          }
                          onChangeText={text => {
                            this.setState({
                              artWrittenText: text,
                              statusText: text,
                            });
                          }}
                          style={styles.artTextField}
                        />
                        {this.renderSmallArt()}
                      </LinearGradient>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity
                        disabled={this.state.statusText == ''}
                        style={[styles.selectArt, {
                          backgroundColor:
                            this.state.statusText == '' ? '#dedede' : darkSky,
                        }]}
                        onPress={() => {
                          if (this.state.statusText == '') {
                            alert('Status is missing');
                          } else if (
                            this.state.artColor1 == '' &&
                            this.state.artImageUri == ''
                          ) {
                            alert('Please select background color');
                          } else {
                            this.setState({ showArtModal: false });
                            this.requestHandlerCreatePost();
                          }
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: this.state.statusText == '' ? 'black' : 'white',
                          }}>
                          Done
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.doneBtn}
                        onPress={() => {
                          this.setState({
                            statusText: '',
                            artColorId: '',
                            artColor1: '',
                            artColor2: '',
                            artWrittenText: 'Hello Go Ahead',
                            artImageUri: '',
                            showArtModal: false,
                          });
                        }}>
                        <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            </ScrollView>

            <Modalize
              modalStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
              useNativeDriver={true}
              modalHeight={heightPercentageToDP(60)}
              ref={this.modal}
              HeaderComponent={
                <View style={{ width: wp(90), paddingVertical: wp(3), justifyContent: 'center', alignItems: 'center' }}>
                  <TextInput onChangeText={(text) => this.searchGifs(text)} style={{ width: wp(80), borderWidth: 1, borderColor: '#bebebe', height: wp(10), borderRadius: 5, paddingLeft: 5 }} placeholder="Search Gifs" />
                </View>
              }
              flatListProps={{
                data: Object.entries(this.state.gifs),
                renderItem: this.renderGifs,
                keyExtractor: item => item[1].id,
                showsVerticalScrollIndicator: false,
                scrollEventThrottle: 16,
                numColumns: 3,
                nestedScrollEnabled: true

              }}

            />

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
                    style={{ height: screenHeight * 0.4 }}
                    scrollEnabled={true}
                    data={this.state.feelingsData}
                    nestedScrollEnabled
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() =>
                            this.setState({
                              feelings: false,
                              feelingValue: item.text,
                              feelingEmoji: item.emoji,
                            })
                          }
                          style={styles.emojiContainer}>

                          <Emoji
                            name={item.emoji}
                            style={{ fontSize: 20, marginRight: 5 }}
                          />
                          <Text
                            style={styles.emojiText}>
                            {item.text}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </>
            ) : null}
          </KeyboardAvoidingView>

        )}

        <PostingModal
          isVisible={this.state.postFlag}
          onBackButtonPress={() => this.closeModal()}
          info={'Updating Post'}
          headerText={'POSTING'}
          postFlag={this.state.postFlag}
        />

        <ErrorModal
          isVisible={showErrorModal}
          onBackButtonPress={() => this.closeErrorModal()}
          info={errMsg}
          heading={'Hoot!'}
          onPress={() => this.closeErrorModal()}
            />

      </Container>
    );
  }

}

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
  createNewPost: (token, data, checkMultiPost) => dispatch(createNewPost(token, data, checkMultiPost))
});
export default connect(mapStateToProps, mapDispatchToProps)(StatusView);
