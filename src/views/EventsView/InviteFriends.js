import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image
} from 'react-native';
import styles from './styles';
import {
  Container,
  Left,
  Body,
  Right,
  ListItem,
  
} from 'native-base';
import {BG_DARK, BLUE_NEW, TEXT_INPUT_LABEL, } from '../../constants/colors';
import { inviteEvent } from '../../services/index';

import { connect } from 'react-redux';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import PropTypes from 'prop-types';
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import PMPHeader from '../../components/common/PMPHeader';
import { RFValue } from 'react-native-responsive-fontsize';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { black} from '../../constants/ConstantValues'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import requestRoutes from '../../utils/requestRoutes';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import { LongAboutParseHtml, ShortAboutParseHtml , Replacebr} from '../../components/helpers';


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
      loading: false,
      followers: [],
      change: false,
      invitedUserList:this.props.navigation.state.params.event.invitedUsers
    };
  }

  componentDidMount() {
    this.getFollowFollowing('get-friends');
  }

  goBack = () => {
    this.props.navigation.pop();
  };

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  async getFollowFollowing(type) {
    this.getAccessToken().then(async token => {
      this.setState({ loading: true });
      const data = new FormData();

      data.append('server_key', server_key);
      data.append('type', 'followers');
      data.append('user_id', this?.props?.user?.user_data.user_id);
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
        console.log('response follow', responseJson);
        if (responseJson.api_status === 200) {
          this.setState({
            loading: false,
            followers: responseJson.data.followers,
          });
        } else {
          this.setState({ loading: false });
        }
      } catch (error) {
        console.log(error);
        this.setState({ loading: false });
      }
    });
  }
 
  renderItem = ({ item, index }) => {
    const  event  = this.state?.invitedUserList??[];
    const details=this.props.navigation.state.params.event;
  
 const Avatar = item.avatar && typeof item.avatar === 'string' && (item.avatar.split('https://')[1] || item.avatar.split('http://')[1]) ? item.avatar : null;

    var checkIndex=event?.indexOf(item?.user_id);
    return (
      <>
        <View
          key={index}
          style={{
            flex: 1,
            // backgroundColor: index % 2 == 0 ? '#FFFFFF' : '#E8F6FC',
            marginVertical: wp(1),
          }}>
          <ListItem
            style={{ marginBottom: wp(2) }}
            noBorder
            avatar
            onPress={() => {
              if (item.user_id == this?.props?.user?.user_data.user_id) {
                this.props.navigation.navigate('UserProfile');
              } else if (item.parent_id !== '0') {
                this.props.navigation.navigate({
                  routeName: 'PetProfile',
                  key: 'PetProfile',
                  params: { item :item.user_id},
                });
              } else {
                this.props.navigation.navigate({
                  routeName: 'Profile',
                  key: 'Profile',
                  params: { user_id: item.user_id },
                });
              }
            }}>
            <Left style={{ justifyContent: 'center' }}>
             
         {
           Avatar
           ? 
              <FastImage
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'black',
                  width: RFValue(45),
                  height: RFValue(45),
                  borderRadius: 10,
                }}
                source={{ uri: Avatar }}
              />
               :
              <Image
              style={{
                alignSelf: 'center',
                backgroundColor: 'black',
                width: RFValue(45),
                height: RFValue(45),
                borderRadius: 10,
              }}
              source={black}
            />
  } 
          </Left>
            <Body style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.eNameText} numberOfLines={1} note>
                  {item?.full_name}
                </Text>
                <Text numberOfLines={2} style={styles.eContentText} note>
                  {
                   item.about? ShortAboutParseHtml(item.about).replace(/<br>/g,'\n')
                  // item.about ? item.about.replace(/<br>/g,'\n') 
                  : null}
                </Text>
              </View>

            </Body>
            <Right style={{ justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <TouchableOpacity
                 disabled={checkIndex==-1?false:true}
                  style={{
                    flexDirection: 'row',
                    width: wp(20),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: hp(4),
                    borderWidth:1,
                    borderRadius: 10,
                    borderColor:checkIndex==-1? BLUE_NEW : TEXT_INPUT_LABEL
                  }}
                  onPress={() => {
                    
                    this.setState({eventLoading: true, change: true.valueOf})
                    inviteEvent(item.user_id, details.id, (value) =>{
                      if(value==1){
                        this.props.navigation.state.params.event.invitedUsers.push(item.user_id);
                      }
                    this.setState({eventLoading: false, change: false,invitedUserList:value==1?[...this.state.invitedUserList,item.user_id]:this.state.invitedUserList})
                    })
                  }}>
                  <Text numberOfLines={1} style={{ fontWeight: '700', color:checkIndex==-1?BLUE_NEW:TEXT_INPUT_LABEL }} note>
                   {checkIndex==-1?'Invite':'Invited'}
            </Text>
                </TouchableOpacity>

              </View>
            </Right>
          </ListItem>
        </View>
      </>
    );
  };

  render() {
  
    const { loading, followers } = this.state;
    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        <PMPHeader centerText={'My Pages'}
          ImageLeftIcon={'arrow-back'}
          LeftPress={() => this.props.navigation.pop()}
          RightPress={() => { }}
          centerText={'Invite'} />
        {loading ? (
          <PlaceholderLoader change={this.state.change}/>
        ) : (
            <FlatList
              disableVirtualization={true}
              ref={ref => {
                this.flatList = ref;
              }}
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled={true}
              scrollEnabled={true}
              horizontal={false}
              data={followers}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
              style={{ marginVertical: RFValue(5) }}
            />
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
)(NotificationsView);
