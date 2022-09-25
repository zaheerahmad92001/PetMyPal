import React from  "react";
import { Platform } from "react-native";
import { StyleSheet } from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import { heightPercentageToDP as hp , widthPercentageToDP as wp} from "react-native-responsive-screen";
import { black, DANGER, darkSky, grey, TEXT_INPUT_LABEL, White } from "../../constants/colors";
import { labelFont, mediumText, textInputFont, largeText } from "../../constants/fontSize";

const styles = StyleSheet.create({
content:{
    backgroundColor:darkSky
    
    // height:hp(100)
},
darkView:{  
    height:isIphoneX()? hp(23) :hp(30),
    zIndex:-1,
    backgroundColor:darkSky ,
    // position:'absolute',
    // top:0
},
maintainer:{
    top:isIphoneX()? hp(-21) : hp(-25), 
    // backgroundColor:'red'
    // backgroundColor:darkSky
},
imgView:{
//  justifyContent:'center',
 alignItems:'center',
//  backgroundColor:'black'
//  width:'100%'
},
container:{
  backgroundColor:White,
  zIndex:-1,
  top:isIphoneX()? hp(-11) : hp(-13),
  borderTopRightRadius:20,
  borderTopLeftRadius:20,
//   backgroundColor:'green'

  
},
innerView:{
 marginTop:isIphoneX()?hp(14) : hp(16)
},
bigText:{
    textAlign:"center",
    fontSize:largeText,
    fontWeight:'700',
    color:darkSky,
},
smallText:{
    color:TEXT_INPUT_LABEL,
    fontWeight:"500",
    fontSize:mediumText,
    textAlign:'center'
},
infoView:{
marginHorizontal:25,
},
btnView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginTop:15
},

verifyBySMSBtnSelected: {
    width: wp(41),
    backgroundColor: darkSky,
    borderColor: darkSky,
    borderRadius: 10,
    paddingVertical: Platform.OS == 'android' ? 5 : 10,
},
verifyBySMSBtn: {
    width: wp(41),
    borderRadius: 10,
    paddingVertical: Platform.OS == 'android' ? 5 : 10,

},
titleStyle: {
    color: White,
},
phoneView:{
    marginTop:25,
},
intlPhoneInputStyle: {
    paddingLeft: 2,
    paddingVertical: 0,
    borderBottomColor:grey,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // paddingBottom: Platform.OS == 'android' ? 0 : 10,
    marginBottom:10,
    // marginTop: Platform.OS == 'android' ? 0 : 10,
},
intlPhoneInputStyle_err: {
    paddingLeft: 2,
    paddingVertical: 0,
    borderBottomColor:DANGER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // paddingBottom: Platform.OS == 'android' ? 0 : 10,
    marginBottom:10,
    // marginTop: Platform.OS == 'android' ? 0 : 10,
},
buttonContainer: {
    marginTop: hp(4),
    alignSelf: 'center'
},




}) 
export default styles