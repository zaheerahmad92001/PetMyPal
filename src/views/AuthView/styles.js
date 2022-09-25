import { StyleSheet} from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper';
import {responsiveHeight} from "react-native-responsive-dimensions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BG_DARK, black, PINK, TEXT_INPUT_LABEL } from '../../constants/colors';
import { THEME_FONT } from '../../constants/fontFamily';
import { labelFont, largeText, mediumText } from '../../constants/fontSize';

export default styles = StyleSheet.create({
    wraper: {
        flex: 1,
        backgroundColor: 'white'
    },
    titleStyle:{
      color:PINK
    },
    petmypalBtn:{
        borderColor:PINK,
        borderRadius:25,
        width:wp(65),
        marginBottom:15,
        borderWidth:1,
        backgroundColor:'rgb(253,237,238)'
    },
    logoBg: {
        // width: wp(100),
        height:300,
        // backgroundColor:'red',
        top:-10,
        zIndex:-1
    },
    
    logoContainer: {
        // marginTop: hp(10),
        // flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'green'
    },
    petLogoView:{
        marginTop:-35,
        marginHorizontal: 20,
    },

    petsLogo:{
        width:50,
        height:50,
        // backgroundColor:'red',
        // position:'absolute',
        top:10,
        marginLeft:20,
        // zIndex:1

    },

    infoTtext: {
        paddingBottom: hp(1),
        marginHorizontal: 20,
    },

    btnContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: responsiveHeight(3),
        marginTop:40
        // top: isIphoneX() ? -10: -30,
    },
    headingView:{
    //   top: isIphoneX() ? -50:-70,
      justifyContent:'center',
      alignItems:'center',
      marginHorizontal:20,
      marginTop:10,
    //   backgroundColor:'red'
    },
    heading:{
        color:BG_DARK,
        fontSize:25,
        fontWeight:'bold'
    },
    sub_heading:{
     color:BG_DARK,
     fontWeight:'bold',
     fontSize:largeText,
     marginTop:15,
     marginBottom:20,
    },
    textStyle:{
        color:TEXT_INPUT_LABEL,
        fontFamily:THEME_FONT,
        fontSize:13,
        fontWeight:'500',
        textAlign:'center'
    }
    
})


