import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {BGCOLOR, grey, PINK} from '../../constants/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
    color: '#222326',
    fontWeight: '500',
    marginLeft:wp(0)
  },
  eTimeText: {
    fontSize: RFValue(10 - 2),
    fontFamily: THEME_FONT,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  eNameText: {
    fontSize: RFValue(18 - 2),
    fontWeight: 'bold',
    color: grey,
    fontFamily: THEME_FONT,
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
  textStyle:{
    fontSize: RFValue(14),
    color: '#8B94A9',
    fontWeight: '700',

  },
  tabStyle:{
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 4,
    marginLeft: wp(2),
    borderColor: '#8B94A9'
  },
  activeTextStyle:{
    fontSize: RFValue(14),
    color: '#20ACE2',
    fontWeight: '700',

  },
  activeTabStyle:{
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 4,
    marginLeft: wp(2),
    borderColor: '#20ACE2'
  },
  renderBtnContainer:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center',
    marginVertical:wp(4)

  },
  btn:{
    width:'28%',
    height:wp(10),
    borderRadius:10,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    
  },
  eventName:{
    fontSize:15,
    //  RFValue(16 - 2),
    fontFamily: THEME_FONT,
    color: '#222326',
    fontWeight: 'bold',
    // marginLeft:wp(1)
  },
  eventDate:{
    fontSize: RFValue(10 - 2),
    fontFamily: THEME_FONT,
    alignSelf: 'flex-end',
    fontWeight: '500',
    color:PINK
  },
  eventDes:{
    fontSize: RFValue(18 - 2),
    // fontWeight: 'bold',
    color: '#000',
    fontFamily: THEME_FONT,
  },
  eventLocation:{
   color:grey 
  },
  pt_container:{
    flex: 1,
    backgroundColor: 'white',
    marginVertical: RFValue(2),
  },
  imgStyle:{
    alignSelf: 'center',
    backgroundColor: 'grey',
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: 10,
  },
  staticImg:{
    height: RFValue(15),
    width: RFValue(15),
    alignSelf: 'center',
  },
  staticImage:{
      height: RFValue(15),
      marginLeft: wp(2),
      width: RFValue(15),
    },
  countText:{
    color: '#465575',
    fontSize: 13,
    marginLeft: wp(1),
  },
  scrollview:{ 
    width: '100%', 
    paddingHorizontal: wp(4),
     marginTop: wp(4) 
    }

});
