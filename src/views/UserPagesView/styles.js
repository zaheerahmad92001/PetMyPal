import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {BGCOLOR, BLUE_NEW} from '../../constants/colors';

const window = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
    // marginBottom:10
  },
  eContentText: {
    fontSize: RFValue(16 - 2),
    fontFamily: THEME_FONT,
    // color: BLUE_NEW,
    // fontWeight: 'bold',
  },
  eContentTextSmall: {
    fontSize: RFValue(12 - 2),
    fontFamily: THEME_FONT,
    color: '#222326',
    fontWeight: '400',
  },
  eTimeText: {
    fontSize: RFValue(10 - 2),
    fontFamily: THEME_FONT,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  eNameText: {
    fontSize: RFValue(16 - 2),
    fontWeight: 'bold',
    color: 'black',
    fontFamily: THEME_FONT,
  },
  searchResultContainer: {
     flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultEmpty: {
    paddingVertical: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultImage: {
    height: RFValue(156),
    width: RFValue(156),
    marginBottom: RFValue(20),
    tintColor: '#aeaeae',
    opacity: 0.6,
  },
  searchResultText: {
    color: '#aeaeae',
    // opacity: 0.8,
    fontSize: RFValue(18 - 2),
    width: window.width * 0.8,
    textAlign: 'center',
  },
  
});
