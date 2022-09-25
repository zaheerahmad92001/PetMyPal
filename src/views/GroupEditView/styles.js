import {StyleSheet, Platform, Dimensions} from 'react-native';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {BGCOLOR, TEXT_DARK} from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
  },
  bottomSheet: {
    height: screenHeight * 0.42,
    backgroundColor: '#F7FAFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    elevation: Platform.OS === 'ios' ? 5 : 10,
    shadowRadius: 5,
    shadowOpacity: 0.4,
    alignItems: 'center',
  },
  imgIcon: {
    width: RFValue(36),
    height: RFValue(36),
  },
  imgIcon1: {
    width: RFValue(20),
    height: RFValue(20),
  },
  coverImgContainer: {
    height: 260,
  },
  coverImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImgContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    // flexDirection: 'row',
    // justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  profileImgBox: {
    marginLeft: 20,
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: -80,

    // elevation: 5
  },
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
    resizeMode: 'cover',
  },
  userDetails: {
    // paddingVertical: 10,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 16,
    color: TEXT_DARK,
    fontWeight: 'bold',
  },
  date: {
    color: TEXT_DARK,
    fontSize: 14,
  },
  description: {
    fontSize: 24,
    color: TEXT_DARK,
    fontWeight: 'bold',
  },
  actions: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    marginVertical: RFValue(20),
    marginHorizontal: RFValue(40),
  },
});
