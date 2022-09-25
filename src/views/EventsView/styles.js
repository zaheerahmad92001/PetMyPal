import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { HEADER, TEXT_LIGHT, TEXT_DARK, TEXT_INPUT_LABEL, PLACE_HOLDER, BLUE_NEW } from '../../constants/colors';
import { labelFont, mediumText } from '../../constants/fontSize';

const window = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  coverImg: {
    width: '100%',
    height: RFValue(200),
  },
  profileImg: {
    marginLeft: RFValue(25),
    marginTop: -30,
    marginBottom: RFValue(15),
  },
  darkbtn: {
    height: 30,
    width: window.width * 0.3,
  },
  passwordBtn: {
    height: 40,
    width: window.width * 0.6,
  },
  box: {
    borderWidth: 1,
    borderColor: 'rgba(52, 52, 52, 0.3)',
    borderRadius:5,
    marginHorizontal: RFValue(15),
    paddingVertical: RFValue(20),
    marginBottom: RFValue(15),
  },
  NameText: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    color: TEXT_DARK,
    fontWeight: 'bold',
    // marginLeft: RFValue(20),
    marginBottom: RFValue(5),
  },
  profileAvatar: {
    backgroundColor: '#DADADA',
    borderRadius: RFValue(5),
    width: '100%',
    height: RFValue(130),
    justifyContent: 'center',
  },
  inputLabel: {
    color: '#000'
  },
  coverAvatar: {
    backgroundColor: '#DADADA',
    borderRadius: RFValue(5),
    width: '100%',
    height: RFValue(100),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  viewForInput:{
    paddingHorizontal: wp(5),
    paddingVertical: wp(4),
    backgroundColor: '#fff',
    marginBottom: RFValue(15),
  },
  imageIcon: {
    height: wp(9),
    width: wp(10),
    
    alignSelf: 'center',
  },

  greyText: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    color: 'grey',
    marginVertical: RFValue(8),
  },
  bottomText: {
    color: TEXT_INPUT_LABEL,
    fontSize: RFValue(14),
    //marginLeft: wp(1),
    marginTop: wp(2),
    marginBottom: wp(Platform.OS == 'android' ? -1 : 0),
  },
  aboutText: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    color: 'grey',
    marginVertical: RFValue(10),
    marginHorizontal: RFValue(17),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginBottom: RFValue(20),
  },
  formControl: {
    height: 35,
    borderColor: '#707070',
    borderWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: RFValue(6),
    fontSize: RFValue(14),
  },
  formControlError: {
    height: 35,
    borderColor: '#FF0000',
    borderWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: RFValue(6),
    fontSize: RFValue(14),
  },
  editFormControl:{
    // height: 35,
    marginLeft:0,
    fontSize: 18,
    
  },
  editFormControlError: {
    height: 35,
    fontSize: 18,
    marginLeft: -4,
    borderBottomColor: '#FF0000',
    borderTopColor: '#fff',
    borderLeftColor: '#ffff',
    borderRightColor: '#ffff',
  
    
    borderBottomWidth: 1,
  },
  textView: {
    marginLeft: RFValue(10),
    marginRight: RFValue(30),
    flex: 1,
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
    top: 5,
  },
  locationStyle:{
    fontSize:mediumText,
  },
  btnContainerStyle:{
    width:'100%'
  }
});
