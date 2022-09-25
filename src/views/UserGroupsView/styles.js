import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {BGCOLOR, BLUE, darkGrey, TEXT_DARK} from '../../constants/colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
    color: '#465575',
    fontWeight: '500',
  },
  eContentTextSmall: {
    fontSize: RFValue(15 - 2),
    color: '#929AAE',
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
    color: TEXT_DARK,
   // fontFamily: THEME_FONT,
    marginTop:wp(2)
  },
  searchResultContainer: {
    flex: 1,
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
