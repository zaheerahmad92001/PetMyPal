import React from 'react';
import { Button, Footer, FooterTab, Thumbnail } from 'native-base';
import { View, Text, Dimensions, TouchableOpacity, Platform, StyleSheet, Image, Animated, ImageBackground } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';



import { SwipeablePanel } from 'rn-swipeable-panel';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import styles from './styles';
import { grey, FOOTER_ICON_ACTIVE_NEW, FOOTER_ICON_NEW, darkSky, TEXT_INPUT_LABEL, TEXT_GREY, black, HEADER, White } from '../../constants/colors';
import MyPetsPanel from './MyPetsPanel';
import CommunitySvg from '../../assets/floater-icons/communities.svg';
import DogHouseSvg from '../../assets/floater-icons/dog-house.svg';
import EventSvg from '../../assets/floater-icons/events.svg';
import FollowerSvg from '../../assets/floater-icons/followers.svg';
import LogoutSvg from '../../assets/floater-icons/logout.svg';
import TourPMP from '../../assets/floater-icons/tourPmp.svg';
import MissingPetSvg from '../../assets/floater-icons/missing-pet.svg';
import PlusSvg from '../../assets/floater-icons/plus.svg';
import PMP from '../../lib/model/pmp';
import NavigationService from '../../presentation/ControlPanel/NavigationService';
import { store } from '../../lib/createStore';
import OneSignal from 'react-native-onesignal';





export class AddFooter extends React.Component {
  constructor(props) {
    super(props);
    OneSignal.init('433c25e1-b94d-4f09-8602-bbe908a3761e', {
      kOSSettingsKeyAutoPrompt: true,
    });
    this.state = {
      swipeablePanelActive: false,
      upDown: false,
      floatingModal: false,
      panelProps: {
        fullWidth: true,
        openLarge: true,

      },


    };
    this.notch = DeviceInfo.getDeviceType();
    this.shakeAnimation = new Animated.Value(0);
    this.youtubeRef = React.createRef()
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.inFocusDisplaying(2);

  }


  onReceived=()=>{
    alert('New message')
  }

