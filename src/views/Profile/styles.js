import { StyleSheet, Platform, Dimensions } from 'react-native';
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
import{BLUE_NEW} from '../../constants/colors';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFValue } from 'react-native-responsive-fontsize';
import {
  BGCOLOR,
  TEXT_DARK,
  BG_DARK_DISABLED,
  TEXT_LIGHT,
  White,
  black,
  grey,
  darkSky,
  darkGrey,
  HEADER,
  TEXT_INPUT_LABEL,
} from '../../constants/colors';
import BlockCard from '../../components/common/DetailBlockCard';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { mediumText } from '../../constants/fontSize';

let imgHeight =Platform.OS=='ios'?80: 70
let imgWidth = Platform.OS=='ios'?80: 70

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    zIndex: 1,
    marginTop:Platform.OS=='ios' ? hp(2):hp(5) ,
    left: 10
  },
  iconStyle: {
    fontSize: 30,
    color: darkSky
  },
  blackIcon: {
    fontSize: 30,
    color: darkSky
  },
  bottomSheet: {
    flex: 1,
    height: screenHeight * 0.8,
    // backgroundColor:'#F7FAFC',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
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
    // height: 260,
    height: hp(37),
    backgroundColor: BG_DARK_DISABLED,
  },
  coverImg: {
    height: null,
    width: null,
    flex: 1,
    // width: '100%',
    // height:hp(37),
    // height: '100%',
  },
  profileImgContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  profileImgBox: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: -80,
    backgroundColor: BG_DARK_DISABLED,
    // elevation: 5
  },
  infoIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  profileImg: {
    height: null,
    width: null,
    borderRadius:10,
    flex: 1
  },

  userDetails: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    color: TEXT_DARK,
    fontWeight: 'bold',
  },
  date: {
    color: TEXT_DARK,
  },

  actions: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginVertical: RFValue(20),
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
  infoDetailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft:wp(1)
  },
  followersText: {
    color: '#8B94A9',
    marginLeft:wp(-1)
  },

  coverImageView: {
    width: '100%',
    height: hp(37),
    overflow: 'hidden',
  },
  // cardView: {
  //   elevation: 1,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.3,
  //   marginTop: hp(-12),
  //   backgroundColor: '#fff',
  //   borderRadius: 20,
  //   width: wp(88),
  //   alignSelf: 'center',
  //   paddingBottom: 20,
  // },
  cardView: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    marginTop: hp(-8),
    backgroundColor: '#fff',
    borderRadius: 20,
    width: wp(88),
    alignSelf: 'center',
    paddingBottom: 10,
    marginBottom:15,
  },
  outerView: {},
  imgView: {
    alignSelf: 'center',  // added
    marginTop: hp(-6), // added
  },
  imgOuterView: {
    width:imgWidth,
    height:imgHeight,
    overflow: 'hidden',
  },
  nameView: {
    marginTop: 5
  },
  memberSince:{ 
    color: BLUE_NEW,
    textAlign: 'center'
     },
  nameStyle: {
    color: '#182A53',
    fontSize: mediumText,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rowView: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  followingFollwerRow: {
    flex: 1,
   justifyContent:'center',
   alignItems:'center',
  },

  followerIcon: {
    height: RFValue(25),
    width: RFValue(25),
    marginRight: 6,
  },
  countView: {
    flexDirection: 'column',
    marginLeft: 5
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  followBtn: {
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(4),
    borderColor: darkGrey,
    backgroundColor:darkGrey,
    borderRadius: 8,
  },
  followText: {
    color: darkSky,
    fontWeight: '600'
  },
  btnHeight: {
    height: 40,
    width: wp(32)
  },
  messageBtn: {
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#20ACE2',
    alignItems: 'center',
    height: hp(4),
    borderColor: '#20ACE2',
    borderRadius: 8,
  },
  messageText:{
    color: '#FFFF', 
    fontWeight: '600'
  },
  myPetsView:{
    flexDirection: 'row',
    marginHorizontal: 30,
    marginTop:Platform.OS=='ios'? 5:0,
    alignItems: 'center',
  },
  petText:{
    fontSize:mediumText, 
    fontWeight: 'bold' 
  },
  notFound:{
    fontSize: 18,
    alignSelf: 'center',
    marginVertical: 10,
  },
  leftArrowView:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fff',
  },
  leftButton:{
    alignItems: 'flex-start',
    paddingHorizontal: 3,
  },
  rightButton:{
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  noFeed:{
      flex: 1,
      height: RFValue(250),
      backgroundColor: '#FFFFFF',
      marginVertical: RFValue(5),
      justifyContent: 'center',
  },
  noFeedText:{
    textAlign: 'center',
    fontSize: 18,
    fontFamily: THEME_FONT,
    textAlignVertical: 'center',
  },
  defaultImg:{
    alignSelf: 'center',
    height: RFValue(100),
    width: RFValue(100),
    marginVertical: 10,
    tintColor: '#aeaeae',
    opacity: 0.6,
  },

  loaderView:{
    flex:1, 
    justifyContent:'center', 
    alignItems:'center'
  },
  noCommentsIcon:{
    color: 'gray',
    fontSize: RFValue(98),
    alignSelf: 'center',
  },
  noCommentsText:{
    fontFamily: THEME_FONT,
    fontSize: RFValue(18 - 2),
    alignSelf: 'center',
    color: 'gray',         
  },
  commentsHolderView:{
      flex: 1,
      marginHorizontal: RFValue(10),
      marginVertical: RFValue(10),
  },
  
  textFieldOuterView:{
    flexDirection: 'row',
    paddingVertical: RFValue(10),
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp(7),
    marginBottom: hp(2)
  },
  textFieldInnerView:{
      flex: 1,
      borderRadius: RFValue(10),
      borderWidth: 1,
      borderColor: HEADER,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: RFValue(4),
  },
  textInput:{
    flex: 1, 
    paddingVertical: 5,
    paddingLeft: 5
  },

activeIcon:{
  color: HEADER,
  fontSize: RFValue(22),
  textAlign: 'right',
  marginLeft: RFValue(10),
},

inActiveIcon:{
  color: '#707070',
  fontSize: RFValue(22),
  textAlign: 'right',
  marginLeft: RFValue(10),
},
petImg:{
    width:60,
    height: 60, // 70
    borderRadius:10,
}




});
