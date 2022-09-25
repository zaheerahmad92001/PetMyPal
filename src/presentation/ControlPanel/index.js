import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import {Avatar, Accessory} from 'react-native-elements';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {Icon, ListItem} from 'native-base';

import {BLUE_NEW, HEADER, EDIT_NEW, darkSky} from '../../constants/colors';
import {PMPVersion} from '../../constants/ConstantValues';
import {THEME_BOLD_FONT, THEME_FONT} from '../../constants/fontFamily';
import NavigationService from './NavigationService';
import PMP from '../../lib/model/pmp';
import {userSave} from '../../redux/actions/user';
import {store} from '../../lib/createStore';
import {
  terms,
  updateProfile,
  petIcon,
  wordPixxy,
  followersIcon,
  pages,
  group,
  community,
  information,
  moreIcon,
  circle,
  Faqs,
  cust_Support,
} from '../../constants/ConstantValues';

import User from '../../assets/drawer-icons/user.svg';
import Dots from '../../assets/drawer-icons/dots.svg';
import Menu from '../../assets/drawer-icons/menu.svg';
import Group from '../../assets/drawer-icons/group.svg';
import Preview from '../../assets/drawer-icons/preview.svg';
import Edit from '../../assets/drawer-icons/edit.svg';
import Direction from '../../assets/drawer-icons/direction.svg';
import Img from '../../assets/drawer-icons/img.svg';
import Shrae from '../../assets/drawer-icons/share.svg';
import Breed from '../../assets/drawer-icons/breed.svg';
import Manager from '../../assets/drawer-icons/managerpets.svg';
import FollowFollowers from '../../assets/drawer-icons/followersfollowings.svg';
import MyPages from '../../assets/drawer-icons/mypages.svg';
import CloseAccount from '../../assets/drawer-icons/closeaccount.svg';
import Vendor from '../../assets/drawer-icons/vendor.svg';
import Security from '../../assets/drawer-icons/securitysetting.svg';
import Change from '../../assets/drawer-icons/changepassword.svg';

