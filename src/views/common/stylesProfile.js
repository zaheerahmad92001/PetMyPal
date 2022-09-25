import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {BGCOLOR, TEXT_DARK, HEADER, TEXT_LIGHT} from '../../constants/colors';

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
  },
  coverImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverImgEdit: {
    position: 'absolute',
    zIndex: 300,
    top: 10,
    right: 20,
  },
  coverImgEditButton: {},
  editImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    opacity: 0.6,
    tintColor: 'white',
  },
  profileImgContainer: {
    position: 'absolute',
    top: screenHeight * 0.3,
    zIndex: 300,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    // marginBottom: 20,
    zIndex: 1001,
  },
  profileImgBox: {
    width: RFValue(90),
    height: RFValue(90),
    borderRadius: RFValue(10),
    marginLeft: RFValue(20),
    marginRight: RFValue(5),
  },
  deceaseBox: {
    width: '90%',
    position: 'absolute',
    top: RFValue(60),
    zIndex: 600,
    marginLeft: RFValue(20),
  },
  ribbon: {
    height: RFValue(20),
    width: RFValue(20),
    // position: 'absolute',
    // top: 5,
    // zIndex: 700,
    // left: 5,
    resizeMode: 'contain',
  },
  dText: {
    color: 'white',
  },
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: RFValue(10),
    resizeMode: 'contain',
  },
  profileImgEdit: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  userDetails: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  date: {
    color: TEXT_DARK,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: RFValue(10),
    marginRight: RFValue(10),
    height: 40,
    // borderRadius: 10
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    marginTop: -20,
    zIndex: 1000,
    width: screenWidth,
    paddingTop: 20,
  },
  followersText: {
    color: TEXT_DARK,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginRight: 10,
  },
  btn: {
    height: 35,
    width: 120,
    // marginRight: 20,
    // position: 'absolute',
    // right: 10,
    // top: 5,
  },
  editBtnContainer: {
    width: RFValue(35),
    height: RFValue(35),
    marginRight: 20,
    zIndex: 100000,
  },
  editIcon: {
    textAlign: 'center',
    color: 'white',
    fontSize: RFValue(16),
  },
  petInfo: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    marginVertical: 5,
  },
  petInfoItem: {
    width: '48%',
    marginBottom: 24,
    flexDirection: 'row',
    // alignItems: 'center',
  },
  oddItem: {
    marginRight: '4%',
  },
  infoIconContainer: {
    marginRight: 7,
  },
  infoIcon: {
    width: 22,
    height: 22,
    tintColor: HEADER,
    resizeMode: 'contain',
  },
  info: {
    fontSize: 12,
    marginHorizontal: 5,
    color: 'white',
  },

  infoDetailText: {
    fontSize: 12,
    // color: 'white',
    fontWeight: 'bold',
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
