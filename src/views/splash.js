import React from 'react';
import {
  StyleSheet,
  View,
  PixelRatio,
  Image,
  Text
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import AnimatedSplash from "react-native-animated-splash-screen";

import { userSave, userEdit, saveWorkSpace } from '../redux/actions/user';
import {
  LOGIN_USER,
  CURRENT_WORKSPACE,
  ACCESS_TOKEN,
  IS_INTRO_DONE,
  USER_DETAIL
} from '../constants/storageKeys';
import { appInit } from '../redux/actions';
import { reciveMessage, chatListUpdate } from '../redux/actions/messages';
import { notificationUpdate } from '../redux/actions/notifications';
import { splash, splashBG } from '../constants/ConstantValues';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';



import {
  TEXT_LIGHT,
  SPLASH_TEXT,
  BLACK,
} from '../constants/colors';
import NotifService from './NotifService';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { mediumText } from '../constants/fontSize';
import { petMyPalGroupApiService } from '../services/PetMyPalGroupApiService';
const {getPetCategory} = petMyPalGroupApiService;



class Splash extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    root: PropTypes.string,
    appInit: PropTypes.func,
  };

  constructor(props) {

    super(props);
    this.state = {
      isLoaded:false,
    };
    this.props.appInit();

    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }

  openRoute = route => {
    this.props.navigation.navigate(route);
  };

  componentDidMount() {
    this.props.getPetCategory();
    setTimeout(()=>{
    this.getData();
  },3000)

  }
  removeItems = async () => {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN);
      await AsyncStorage.removeItem(LOGIN_USER);
      await AsyncStorage.removeItem(CURRENT_WORKSPACE);
      return true;
    } catch (exception) {
      return false;
    }
  };

  getData = async () => {
    const scope = this;
    const ITEM = await AsyncStorage.getItem(ACCESS_TOKEN);
    const user = await AsyncStorage.getItem(LOGIN_USER)
    const USER = await AsyncStorage.getItem(USER_DETAIL);
    const isIntroDone = await AsyncStorage.getItem(IS_INTRO_DONE)
    SplashScreen.hide();

    if (ITEM && USER) {

      this.props.userSave(JSON.parse(USER));
      this.props.saveWorkSpace({ show: true, updateNewsFeed: false });
      this.openRoute('AppNavigator');

    } else {
      this.openRoute('AuthNavigator');
    }

  };

  componentDidUpdate() {
    const root = this.props.root;
    
    if (root === 'outside') {
      this.openRoute('AuthNavigator');
    } else if (root === 'inside') {
      this.getData();
    }
  }

  render() {
    return (
      <BackgroundImage
        source={splashBG}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={splash}
          // resizeMode={'contain'}
          style={styles.splashImg}
        />
        <View style={styles.textView}>
          <Text style={styles.textStyle}>Where Pet Lovers Hangout!</Text>
        </View>
      </BackgroundImage>

    );
  }
  onRegister(token) {
    this.setState({ registerToken: token.token, fcmRegistered: true });
  }

  onNotif(notif) {
    if (notif?.data?.message_id) {
      this.props.chatListUpdate({ notif: notif });
    } else {
      this.props.notificationUpdate({ notif: notif })
    }
  }
}
const imgMarginBottom = 45
const imgHeight = 90
const imgWidth = 90
const topMargin = 15
const horizontalPadding = 25

var styles = StyleSheet.create({
  modalStyling: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  splashImg: {
    alignSelf: 'center',
    // width:"100%",
    // height:'50%',
    resizeMode:'contain'
  },
  textView: {
    justifyContent: "center",
    alignItems: 'center',
    top: hp(26)
  },
  textStyle: {
    color: BLACK,
    fontSize: mediumText,
    fontWeight: '500'
  },

  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  splashTextView: {
    marginBottom: -56,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainerTop: {
    alignItems: 'flex-end',
    marginTop: -58,
    marginRight: -120,
  },
  logoContainerBottom: {
    alignItems: 'flex-start',
    marginBottom: -58,
    marginLeft: -115,
  },
  logoContainer: {
    flex: 1,
    marginTop: -58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTop: {
    width: PixelRatio.getPixelSizeForLayoutSize(80),
    height: PixelRatio.getPixelSizeForLayoutSize(80),
    resizeMode: 'contain',
  },
  logoBottom: {
    width: PixelRatio.getPixelSizeForLayoutSize(80),
    height: PixelRatio.getPixelSizeForLayoutSize(80),
    resizeMode: 'contain',
  },
  logo: {
    width: PixelRatio.getPixelSizeForLayoutSize(70),
    height: PixelRatio.getPixelSizeForLayoutSize(70),
    resizeMode: 'contain',
  },
  versionNumber: {
    color: TEXT_LIGHT,
    fontWeight: 'bold',
  },
  splashText: {
    color: SPLASH_TEXT,
    fontSize: 14,
    paddingBottom: -120,
    textAlign: 'center',
  },
});

const mapStateToProps = state => ({
  totalUnread: state.messages.totalUnread,
  listChat: state.messages.chatList,
  root: state.app.root,
});

const mapDispatchToProps = dispatch => ({
  appInit: () => dispatch(appInit()),
  userSave: user => dispatch(userSave(user)),
  chatListUpdate: data => dispatch(chatListUpdate(data)),
  notificationUpdate: data => dispatch(notificationUpdate(data)),
  reciveMessage: data => dispatch(reciveMessage(data)),
  userEdit: user => dispatch(userEdit(user)),
  saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
  getPetCategory:()=>dispatch(getPetCategory())
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Splash);
