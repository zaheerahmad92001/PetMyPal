import { StyleSheet, Platform, Dimensions } from 'react-native';
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BGCOLOR, darkSky } from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
    // marginBottom:10
  },
  manuText: {
    color: 'gray', fontWeight: 'bold', paddingVertical: wp(3), fontSize: 15
  },
  manuContaner: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#00000021',
    alignItems: 'center'
  },
  eContentText: {
    fontSize: RFValue(14),
    fontFamily: THEME_FONT,
    color: '#FFFF',
    fontWeight: 'bold',
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
    fontFamily: THEME_FONT,
  },
  timeText: {
    fontSize: RFValue(12),
    color: 'black',
    fontFamily: THEME_FONT,
    textAlign: 'right',
    paddingRight: RFValue(10),
    paddingLeft: RFValue(5),
  },
  btnStyle: {
    flexDirection: 'row',
    width: wp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(5),
    borderWidth: 1,
    borderColor: darkSky,
    borderRadius: 12,
    backgroundColor: darkSky
  },
  btnRetry: {
    flexDirection: 'row',
    width: wp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(5),
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#F596A0',
    backgroundColor: '#F596A0'
  },
  outerView: {
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
    flexDirection: 'row',
    height: hp(7),
    justifyContent: 'space-between',
    paddingHorizontal: wp(4)
  },
  menuView: {
    marginTop: wp(-2),
    flexDirection: 'row',
    marginRight: wp(4),
    justifyContent: 'flex-end'
  },
  menuInnerView:{
    backgroundColor: 'white',
    width: wp(50),
    borderRadius: 12,
    marginVertical: wp(2),
    paddingVertical: wp(2),
    padding: RFValue(10),
    justifyContent: 'space-between'

  },
  
});
