import React from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import styles from './styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import { Badge } from 'react-native-elements';
import {Container,Content, Icon,} from 'native-base';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { userEdit, saveWorkSpace } from '../../redux/actions/user';
import { RFValue } from 'react-native-responsive-fontsize';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import requestRoutes from '../../utils/requestRoutes';
import AsyncStorage from '@react-native-community/async-storage';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import { HEADER, PINK, White } from '../../constants/colors';
import OneSignal from 'react-native-onesignal';
import MasonryList from "react-native-masonry-list";
import { commonState} from '../../components/common/CommomState';
import { labelFont } from '../../constants/fontSize';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

class PixxyPetView extends React.Component {

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
      loadingPets: true,
      loadingSuggested: true,
      suggested:commonState.suggested,
      allListPixxy: [],
      pixxy: [],
      pixxyImages: [],
      newsFeed: [],
      isOwner: true,
      loadingNewsFeed: true,
      token: '',
      visible: true,
      start: false,
      isRefreshing: false,
      modalVisible: false,
      viewerContent: {
        reaction: {},
      },
      viewerIndex: 0,
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
    let isOwner = false;
    if (this.props.parent_id === this?.props?.user?.user_data.user_id) {
      isOwner = true;
    }
    this.getAccessToken()
      .then(TOKEN => {
        this.setState({ token: JSON.parse(TOKEN).access_token, isOwner });
      })
      .then(() => {
        this.requestHandlerGetPixxy('get-pixxy');
      });
  }

  componentWillReceiveProps(props) {
    const {newsFeed, start } = this.state;
    this.onRefresh();
    if (start) {
      this.setState({ newsFeed });
    } else {
      this.setState({ start: true });
    }
  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  async requestHandlerGetPixxy(type) {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('user_id', this.props.pet_id);
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
      var ListOfImages = []
      var imageIndex = 0
      if (responseJson.api_status === 200) {
        const postPhotosArray = [];
        let changeDimensions = 0
        responseJson.pixxys.forEach(post => {

          let imgUri = ''
          let extension = post?.first_image?.split('.').pop()

          if(
            extension== 'jpeg' ||
            extension== 'jpg' ||
            extension =='gif' ||
            extension =='png'
            ){
              imgUri = post.first_image
            }else{
              let _video = post?.first_image.replace('/video', '/photo')
              let _video_small = _video.replace('_video_small', '_photo_small')
              let videoToImg = _video_small.replace(extension, 'jpg')
              imgUri = videoToImg
            }

          const photoArrayItem = [];
          let obj = {}
          if (changeDimensions == 0) {
            changeDimensions = changeDimensions + 1
            obj = {
              dimensions: { width: wp(43.8), height: wp(60) },
              uri:imgUri ,
              imageIndex: imageIndex,
              item: post,
            }
            imageIndex = imageIndex + 1
          } else if (changeDimensions == 1) {
            changeDimensions = changeDimensions + 1
            obj = {
              dimensions: { width: wp(43.8), height: wp(30) },
              uri:imgUri ,
              imageIndex: imageIndex,
              item: post,
            }
            imageIndex = imageIndex + 1
          } else if (changeDimensions == 2) {
            changeDimensions = changeDimensions + 1
            obj = {
              dimensions: { width: wp(43.8), height: wp(30) },
              uri:imgUri ,
              imageIndex: imageIndex,
              item: post,
            }
            imageIndex = imageIndex + 1
          } else if (changeDimensions == 3) {
            changeDimensions = 1
            obj = {
              dimensions: { width: wp(43.8), height: wp(60) },
              uri:imgUri ,
              imageIndex: imageIndex,
              item: post,
            }
            imageIndex = imageIndex + 1
          }
          ListOfImages.push(obj)
          photoArrayItem.push(post.first_image);
          postPhotosArray.push(photoArrayItem);
        });


        this.setState({
          pixxy: responseJson.pixxys,
          pixxyImages: postPhotosArray,
          allListPixxy: ListOfImages,
          loadingNewsFeed: false,
          // more: false,
          loading: false,
          isRefreshing: false,
        });
      } else {
        this.setState({ pixxy: [] });
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  
  goBack = () => { this.props.navigation.pop() };

  onRefresh = () => {
    this.setState(
      {
        isRefreshing: true,
        newsFeed: [],
        loadingNewsFeed: true,
        // more: false,
        suggested: [{}, {}, {}, {}],
        pixxy: [],
      },
      () => {
        this.requestHandlerGetPixxy('get-pixxy');
      },
    );
  };

  updateState = state => { this.setState(state) };

  pixxyShow() {
    const { allListPixxy} = this.state;
    return (
      <View style={{ margin: wp(3) }}>
        <MasonryList
          sorted={true}
          onPressImage={(obj, index) => {

            this.setState({
              modalVisible: true,
              viewerIndex: obj.imageIndex,
              viewerContent: {
                photos: obj.item.photo_pixxy,
                // photos: obj.item.pixxy_photos,
                isPost: true,
                ...obj.item
              }
            })
          }}
          renderIndividualFooter={(item) => {
          let extension = item?.item?.first_image?.split('.').pop()
          
              return (
                <View>
             { item.item.pixxy_photos.length > 1 ?
                  <Badge
                    value={item?.item?.pixxy_photos?.length}
                    badgeStyle={{backgroundColor:PINK,}}
                    textStyle={{color:White,fontSize:labelFont,}}
                    containerStyle={{position:'absolute',top:-30,right:10,}}
                  />
                  : null 
                  }

                  {
                     extension == 'jpeg' ||
                     extension == 'jpg' ||
                     extension =='gif' ||
                     extension =='png' ? null : 
                     <View
                      style={{
                        position:'absolute',
                        left:15,
                        right:0,
                        top:item.dimensions.height >150 ? -(item?.dimensions?.height): -(item?.dimensions?.height),
                        height:30,
                        width:30,
                      }}
                     >
                     <Icon
                      name={'video-camera'}
                      type={'Entypo'}
                      style={{
                        fontSize:20,
                        top:15,
                        color:White , 
                       }}
                     />
                     </View>
                  }
                </View>
              )
          }}
          imageContainerStyle={{ borderRadius: 15, margin:3 }}
          images={allListPixxy}
        />
      </View>
    )
  }

   updateShareCount = (id) => {
    
    var updateAllListPixxy = this.state.allListPixxy;
    let newContent=this.state.viewerContent;
    updateAllListPixxy.forEach((item) => {
      let newItem=item.item;
    
     
      if (newItem.post_id == id) {
        if (newItem?.shared_info?.post_share) {
          newItem.shared_info.post_share = Number(newItem.shared_info.post_share) + 1
          newContent.shared_info.post_share = Number(newContent.shared_info.post_share) + 1
        }
        else {
          newItem.post_share = Number(newItem.post_share) + 1;
          newContent.post_share = Number(newContent.post_share) + 1
        }
      }

    });
   
    this.setState({ allListPixxy: updateAllListPixxy,viewerContent:newContent })
  }

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

  render() {
    console.log(this.state.allListPixxy)
    const {
      loading,
      isOwner,
      loadingPets,
      loadingSuggested,
      loadingNewsFeed,
    } = this.state;
 
    return (
      <Container style={styles.container}>
        <ImageViewerModal
          viewerContent={this.state.viewerContent}
          modalVisible={this.state.modalVisible}
          updateState={this.updateState}
          pixxyData={true}
          updateShareCount={this.updateShareCount}
          handleComments={this.handleComments}
        />
        {loading && loadingPets && loadingSuggested ? (
          <PlaceholderLoader />
        ) : (
            <>
              <Content
                nestedScrollEnabled={false}
                scrollEnabled={false}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                  <RefreshControl
                    colors={[HEADER, '#9Bd35A', '#689F38']}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.onRefresh()}
                  />
                }>
                {isOwner ? (
                  <View style={{
                    marginBottom: 20,
                    borderTopColor: '#ffff',
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.32,
                    shadowRadius: 5.46,

                    elevation: 9,
                  }}>

                    <View style={{
                      paddingBottom: RFValue(15), paddingHorizontal: wp(5), backgroundColor: 'white',
                    }}>
                      <TouchableOpacity
                        onPress={() => {
                          // NavigationService.navigate('PixxyCreateView');
                          this.props.navigation.navigate({
                            routeName: 'PixxyCreateView',
                            key: 'PixxyCreateView',
                            params: { pet_id: this.props.pet_id },
                          });
                        }}
                        style={{ flex: 1 }}>
                        <View style={{
                          flexDirection: 'row',
                          backgroundColor: '#FFFFFF',
                          marginTop: hp(3),
                        }}>

                          <View
                            style={styles.shareOuterView}>
                            <Text style={styles.shareText}>Share your pet pictures and videos</Text>
                          </View>
                        </View>

                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
                <View
                  style={styles.pixxyShowView}>
                  {!loadingNewsFeed ? (
                    this.state.pixxy.length > 0 ? (
                      <>
                        {this.pixxyShow()}
                      </>
                    ) : (
                        <View
                          style={styles.noPixxyView}>
                          <Text style={styles.noMemory}>Pixxy has no memory</Text>
                        </View>
                      )
                  ) : (
                      <PlaceholderLoader />
                    )}
                </View>
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
)(PixxyPetView);