const LeftMenu = props => {
  props.navigation.navigationOptions = {
    header: null,
  };
  const [state, setState] = useState({
    avatar: '',
    username: '',
    registered: '',
    total_pets: '',
    isVisible: false,
  });

  useEffect(() => {
    try {
      if (props?.user?.user_data) {
        setState({
          avatar: props?.user?.user_data?.avatar,
          username:
            props?.user?.user_data?.first_name +
            ' ' +
            props?.user?.user_data?.last_name,
          registered: props?.user?.user_data?.registered,
          total_pets: props?.user?.user_data?.total_pets,
        });
      }
    } catch (err) {
      null;
    }
  }, [props.user]);

  const _onPress = name => {
    props.navigation.pop();
    props.navigation.navigate({routeName: name});
    props.drawerClose();
  };

  function showMore() {
    setState(state => ({...state, isVisible: !state.isVisible}));
  }

  return (
    <View style={{flex: 1, backgroundColor: '#ffff', width: '100%'}}>
      <StatusBar
        backgroundColor={'white'}
        barStyle={'dark-content'}
        translucent={false}
      />

      <ScrollView
        scrollEnabled={true}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{
          flexGrow: 1,
          paddingBottom: 20,
          paddingTop: 20,
          backgroundColor: 'white',
        }}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', marginVertical: 30}}>
            <View style={{marginRight: 15}}>
              <View style={{borderRadius: 15, overflow: 'hidden'}}>
                <Avatar source={{uri: state.avatar}} size={'large'} />
              </View>
              <Accessory
                size={21}
                style={{
                  marginLeft: 10,
                  backgroundColor: EDIT_NEW,
                  borderWidth: 1,
                  borderColor: '#fff',
                }}
                onPress={() => _onPress('EditProfile')}

                //   onPress={() => {
                //   props.navigation.navigate({
                //     routeName: 'EditProfile',
                //     key: 'EditProfile',
                //   })
                // }}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('UserProfile')}>
                <View>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: THEME_BOLD_FONT,
                      fontWeight: 'bold',
                      fontSize: RFValue(16),
                      paddingRight: 12,
                      width: 200,
                    }}>
                    {state.username}
                  </Text>
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: THEME_FONT,
                  fontSize: RFValue(13),
                  color: BLUE_NEW,
                }}>
                Member Since: {state?.registered?.split('/')[1]}
              </Text>
            </View>
          </View>

          <ListItem
            noBorder
            style={styles.listStyle}
            onPress={() => _onPress('MyPets')}>
            <Preview width={20} height={20} />
            <Text style={styles.textStyle}>My Pets</Text>
          </ListItem>

          <ListItem
            noBorder
            style={styles.listStyle}
            onPress={() => _onPress('PixxyWorldView')}>
            <Img width={20} height={20} />
            <Text style={styles.textStyle}>World Pixxy</Text>
          </ListItem>
          <ListItem
            noBorder
            style={styles.listStyle}
            onPress={() => _onPress('BreedIdentifier')}>
            <Breed width={20} height={20} />
            <Text style={styles.textStyle}>Sandy's Lab</Text>
          </ListItem>
          {/* <ListItem noBorder
                style={styles.more_listStyle}
                onPress={() => _onPress('BreedIdentifier')}>
                <Image source={information} 
                 resizeMode={'contain'}
                 style={styles.img24} tintColor='#182A53' />
                <Text style={[styles.moreTextStyle, { marginLeft: RFValue(7) }]}>
                  Breed Identifier
                </Text>
              </ListItem>
           */}
          <ListItem
            style={styles.listStyle}
            noBorder
            onPress={() => _onPress('Followers')}>
            <Dots width={20} height={20} />
            <Text style={styles.textStyle}>My Circle</Text>
          </ListItem>

          {/* <ListItem noBorder
            style={styles.listStyle}
            onPress={() => _onPress('PostDetail')}>
            <Image source={pages} style={styles.img30} />
            <Text style={[styles.textStyle, { marginLeft: RFValue(3) }]}>
             Post Detail
            </Text>
          </ListItem> */}

          <ListItem
            noBorder
            style={styles.listStyle}
            onPress={() => _onPress('UserGroupsView')}>
            <Group width={20} height={20} />
            <Text style={styles.textStyle}>Communities</Text>
          </ListItem>

          <ListItem
            noBorder
            onPress={() => _onPress('EventsView')}
            style={styles.listStyle}>
            <User width={20} height={20} />
            <Text style={styles.textStyle}>My Events</Text>
          </ListItem>

          <ListItem
            noBorder
            style={styles.listStyle}
            onPress={() => _onPress('EditProfile')}>
            <Edit width={20} height={20} />
            <Text style={styles.textStyle}>Update Profile</Text>
          </ListItem>

          <ListItem
            noBorder
            style={styles.listStyle}
            onPress={() => _onPress('BecomeVendor')}>
            <Vendor width={20} height={20} />
            <Text style={styles.textStyleVendor}>Become a Vendor</Text>
          </ListItem>

          <TouchableOpacity onPress={() => showMore()} style={styles.listStyle}>
            <View style={styles.moreView}>
              <View style={styles.moreInnerView}>
                <Menu width={20} height={20} />
                <Text style={styles.textStyle}> More </Text>
              </View>
              <Icon
                name={state.isVisible ? 'chevron-down' : 'chevron-up'}
                type={'Feather'}
                style={styles.iconStyle}
              />
            </View>
          </TouchableOpacity>

          {state.isVisible ? (
            <View>
              {/* <ListItem noBorder
                style={styles.more_listStyle}
                onPress={() => _onPress('ProductList')}>
                <Image source={terms} style={styles.img24} tintColor='#182A53' />
                <Text style={[styles.moreTextStyle, { marginLeft: RFValue(7) }]}>
                  Free QR Tag
                </Text>
              </ListItem> */}

              {/* <ListItem noBorder
                style={styles.more_listStyle}
                onPress={() => _onPress('AppIntro')}>
                <Image 
                source={cust_Support} 
                resizeMode={'contain'}
                style={styles.img24} tintColor='#182A53' />
                <Text style={[styles.moreTextStyle, { marginLeft: RFValue(7) }]}>
                  App Intro
                </Text>
              </ListItem> */}

              <ListItem
                noBorder
                style={styles.more_listStyle}
                onPress={() => _onPress('ContactUs')}>
                <Image
                  source={cust_Support}
                  resizeMode={'contain'}
                  style={[styles.img24, {height: 22}]}
                  tintColor="#182A53"
                />
                <Text style={[styles.moreTextStyle, {marginLeft: RFValue(7)}]}>
                  Contact Us
                </Text>
              </ListItem>

              <ListItem
                noBorder
                style={styles.more_listStyle}
                onPress={() => _onPress('AboutUs')}>
                <Image
                  source={information}
                  resizeMode={'contain'}
                  style={styles.img24}
                  tintColor="#182A53"
                />
                <Text style={[styles.moreTextStyle, {marginLeft: RFValue(7)}]}>
                  About Us
                </Text>
              </ListItem>

              <ListItem
                noBorder
                style={styles.more_listStyle}
                onPress={() => _onPress('FAQ')}>
                <Image
                  source={Faqs}
                  resizeMode={'contain'}
                  style={styles.img24}
                  tintColor="#182A53"
                />
                <Text style={[styles.moreTextStyle, {marginLeft: RFValue(7)}]}>
                  FAQ
                </Text>
              </ListItem>

              <ListItem
                noBorder
                style={styles.more_listStyle}
                onPress={() => _onPress('TermsConditions')}>
                <Image
                  source={terms}
                  resizeMode={'contain'}
                  style={styles.img24}
                  tintColor="#182A53"
                />
                <Text style={[styles.moreTextStyle, {marginLeft: RFValue(7)}]}>
                  Terms & Conditions
                </Text>
              </ListItem>
            </View>
          ) : null}

          <ListItem
            noBorder
            style={styles.logoutItm}
            onPress={() => {
              PMP.logout().then(function() {
                NavigationService.navigate('AuthNavigator');
              });
              store.dispatch({type: 'USER_LOGOUT'});
            }}>
            <Feather size={24} color={'#F596A0'} name="log-out" />
            <Text style={styles.logoutText}>Log Out</Text>
          </ListItem>
        </View>
      </ScrollView>
      <ListItem
        noBorder
        style={{
          justifyContent: 'center',
          marginTop: 29,
        }}
        onPress={() => {
          PMP.logout().then(function() {
            NavigationService.navigate('AuthNavigator');
          });
        }}>
        <Text
          style={{
            paddingHorizontal: RFValue(18),
          }}>
          {PMPVersion}
        </Text>
      </ListItem>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user.user,
    pets: state.mypets.pets,
  };
};

