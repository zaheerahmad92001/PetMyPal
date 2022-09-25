import {StyleSheet ,PixelRatio,} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {RFValue } from 'react-native-responsive-fontsize';
import { black, grey } from '../../constants/colors';

export default  styles = StyleSheet.create({
        container: {
          flex: 1,
        },
        logoText2: {
          width: wp(90),
          height: hp(10),
        },
        signupText: {
          width: PixelRatio.getPixelSizeForLayoutSize(80),
        },
        logoText: {
          width: wp(40),
          height: hp(10),
        },
        bottomOptions: {
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
      
          paddingBottom: RFValue(40),
        },
        options: {
          paddingTop: RFValue(10),
        },
        buttons: {
          height: 42,
          marginBottom: 10,
          width: 320,
          alignItems: 'center'
        },
        icon: {
          marginHorizontal: 20,
        },
        forgetPass: {
            // margin: 8,
            marginTop:10,
            marginBottom:10,
            marginRight: 0,
            justifyContent: 'flex-end',
            flexDirection: 'row'
        },
        forgetText: {
            color: black,
            fontSize: 15
        },
        btnStyle: {
            marginTop: 15,
            alignSelf: 'center',
            width:wp(90)
        },
        customStyle: {
            fontWeight: "bold",
            color: grey
        },
        loaderStyle:{
          width:'100%',
          height:'20%',
          justifyContent:'center',
          alignItems:'center',
          zIndex:1
        }
      
})