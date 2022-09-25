import React from  "react";
import { Platform } from "react-native";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp , widthPercentageToDP as wp} from "react-native-responsive-screen";
import { black, darkSky, PINK } from "../../constants/colors";
import { labelFont, textInputFont } from "../../constants/fontSize";

const styles = StyleSheet.create({
content:{
    // flex:1,
    height:hp(100)
},

bgImg:{
    flex:1,
},
aboutUsView:{
 marginHorizontal:25,
 marginTop:15,
},
video:{
  flex:1,
  borderRadius:10,
  overflow:'hidden',
  marginHorizontal:25,  
//   marginTop:10,
},
brandView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    position:'absolute',
    top:10,
    zIndex:1

},
imgView:{
    height:Platform.OS=='ios'? 300 :290,
    width:'100%',
    overflow:'hidden',
    position:'absolute',
    bottom:0,
    zIndex:-1
    
},
imgStyle:{
    width:null,
    height:null,
    flex:1,
    bottom:Platform.OS=='ios'?hp(-12):hp(-10),
},
ViewBtnStyle:{
    color:darkSky,
    fontWeight:'bold',
    fontSize:labelFont
},
HideBtnStyle:{
    color:PINK,
    fontWeight:'bold',
    fontSize:labelFont,
    marginBottom:10,
},
messageText:{
   color: '#202020',
   textAlign: "justify" ,
//    color: '#606060',
// alignSelf:'center',
   fontSize:labelFont,
}


}) 
export default styles