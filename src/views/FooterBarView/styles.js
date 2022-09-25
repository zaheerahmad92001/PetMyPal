import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {TEXT_DARK, TEXT_LIGHT, FOOTER_ICON_NEW, FOOTER_ICON_ACTIVE_NEW, FOOTER_ICON_ACTIVE_Border_NEW} from '../../constants/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    flex: 1,
    height: screenHeight * 0.8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    elevation: Platform.OS === 'ios' ? 5 : 10,
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  
  imgIcon: {
    width: RFValue(30),
    height: RFValue(30),
  },
  imgIcon1: {
    width: RFValue(20),
    height: RFValue(20),
  },

  iconContainer: {
    backgroundColor: TEXT_LIGHT,
    width: 32,
    height: 32,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    backgroundColor: FOOTER_ICON_ACTIVE_NEW,
    width: 37,
    height: 48,
    shadowColor: '#000000',
    marginTop: -20,
    borderRadius: 6,
    borderColor: FOOTER_ICON_ACTIVE_Border_NEW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIcon: {
    color: FOOTER_ICON_NEW,
position:'absolute',

  },
  homeButtonContainer: {
    backgroundColor: TEXT_DARK,
    width: 48,
    height: 48,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    color: TEXT_LIGHT,
    // fontSize: 14,
    margin: 0,
    padding: 0,
  },
  selectedIcon: {
    color: '#fff',
  },
  footerText: {
    color: '#fff',
    fontSize: 10,
  },
  tileStyle:{
    width:Dimensions.get('window').width*0.94,
    height:70,
    backgroundColor:'red',
    borderRadius:10,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
    paddingHorizontal:20
  },
  tourToPetMyPal:{
    width:Dimensions.get('window').width*0.64,
    height:70,
    backgroundColor:'red',
    borderRadius:10,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
    paddingHorizontal:20
  },
 
});
