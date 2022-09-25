import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../../constants/fontFamily';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import { BLUE } from '../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    marginBottom: 20,
    paddingHorizontal: RFValue(40),
  },
  
  textInput1: {
    fontSize: RFValue(14),
    fontFamily: THEME_FONT,
    justifyContent: 'center',
  },
  resendText:{
    textAlign: 'center',
    marginTop: 4,
    color:BLUE
 },
 timmerStyle:{
  color:BLUE,
  fontSize:13
 },

});