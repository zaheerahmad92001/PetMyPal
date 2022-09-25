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
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 220,
  },
  imageThumbnail1: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 220,
    width: screenWidth,
  },
  removeImgIcon: {
    position: 'absolute',
    top: RFValue(10),
    left: RFValue(10),
    backgroundColor: 'white',
    borderRadius: 50,
  },
  modal: {
    backgroundColor: 'white',
    position: 'absolute',
    padding: RFValue(20),
    zIndex: 500,
    width: '100%',
    marginHorizontal: RFValue(20),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 5,
    top: 40,
  },
  backdrop: {
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
    zIndex: 400,
    backgroundColor: '#000000A1',
    opacity: 0.6,
  },
  feelingHeading: {
    fontSize: RFValue(14),
    color: 'grey',
    marginBottom: RFValue(15),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: THEME_FONT,
  },
  
});
