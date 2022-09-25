import { StyleSheet, Platform, Dimensions } from 'react-native';
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { BGCOLOR, TEXT_DARK, HEADER, White, black, TEXT_INPUT_LABEL, darkSky, darkGrey, PLACE_HOLDER, DANGER, PINK, BLACK } from '../../constants/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { labelFont, mediumText, textInputFont } from '../../constants/fontSize';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'


const height = Dimensions.get('window').height;
const width  = Dimensions.get('window').width;

let imgHeight =Platform.OS=='ios'?80: 70
let imgWidth = Platform.OS=='ios'?80: 70
let bgHeight = 320;


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
  },
  bottomSheet: {
    flex: 1,
    height: height * 0.8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    elevation: Platform.OS === 'ios' ? 5 : 10,
    shadowRadius: 5,
    shadowOpacity: 0.4,
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
CommentsBox:{
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

  imgIcon: {
    width: RFValue(36),
    height: RFValue(36),
  },

  coverImgContainer: {
    // height: 260,
    height:hp(37),
    marginTop:Platform.OS=='ios' ? hp(2):hp(5) ,
    flexDirection:'row',
    justifyContent:'space-between',
    marginLeft:10,
    marginRight:20,
  },
  
  coverImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  deceaseBox: {
    position: 'absolute',
    // top: RFValue(60),
    marginTop:Platform.OS=='ios'?hp(8):hp(12),
    zIndex:1,
    left: RFValue(20),
    right: RFValue(10)
  },

  ribbon: {
    height: RFValue(20),
    width: RFValue(20),
  },

  dText: {
    color: 'white',
    fontWeight: '600'
  },

  profileImg: {
    height: null,
    width: null,
    borderRadius: 15,
    // overflow:'hidden',
    flex: 1
  },


  date: {
    color: TEXT_DARK,
  },

  btn: {
    height: 35,
    width: 120,
  },

  editBtnContainer: {
    width: RFValue(35),
    height: RFValue(35),
    zIndex: 1,
    elevation:10,
    marginTop:5
  },

  infoIconContainer: {
    marginRight: 7,
  },
  infoIcon: {
    width: 25,
    height: 25,
    tintColor: HEADER,
   
  },

  info: {
    fontSize: 12,
    marginHorizontal: 5,
    color: 'white',
  },

  infoDetailText: {
    fontSize: 12,
    fontWeight: 'bold',
    flexWrap:'wrap',
    height:'auto',
    width:wp(25),
    marginLeft:-2
  

  },

  deactivateCloseBtn: {
    position: 'absolute',
    zIndex: 1,
    right:5,
    top: -10,
  },
  confettiView: {
    position: 'absolute',
    top: 0, left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  imgBackground: {
    width: width,
    height: height * 0.65,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  imgStyle: {
    width: 90,
    height: 90,
    marginTop: -50,
    borderRadius: 50
  },

  linearGradient: {
    width: '100%',
    height: bgHeight,
    position: 'absolute',
  },
  imgBG: {
    width: '100%',
    height: bgHeight,
  },
  textStyle: {
    fontSize: RFValue(17),
    fontWeight: 'bold',
    color:black,
    // color: 'white',
  },
  tabStyle: {
    backgroundColor: 'white',
    marginBottom: 4,
    marginLeft:wp(2),
  },

  homePageOuter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf:'flex-start',
    
  },
  
  btnContainerStyle:{
    width:wp(26),
    borderRadius:10,
    paddingVertical:Platform.OS==='ios'?7:5,
  },
  titleStyle:{
     fontSize:Platform.OS=='ios'? 13 : 12,
  },
  header: {
    // position: 'absolute',
    // zIndex: 1,
    // marginTop: hp(2),
    // left: 10
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
    marginTop: hp(-4),
    backgroundColor: '#fff',
    borderRadius: 20,
    width: wp(88),
    alignSelf: 'center',
    paddingBottom:10,
    marginBottom:15,
  },
  outerView:{
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  ribbonImg:{
      backgroundColor: '#BBBBBB',
      paddingHorizontal: hp(3),
      paddingVertical: hp(2),
      width: wp(18),
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomRightRadius: 20,
      borderTopLeftRadius: 20,
      left: -1,
      top: -1
  },
  dontDistrubView:{
      backgroundColor: '#FDEDEE',
      paddingVertical: hp(2),
      width: wp(18),
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomRightRadius: 20,
      borderTopLeftRadius: 20,
  },
  DisturbView:{
    backgroundColor: '#ffff',
    paddingHorizontal: hp(3),
    paddingVertical: hp(2),
    width: wp(18),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
},
profileImgView:{
  height: imgHeight,
   width: imgWidth,
   marginTop: hp(-5),
   alignItems:'center',
},
imgOuterView: {
  width:imgWidth,
  height:imgHeight,
  overflow: 'hidden',

  backgroundColor:White,
  shadowColor:'#000',
  shadowOffset:{height:0,width:0},
  shadowOpacity:0.5,
  shadowRadius:0,
  elevation:2,

  borderRadius:15,
},
EditView:{
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: hp(-2),
},
UPOuterView:{
    flexDirection: 'row',
    justifyContent: 'center',
  
  },
  fullNameText:{
      color:TEXT_DARK,
      fontSize: 20,
      marginTop:3,
      textAlign: 'center',
      fontWeight: 'bold',
      
  },
  petProfileView:{
      flexDirection: 'row',
      justifyContent:'center',
      alignItems:'center'

    
  },
  genderIcon:{
      // borderWidth:1

  },
  genderTextView:{

  },
  rowView:{
    flexDirection: 'row',
    alignItems:'center',
   marginTop: 3
 
  },
  petSubTypeText:{
    color:TEXT_INPUT_LABEL,
    textAlign: 'center'
  },

  followBtn: {
    width: wp(35),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(4),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: darkSky,
    backgroundColor:darkSky
  },

  followingBtn: {
    width: wp(35),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(4),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: darkGrey,
    backgroundColor: darkGrey
  },

  followStyle: {
    fontWeight: '700',
    color:White
  },
  followingStyle: {
    fontWeight: '700',
    color: White
  },
  followingView:{
      justifyContent: 'center',
      height: 35,
      marginTop: 20,
      alignItems: 'center',
  },
  aboutView:{                       
      // justifyContent: 'center',
      marginTop: 10,
      marginHorizontal: 12
  },
  aboutText:{
     color: '#465575',
     marginHorizontal: 10,
     fontFamily:THEME_FONT,
     fontSize:labelFont,
  },
  modalView:{
    backgroundColor: 'white',
    borderRadius:20,
    width: wp(88),
    alignSelf:'center',
},
imgBgView:{
    flexDirection: 'row',
    justifyContent: 'center',
},
imgBgViewInn:{
    height: wp(15),
    width: wp(15),
    borderRadius: 20,
},
rowEnd:{
    justifyContent: 'flex-end',
    flexDirection: 'row',
},
ribbonOuterView:{
    borderWidth: 2,
    borderColor:White,
    backgroundColor: '#BBBBBB',
    padding:8,
    borderRadius:10,
    marginTop: wp(-4),
    marginRight: wp(-4), 
},
ribbonStyle:{
    height: RFValue(9),
    width: RFValue(9),
},
nameView:{
    margin:5,
    flexDirection: 'row',
    justifyContent: 'center',
},
nameStyle:{
  fontWeight: 'bold',
  color: '#182A53',
  fontSize:textInputFont,
},

btnOuterView:{
  flexDirection: 'row',
  // marginVertical:10,
  marginVertical:10,
  justifyContent: 'center',
  
},
btnInnerView:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
},
btnView:{
    flexDirection: 'row',
    height: 42,
    borderWidth: 1,
    width: width * 0.35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: RFValue(15),
    borderColor: '#20ACE2',
    backgroundColor: '#20ACE2',
},
activeTextStyle: {
  fontSize: RFValue(20),
  color: '#20ACE2',
  fontWeight: 'bold',
},

activeTabStyle: {
  backgroundColor: 'white',
  marginBottom: 4,
  marginLeft: wp(2),
  borderBottomColor:darkSky,
  borderBottomWidth:2
},


ownPetView:{
    marginBottom: 20,
    borderTopColor: '#ffff',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 1,
},
statusView:{
    paddingBottom: RFValue(15),
    paddingHorizontal: wp(5),
    backgroundColor:White,
},
whatsInYourMind:{
    flexDirection: 'row',
    backgroundColor:White,
    marginTop: hp(3),
},
thoughtsView:{
    flex: 1,
    borderRadius: wp(4),
    paddingVertical: RFValue(5),
    borderWidth: 1,
    borderColor:PLACE_HOLDER,
    overflow: 'hidden',
    height: hp(9),
},
text:{
    color:PLACE_HOLDER,
    marginLeft: 10,
    fontSize:textInputFont,
},
noPostView:{
    flex: 1,
    height: RFValue(250),
    backgroundColor: '#FFFFFF',
    marginVertical: RFValue(5),
    justifyContent: 'center',
},
noPostFound:{
    textAlign: 'center',
    fontSize: RFValue(18),
    fontFamily: THEME_FONT,
    textAlignVertical: 'center',
},
loaderStyle: {
  width: wp(100),
  marginTop:Platform.OS=='ios' ? hp(-20):hp(-20) ,
  alignSelf: 'center',
  zIndex: 1
},
submitBtn:{
  width: wp(88),
  borderTopLeftRadius:0,
  borderTopRightRadius:0,
  borderBottomRightRadius:20,
  borderBottomLeftRadius:20
},
textInputError:{
    borderColor:DANGER,
    borderWidth: 1,
    borderRadius:12,
    marginHorizontal: wp(3),
    paddingLeft:10,
    height: 70,
},
textInput:{
  borderColor: '#00000021',
  borderWidth: 1,
  borderRadius:12,
  marginHorizontal: wp(3),
  paddingLeft: 10,
  height: 70,
},
deactivateText:{
  fontSize: 20,
  textAlign: 'center',
  fontWeight: 'bold',
},
followersIcon:{
  height: RFValue(25),
  width: RFValue(25),

},
CancelbtnView: {
  width: wp(45),
  borderBottomLeftRadius:0,
  borderBottomRightRadius:20,
  borderTopRightRadius:0,
  borderTopLeftRadius:0,
  borderColor:PINK,
  borderWidth:StyleSheet.hairlineWidth,
  backgroundColor: PINK
},
tabBarUnderlineStyle: {
  borderRadius: 25,
  height: 0,
},



tabsView:{
  flexDirection:'row',
  alignItems:"center",
  justifyContent:'space-between',
  marginLeft:45,
  marginRight:45
},
activeTab:{
  borderBottomColor: darkSky,
  borderBottomWidth: 2,
  paddingHorizontal: 10,
},
inactiveTab:{
  // borderBottomColor: darkSky,
  // borderBottomWidth: 2,
  paddingHorizontal: 10,
},

activeTabText:{
  color:darkSky,
  fontSize:RFValue(15),
  fontWeight:'bold',
  marginBottom:2,
},
inActiveTabText:{
  color:TEXT_INPUT_LABEL,
  fontSize:RFValue(15),
  fontWeight:'bold',
  marginBottom:2,

},
closeView:{
  right: '10%',
  top: 5,
  position: 'absolute',
  zIndex: 999
}



});
