import React from 'react';
import {StyleSheet} from 'react-native';
import {black, darkSky, FOOTER_ICON_ACTIVE_Border_NEW, grey, TEXT_INPUT_LABEL, White} from '../../../constants/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { mediumText, textInputFont } from '../../../constants/fontSize';

const styles = StyleSheet.create({
  header: {
    color: darkSky,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  step: {
    textAlign: 'right',
    marginRight: 10,
    color: grey,
  },
  field: {
    marginTop: hp(5),
    // marginHorizontal: 25,
    paddingVertical:20,
    paddingHorizontal:25,
    backgroundColor:White,
    // margin: wp(5),
  },
  bText: {
    color: grey,
    marginLeft: wp(3.5),
  },
  text: {
    marginHorizontal: wp(10),
    // marginTop: hp(1),
    textAlign: 'center',
    fontSize:textInputFont,
    color:FOOTER_ICON_ACTIVE_Border_NEW
  },
  textInput: {
    fontSize: 12,
    height: hp(1),
  },
  intlPhoneInputStyle: {
    left:-10,
    paddingVertical: 0,
    backgroundColor: undefined,
    paddingBottom: Platform.OS == 'ios' ? 10 : null,
    marginTop: Platform.OS === 'android' ? 0 : 10,
  },
  label: {
    color: TEXT_INPUT_LABEL,
    fontSize: 15,
    marginTop:7,
    // paddingLeft: wp(4),
  },
  border:{
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor: grey,
    marginBottom: wp(1.3),
    width: wp(87.5),
  },
  containerStyle:{
    marginTop:7,
    borderBottomColor: grey,
    borderBottomWidth:StyleSheet.hairlineWidth,
  },
  
  btnContainerStyle:{
    backgroundColor:darkSky,
    marginTop:hp(2),
    marginBottom:hp(2),
    alignItems:'center',
    alignSelf:'center',
    elevation:2,
    shadowColor:'#000',
},
inputContainerStyle:{
       borderBottomColor: grey,
        borderBottomWidth:StyleSheet.hairlineWidth,
}
});

export default styles;
