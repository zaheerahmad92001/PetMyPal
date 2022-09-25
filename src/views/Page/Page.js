import React, { useState } from 'react';
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
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import styles from './styles';
import {
  Container,
  Content,
  Icon,
} from 'native-base';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { userEdit, saveWorkSpace } from '../../redux/actions/user';
import { RFValue } from 'react-native-responsive-fontsize';
import { THEME_FONT } from '../../constants/fontFamily';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import requestRoutes from '../../utils/requestRoutes';
import AsyncStorage from '@react-native-community/async-storage';
import { HEADER } from '../../constants/colors';
import { BLUE_NEW } from '../../constants/colors';
import LottieView from 'lottie-react-native';
import OneSignal from 'react-native-onesignal';
import WhatsYourMind from './../common/WhatsYourMind';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import ShareModal from '../shareModal/index';
import { LIKE_URL, LOVE_URL, SAD_URL, ANGRY_URL, HAHA_URL, WOW_URL } from '../../constants/ConstantValues';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RenderItemCard from '../../components/common/RenderItemCard';
import { commonState } from '../../components/common/CommomState';
import { petMyPalPagesApiService } from '../../services/PetMyPalPagesApiService';
const { petOwnerPageNewsFeed, petOwnerLikePage, postReaction } = petMyPalPagesApiService;
import EventEmitter from '../../services/eventemitter';




const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

