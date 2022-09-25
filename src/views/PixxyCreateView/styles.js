import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {BGCOLOR, darkSky} from '../../constants/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: wp(5),
    paddingHorizontal: wp(5),
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
  actions: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    marginTop: RFValue(12),
    height: 40,
  },
  uploadPhotoBtn:{
      // height:wp(18),
      width:wp(32),
      paddingVertical: wp(2),
      borderWidth: 1,
      marginRight: RFValue(7),
      borderColor: '#00000021',
      borderRadius: RFValue(15),
      alignItems: 'center',
      backgroundColor:darkSky
    },
  btnText:{
      alignSelf: 'center',
      color: 'white',
    },
    createPixxyText:{
      fontFamily: THEME_FONT,
      fontSize: RFValue(16),
      fontWeight: 'bold',
      color:darkSky
    },
    onPageView:{
      paddingHorizontal: 20,
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
    }
  
});
