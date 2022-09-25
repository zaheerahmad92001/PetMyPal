import { StyleSheet, Platform, Dimensions } from 'react-native';
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { BGCOLOR, darkGrey, darkSky, PINK, White } from '../../constants/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { textInputFont } from '../../constants/fontSize';

const window = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  eContentText: {
    fontSize: RFValue(14),
    fontFamily: THEME_FONT,
    color: '#8B94A9',
    fontWeight: '500',
  },
  
  eNameText: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: 'black',
    fontFamily: THEME_FONT,
  },
  statusTime: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: PINK,
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
    fontSize: RFValue(16),
    width: window.width * 0.8,
    textAlign: 'center',
  },
  countHeading: {
    fontSize: RFValue(15),
    color: '#182A53',
    fontWeight: '700',
    marginLeft: RFValue(18),
    paddingBottom: RFValue(18),
    backgroundColor: 'white'

  },
 
  textStyle: {
    fontSize: RFValue(20),
    color: '#8B94A9',
    fontWeight: 'bold',

  },
  tabStyle: {
    backgroundColor: 'white',
    marginBottom: 4,
    marginLeft: wp(2),
  },
  activeTextStyle: {
    fontSize: RFValue(20),
    color: '#20ACE2',
    fontWeight: 'bold',
  },

  activeTabStyle: {
    backgroundColor: 'white',
    marginBottom: 4,
    marginLeft: wp(2),
  },

  followBtn: {
    width: wp(25),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(4),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: darkSky,
    backgroundColor:darkSky
  },
  requestBtn: {
    width: wp(25),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(4),
    // borderWidth: 1,
    borderRadius: 10,
    // borderColor: darkSky,
    backgroundColor:PINK
  },

  followingBtn: {
    width: wp(25),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(4),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: darkGrey,
    backgroundColor: darkGrey
  },

  followStyle: {
    fontWeight: '500', // 700
    color:White,
    fontSize:textInputFont
  },
  
  
  followingStyle: {
    fontWeight: '500', // 700
    color: White,
    fontSize:textInputFont
  },

  imgStyle: {
    alignSelf: 'center',
    backgroundColor: 'black',
    width: RFValue(45),
    height: RFValue(45),
    borderRadius: 10,
  },
  onlineView:{
    flexDirection:'row',
    alignItems:'center',
  },
  onlineText:{
    color:"green",
    fontFamily:THEME_FONT,
    fontSize:textInputFont,
  },
  onlineStatus:({color})=>({
    width:10,
    height:10,
    borderRadius:50,
    backgroundColor:color,

  }),
  onlineStatusContainer:{
    justifyContent:'center',
    position:'absolute',
    right:-5,
    top:8,
    zIndex:1,
    alignItems:'center',
    
    
  }
});
