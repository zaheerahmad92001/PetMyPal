import React from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { color } from 'react-native-reanimated'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1'
import { BG_DARK, black, darkSky, FOOTER_ICON_ACTIVE_Border_NEW, grey, HEADER, lightestGrey, lightestPink, lightGrey, offwhite, PINK, TEXT_DARK, TEXT_INPUT_LABEL, White } from '../../../constants/colors'
import { labelFont, largeText, mediumText, textInputFont } from '../../../constants/fontSize'
const styles = StyleSheet.create({
  wraper: {
    flex: 1,
    backgroundColor: White,
    paddingTop: getStatusBarHeight()
  },
  headerView: {
    //   position:'absolute',
    //   zIndex:1,
  },
  headerOverlay: {
    marginTop: hp(4),
    paddingBottom: 50,
    position: 'absolute',
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',

  },
  headerOverlay1: {
    marginRight:wp(25),
    marginTop: hp(4),
    // paddingBottom: 50,
    // position: 'absolute',
    zIndex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    // alignSelf: 'center',

  },
  headerImg: {
    width: '100%',
    height: hp(30),
    position: 'absolute',
    backgroundColor: 'green'
  },
  settingBG: {
    backgroundColor: White,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginLeft: wp(18),
  },
  settingIcon: {
    backgroundColor: 'white',
    fontSize: 20,
  },
  textStyle: {
    marginLeft: wp(18),
    fontSize: 20,
    fontWeight: '600',
  },
  textStyle1: {
    marginRight: wp(10), 
    fontSize: 20,
    fontWeight: '600',
  },
  backarrow: {
    fontSize: 30,
    color: black
  },
  backarrow1: {
    fontSize: 30,
    color: black,
    alignSelf:'flex-start',
    marginRight:wp(25),
  },
  smallImg: {
    backgroundColor: 'red',
    width: 70,
    paddingVertical: 20,
    height: 70,
    alignSelf: "center",
    marginTop: -50,
    borderRadius: 20,
  },
  bigImg: {
    width: wp(85),
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: White,
    borderRadius: 15,
    alignSelf: 'center',
    // position:'absolute',
    top: -50,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  nameStyle: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: mediumText,
    fontWeight: 'bold'

  },
  ratingView: {
    justifyContent: "center",
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  verticalLine: {
    width: 1,
    height: 15,
    backgroundColor: grey,
    marginLeft: 5,
  },
  likeText: {
    fontSize: textInputFont,
    fontWeight: '500',
    color: black,
    marginLeft: 5,
  },
  content: {
    marginHorizontal: 25,
    marginTop: 10,

  },
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  btnContent: {
    backgroundColor: HEADER,
    width: wp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 5,
  },
  userIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: HEADER,
  },
  settingView: {
    backgroundColor: lightGrey,
    marginTop: -25,
    marginHorizontal: 25,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
  },


  settingView_select: {
    backgroundColor: lightGrey,
    marginTop: -25,
    marginHorizontal: 25,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal:10,
    // paddingVertical:10,
    borderRadius: 20,
  },

  mediumImg: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
  serviceImg:{
    width: 23,
    height: 23,
    resizeMode: 'contain'
  },
  aboutImg:{
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },

  tabsView: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red',
    // paddingVertical:10,
    // borderTopLeftRadius:10,
    // borderBottomLeftRadius:10,
    paddingHorizontal: 20,
  },

  g_selected: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:HEADER,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 20,
  },
  
  s_selected:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:HEADER,
    paddingVertical: 10,
    borderRadius:10,
    // borderTopLeftRadius: 10,
    // borderBottomLeftRadius: 10,
    paddingHorizontal: 20,
  },


  tabText: {
    fontSize: 12,
    fontWeight: "500",
    color: TEXT_DARK
  },
  imgContainer: {
    width: 60,
    height: 60,
    overflow: "hidden",
    borderRadius: 10,
  },
  img: {
    flex: 1,
    height: undefined,
    width: undefined,
    resizeMode:'contain'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameView: {
    alignSelf: 'flex-start',
    marginTop: 5,
    marginLeft: 10,
    flex: 1,
  },
  iconStyle: {
    color: TEXT_DARK,
    fontSize: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  mediumText: {
    fontSize: mediumText,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  time: {
    color: FOOTER_ICON_ACTIVE_Border_NEW,
    fontWeight: "400",
    fontSize: 12,
    marginTop: 5,
  },
  ViewBtnStyle: {
    color: grey,
    fontWeight: '500',
    fontSize: labelFont
  },
  HideBtnStyle: {
    color: PINK,
    fontWeight: 'bold',
    fontSize: labelFont,
    // marginBottom:10,
  },
  messageText: {
    color: FOOTER_ICON_ACTIVE_Border_NEW,
    textAlign: "justify",
    fontSize: labelFont,
    fontWeight: "400"
  },
  imageView: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    marginTop: 20,
    borderRadius: 15,
  },
  modalView:{
    flex:1,
    backgroundColor:White,
    // backgroundColor:'red',
    alignSelf:"center",
    // marginTop:hp(20),
    width:wp(100),
    borderRadius:20,
    // paddingVertical:20,
    alignItems:'center',
    // marginBottom:,

    shadowColor:'#000',
    shadowOffset:{height:2,width:2},
    shadowOpacity:0.2,
    shadowRadius:2,
    elevation:2,
},
itemCards:{
  width:wp(90),
  marginBottom:20,
  borderRadius:15,
  paddingBottom:20,
  paddingTop:10,
  paddingHorizontal:10,
  borderColor:lightestGrey,
  borderWidth:1,
  backgroundColor: lightestPink,

},
itemCardsServices:{
  width:wp(90),
  marginBottom:20,
  borderRadius:15,
  paddingBottom:20,
  paddingTop:10,
  paddingHorizontal:10,
  marginHorizontal:10,
  backgroundColor:White,
  shadowColor:'#000',
    shadowOffset:{height:1,width:1},
    shadowOpacity:0.2,
    shadowRadius:2,
    elevation:1,
},
itemCardsImgView:{
  justifyContent:'center',
  alignItems:'center',
},
itemCardsImg:{
  width:100,
  height:100,
  resizeMode:'contain',
  // tintColor:darkSky
},
itemCardsImgs:{
  width:wp(80),
  height:hp(50),
  borderRadius:10,
  overflow:'hidden'
},
itemCardsHeading:{
  fontSize:largeText,
  fontWeight:'700',
  marginTop:hp(1)
},
itemCardsDescription:{
  color:'#8B94A9',
  marginTop:hp(1)
}
})

export default styles