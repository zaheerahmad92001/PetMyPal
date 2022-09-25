import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {BGCOLOR, darkSky, PINK, White} from '../../constants/colors';
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper';
import { labelFont } from '../../constants/fontSize';
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';

const window = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181515',
    // paddingTop: RFValue(20),
  },
  userNameText: {
    fontSize: RFValue(16 - 2),
    fontFamily: THEME_FONT,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: RFValue(14 - 2),
    fontFamily: THEME_FONT,
    color: '#FFFFFF',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginHorizontal:10,

    position:'absolute',
    top:20,
    // marginBottom: RFValue(20),
  },
  textView: {
    marginLeft: RFValue(10),
    marginRight: RFValue(30),
    flex: 1,
  },
  bar: {},
  closeIcon: {
    position: 'absolute',
    right: 0,
    top: 5, 
  },
  progressBar:{
      flexDirection: 'row',
      marginBottom: 20,
      // marginTop:isIphoneX()? 50 :0,
      top:Platform.OS=='android'? getStatusBarHeight(): 
         isIphoneX() ? getStatusBarHeight()+10:
         getStatusBarHeight(),
      zIndex:1,
      marginLeft: 3,
    },
    titleView:{
      position:'absolute',
      top:Platform.OS=='android'? 130:170,
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'center'
    },
    titleStyle:{
      color:White,
      fontSize:labelFont,
      fontWeight:'500',
    
    },
    videoView:{
      height:300,
      width: '100%',
    },
   videoStyle:{
      flex: 1,
      width:wp(100),
      height: 300,
      alignSelf: 'center',
      backgroundColor: 'black',
       width: '100%',
    },
    iconStyle:{
      color:PINK,
      marginRight:10
    }
    
});
