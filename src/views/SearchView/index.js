import React from 'react';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
  ScrollView,
  SafeAreaView
} from 'react-native';

import styles from './styles';
import {
  Container,
  Tab,
  Tabs,
  Icon,
  Left,
  Body,
  Right,
  ListItem,
  ScrollableTab,
} from 'native-base';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';

import { BGCOLOR, darkSky, grey, lightSky, PINK } from '../../constants/colors';
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import requestRoutes from '../../utils/requestRoutes';
import Search_Input from '../../components/common/SearchInput';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import CustomLoader from '../../components/common/CustomLoader';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import SvgMemberIcon from '../../assets/images/members-icon.svg';
import { LongAboutParseHtml , ShortAboutParseHtml} from '../../components/helpers';


class SearchView extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      search: true,
      searchText: '',
      searched: false,
      searching: false,
      users: [],
      groups: [],
      pages: [],
      pets: [],
      events: [],
      lostPets: [],
      token: '',
      currentUserId:undefined
    };

  }

  componentDidMount() {
    this.getAccessToken().then(async token => {
      this.setState({ token: JSON.parse(token).access_token });
    });
  }

  componentWillReceiveProps(props) { }

  goBack = () => {
    this.props.navigation.pop();
  };

  
  cancelRequest = (item , index, type) => {
    let temp = item
    const {users} = this.state

    this.setState({ followLoading: true })
    petMyPalApiService.confirmRequest(this.state.token, server_key, item.user_id,type) .then(response => {
        if (response.data?.api_status == 200) {
          temp.is_following = 0
          let tempUser = users.slice()
          tempUser[index] = temp
          this.setState({users:tempUser})
        }
       
    })
 }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }
  async followUser(item, index) {
    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('user_id', item.user_id);
    const response = await petMyPalApiService.followUser(this.state.token, formData).catch((e) => {
      console.warn(e)
    })
    if (response.data?.api_status === 200){
      let updateUsers = this.state.users;
      if (response.data?.follow_status == "followed") {
       updateUsers[index].is_following = 1
         
        this.setState({ users: updateUsers })
      }
      else if(response.data?.follow_status == "requested"){
        updateUsers[index].is_following = 2
        this.setState({ users: updateUsers })
      }
      else {
        updateUsers[index].is_following = 0
        this.setState({ users: updateUsers })
        
      }
    }
  }
  async blockUser(item) {
    const formData = new FormData();
    formData.append("s", this.state.token);
    formData.append('user_id', this.props.user?.user_data?.user_id);
    formData.append("block_type", "block");
    formData.append("recipient_id", item.user_id)
    const response = await petMyPalApiService.unBlockUser(formData);
    if (response.data?.api_status == 200) {
      this.setState({ users: this.state.users.filter(i => i.user_id != item.user_id) })

    }

  }