const mapDispatchToProps = dispatch => ({
  saveLoginUser: user => dispatch(userSave(user)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeftMenu);

const styles = StyleSheet.create({
  textStyle: {
    fontWeight: '600',
    color: '#182A53',
    fontSize: 16,
    marginHorizontal: wp(5),
  },
  textStyleVendor: {
    fontWeight: 'bold',
    color: darkSky,
    fontSize: 16,
    marginHorizontal: wp(5),
    textDecorationLine: 'underline',
  },
  container: {
    backgroundColor: 'white',
    marginLeft: 20,
    flex: 1,
    marginBottom: 20,
  },
  btn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  img24: {
    height: 25,
    width: 25,
  },
  img25: {
    height: 25,
    width: 25,
    tintColor: '#182A53',
  },
  img27: {
    height: 22.5,
    width: 22.5,
  },
  img28: {
    height: 19,
    width: 19,
  },
  img30: {
    height: 25,
    width: 25,
  },
  listStyle: {
    marginLeft: 0,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    paddingHorizontal: RFValue(18),
    color: '#F596A0',
    fontWeight: '600',
    fontSize: 18,
  },
  logoutItm: {
    marginLeft: 0,
    marginTop: 20,
    paddingLeft: 10,
  },
  moreView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 25,
    marginTop: wp(2),
  },
  moreInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    fontSize: 25,
    color: '#182A53',
  },
  more_listStyle: {
    marginLeft: wp(12),
    paddingLeft: 10,
    paddingVertical: 7,
    // marginBottom:5,
    // paddingTop:5,
    paddingBottom: 5,
  },
  moreTextStyle: {
    paddingLeft: 0,
    paddingRight: 10,
    fontWeight: '400',
    color: '#182A53',
    fontSize: 14,
  },
});
