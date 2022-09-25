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
    fontSize: RFValue(14),
    fontFamily: THEME_FONT,
    color: '#222326',
    fontWeight: '500',
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
    // fontFamily: THEME_FONT,
  },
  timeText: {
    fontSize: RFValue(12),
    color: 'black',
    fontFamily: THEME_FONT,
    textAlign: 'right',
    paddingRight: RFValue(10),
    paddingLeft: RFValue(5),
    marginTop:2,
  },
  toolbar: {
   width:'90%',
  },
  ChatInputView:{
    flexDirection:'row',
    borderWidth:1,
    borderColor:'#000',
    height:hp(6),
    marginBottom:hp(5),
    // borderWidth:1
  },
  RightView:{
    flexDirection:'row',
    alignItems:'flex-end',
    position:'absolute',
    right:wp(5),
    bottom:wp(2.5),
   // justifyContent:'space-between',
    // borderWidth:1
  },
  inputToolbar:{
  marginRight:wp(25),
  borderRadius:15,
  borderWidth:0,
  borderTopWidth:0
  },
  emptyConversation:{
    justifyContent:'center',
    alignItems:'center'
  },
  nothingSVG:{
    flex:1, 
    justifyContent:'center' ,
     alignItems:'center'
  }
});
