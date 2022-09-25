import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {BGCOLOR, black, DANGER, grey, TEXT_DARK, TEXT_INPUT_LABEL} from '../../constants/colors';
import {widthPercentageToDP as wp,heightPercentageToDP as hp,} from 'react-native-responsive-screen';
import { textInputFont } from '../../constants/fontSize';

const window = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'space-between'
  },

  coverImg: {
    width: '100%',
    height: RFValue(180),
  },
  modal: {
    backgroundColor: 'white',
    maxHeight:wp(50),
    width:'80%',
    alignSelf:'center',
    top:'40%',
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:-5
  
    
    

  },
  btnRow: {
    flexDirection: 'row',
    height: 'auto',
    width:'auto',
    flexGrow:1,
    alignItems:'flex-end'

  },
  profileImg: {
    width: RFValue(55),
    height: RFValue(55),
    opacity: 1,
    marginVertical: RFValue(10),
    alignSelf: 'center',
  },
  grpInfo: {
    position: 'absolute',
    bottom: RFValue(0),
    left: RFValue(0),
    top: 0,
    zIndex: 300,
    padding: RFValue(10),
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  grpInfoBox: {},
  darkbtn: {
    marginVertical: RFValue(8),
    height: 40,
    width: window.width * 0.7,
    alignSelf: 'center',
  },
  deleteBtn: {
    height: 30,
    width: window.width * 0.45,
    marginTop: RFValue(10),
    marginRight: RFValue(10),
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
    fontSize: RFValue(14),
    fontFamily: THEME_FONT,
    color: TEXT_INPUT_LABEL,
    fontWeight: 'bold',
    marginTop:wp(3)
    // marginLeft: RFValue(20),
    // marginBottom: RFValue(5),
  },
  profileAvatar: {
    backgroundColor: '#DADADA',
    borderRadius: RFValue(5),
    width: window.width * 0.3,
    height: RFValue(130),
    justifyContent: 'center',
   // paddingBottom:wp(10)
  },
  coverAvatar: {
    backgroundColor: '#DADADA',
    borderRadius: RFValue(5),
    width: '100%',
    height: RFValue(130),
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
   
    
  },
  bottomText: {
    fontSize: RFValue(14),
    fontFamily: THEME_FONT,
    color: TEXT_INPUT_LABEL,
    marginBottom: RFValue(10),
    marginTop:10,
  },
  aboutText: {
    fontSize: RFValue(14),
    fontFamily: THEME_FONT,
    color: TEXT_INPUT_LABEL,
    marginRight: RFValue(20),
    marginVertical: wp(2.2),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginBottom: RFValue(20),
  },
  formControl: {
    height: 38,
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
    fontSize: RFValue(14)
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
  commView:{
      paddingHorizontal: wp(7),
      paddingVertical: wp(4),
      borderColor: '#0000',
      borderWidth: 1,
      elevation: 5,
      shadowColor: '#0000',
      shadowOpacity: 12,
      backgroundColor: '#fff',
      marginBottom: RFValue(15),
    },

    breedView: {
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor:grey
    },
    breedViewError: {
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: DANGER
    },
  
    breadInnerView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    breedText: {
      flex: 1,
      color: black,
      fontSize: textInputFont,
    },
    iconStyle: {
      color: TEXT_INPUT_LABEL,
      fontSize: 11,
      width: wp(10),
      textAlign: 'center'
    },
    btnContainerStyle:{
      marginTop:25,
      fontSize:RFValue(13)
    },
    memberBtn:{
alignSelf:'center',
marginVertical:hp(2)

    },
    popupImage:{
      width: 90,
      height: 90,
      borderRadius: 50,
      marginTop: -45
    },
    existingGroupcontainer: {
      borderColor: '#0000', // if you need
      borderWidth: 1,
      marginTop: hp(-10),
      backgroundColor: 'white',
      borderRadius: 20,
      width: wp(88),
      marginBottom: wp(10),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 2.84,    
      elevation: 5,
      paddingBottom:wp(1)
      
      
  },
  AvatarButtons:{
    paddingHorizontal: wp(7),
    borderColor: '#0000', // if you need
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#0000',
    shadowOpacity: 12,
    backgroundColor: '#fff',
    paddingBottom:wp(5)
    // marginBottom: RFValue(15),
    // marginVertical:wp(4),
  
  }


   

});