class Page extends React.Component {
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
      page: {},
      likeLoading: false,
      page_id: '',
      isOwner: false,
      img: [],
      loadingSuggested: true,
      suggested: commonState.suggested,
      pets: [{}],
      newsFeed: this.props.user?.pageNewsFeed ?? [],
      loadingNewsFeed: true,
      more: false,
      lastPostId: '',
      token: '',
      visible: true,
      showModal: false,
      endOfData: false,
      reaction: commonState.reaction,
      months: commonState.months,
      postIndex: null,
      start: false,
      isRefreshing: false,
      feelingsData: commonState.feelingsData,
      modalVisible: false,
      isLiked: false,
      viewerContent: {
        reaction: {},
      },
      shareModalVisible: false,
    };




    this.checkPageStatus = this.checkPageStatus.bind(this);
    this.updatePageNewsFeed = this.updatePageNewsFeed.bind(this);
    this.endData = this.endData.bind(this);

    EventEmitter.on('pageNewsFeed', this.updatePageNewsFeed);
    EventEmitter.on('endPageNewsFeed', this.endData);

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
    clearTimeout(this.refreshTimer)
  }


  componentDidMount() {
    this.checkPageStatus();

  }

  async checkPageStatus() {
    let  isOwner = false;
    if (
      this.props.navigation.getParam('page').user_id ===
      this?.props?.user?.user_data.user_id
    ) {
      isOwner = true;
    }
    let isLiked = this.props.navigation.getParam('joinStatus')
    const TOKEN = await AsyncStorage.getItem(ACCESS_TOKEN);
    const page_id = this.props.navigation.getParam('page').page_id;
    this.setState({
      isLiked,
      isOwner,
      page: this.props.navigation.getParam('page'),
      page_id: page_id,
      loading: false,
      token: JSON.parse(TOKEN).access_token,
    })
    this.props.petOwnerPageNewsFeed(page_id, JSON.parse(TOKEN).access_token, 'get_page_posts', false, 'firstTimeLoadData');
  }

  updatePageNewsFeed(data) {
    this.setState({ newsFeed: data, loadingNewsFeed: false, more: false });
  }
  endData(value) {
    this.setState({ endOfData: value })

  }
  postReact(index, item, reaction) {
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
  //TODO NOT SURE WHETHTER IT IS NECSSARY OR NOT 


  // likePage(status){
  //   this.setState({
  //     isLiked: status=="liked"?true:false,
  //   });
  // }

  // componentWillReceiveProps(props) {
  //   if (this.props.commentCount !== 0 && this.state.postIndex !== null) {
  //     let newsFeed = [...this.state.newsFeed];
  //     newsFeed[this.state.postIndex].post_comments =
  //       Number(this.state.newsFeed[this.state.postIndex].post_comments) +
  //       this.props.commentCount;
  //     this.setState({
  //       newsFeed,
  //       postIndex: null,
  //     });
  //   }
  //   this.getAccessToken().then(TOKEN => {
  //     this.setState({
  //       page: this.props.navigation.getParam('page'),
  //       page_id: this.props.navigation.getParam('page').page_id,
  //       loading: false,
  //       token: JSON.parse(TOKEN).access_token,
  //     });
  //     this.requestHandlerNewsFeed('get_page_posts');
  //   });
  // }
  goBack = () => {
    this.props.navigation.pop();
  };

  reactions = (item, index) => {
    const { newsFeed } = this.state;
    const scope = this;
    setTimeout(function () {
      (newsFeed[index].reactionVisible = false), scope.setState({ newsFeed });
    }, 4000);

    return (
      <View
        style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity
          onPress={() => {
            this.postReact(index, item, 'Like');
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{ uri: LIKE_URL }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.postReact(index, item, 'Love');
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{ uri: LOVE_URL }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.postReact(index, item, 'HaHa');
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{ uri: HAHA_URL }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.postReact(index, item, 'Wow');
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{ uri: WOW_URL }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.postReact(index, item, 'Sad');
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri: SAD_URL
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.postReact(index, item, 'Angry');
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri: ANGRY_URL
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

  renderItemCard = ({ item, index }) => {
    const { newsFeed, reaction } = this.state;
    return (
      <RenderItemCard
       nodeRef={(ref,id)=>{}}
        getFeelingIcon={this.getFeelingIcon}
        item={item}
        index={index}
        state={this.state}
        props={this.props}
        openComments={(item, index) => {
          this.setState(
            { postIndex: index },
            this.props.onCommentDataChange(item.get_post_comments, item),
            this.props.commentOpen(),
          );
        }}
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
        is_reacted={(item) => {
          item.reaction.is_reacted
            ? () => {
              item.reaction.is_reacted = false;
              item.reaction.count = item.reaction.count - 1;
              item.reaction.type = '';
              this.setState(
                { newsFeed },
                // () => this.requestHandlerPostReaction("post-actions", '', item)
              );
            }
            : () => {
              item.reaction.count = item.reaction.count + 1;
              item.reaction.type = 'Like';
              item.reaction.is_reacted = true;
              this.setState({ newsFeed }, () =>
                this.props.postReaction(this.state.token, item.post_id, 'Like')
              );
            }
        }}
        onPressOut={() => (newsFeed[index].reactionVisible = false)}
        onLongPress={() => {
          newsFeed[index].reactionVisible = true;
          this.setState({ newsFeed });
        }}
        reactions={() => this.reactions(item, index)}
        shareModalVisible={() => this.setState({
          shareModalVisible: true,
          viewerContent: {
            index,
            ...item,
          },
        })}
      />
    );
  };

  onRefresh = () => {
    this.setState(
      {
        isRefreshing: true,
        loadingNewsFeed: true,
        more: false,
        suggested: [{}, {}, {}, {}],
      },
      () => {
        this.props.petOwnerPageNewsFeed(this.state.page_id, this.state.token, 'get_page_posts', false, 'firstTimeLoadData');
      },
    );
    this.refreshTimer = setTimeout(() => { this.setState({ isRefreshing: false }) }, 3000);
  };

  likePage = async type => {
    this.props.petOwnerLikePage(this.state.token, this.state.page_id);
    this.setState({ isLiked: !this.state.isLiked })
  };

  updateState = state => {
    this.setState(state);
  };

  render() {
    const {
      isOwner,
      page,
      loading,
      loadingPets,
      loadingSuggested,
      newsFeed,
      imageViewer,
      loadingNewsFeed,
      visible,
      more,
      img,
      likeLoading,
      isLiked,
      userProfilePic,
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
        {loading  ? (
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
                    if (!this.props.pages.moreData) {
                      this.distanceFromEnd = currentItemIndex + 5

                      this.props.petOwnerPageNewsFeed(this.state.page_id, this.state.token, 'get_page_posts', true, 'moreLoadData');

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
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => this.onRefresh()}
                />
              }>
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
                      style={{ fontSize: 30, color: 'black' }}
                    />
                  </TouchableOpacity>
                  <Image
                    resizeMode='cover'
                    style={styles.coverImg}
                    source={{
                      uri: page.cover
                        ? page.cover
                        : 'https://res.cloudinary.com/n4beel/image/upload/v1595058775/pattern_2_xhmx4n.png',
                    }}
                  />

                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                <View style={{
                  borderColor: '#0000', // if you need 
                  // overflow: 'hidden',
                  borderWidth: 1,
                  elevation: 5,
                  shadowColor: '#0000',
                  shadowOpacity: 12,
                  // shadowRadius: 10,
                  marginTop: hp(-8),
                  backgroundColor: '#fff',
                  height: hp(35),
                  borderRadius: 20,
                  width: wp(88)
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                    <View style={{ marginLeft: 20 }}>
                      {isOwner ? (
                        <TouchableOpacity
                          style={{
                            width: RFValue(35),
                            height: RFValue(35),
                          }}>
                        </TouchableOpacity>

                      ) : null}
                    </View>
                    <View style={{ marginTop: hp(-7) }}>

                      <View style={{
                        width: 90,
                        height: 95,
                        borderRadius: 10,
                        // marginTop: -50,
                        // marginHorizontal: 20,
                        backgroundColor: 'grey',
                      }}>
                        <Image
                          style={styles.profileImg}
                          source={{
                            uri: page.avatar
                              ? page.avatar
                              : 'https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600134.jpg',
                          }}
                        />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: hp(-2) }} >
                      <View style={{ marginRight: 20 }}>
                        {isOwner ? (
                          <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate({
                              routeName: 'EditPage',
                              key: 'EditPage',
                              params: { page, newPage: false },
                            });
                          }}
                            style={{
                              width: RFValue(35),
                              height: RFValue(35),
                            }}>
                            <Image
                              style={styles.profileImg}
                              source={require('./../../assets/images/updated/EditPic.png')}
                            />
                          </TouchableOpacity>

                        ) : null}
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ marginVertical: wp(3) }}>

                      <Text style={{ color: '#182A53', fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>
                        {page.page_title}
                      </Text>
                      <Text style={{ color: '#8B94A9', textAlign: 'center' }}>
                        @{page.page_name}
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginHorizontal: 3 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flexDirection: 'column', flex: 3, alignItems: 'flex-end', justifyContent: 'center' }}>
                          <View style={styles.infoIconContainer}>
                            <Image
                              style={styles.infoIcon}
                              source={{
                                uri:
                                  'https://res.cloudinary.com/n4beel/image/upload/v1595413810/gender_lgrprr.png',
                              }}
                            />
                          </View>
                        </View>
                        <View style={{ flexDirection: 'column', flex: 7, justifyContent: 'center' }}>
                          <Text style={styles.infoDetailText}>

                            {page.likes} Likes
                          </Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'column', flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <View style={{ flexDirection: 'column', flex: 3, alignItems: 'flex-end', justifyContent: 'center' }}>
                            <View style={styles.infoIconContainer}>
                              <Image
                                style={styles.infoIcon}
                                source={{
                                  uri:
                                    'https://res.cloudinary.com/n4beel/image/upload/v1595414113/age_fuqgy0.png',
                                }}
                              />
                            </View>
                          </View>
                          <View style={{ flexDirection: 'column', flex: 7, justifyContent: 'center' }}>
                            <Text style={styles.infoDetailText}>
                              {page.rating} Rating
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flexDirection: 'column', flex: 7, justifyContent: 'center' }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            {isOwner === false ? (
                              <>
                                {this.props.pages?.likePageLoader ? (
                                  <ActivityIndicator
                                    size={'large'}
                                    color={HEADER}
                                    style={{ marginVertical: RFValue(5), flex: 1 }}
                                  />
                                ) : this.props.pages?.likePageLoader == false && isLiked ? (
                                  <TouchableOpacity onPress={() => this.likePage('like-page')} style={{ flexDirection: 'row', width: wp(30), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: hp(4), borderWidth: 1, borderRadius: 12, borderColor: BLUE_NEW }}>
                                    <Text style={{ fontWeight: 'bold', color: BLUE_NEW }}>Unlike</Text>
                                  </TouchableOpacity>

                                ) : (
                                  <TouchableOpacity onPress={() => this.likePage('like-page')} style={{ flexDirection: 'row', width: wp(30), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: hp(4), borderWidth: 1, borderRadius: 12, borderColor: BLUE_NEW }}>
                                    <Text style={{ fontWeight: 'bold', color: BLUE_NEW }}>Like</Text>
                                  </TouchableOpacity>
                                )}
                              </>
                            ) : null}

                          </View>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flexDirection: 'column', flex: 7, justifyContent: 'center' }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            <TouchableOpacity style={{ backgroundColor: BLUE_NEW, flexDirection: 'row', width: wp(30), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: hp(4), borderWidth: 1, borderRadius: 12, borderColor: BLUE_NEW }}>
                              <Text style={{ fontWeight: 'bold', color: 'white' }}>Invite</Text>
                            </TouchableOpacity>

                          </View>
                        </View>
                      </View>
                    </View>




                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 30, marginVertical: 20, alignItems: 'center' }}>

                    <Text numberOfLines={2} style={{ color: '#465575' }}>
                      {page.about}
                    </Text>

                  </View>
                </View>

              </View>


              {this.state.isOwner ? (
                <View style={{ marginBottom: RFValue(10) }}>
                  <WhatsYourMind StatusView={() => {
                    this.props.navigation.navigate({
                      routeName: 'StatusView',
                      params: {
                        page_id: page.page_id,
                        page,
                      },
                    });
                  }} />
                </View>
              ) : null}
              <View style={{ flex: 1 }}>
                {this.state.newsFeed.length > 0 ? (
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
                ) : this.state.endOfData ? <Text
                  style={{
                    textAlign: 'center',
                    fontSize: RFValue(18),
                    fontFamily: THEME_FONT,
                    textAlignVertical: 'center',
                  }}>
                  No News Feed Available for page
                </Text> : (
                  <View style={{ width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'center' }}><LottieView style={{ height: 80 }} autoPlay source={require('../../assets/lottie/loader-black.json')} /></View>
                )}
              </View>

              {this.props.pages.moreData ? (
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
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  workspace: state.user.workspace,
  pages: state.pages
});

export default connect(
  mapStateToProps,
  { userEdit, saveWorkSpace, petOwnerPageNewsFeed, petOwnerLikePage, postReaction },
)(Page);