async requestHandlerSearchData(type, search) {
  this.setState({ searchText: search }, async () => {
    if (this.state.searchText.length >= 3) {

      const controller = new AbortController();
      const { signal } = controller;
      this.setState({ searched: true, searching: true });
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('search_key', search);

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
            signal
          },
        );
        const responseJson = await response.json();
      
        if (responseJson.api_status === 200) {
          let pets = responseJson.users.filter(e => e.parent_id !== '0');
          let lostPets=responseJson.users.filter(e=>e.pet_lost == '1')
         
          this.setState({
            events:responseJson.events,
            groups: responseJson.groups,
            pages: responseJson.pages,
            users: responseJson?.users,
            pets,
           lostPets,
            search: false,
            loading: false,
            searching: false,
          });
        } else {
          this.setState({ loading: true });
        }
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => controller.abort(), 5000);
    }
  });

}

  renderPetOwners = ({ item, index }) => {
    if (item.parent_id === '0') {
console.log(item, 'petowner');
      return (
        <View
          key={index}
          style={styles.pt_container}>
          <ListItem noBorder avatar
            onPress={() => {
              this.props.navigation.navigate({
                routeName: 'Profile',
                key: 'Profile',
                params: { user_id: item.user_id,item:item },
              });
            }}>
            <Left style={{ justifyContent: 'center' }}>
              <FastImage
                style={styles.imgStyle}
                source={{ uri:item?.avatar?.toString()?.includes('https')?""+ item.avatar:'' }}
              />
            </Left>
            <Body>
              <Text style={styles.eNameText} numberOfLines={1} note>{item.full_name}</Text>
              <Text style={{ color: '#8B94A9' }} numberOfLines={3} note>{LongAboutParseHtml(item?.about)}</Text>
            </Body>
            <Right>
              <View style={{ flexDirection: 'row',alignItems:'center' }}>
                <Image
                  style={styles.staticImg}
                  source={require('./../../assets/images/updated/followers-green.png')}
                />

                <Text style={styles.countText} numberOfLines={3} note>{item.details.followers_count}</Text>
                <Image
                  style={styles.staticImage}
                  source={require('./../../assets/images/updated/followings-orange.png')}
                 />

              <Text style={styles.countText} numberOfLines={3}note>{item.details.following_count}</Text>
              </View>
            </Right>
          </ListItem>
          <ScrollView showsHorizontalScrollIndicator={false} style={styles.scrollview} horizontal={true}>
            {item?.pets ? item?.pets.map((item, index) => {
              return (
                <TouchableOpacity 
                 onPress={() => {
                  this.props.navigation.navigate({
                    routeName: 'PetProfile',
                    key: 'PetProfile',
                    params: { item },
                  });
                }} 
                key={index} style={{ width: 50, height: 50, backgroundColor: '#d8effa', marginRight: wp(2), borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={{ uri: item?.avatar }} style={{ width: 50, height: 50, borderRadius: 10 }} />
                </TouchableOpacity>
              )
            }) : null}
            <Image />

          </ScrollView>
          <View style={styles.renderBtnContainer}>
          

              {
                item?.is_following == 2 ? 
                <TouchableOpacity onPress={() => this.followUser(item, index)} style={[styles.btn, { backgroundColor: item?.is_following == 1 ? '#dedede' : item?.is_following == 2? PINK : '#20ACE2' }]}>
              <Icon name={''} type="FontAwesome" 
              style={{ fontSize: 20, color: 'white', fontWeight: '400' }} />
              <Text style={{ color: 'white', marginLeft: wp(2) }}>Requested</Text>
              </TouchableOpacity>
              :
              item?.is_following == 1 ? 
              <TouchableOpacity onPress={() => this.followUser(item, index)} style={[styles.btn, { backgroundColor: item?.is_following == 1 ? '#dedede' : item?.is_following == 2? PINK : '#20ACE2' }]}>
              <Icon name={"ban" } type="FontAwesome" 
              style={{ fontSize: 20, color: 'white', fontWeight: '400' }} />
              <Text style={{ color: 'white', marginLeft: wp(2) }}>Unfollow</Text>
              </TouchableOpacity>
              :
              item?.is_following == 0 ?
              <TouchableOpacity onPress={() => this.followUser(item, index)} style={[styles.btn, { backgroundColor: item?.is_following == 1 ? '#dedede' : item?.is_following == 2? PINK : '#20ACE2' }]}>
              <Icon name={"user-plus"} type="FontAwesome" 
              style={{ fontSize: 20, color: 'white', fontWeight: '400' }} />
              <Text style={{ color: 'white', marginLeft: wp(2) }}>follow</Text>
              </TouchableOpacity>
              :
              null

              }
            <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate({
                    routeName: 'Chat',
                    key: 'Chat',
                    params: {userId: item.user_id, avatar: item.avatar,  chatName: item?.first_name},
                  });
                }} style={[styles.btn, { backgroundColor: '#dedede' }]}><Icon name="comments" type="FontAwesome" style={{ fontSize: 20, color: 'black', fontWeight: '400' }} /><Text style={{ color: 'black', marginLeft: wp(2) }}>Message</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => this.blockUser(item)} style={[styles.btn, { backgroundColor: '#F596A0' }]}><Icon name="ban" type="FontAwesome" style={{ fontSize: 20, color: 'white', fontWeight: '400' }} /><Text style={{ color: 'white', marginLeft: wp(2) }}>Block</Text></TouchableOpacity>
          </View>

        </View>
      );
    } else {
      return null;
    }
  };

  renderPages = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          marginVertical: RFValue(2),
        }}>
        <ListItem
          noBorder
          avatar
          onPress={() => {
            this.props.navigation.navigate({
              routeName: 'Page',
              key: 'Page',
              params: { page: item },
            });
          }}>
          <Left style={{ justifyContent: 'center' }}>
            <FastImage
              style={{
                alignSelf: 'center',
                backgroundColor: 'grey',
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: 10,
              }}
              source={{ uri: "" + item.avatar }}
            />
          </Left>
          <Body>
            <Text style={styles.eNameText} numberOfLines={1} note>
              {item.page_title}
            </Text>
            <Text style={styles.description} numberOfLines={1} note>
              {item.about}
            </Text>
          </Body>
        </ListItem>
      </View>
    );
  };

  renderGroups = ({ item, index }) => {
    return (
      <View
      key={item.group_id}
      style={{
        // flex: 1,
        backgroundColor:'#FFFFFF',
        marginVertical: RFValue(2),
        // backgroundColor: '#E3EDF0',
      }}>
      <ListItem
        noBorder
        avatar
        onPress={() => {

          this.props.navigation.navigate({
            routeName: 'Group',
            key: 'Group',
            params: { group: item, joinStatus: false },
          });

        }
      
      }
      >
        <Left style={{ justifyContent: 'center' }}>
          <FastImage
            style={{
              alignSelf: 'center',
              backgroundColor: 'black',
              width: RFValue(45),
              height: RFValue(45),
              borderRadius: 12,
            }}
            source={{ uri: item?.avatar?.replace(/\s/g, '') }}
          />
        </Left>
        <Body>
          <Text style={styles.eNameText} numberOfLines={1} note>
            {item.group_title}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {typeof item === 'object' && item.petsitter !== undefined
              ? item.petsitter.services.map((item, i) => {
                return (
                  <Text key={i} style={styles.eContentText}>{item.name} | </Text>
                );
              })
              : null}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: wp(2) }}>
            <SvgMemberIcon width={16} height={16} />
            <Text style={[styles.eContentTextSmall, { marginLeft: wp(1) }]} note>
              {item.members}
              {item.members !== '1' ? ' Members' : ' Member'}
            </Text>
          </View>
          <Text numberOfLines={2} style={styles.eContentText} note>
           {LongAboutParseHtml(item?.about)}
          </Text>
          <Text style={[styles.eContentTextSmall, { marginVertical: wp(1) }]} note>
            {'Created On: '}
            {item.registered}
          </Text>
          {!_.isEmpty(item?.category) && <Text style={styles.eContentTextSmall} note>
            {'Category: '}
            {item?.category}
          </Text>}
          <View style={{ width: wp(40), height: wp(8), justifyContent: 'center', alignItems: 'center', backgroundColor: this.colorFunction(item.privacy) ? '#FFF4E3' : '#FDEDEE', borderRadius: 10, marginTop: wp(1) }}>
            <Text style={[styles.eContentTextSmall, { color: this.colorFunction(item.privacy) ? '#FFAF3E' : '#F596A0' }]} note>
              {item.privacy === '1' ? 'Public Community' : 'Private Community'}
            </Text>
          </View>
          {/* </View> */}
        </Body>
        </ListItem>
      </View>
    );
  };

  renderPets = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          marginVertical: RFValue(2),
        }}>
        <ListItem
          noBorder
          avatar
          onPress={() => {
            this.props.navigation.navigate({
              routeName: 'PetProfile',
              key: 'PetProfile',
              params: { item },
            });
          }}>
          <Left style={{ justifyContent: 'center' }}>
            <FastImage
              style={{
                alignSelf: 'center',
                backgroundColor: 'grey',
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: 10,
              }}
              source={{ uri: "" + item.avatar }}
            />
          </Left>
          <Body>
          <Text style={styles.eContentText} note>
          {item.full_name}@<Text style={{fontSize:14,fontWeight:'bold'}}>{item.parent_name}</Text>
            </Text>
            <Text style={[styles.petSubTypeText,{color:PINK}]}>
                        {item?.lost_data?.lost_since_unix ?
                      `Lost Since ${ moment.unix(item?.lost_data?.lost_since_unix).fromNow() }`
                         :<Text style={[styles.eNameText,{fontSize:12}]} numberOfLines={1} note>
                         Member Since: {item?.pet?.created_at?.toString().split(' ')[0]?.split('-')[0]}
                         </Text>
                         }
                      </Text>
          
            <Text style={[styles.eNameText,{fontSize:12}]} numberOfLines={1} note>
            {item.full_name.toString().trim()} is a {item.age_text} <Text style={{color:item.gender=='male'?darkSky:PINK,fontSize:12}}>{item.gender.charAt(0).toUpperCase() + item.gender.slice(1)}</Text>
            </Text>
            <Text style={[styles.eNameText,{fontSize:12}]} numberOfLines={1} note>
             {item?.pet_info?.pet_sub_type_text}  ({item?.pet_info?.pet_type_text})
            </Text>
          
          </Body>
        </ListItem>
      </View>
    );
  };
  renderLostPets = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          marginVertical: RFValue(2),
        }}>
        <ListItem
          noBorder
          avatar
          onPress={() => {
            this.props.navigation.navigate({
              routeName: 'PetProfile',
              key: 'PetProfile',
              params: { item },
            });
          }}>
          <Left style={{ justifyContent: 'center' }}>
            <FastImage
              style={{
                alignSelf: 'center',
                backgroundColor: 'grey',
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: 10,
              }}
              source={{ uri: "" + item.avatar }}
            />
          </Left>
          <Body>
          <Text style={styles.eContentText} note>
          {item.full_name}@<Text style={{fontSize:14,fontWeight:'bold'}}>{item.parent_name}</Text>
            </Text>
            <Text style={[styles.petSubTypeText,{color:PINK}]}>
                      Lost Since { moment.unix(item?.lost_data?.lost_since_unix).format('MM Do YYYY') }
      
                      </Text>
            <Text style={[styles.eNameText,{fontSize:12}]} numberOfLines={1} note>
            {item.full_name.toString().trim()} is a {item.age_text} <Text style={{color:item.gender=='male'?darkSky:PINK,fontSize:12}}>{item.gender.charAt(0).toUpperCase() + item.gender.slice(1)}</Text>
            </Text>
            <Text style={[styles.eNameText,{fontSize:12}]} numberOfLines={1} note>
             {item?.pet_info?.pet_sub_type_text}  ({item?.pet_info?.pet_type_text})
            </Text>
          
          </Body>
        </ListItem>
      </View>
    );
  };
  renderEvents = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          marginVertical: RFValue(2),
        }}>
        <ListItem
          noBorder
          avatar
          onPress={() => {
            this.props.navigation.navigate({
              routeName: 'EventDetails',
              key: 'EventDetails',
              params: { item: item, btnShow: true, goingShow: true, interestShow: true },
            });
          }}
          style={{
            flexDirection:'column',
        
          }}
          >
          {/* <Left style={{ justifyContent: 'center' }}> */}
            <FastImage
              style={{
                alignSelf: 'center',
                backgroundColor: 'grey',
                width: '90%',
                height: RFValue(75),
                borderRadius: 10,
              }}
              resizeMode='cover'
              source={{ uri: "" + item.cover }}
            />
          {/* </Left> */}
          <Body style={{
            alignSelf:'flex-start'
          }}>
          <Text style={styles.eventName} note>
          {item.name}
      
            </Text>
            {/* <View style={{
              justifyContent:'space-between',
              width:wp(85),
              flexDirection:'row'
            }}> */}
              <View style={{
                flexDirection:'row'
              }}>
          <Text style={[styles.eventDate,{fontSize:12, fontWeight:'bold'}]} numberOfLines={1} note>
             {moment(item?.start_date_js).format('MMM-DD')} <Text style={{fontSize:12,fontWeight:'bold'}}>{moment(item.start_date_js).format('hh:mm')} - </Text> 
            </Text>
            <Text style={[styles.eventDate,{fontSize:12, fontWeight:'bold'}]} numberOfLines={1} note>
              {moment(item?.end_date_js).format('MMM-DD')}
              <Text style={{fontSize:12,fontWeight:'bold',}}> {moment(item.end_date_js).format('hh:mm')}</Text> 
  </Text>
  </View>
            <Text style={[styles.eventDate,{color:grey, fontSize:12, alignSelf:'flex-start'}]}>
               Going:<Text style={{color:darkSky,fontSize:12}} > {item.going_count} </Text> | Interested: <Text style={{color:darkSky, fontSize:12}}>{ item.interested_count} </Text>
             </Text>
            {/* </View> */}
            <Text style={[styles.eventDes,{fontSize:12}]} numberOfLines={2} note>
              {item.description}
          </Text>
            <Text style={[styles.eventLocation,{fontSize:12, width:wp(85)}]} numberOfLines={1} note>
             Location: <Text style={{color:darkSky, fontSize:12}}>{item?.location}</Text>
            </Text>
          
          </Body>
        </ListItem>
      </View>
    );
  };
  colorFunction = (privacy) => {
    if (privacy == 1) return true;
    else return false;

  }
  render() {

    const {
      searchText,
      users,
      groups,
      pages,
      pets,
      events,
      lostPets,
      searched,
      searching,
      search,
    } = this.state;

console.log('user', users);

    return (
      <Container style={[styles.container, { backgroundColor: 'white' }]}>
        <StatusBar
          backgroundColor={'white'}
          barStyle={'dark-content'}
          translucent={false}
        />
        <SafeAreaView />

        <View style={{ backgroundColor: 'white' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: wp(3),
              

            }}>
            <TouchableOpacity onPress={this.goBack}>
              <Icon
                name={'chevron-back'}
                type="Ionicons"
                style={{ fontSize: 30, color: '#20ACE2', fontWeight: '400' }}
              />
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', fontSize: 17,color:'#20ACE2',flexGrow:1,textAlign:'center',marginRight:wp(10) }}>Search</Text>
            <Text />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: RFValue(10),
            paddingHorizontal: RFValue(5),
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'white',
            paddingHorizontal: wp(3),
          }}>
          <IonicIcon
            name={'search'}
            size={22}
            color={'#20ACE2'}
            onPress={() => {
              if (search) {
                searchText !== ''
                  ? this.requestHandlerSearchData('search', searchText)
                  : null;
              } else {
                this.setState({
                  searchText: '',
                  search: true,
                });
              }
            }}
          />

          <Search_Input
            placeholder={'Search'}
            placeholderTextColor={'black'}
            value={searchText}
            icon={search ? 'search' : 'md-close'}
            onChangeText={searchText => {
              searchText !== ''
                ? this.requestHandlerSearchData('search', searchText)
                : this.setState({
                  users: [],
                  groups: [],
                  pages: [],
                  searchText: '',

                });
            }}
            searchText={this.state.searchText}
            onPress={() => {
              if (search) {
                searchText !== ''
                  ? this.requestHandlerSearchData('search')
                  : null;
              } else {
                this.setState({
                  searchText: '',
                  search: true,
                });
              }
            }}
          />
        </View>
        {!searched ? (
          <View style={styles.searchResultContainer}>
            <Image
              resizeMode={'contain'}
              source={{
                uri:
                  'https://res.cloudinary.com/n4beel/image/upload/v1597305559/search_wcf5n3.png',
              }}
              style={styles.searchResultImage}
            />
            <Text style={styles.searchResultText}>
              Search Pet Owner, Friends and Pets.
            </Text>
          </View>
        ) : searching ? (
          <View style={styles.searchResultContainer}>
            <CustomLoader />
          </View>
        ) : users.length > 0 || groups.length > 0 || pages.length > 0 || events.length > 0 || lostPets.length > 0 ? (
          <Tabs
            renderTabBar={() => (
              <ScrollableTab
                style={{ backgroundColor: 'white', padding: 5, borderWidth: 0 }}
              />
            )}>
            <Tab
              textStyle={styles.textStyle}
              tabStyle={styles.tabStyle}
              activeTextStyle={styles.activeTextStyle}
              activeTabStyle={styles.activeTabStyle}
              heading={'Pet Owners'}>
              {users.length > 0 ? (
                <FlatList
                  disableVirtualization={true}
                  ref={ref => {this.flatList = ref}}
                  keyboardShouldPersistTaps="always"
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                  horizontal={false}
                  data={users}
                  extraData={this.state}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderPetOwners}
                  style={{ marginVertical: RFValue(5), backgroundColor: BGCOLOR }}
                />
              ) : (
                <View style={styles.searchResultContainer}>
                  <Image
                    resizeMode={'contain'}
                    source={{
                      uri:
                        'https://res.cloudinary.com/n4beel/image/upload/v1597305557/cactus_pmtn8w.png',
                    }}
                    style={styles.searchResultImage}
                  />
                  <Text style={styles.searchResultText}>
                    No Pet Owners found for this keyword
                  </Text>
                </View>
              )}
            </Tab>
            <Tab
              textStyle={styles.textStyle}
              tabStyle={styles.tabStyle}
              activeTextStyle={styles.activeTextStyle}
              activeTabStyle={styles.activeTabStyle}
              heading={'Pets'}>
              {pets.length > 0 ? (
                <FlatList
                  disableVirtualization={true}
                  keyboardShouldPersistTaps="always"
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                  horizontal={false}
                  data={pets}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderPets}
                  style={{ marginVertical: RFValue(5), backgroundColor: BGCOLOR }}
                />
              ) : (
                <View style={styles.searchResultContainer}>
                  <Image
                    resizeMode={'contain'}
                    source={{
                      uri:
                        'https://res.cloudinary.com/n4beel/image/upload/v1597305557/cactus_pmtn8w.png',
                    }}
                    style={styles.searchResultImage}
                  />
                  <Text style={styles.searchResultText}>
                    No Pets found for this keyword
                  </Text>
                </View>
              )}
            </Tab>
            <Tab
              textStyle={styles.textStyle}
              tabStyle={styles.tabStyle}
              activeTextStyle={styles.activeTextStyle}
              activeTabStyle={styles.activeTabStyle}
              heading={'Lost Pets'}>
              {lostPets.length > 0 ? (
                         <FlatList
                         disableVirtualization={true}
                         keyboardShouldPersistTaps="always"
                         nestedScrollEnabled={true}
                         scrollEnabled={true}
                         horizontal={false}
                         data={lostPets}
                         keyExtractor={(item, index) => index.toString()}
                         renderItem={this.renderLostPets}
                         style={{ marginVertical: RFValue(5), backgroundColor: BGCOLOR }}
                       />
              ) : (
                <View style={styles.searchResultContainer}>
                  <Image
                    resizeMode={'contain'}
                    source={{
                      uri:
                        'https://res.cloudinary.com/n4beel/image/upload/v1597305557/cactus_pmtn8w.png',
                    }}
                    style={styles.searchResultImage}
                  />
                  <Text style={styles.searchResultText}>
                    No Lost Pets found for this keyword
                  </Text>
                </View>
              )}
            </Tab>

            <Tab
              textStyle={styles.textStyle}
              tabStyle={styles.tabStyle}
              activeTextStyle={styles.activeTextStyle}
              activeTabStyle={styles.activeTabStyle}
              heading={'Events'}>
              {events?.length > 0 ? (
                <FlatList
                disableVirtualization={true}
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled={true}
                scrollEnabled={true}
                horizontal={false}
                data={events}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderEvents}
                style={{ marginVertical: RFValue(5), backgroundColor: BGCOLOR }}
              />
              ) : (
                <View style={styles.searchResultContainer}>
                  <Image
                    resizeMode={'contain'}
                    source={{
                      uri:
                        'https://res.cloudinary.com/n4beel/image/upload/v1597305557/cactus_pmtn8w.png',
                    }}
                    style={styles.searchResultImage}
                  />
                  <Text style={styles.searchResultText}>
                    No Events found for this keyword
                  </Text>
                </View>
              )}
            </Tab>

            {/* <Tab
              textStyle={styles.textStyle}
              tabStyle={styles.tabStyle}
              activeTextStyle={styles.activeTextStyle}
              activeTabStyle={styles.activeTabStyle}
              heading={'Pages'}>
              {pages.length > 0 ? (
                <FlatList
                  disableVirtualization={true}
                  ref={ref => {
                    this.flatList = ref;
                  }}
                  keyboardShouldPersistTaps="always"
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                  horizontal={false}
                  data={pages}
                  extraData={this.state}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderPages}
                  style={{marginVertical: RFValue(5), backgroundColor: BGCOLOR}}
                />
              ) : (
                <View style={styles.searchResultContainer}>
                  <Image
                    resizeMode={'contain'}
                    source={{
                      uri:
                        'https://res.cloudinary.com/n4beel/image/upload/v1597305557/cactus_pmtn8w.png',
                    }}
                    style={styles.searchResultImage}
                  />
                  <Text style={styles.searchResultText}>
                    No Pages found for this keyword
                  </Text>
                </View>
              )}
            </Tab>
            */}
            <Tab
              textStyle={styles.textStyle}
              tabStyle={styles.tabStyle}
              activeTextStyle={styles.activeTextStyle}
              activeTabStyle={styles.activeTabStyle}
              heading={'Communities'}>
              {groups.length > 0 ? (
                <FlatList
                  disableVirtualization={true}
                  ref={ref => {
                    this.flatList = ref;
                  }}
                  keyboardShouldPersistTaps="always"
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                  horizontal={false}
                  data={groups}
                  extraData={this.state}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderGroups}
                  style={{ marginVertical: RFValue(5), backgroundColor: BGCOLOR }}
                />
              ) : (
                <View style={styles.searchResultContainer}>
                  <Image
                    resizeMode={'contain'}
                    source={{
                      uri:
                        'https://res.cloudinary.com/n4beel/image/upload/v1597305557/cactus_pmtn8w.png',
                    }}
                    style={styles.searchResultImage}
                  />
                  <Text style={styles.searchResultText}>
                    No Communties found for this keyword
                  </Text>
                </View>
              )}
            </Tab>
          </Tabs>
        ) : (
          <View style={styles.searchResultContainer}>
            <Image
              resizeMode={'contain'}
              source={{
                uri:
                  'https://res.cloudinary.com/n4beel/image/upload/v1597305557/cactus_pmtn8w.png',
              }}
              style={styles.searchResultImage}
            />
            <Text style={styles.searchResultText}>
              Please check spelling or try different keywords
            </Text>
          </View>
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
)(SearchView);
