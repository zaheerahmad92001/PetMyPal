import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {BGCOLOR, TEXT_DARK} from '../../constants/colors';

const window = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  coverImg: {
    width: '100%',
    height: RFValue(300),
  },
  modal: {
    backgroundColor: 'white',
    maxHeight:145,
    width:300,
    alignSelf:'center',
    top:'40%',
    borderRadius:5,
    alignItems:'center',
    justifyContent:'center',
  },
  btnRow: {
    flexDirection: 'row',
    height: 30,
  },
  profileImg: {},
  grpInfo: {
    position: 'absolute',
    bottom: RFValue(10),
    left: RFValue(5),
    zIndex: 300,
  },
  grpInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkbtn: {
    marginVertical: RFValue(8),
    height: 40,
    width: window.width * 0.7,
    alignSelf: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: RFValue(10),
    right: RFValue(20),
    zIndex: 300,
    height: 30,
    width: window.width * 0.45,
  },
  backdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 400,
    backgroundColor: 'grey',
    opacity: 0.8,
  },
  box: {
    borderWidth: 1,
    borderColor: '#707070',
    marginHorizontal: RFValue(15),
    paddingVertical: RFValue(20),
    paddingHorizontal: RFValue(10),
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
    width: window.width * 0.3,
    height: RFValue(130),
    justifyContent: 'center',
  },
  coverAvatar: {
    backgroundColor: '#DADADA',
    borderRadius: RFValue(5),
    width: '100%',
    height: RFValue(120),
    justifyContent: 'center',
  },

  imageIcon: {
    height: RFValue(50),
    width: RFValue(50),
    alignSelf: 'center',
  },
  infoText: {
    color: '#424242',
  },

  greyText: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    color: '#424242',
    marginTop:-15
    
  },
  bottomText: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    color: 'grey',
    marginTop: 10,
    marginBottom: RFValue(10),
  },
  aboutText: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    color: 'grey',
    marginVertical: RFValue(10),
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
    fontSize: RFValue(14),
    width:'90%',
    borderRadius:5,
    marginVertical:15,
    paddingHorizontal:5
  },
  formControlError: {
    height: 35,
    borderColor: '#FF0000',
    borderWidth: 1,
    fontSize: RFValue(14),
    width:'90%',
    borderRadius:5,
    marginVertical:15,
    paddingHorizontal:5
  },
  errorText: {
    color: '#EB046F',
    marginHorizontal: RFValue(10),
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
});