  startShake = () => {
    Animated.sequence([
      Animated.timing(this.shakeAnimation, { toValue: 10, duration: 300, useNativeDriver: true }),
      Animated.timing(this.shakeAnimation, { toValue: -10, duration: 300, useNativeDriver: true }),
      Animated.timing(this.shakeAnimation, { toValue: 10, duration: 300, useNativeDriver: true }),
      Animated.timing(this.shakeAnimation, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start();
  }

  openPanel = () => {
    this.setState({ swipeablePanelActive: true });
  };

  closePanel = () => {
    this.setState({ swipeablePanelActive: false });
  };


  getHeight() {
    let heightOfDevice = Dimensions.get('window').height;
    if (this.notch) {
      if (heightOfDevice > 800) {
        return 750;
      }
      if (heightOfDevice < 800 && heightOfDevice > 600) {
        return 620;
      }
      if (heightOfDevice < 600 && heightOfDevice > 400) {
        return 520;
      } else {
        return 420;
      }
    } else {
      if (heightOfDevice > 800) {
        return 750;
      }
      if (heightOfDevice < 800 && heightOfDevice > 600) {
        return 620;
      }
      if (heightOfDevice < 600 && heightOfDevice > 400) {
        return 520;
      } else {
        return 420;
      }
    }
  }


  LogoutCall() {
    PMP.logout().then(function () {
      NavigationService.navigate('AuthNavigator');
    });
    store.dispatch({ type: 'USER_LOGOUT' })
  }

  TourPetMyPal() {
    this.props.navigation.navigate('TourPetMyPal')
  }

  render() {

    const {
      index,
      switchScreen,
      navigation,
      totalUnread,
      totalNotifications,
    } = this.props;
    const {
       upDown,
       panelProps,
       } = this.state;
    const actions = [
      {
        text: 'Tour PetMyPal',
        Image: TourPMP,
        screenName: 'TourPetMyPal',
        position: 6,
        textColor: grey,
        tintColor: 'red',
        color: '#34B7B0',
      },
      {
        text: 'Logout',
        Image: LogoutSvg,
        screenName: 'Logout',
        position: 6,
        textColor: grey,
        tintColor: 'red',
        color: '#20ace2',
      },
      {
        text: 'My Circle',
        Image: FollowerSvg,
        screenName: 'Followers',
        position: 2,
        textColor: grey,
        tintColor: 'red',
        color: '#2f87c2',
      },
      {
        text: 'Add Pet',
        Image: PlusSvg,
        screenName: 'PetAddView',
        position: 3,
        textColor: grey,
        tintColor: 'red',
        color: '#5658aa',
      },
      {
        text: 'Lost My Pet',
        Image: MissingPetSvg,
        screenName: 'MyPets',
        position: 4,
        textColor: grey,
        tintColor: 'red',
        color: '#a435a3',
      },
      {
        text: 'Events',
        Image: EventSvg,
        screenName: 'EventsView',
        position: 5,
        textColor: grey,
        tintColor: 'red',
        color: '#dc75b9',
      },

      {
        text: 'Communities',
        Image: CommunitySvg,
        screenName: 'UserGroupsView',
        position: 6,
        textColor: grey,
        tintColor: 'red',
        color: '#ed5773',
      },
      {
        text: 'Home',
        Image: DogHouseSvg,
        screenName: 'Home',
        position: 1,
        textColor: grey,
        tintColor: grey,
        color: '#f2694d',


      },
    ];
    return (
      <View>
        <View style={{}}>
          <SwipeablePanel
            closeOnTouchOutside
            fullWidth
            //  showCloseButton= {true}
            {...panelProps}
            openLarge={upDown}
            isActive={this.state.swipeablePanelActive}
            onClose={this.closePanel}
            onPressCloseButton={this.closePanel}
            style={{ height: this.getHeight() }}>
            <MyPetsPanel
              // OnPressUpDown={() => {
              //   let panelProp = panelProps;
              //   panelProp.openLarge = !panelProp.openLarge;
              //   this.setState({panelProps: panelProps});
              // }}
              parentCallback={this.closePanel}
              upAndDown={panelProps.openLarge}
              navigation={navigation}
            />
          </SwipeablePanel>
        </View>
        <Footer style={{ backgroundColor: 'white' }}>
          <FooterTab
            navigation={navigation}
            style={{
              backgroundColor: 'white',
              borderTopRightRadius: 17,
              borderTopLeftRadius: 17,
              borderWidth: 1,
              borderColor: '#0000001A',
            }}>
            <Button
              style={index === 1 ? styles.selected : {}}
              onPress={() => { this.props.switchScreen(1) }}>
              <View
                style={
                  index === 1
                    ? styles.selectedIconContainer
                    : styles.iconContainer
                }>
                {totalNotifications > 0 && (
                  <View
                    style={{
                      marginBottom: -9,
                      marginRight: -12,
                      zIndex: 999,
                    }}>
                    <Text
                      style={{
                        backgroundColor: '#f596a0',
                        borderRadius: 20,
                        paddingVertical: 1,
                        paddingHorizontal: 7,
                      }}
                      numberOfLines={1}>
                      {totalNotifications}
                    </Text>
                  </View>
                )}
                {index === 1 ? (
                  <Thumbnail
                    style={{ width: 22, height: 22, resizeMode: 'contain' }}
                    tintColor={'#fff'}
                    square
                    source={require('../../assets/images/updated/notificationIcon.png')}
                  />
                ) : (
                  <Thumbnail
                    style={{ width: 22, height: 22, resizeMode: 'contain' }}
                    square
                    source={require('../../assets/images/updated/notificationIcon.png')}
                  />
                )}
              </View>
              <Text style={styles.footerText}>Notifications</Text>
            </Button>

            <Button
              style={index === 2 ? styles.selected : {}}
              onPress={() => { this.props.switchScreen(2); }}>
              <View
                style={
                  index === 2
                    ? styles.selectedIconContainer
                    : styles.iconContainer
                }>
                {totalUnread > 0 && (
                  <View
                    style={{
                      marginBottom: -9,
                      marginRight: -12,
                      zIndex: 999,
                    }}>
                    <Text
                      style={{
                        backgroundColor: '#f596a0',
                        borderRadius: 12,
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                      }}
                      numberOfLines={1}>
                      {totalUnread}
                    </Text>
                  </View>
                )}
                {index === 2 ? (
                  <View>
                    <Thumbnail
                      style={{ width: 22, height: 22, resizeMode: 'contain' }}
                      tintColor={'#fff'}
                      square
                      source={require('../../assets/images/updated/msgIcon.png')}
                    />
                  </View>
                ) : (
                  <Thumbnail
                    style={{ width: 22, height: 22, resizeMode: 'contain' }}
                    square
                    source={require('../../assets/images/updated/msgIcon.png')}
                  />
                )}
              </View>
              <Text style={styles.footerText}>Messages</Text>
            </Button>
            <Button
              style={index === 0 ? styles.selected : styles.selected}
              onPress={() => { this.setState({ floatingModal: !this.state.floatingModal }, () => this.startShake()) }}>
              <View
                style={
                  index === 0
                    ? styles.selectedIconContainer
                    : { ...styles.iconContainer, backgroundColor: darkSky }
                }>
                <View
                  style={
                    index === 0
                      ? { ...styles.footerIcon, ...styles.selectedIcon }
                      : styles.footerIcon
                  }>
                  <PlusSvg width={15} height={15} />
                </View>
              </View>
              <Text style={styles.footerText}>Home</Text>
            </Button>

            <Button
              style={index === 3 ? styles.selected : {}}
              onPress={() => { this.props.switchScreen(3); }}>
              <View
                style={
                  index === 3
                    ? styles.selectedIconContainer
                    : styles.iconContainer
                }>
                {index === 3 ? (
                  <Thumbnail
                    style={{ width: 22, height: 22, resizeMode: 'contain' }}
                    tintColor={'#fff'}
                    square
                    source={require('../../assets/images/updated/camraIcon.png')}
                  />
                ) : (
                  <Thumbnail
                    style={{ width: 22, height: 22, resizeMode: 'contain' }}
                    square
                    source={require('../../assets/images/updated/camraIcon.png')}
                  />
                )}
              </View>
              <Text style={styles.footerText}>Camera</Text>
            </Button>

            <Button
              style={index === 4 ? styles.selected : {}}
              onPress={() => {
                // switchScreen(4)
                this.openPanel();
                //this.checkFloatingButtonState(4);
              }}>
              <View
                style={
                  index === 4
                    ? styles.selectedIconContainer
                    : styles.iconContainer
                }>
                {index === 4 ? (
                  <Thumbnail
                    style={{ width: 22, height: 22, resizeMode: 'contain' }}
                    tintColor={'#fff'}
                    square
                    source={require('../../assets/images/updated/petIcon.png')}
                  />
                ) : (
                  <Thumbnail
                    style={{ width: 22, height: 22, resizeMode: 'contain' }}
                    square
                    source={require('../../assets/images/updated/petIcon.png')}
                  />
                )}
              </View>
              <Text style={styles.footerText}>My Pets</Text>
            </Button>
          </FooterTab>
        </Footer>

        <Modal
          useNativeDriver animationInTiming={300}
          style={{ justifyContent: 'center', alignItems: 'center' }}
          isVisible={this.state.floatingModal}
          onBackdropPress={() => this.setState({ floatingModal: false })}>
          {actions.map(item => {
            return (

              <TouchableOpacity
                style={{ alignSelf: item?.screenName === 'TourPetMyPal' ? 'flex-end' : 'auto' }}
                onPress={() => {
                  this.setState({ floatingModal: false },
                    () => item.screenName == 'Logout' ? this.LogoutCall() :
                      item?.screenName === 'TourPetMyPal' ? this.TourPetMyPal() :
                        item.screenName == 'Home' ? this.props.switchScreen(0) :
                          this.props.navigation.navigate(item.screenName))
                }} >
                {item?.screenName === 'TourPetMyPal' ?
                  <Animated.View style={StyleSheet.flatten([styles.tourToPetMyPal, { backgroundColor: item.color, marginTop: wp(3), transform: [{ translateY: this.shakeAnimation }] }])}>
                    <Text style={{ color: 'white', fontSize: RFValue(16) }}>{item.text}</Text>
                    <item.Image width={25} height={25} />
                  </Animated.View>
                  :
                  <Animated.View style={StyleSheet.flatten([styles.tileStyle, { backgroundColor: item.color, marginTop: wp(3), transform: [{ translateY: this.shakeAnimation }] }])}>
                    <Text style={{ color: 'white', fontSize: RFValue(16) }}>{item.text}</Text>
                    <item.Image width={25} height={25} />
                  </Animated.View>
                }

              </TouchableOpacity>

            )
          })}
        </Modal>

       
      </View>
    );
  }
}



const mapStateToProps = state => ({
  totalUnread: state.messages.totalUnread,
  totalNotifications: state.notifications.totalUnreadNotifications,
});
export default connect(mapStateToProps)(AddFooter);
