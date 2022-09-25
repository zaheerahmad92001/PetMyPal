import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {BGCOLOR} from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
    // marginBottom:10
  },
  eContentText: {
    fontSize: RFValue(16 - 2),
    fontFamily: THEME_FONT,
    color: '#222326',
    fontWeight: '500',
  },
  eTimeText: {
    fontSize: RFValue(10 - 2),
    fontFamily: THEME_FONT,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  eNameText: {
    fontSize: RFValue(15 - 2),
    color: 'black',
    fontFamily: THEME_FONT,
  },
  image: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: RFValue(160),
    width: RFValue(160),
    marginTop: RFValue(-80),
    borderRadius: RFValue(10),
  },

  edit: {
    alignSelf: 'flex-end',
    resizeMode: 'contain',
    height: RFValue(30),
    width: RFValue(30),
    margin: RFValue(10),
  },
});
