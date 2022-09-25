import { StyleSheet, Platform, Dimensions } from 'react-native';
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { BGCOLOR, TEXT_DARK, TEXT_LIGHT, BLUE_NEW, White } from '../../constants/colors';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
  },
  joinBtn: {
    backgroundColor: BLUE_NEW,
    flexDirection: 'row',
    width: wp(22),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(4),
    borderWidth: 1,
    borderRadius: 8,
    borderColor: BLUE_NEW
  },
  bottomSheet: {
    flex: 1,
    height: screenHeight * 0.8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    elevation: Platform.OS === 'ios' ? 5 : 10,
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  imgIcon: {
    width: RFValue(36),
    height: RFValue(36),
  },
  imgIcon1: {
    width: RFValue(20),
    height: RFValue(20),
  },
  coverImgContainer: {
    height: 260,
  },
  coverImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userIdentity: {
    position: 'absolute',
    zIndex: 500,
    top: 120,
    left: 0,
  },
  profileImgContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    backgroundColor: 'white',
  },
  members: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileImgBox: {
    marginLeft: 20,
    width: 108,
    height: 108,
    borderRadius: 10,
  },
  profileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userDetails: {
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 16,
    color: TEXT_LIGHT,
    fontWeight: 'bold',
  },
  date: {
    color: TEXT_DARK,
    fontSize: 14,
  },
  description: {
    fontSize: 24,
    color: TEXT_LIGHT,
    fontWeight: 'bold',
  },
  about: {
    fontSize: 24,
    color: TEXT_DARK,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  actions: {
    position: 'absolute',
    zIndex: 500,
    top: 256,
    right: 0,
    height: RFValue(30),
    flexDirection: 'row',
    marginVertical: RFValue(20),
    marginHorizontal: RFValue(15),
    width: screenHeight * 0.26,
  },
  iconContainer: {
    backgroundColor: TEXT_LIGHT,
    width: 32,
    height: 32,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    backgroundColor: TEXT_DARK,
    width: 32,
    height: 32,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIcon: {
    color: TEXT_DARK,
    margin: 0,
    padding: 0,
  },
  homeButtonContainer: {
    backgroundColor: TEXT_DARK,
    width: 48,
    height: 48,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    color: TEXT_LIGHT,
    margin: 0,
    padding: 0,
  },
  selectedIcon: {
    color: '#fff',
  },
  footerText: {
    color: '#5A5959',
    fontSize: 10,
  },
  btnHeading:{
    fontWeight: 'bold',
    textAlign: 'center',
    color:White,
  },
  noData:{
    alignItems:'center',
    justifyContent:'center',
  }
});
