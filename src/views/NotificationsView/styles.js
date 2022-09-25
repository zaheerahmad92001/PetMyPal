import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {BGCOLOR} from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
    // marginBottom:10
  },
  eContentText: {
    fontSize: RFValue(12),
    fontFamily: THEME_FONT,
    color: '#222326',
    fontWeight: '500',
    width:wp(70)
  },
  eTimeText: {
    fontSize: RFValue(8),
    fontFamily: THEME_FONT,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  eNameText: {
    fontSize: RFValue(14),
    color: 'black',
    fontWeight: 'bold',
    fontFamily: THEME_FONT,
  },
  timeText: {
    fontSize: RFValue(12),
    color: '#C7CCDA',
    fontFamily: THEME_FONT,
    textAlign: 'right',
    paddingRight: RFValue(10),
    paddingLeft: RFValue(5),
  },
  nothingSVG:{
    flex:1, 
    justifyContent:'center' ,
     alignItems:'center'
  }
});
