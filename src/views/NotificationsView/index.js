import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  Image,
  TextInput,
  Keyboard,
  FlatList,
} from 'react-native';
import styles from './styles';
import {
  Container,
  Button,
  Icon,
  Drawer,
  Left,
  Body,
  Right,
  ListItem,
  Card,
} from 'native-base';
import {connect} from 'react-redux';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import {darkSky, HEADER} from '../../constants/colors';
import PropTypes from 'prop-types';
import {userEdit, userSave, saveWorkSpace} from '../../redux/actions/user';
import PMPHeader from '../../components/common/PMPHeader';
import {RFValue} from 'react-native-responsive-fontsize';
import {SERVER, server_key} from '../../constants/server';
import {ACCESS_TOKEN} from '../../constants/storageKeys';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import requestRoutes from '../../utils/requestRoutes';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import {notificationRemove} from '../../redux/actions/notifications';
import {petMyPalGroupApiService} from '../../services/PetMyPalGroupApiService';
const {getOwnerJoinedGroups} = petMyPalGroupApiService;
import NothingSvg from '../../assets/Pixxy/noPixxy.svg';


import {menuImg} from '../../constants/ConstantValues';

class NotificationsView extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      loading: true,
    };
  }

  componentDidMount() {
      
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.notificationData();
    });
    this.notificationData();
  }
  notificationData() {
    this.props.notificationRemove();
    this.getJoinedGroups();
    this.requestHandlerNotificationData('get-general-data');
  }
  componentWillUnmount() {
    this.focusListener;
  }
  goBack = () => {
    this.props.navigation.pop();
  };

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }
  async getJoinedGroups() {
    this.getAccessToken().then(async token => {
      this.props.getOwnerJoinedGroups(
        JSON.parse(token).access_token,
        this.props.user?.user_data?.user_id,
        'joined_groups',
      );
    });
  }
  async requestHandlerNotificationData(type) {
    this.getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('fetch', 'announcement,group_chat_requests,notifications');

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
        // console.log('responseJson.notifications',responseJson.notifications);
        if (responseJson.api_status === 200) {
          this.setState({
            notifications: responseJson.notifications,
            loading: false,
          });
        } else {
          this.setState({notifications: [], loading: false});
        }
      } catch (error) {
        console.log(error);
        this.setState({loading: false});
      }
    });
  }

  renderItem = ({item, index}) => {
    // if(item?.group_id!='0'){
    // console.log('item?.type_text',item);
    // }
    let id = item?.group_id;
    return (
      <View
        key={index}
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          marginVertical: wp(1),
        }}>
        <ListItem
          key={index}
          noBorder
          avatar
          style={{marginBottom: wp(2)}}
          onPress={() => {
            if (
              item?.type == 'visited_profile' ||
              item?.type == 'following' ||
              item?.type == 'interested_event' ||
              item?.type == 'going_event' ||
              item?.type== "following_request"||
              item?.type == "accepted_request"

            ) {
              this.props.navigation.navigate({
                routeName: 'Profile',
                key: 'Profile',
                params: {
                  user_id: item?.notifier?.user_id}
                
              });
            }
            else if(  item?.type == 'comment' ||
            item?.type == 'reaction' ){
              this.props.navigation.navigate({
                routeName: 'PostDetail',
                key: 'PostDetail',
                params: item
              
              });

            }
            else if(item.type=='viewed_story'){
              console.warn('we need stories array!') //! we are not getting array of stories so we cannot navigate to story screens.
            }
            else if (item?.type == 'invited_event') {
              this.props.navigation.navigate({
                routeName: 'EventDetails',
                key: 'EventDetails',
                params: {
                  // item: this.props?.events?.find(item => item?.id == event_id),
                  item: item?.event,
                  btnShow: true,
                  goingShow: true,
                  interestShow: true,
                },
              });
            }             
            else if (item.type == 'send_message') {
              this.props.navigation.navigate({
                routeName: 'Chat',
                key: 'Chat',
                params: {
                  userId: item?.notifier?.user_id,
                  avatar: item?.notifier?.avatar,
                },
              });
            } else if (item.post_id != '0') {
              this.props.navigation.navigate({
                routeName: 'Profile',
                key: 'Profile',
                params: {
                  user_id: item?.notifier?.user_id,
                  post_id: item?.post_id,
                },
              });
            } else if (item?.group_id!='0') {

              this.props.navigation.navigate({
                routeName: 'Group',
                key: 'Group',
                params: {
                  group: this.props?.joinedGroups.find(
                    item => item?.id == id,
                  ),
                  item,
                  joinStatus: true,
                },
              });
            }else if(item?.type=='group_admin'){
              console.log('mein andar aa gy hn');
              this.props.navigation.navigate({
                routeName: 'Group',
                key: 'Group',
                params: {
                  group: this.props?.joinedGroups.find(
                    item => item?.id == id,
                  ),
                  item,
                  joinStatus: true,
                },
              });

            }
          }}>
          <Left style={{justifyContent: 'center'}}>
            <Image
              style={{
                alignSelf: 'center',
                backgroundColor: 'black',
                width: RFValue(45),
                height: RFValue(45),
                borderRadius: 10,
              }}
              source={{uri: '' + item?.notifier?.avatar}}
            />
          </Left>
          <Body>
            <View style={{}}>
              <Text style={styles.eNameText} numberOfLines={1} note>
                {item?.notifier?.full_name}
              </Text>
            </View>
            <Text numberOfLines={1} style={[styles.eContentText]} note>
              {item?.type_text}
               
            </Text>
          </Body>
          <Right>
            <Text style={styles.timeText} numberOfLines={1} note>
              {item.time_text_string}
            </Text>
          </Right>
        </ListItem>
      </View>
    );
  };

  render() {
    const {notifications, loading} = this.state;
    return (
      <Container style={styles.container}>
        <StatusBar
          backgroundColor={'white'}
          barStyle={'dark-content'}
          translucent={false}
        />
        <SafeAreaView />
        <PMPHeader
          LeftPress={this.props.drawerOpen}
          centerText={'Notifications'}
        />

        {loading ? ( <PlaceholderLoader />) : 
         notifications?.length > 0 ? (
          <FlatList
            disableVirtualization={true}
            ref={ref => {
              this.flatList = ref;
            }}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
            scrollEnabled={true}
            horizontal={false}
            data={notifications}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            style={{marginVertical: RFValue(5)}}
          />
        ): 
        <View style={styles.nothingSVG}><NothingSvg/></View>
      
      }
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    joinedGroups: state.groups?.joinedGroups,
    following: state?.user?.follow_followers?.following,
    events: state?.events?.events?.InvitedEvents,
  };
};

export default connect(
  mapStateToProps,
  {notificationRemove, saveWorkSpace, getOwnerJoinedGroups},
)(NotificationsView);
