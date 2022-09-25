import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import styles from './styles';
import {
  Container,
  Tab,
  Tabs,
  Left,
  Body,
  Right,
  ListItem,
  ScrollableTab,
  Icon,
} from 'native-base';
import { connect } from 'react-redux';
import { BGCOLOR, PINK } from '../../constants/colors';
import PropTypes from 'prop-types';
import { userEdit, userSave, saveWorkSpace, followFollower } from '../../redux/actions/user';
import PMPHeader from '../../components/common/PMPHeader';
import { RFValue } from 'react-native-responsive-fontsize';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import { no_data_default_img } from '../../constants/ConstantValues';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import ErrorModal from '../../components/common/ErrorModal';
import { Capitalize } from '../../utils/RandomFuncs';
import ConfirmModal from '../../components/common/ConfirmModal';
import { NavigationEvents } from 'react-navigation';
import { ShortAboutParseHtml } from '../../components/helpers';
import OnlineSvg from '../../assets/onlineStatus/Online.svg';
import OfflineSvg from '../../assets/onlineStatus/Offline.svg';

let tempArray = []
let tempFollowing = []

class Followers extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loading: true,
      followers: [],
      following: [],
      isErrorModal_Visible: false,
      isConfirm_Modal_visible: false,
      unfollowMsg: '',
      unfollowUserId: '',
      unfollowInProcess: false,
      userAvatar: '',
      followingName: '',
      token: '',
      uId: '',
      logedInUser: this?.props?.user?.user_data.user_id,
      randomKey: 'Profile',
      refreshing:false,
      requestStatus:null,
      isFollowed:null,
      followRequest:null,
      isFollowed:null
    };
  }

  componentDidMount() {
    let _params = this.props.navigation.state.params
    let ID = ''
    if (_params) {
      ID = this.props.navigation.state.params.currentUserId
    } else {
      ID = this?.props?.user?.user_data.user_id
    }

    let r = Math.random().toString(36).substring(7);

    this.getAccessToken().then(TOKEN => {
      this.setState({
        uId: ID,
        token: JSON.parse(TOKEN).access_token,
        randomKey: r    /// important 
      }, () => {

        /*********** Guest User`s followers and following  ****************/

        this.getFollowFollowing();

      });
    });
  }

  goBack = () => {
    this.props.navigation.pop();
  };

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  getFollowFollowing = async () => {

    const { token, uId, logedInUser } = this.state
    this.setState({ loading: true });
    const formData = new FormData();

    formData.append('server_key', server_key);
    formData.append('type', 'followers,following');
    formData.append('user_id', uId);
    const response = await petMyPalApiService.followFollowing(token, formData).catch((e) => {

      this.setState({
        isErrorModal_Visible: true,
        errorMessage: Capitalize(e.errors.error_text),
        refreshing:false
      });
    })
    
    const { data } = response
    if (data?.api_status === 200) {
      let followers = data?.data?.followers
      let following = data?.data?.following

      /************* logedIn User ******************/

      if (uId === logedInUser) {
        let ff = {
          followers,
          following
        }
        this.props.saveFollowFollowers(ff)

        /*********************** Followers  **********************/
        tempArray = []
        followers.map((item, index) => {
          tempArray.push({ ...item, following: false })
        })

        tempArray.map((item, index) => {
          var userid = item?.user_id
          following.forEach((element) => {
            if (element.user_id == userid) {
              tempArray[index].following = true
              return true
            }
          });
        })
        /**************************** end Followers  *****************/

        /**************************** Following  *****************/

        tempFollowing = []
        following.map((item, index) => {
          tempFollowing.push({ ...item, following: false })
        })
        tempFollowing.map((item, index) => {
          var userid = item.user_id
          following.forEach((element) => {
            if (element.user_id == userid) {
              tempFollowing[index].following = true
              return true
            }
          });
        })
      }
      /********************** logedIn User end *******************/
      else {
        let logedInUserFollowing = this.props?.followFollowers?.following
        /****************************** Followers *******************************/
        tempArray = []
        followers.map((item, index) => {
          tempArray.push({ ...item, following: false })
        })

        tempArray.map((item, index) => {
          var userid = item?.user_id
          logedInUserFollowing.forEach((element) => {
            if (element.user_id == userid) {
              tempArray[index].following = true
              return true
            }
          });
        })
        /********************************* Followers **************************/

        /***************************** Following *****************************/
        tempFollowing = []
        following.map((item, index) => {
          tempFollowing.push({ ...item, following: false })
        })

        tempFollowing.map((item, index) => {
          var userid = item?.user_id
          logedInUserFollowing.forEach((element) => {
            if (element.user_id == userid) {
              tempFollowing[index].following = true
              return true
            }
          });
        })
      }
      /******************************* Following end **********************/
      this.setState({
        loading: false,
        loaded: true,
        followers: tempArray,
        following: tempFollowing,
        refreshing:false
        // following: data.data.following,
      })

    } else {
      this.setState({
        loading: false,
        loaded: true,
        isErrorModal_Visible: true,
        errorMessage: Capitalize(data.errors.error_text),
        refreshing:false
      })
    }

  }

  UpdatedFollowFollowing = async () => {

    const { token, uId, logedInUser } = this.state

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('type', 'followers,following');
    formData.append('user_id', uId);
    const response = await petMyPalApiService.followFollowing(token, formData).catch((e) => {
      this.setState({
        isErrorModal_Visible: true,
        errorMessage: Capitalize(e.errors.error_text)
      });
    })
    const { data } = response
    if (data?.api_status === 200) {
      let followers = data?.data?.followers
      let following = data?.data?.following

      /************* logedIn User ******************/

      if (uId === logedInUser) {
        let ff = {
          followers,
          following
        }
        this.props.saveFollowFollowers(ff)

        /*********************** Followers  **********************/

        tempArray = []
        followers.map((item, index) => {
          tempArray.push({ ...item, following: false })
        })

        tempArray.map((item, index) => {
          var userid = item?.user_id
          following.forEach((element) => {
            if (element.user_id == userid) {
              tempArray[index].following = true
              return true
            }
          });
        })
        /*********************** end Followers  **********************/

        /**************************** Following  *****************/

        tempFollowing = []
        following.map((item, index) => {
          tempFollowing.push({ ...item, following: false })
        })
        tempFollowing.map((item, index) => {
          var userid = item?.user_id
          following.forEach((element) => {
            if (element.user_id == userid) {
              tempFollowing[index].following = true
              return true
            }
          });
        })

      }
      /********************** logedIn User end *******************/

      else {
        let logedInUserFollowing = this.props?.followFollowers?.following
        /****************************** Followers *******************************/
        tempArray = []
        followers.map((item, index) => {
          tempArray.push({ ...item, following: false })
        })

        tempArray.map((item, index) => {
          var userid = item?.user_id
          logedInUserFollowing.forEach((element) => {
            if (element.user_id == userid) {
              tempArray[index].following = true
              return true
            }
          });
        })
        /********************************* Followers **************************/

        /***************************** Following *****************************/
        tempFollowing = []
        following.map((item, index) => {
          tempFollowing.push({ ...item, following: false })
        })

        tempFollowing.map((item, index) => {
          var userid = item?.user_id
          logedInUserFollowing.forEach((element) => {
            if (element.user_id == userid) {
              tempFollowing[index].following = true
              return true
            }
          });
        })
      }
      /******************************* Following end **********************/

      this.setState({
        loading: false,
        loaded: true,
        followers: tempArray,
        following: tempFollowing,
      })

    } else {
      this.setState({
        loading: false,
        loaded: true,
        isErrorModal_Visible: true,
        errorMessage: Capitalize(data.errors.error_text)
      })
    }

  }

  startFollow = async (tab, index, item, userId) => {

    const { token } = this.state

    if (tab === 'followers') {

      if (tempArray[index].following) {
        tempArray[index].following = false
      } else {
        tempArray[index].following = true
      }
      this.setState({ followers: tempArray })

    }
    else if (tab === 'following') {

      if (tempFollowing[index].following) {
        tempFollowing[index].following = false
      } else {
        tempFollowing[index].following = true
      }
      this.setState({ following: tempFollowing })
    }

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('user_id', item?.user_id);
    // formData.append('user_id', id);
    const response = await petMyPalApiService.followUser(token, formData).catch((e) => {
      this.setState({
        isErrorModal_Visible: true,
        errorMessage: Capitalize(e.errors.error_text)
      });
    })
    const { data } = response
    if (data?.api_status === 200) {
           let logedInUserFollowFollowing = this.props?.followFollowers
      logedInUserFollowFollowing.following.push(item)
      this.props?.saveFollowFollowers(logedInUserFollowFollowing)

      this.UpdatedFollowFollowing()

    }

  }

  openConfirmModal = (item) => {
    this.setState({
      isConfirm_Modal_visible: true,
      unfollowMsg: `Do You Want to Unfollow ${item?.full_name?.trim()}?`,
      unfollowUserId: item?.user_id,
      userAvatar: item?.avatar,
      followingName: item?.full_name
    })
  }


  closeConfirmModal = () => {
    this.setState({ isConfirm_Modal_visible: false })
  }

  closeErrorModal = () => {
    this.setState({ isErrorModal_Visible: false })
  }

  handleUnfollowPress = async () => {

    this.setState({ unfollowInProcess: true })
    
    const { unfollowUserId, token } = this.state
    let logedInUserFollowFollowing = this.props?.followFollowers
    let logedInUserFollowing = logedInUserFollowFollowing?.following
    let logedInUserFollower = logedInUserFollowFollowing?.followers

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('user_id', unfollowUserId);
    const response = await petMyPalApiService.followUser(token, formData).catch((e) => {
      this.setState({
        isConfirm_Modal_visible: false,
        isErrorModal_Visible: true,
        errorMessage: Capitalize(e?.errors?.error_text)
      });
    })
    const { data } = response
    if (data.api_status === 200) {
      this.setState({
        isConfirm_Modal_visible: false,
        unfollowInProcess: false
      })

      let temp = []
      logedInUserFollowing.forEach((element) => {
        if (element.user_id === unfollowUserId) {
          return true
        } else {
          temp.push(element)
        }
      });
      let ff = {
        followers: logedInUserFollower,
        following: temp
      }
      this.props.saveFollowFollowers(ff)
      this.UpdatedFollowFollowing()
    }

  }

  renderFollowers = ({ item, index }) => {
    const { logedInUser, randomKey , isFollowed, requestStatus, followRequest} = this.state
    return (
      <View key={index}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
          }}>
          {index === 0 ? (
            <Text style={styles.countHeading}>
              Total Followers: {this.state.followers.length}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: index % 2 == 0 ?  '#E8F6FC':'#FFFFFF',
            marginVertical: wp(1),
          }}>
          <ListItem
            style={{ marginBottom: wp(2) }}
            noBorder
            avatar
            onPress={() => {
              if (item?.user_id == this?.props?.user?.user_data.user_id) {
                this.props.navigation.navigate('UserProfile');
              } else if (item.parent_id !== '0') {
                this.props.navigation.navigate({
                  routeName: 'PetProfile',
                  key: randomKey,
                  // key: 'PetProfile',
                  params: { item },
                });
              } else {
                this.props.navigation.navigate({
                  routeName: 'Profile',
                  key: randomKey,
                  // key: 'Profile',
                  params: {
                    user_id: item?.user_id,
                    isUserFollowed: item.following,
                    item
                  },
                });
              }
            }}>
            <Left style={{ justifyContent: 'center' }}>
              <View style={styles.onlineStatusContainer}>
            {item?.lastseen=='off'?<OfflineSvg width={15} height={20} />:<OnlineSvg width={15} height={15} />}
              </View>
              <Image
                style={styles.imgStyle}
                source={{ uri: item?.avatar }}
              />
            </Left>
            <Body style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{justifyContent:'center'}}>
                <Text style={styles.eNameText} numberOfLines={1} note>
                  {item?.full_name}
                </Text>
                <Text numberOfLines={2} style={styles.eContentText} note>
                  {ShortAboutParseHtml(item?.about)}
                </Text>
                {(item?.lastseen=='off'&&item?.lastseen_text!='Online')&&<Text style={styles.statusTime} numberOfLines={1} note>{item?.lastseen_text}</Text>}
              </View>

            </Body>
            <Right style={{ justifyContent: 'center', }}>
              {
  }
              {item?.user_id != logedInUser &&
                <View>
                  { item?.is_following==1 ?
                    <TouchableOpacity
                      onPress={() => {
                        
                        this.openConfirmModal(item)}}
                      style={styles.followingBtn}>
                      <Text numberOfLines={1} style={styles.followingStyle}>
                        Following
                      </Text>
                    </TouchableOpacity>
                    :
                    item?.is_following==2 ?
                    <TouchableOpacity
                    onPress={() => {
                      
                      this.startFollow('followers', index, item, item?.user_id)}}
                    style={styles.requestBtn}>
                    <Text numberOfLines={1} style={styles.followingStyle}>
                      Requested
                    </Text>
                  </TouchableOpacity>
                  :
                  item?.is_requested==1 ?
                  <TouchableOpacity
                  onPress={() => {
                    
                    this.startFollow('followers', index, item, item?.user_id)}}
                  style={styles.requestBtn}>
                  <Text numberOfLines={1} style={styles.followingStyle}>
                    Accept
                  </Text>
                </TouchableOpacity>
                :
                    <TouchableOpacity
                      onPress={() => {
                        
                        this.startFollow('followers', index, item, item?.user_id)}}

                      style={styles.followBtn}>
                      <Text numberOfLines={1} style={styles.followStyle}>
                        Follow
                      </Text>
                    </TouchableOpacity>
                  }
                </View> 
                
                // :
                // <View style={styles.onlineView}>
                //   <Icon
                //     name={'clock-o'}
                //     type={'FontAwesome'}
                //     style={{ fontSize: 15, color: PINK, marginRight: 5 }}
                //   />
                //   <Text style={styles.onlineText}>online</Text>
                // </View>
              }
            </Right>

          </ListItem>
        </View>
      </View>
    );
  };

  renderFollowing = ({ item, index }) => {

    const { logedInUser, randomKey, uId } = this.state
    return (
      <View key={index}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
          }}>
          {index === 0 ? (
            <Text style={styles.countHeading}>
              Total Followings: {this.state.following.length}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: index % 2 == 0 ? '#E8F6FC' : '#FFFFFF',
            marginVertical: wp(1),
          }}>
          <ListItem
            noBorder
            style={{ marginBottom: wp(2) }}
            avatar
            onPress={() => {
              if (item.parent_id !== '0') {
                this.props.navigation.navigate({
                  routeName: 'PetProfile',
                  key: 'PetProfile',
                  params: { item },
                });
              } else {
                this.props.navigation.navigate({
                  routeName: 'Profile',
                  key: randomKey,
                  // key: 'Profile',
                  params: {
                    user_id: item?.user_id,
                    isUserFollowed: item.following,
                    item
                  },
                });
              }
            }}>
            <Left style={{ justifyContent: 'center' }}>
            <View style={styles.onlineStatusContainer}>
            {item?.lastseen=='off'?<OfflineSvg width={15} height={20} />:<OnlineSvg width={15} height={15} />}
              </View>
              <Image
                style={styles.imgStyle}
                source={{ uri: item?.avatar }}
              />
            </Left>
            <Body>
              <Text style={styles.eNameText} numberOfLines={1} note>
                {item?.full_name}
              </Text>
              <Text numberOfLines={2} style={styles.eContentText} note>
                {ShortAboutParseHtml(item?.about)}
              </Text>
              {(item?.lastseen=='off'&&item?.lastseen_text!='Online')&&<Text style={styles.statusTime} numberOfLines={1} note>{item?.lastseen_text}</Text>}
            </Body>
            <Right style={{ justifyContent: 'center', }}>
              {
              item?.user_id != logedInUser ?
              logedInUser != uId ?
                item.following ?
                  <TouchableOpacity
                    onPress={() => this.openConfirmModal(item)}
                    style={styles.followingBtn}>
                    <Text numberOfLines={1} style={styles.followingStyle}>
                      Following
                    </Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity
                    onPress={() => this.startFollow('following', index, item)}
                    style={styles.followBtn}>
                    <Text numberOfLines={1} style={styles.followStyle}>
                      Follow
                    </Text>
                  </TouchableOpacity>
                :
                <TouchableOpacity
                  onPress={() => this.openConfirmModal(item)}
                  style={styles.followingBtn}>
                  <Text numberOfLines={1} style={styles.followingStyle}>
                    Following
                  </Text>
                </TouchableOpacity>
                :
                null
              }
            </Right>
          </ListItem>
        </View>
      </View>
    );
  };
