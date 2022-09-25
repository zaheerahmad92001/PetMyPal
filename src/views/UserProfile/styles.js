import { StyleSheet, Platform, Dimensions } from 'react-native';
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { BGCOLOR, BG_DARK_DISABLED, black, BLUE_NEW, darkSky, HEADER, TEXT_DARK, TEXT_INPUT_LABEL, TEXT_LIGHT, White } from '../../constants/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { mediumText } from '../../constants/fontSize';

let imgHeight = Platform.OS == 'ios' ? 80 : 70
let imgWidth = Platform.OS == 'ios' ? 80 : 70
let bgHeight = 320

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
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

  // infoIcon: {
  //   width: 25,
  //   height: 25,
  //   resizeMode: 'contain',
  // },

  imgIcon: {
    width: RFValue(36),
    height: RFValue(36),
  },

  // imgIcon1: {
  //   width: RFValue(20),
  //   height: RFValue(20),
  // },

  coverImgContainer: {
    // height: 260,
    height: hp(37),
    backgroundColor: BG_DARK_DISABLED,
  },

  header: {
    position: 'absolute',
    zIndex: 1,
    marginTop: Platform.OS == 'ios' ? hp(2) : hp(5),
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
    marginBottom: 15,
  },
  outerView: {
    flexDirection: 'row',
    marginBottom: wp(2),
    justifyContent: 'space-between',
  },
  profileImgView: {
    height: imgHeight,
    width: imgWidth,
    marginTop: hp(-5),
    alignItems: 'center',
  },
  imgOuterView: {
    width: imgWidth,
    height: imgHeight,
    overflow: 'hidden',
  },
  EditView: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginTop: hp(-2),
  },
  editBtnContainer: {
    width: RFValue(35),
    height: RFValue(35),
    justifyContent:'center',
    alignItems:'center',
    // marginRight: 20,
    marginTop:10,
    zIndex: 100000,
  },



  imgView: {
    alignSelf: 'center',  // added
    marginTop: hp(-6), // added
  },


  coverImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImgContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    height: 20,
  },
  profileImgBox: {
    width: 120,
    height: 120,
    borderRadius: 10,
    position: 'absolute',
    top: -110,
    left: 20,
  },
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  nameOuterView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  nameText: {
    color: TEXT_DARK,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  memberSince: {
    color: BLUE_NEW,
    textAlign: 'center'
  },

  rowView: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  followingFollwerRow: {
    flexDirection: 'row',
    flex: 1,
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
  infoDetailText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  followersText: {
    color: '#8B94A9',
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
  leftArrow:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
  },
  leftButton:{
    alignItems: 'flex-start',
    paddingHorizontal: 3,
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
menuView:{
  justifyContent: 'flex-end',
  alignItems: 'flex-end', 
  alignSelf: 'flex-end',
  position: "absolute"
}



});
