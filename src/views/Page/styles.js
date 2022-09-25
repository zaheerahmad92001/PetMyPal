import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {BGCOLOR, TEXT_DARK, TEXT_LIGHT} from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
  },
  bottomSheet: {
    flex: 1,
    height: screenHeight * 0.8,
    // backgroundColor:'#F7FAFC',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    elevation: Platform.OS === 'ios' ? 5 : 10,
    shadowRadius: 5,
    shadowOpacity: 0.4,
    // alignItems:'center'
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
    backgroundColor: 'lightgrey',
  },
  coverImg: {
    // width: '100%',
    height: '100%',
  },
  profileImgContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  profileImgBox: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginTop: -50,
    marginHorizontal: 20,
    backgroundColor: 'grey',
  },
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  userDetails: {
    // paddingVertical: 10,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 16,
    color: TEXT_DARK,
    position: 'absolute',
    bottom: RFValue(10),
    zIndex: 300,
    left: RFValue(130),
    fontWeight: 'bold',
  },
  date: {
    color: TEXT_DARK,
    fontSize: 14,
  },
  description: {
    fontSize: 24,
    color: TEXT_DARK,
    fontWeight: 'bold',
  },
  actions: {
    height: 30,
    width: 105,
    marginRight: 10,
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
    // fontSize: 14,
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
    // fontSize: 14,
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
});