onRefresh=()=>{
  this.setState({refreshing:true});
  this.getFollowFollowing();
}


  render() {
    const {
      followers,
      following,
      loaded,
      loading,
      isErrorModal_Visible,
      errorMessage,
      isConfirm_Modal_visible,
      unfollowMsg,
      unfollowInProcess,
      userAvatar,
      followingName,
    } = this.state;

    Array.isArray(followers) && followers.sort((a, b) => a.full_name.localeCompare(b.full_name));
    Array.isArray(followers) && following.sort((a, b) => a.full_name.localeCompare(b.full_name));
    return (
      <Container
     
      style={styles.container}>
       
        <PMPHeader
          ImageLeftIcon={true}
          LeftPress={this.goBack}
          centerText={'Friends'}
        />
       
        <NavigationEvents
          onDidFocus={() => this.UpdatedFollowFollowing()}
        />

        <Tabs
          renderTabBar={() => (
            <ScrollableTab style={{ backgroundColor: 'white' }} />
          )}
          initialPage={this.props.navigation.getParam('key')}>
          <Tab

            textStyle={styles.textStyle}
            tabStyle={styles.tabStyle}
            activeTextStyle={styles.activeTextStyle}
            activeTabStyle={styles.activeTabStyle}
            heading={
              this.props.navigation.getParam('hideFollowing')
                ? 'Pet Followers'
                : 'My Followers'
            }
          >
            {loading ? (
              <View style={styles.searchResultContainer}>
                <PlaceholderLoader />
              </View>
            ) : null}
            {followers.length === 0 && loaded === true ? (
              <View style={styles.searchResultContainer}>
                <Image
                  resizeMode={'contain'}
                  source={require("./../../assets/notFound/friends.png")}
                  style={{width: '100%'}}
                />
              </View>
            ) : null}

            {followers.length > 0 && loaded === true ? (
              <FlatList
                disableVirtualization={true}
                ref={ref => {
                  this.flatList = ref;
                }}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled={true}
                scrollEnabled={true}
                horizontal={false}
                data={followers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderFollowers}
                style={{ marginVertical: RFValue(5), backgroundColor: BGCOLOR }}

              />
            ) : null}
          </Tab>
          {this.props.navigation.getParam('hideFollowing') ? null : (
            <Tab
              textStyle={styles.textStyle}
              tabStyle={styles.tabStyle}
              activeTextStyle={styles.activeTextStyle}
              activeTabStyle={styles.activeTabStyle}
              heading={'My Followings'}>
              {loading ? (
                <View style={styles.searchResultContainer}>
                  <PlaceholderLoader />

                </View>
              ) : null}
              {following.length === 0 && loaded === true ? (
                <View style={styles.searchResultContainer}>
                    <Image
                  resizeMode={'contain'}
                  source={require("./../../assets/notFound/friends.png")}
                  style={{width: '100%'}}
                />
                </View>
              ) : null}
              {following.length > 0 && loaded === true ? (
                
                <FlatList
                  disableVirtualization={true}
                  ref={ref => {
                    this.flatList = ref;
                  }}
                  refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                  keyboardShouldPersistTaps="always"
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                  horizontal={false}
                  data={following}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderFollowing}
                  style={{ marginVertical: RFValue(5), backgroundColor: BGCOLOR }}
                />
              ) : null}
            </Tab>
          )}
        </Tabs>

        <ErrorModal
          isVisible={isErrorModal_Visible}
          onBackButtonPress={() => this.closeErrorModal()}
          info={errorMessage}
          heading={'Hoot!'}
          onPress={() => this.closeErrorModal()}
        />
        <ConfirmModal
          isVisible={isConfirm_Modal_visible}
          onPress={this.closeConfirmModal}
          info={unfollowMsg}
          DoneTitle={'Ok'}
          onDoneBtnPress={this.handleUnfollowPress}
          CancelTitle={'Cancel'}
          onCancelBtnPress={this.closeConfirmModal}
          processing={unfollowInProcess}
          img={userAvatar}
          name={followingName}
        />

      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  followFollowers: state.user?.follow_followers
});

const mapDispatchToProps = dispatch => ({
  saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
  saveFollowFollowers: (ff) => dispatch(followFollower(ff))
});
export default connect(mapStateToProps, mapDispatchToProps)(Followers);
