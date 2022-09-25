import { StyleSheet, Platform, Dimensions } from 'react-native';
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { BGCOLOR, black, DANGER, darkSky, TEXT_INPUT_LABEL, White } from '../../constants/colors';
import { widthPercentageToDP as wp , heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { textInputFont } from '../../constants/fontSize';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bottomSheet: {
    height: height * 0.42,
    backgroundColor: '#F7FAFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000033",

  },
  modalView: {
    backgroundColor: "#fff",
    alignItems: "center",
    width: width - 20
  },
  openButton: {
    backgroundColor: "#fff",
    borderRadius: 100,
    // padding: 2,
    elevation: 2,
    position: 'absolute',
    top: 10,
    right: 10,
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  infoIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  descStyle: {
    borderColor: '#00000021',
    borderWidth: 1,
    paddingHorizontal: RFValue(10),
    paddingBottom: RFValue(20),
    marginHorizontal: RFValue(20),
    marginTop: RFValue(6),
    marginBottom: RFValue(16),
    borderRadius: RFValue(15),
    height: 80,
  },
  descError: {
    borderColor: DANGER,
    borderWidth: 1,
    paddingHorizontal: RFValue(10),
    paddingBottom: RFValue(20),
    marginHorizontal: RFValue(20),
    marginBottom: RFValue(16),
    marginTop: RFValue(6),
    borderRadius: RFValue(15),
    height: 80,
  },
  st_outerView: {
    marginHorizontal: RFValue(10),
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#51BCE5',
    borderRadius: 4,
  },
  storySubImg: {
    backgroundColor: '#F2F2F2',
    bottom: 5,
    right: 5,
    borderColor: '#fff',
    borderWidth: 1,
    width: RFValue(35),
    height: RFValue(35),
    borderRadius: RFValue(45 / 2),
    position: 'absolute',
    zIndex: 300,
  },
  st_thumbnail: {
    backgroundColor: '#F2F2F2',
    width: 100,
    height: 150,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  addStoryView: {
    borderWidth: 2,
    borderColor: '#51BCE5',
    borderRadius: 4,
  },
  imgBox: {
    backgroundColor: '#F2F2F2',
    width: 100,
    height: 150,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
  },
  addBtn: {
    width: RFValue(25),
    height: RFValue(25),
    borderRadius: RFValue(45 / 2),
    backgroundColor: '#FFFFFF',
  },
  nameStyle: {
    fontSize: RFValue(14),
    fontFamily: THEME_FONT,
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: 12,
    alignSelf: 'center',
    color: 'grey',
  },
  onceUponText: {
    color: darkSky,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: wp(5)
  },
  onceUponView: {
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 500,
    width: '90%',
    marginHorizontal: RFValue(20),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    top: 25,
  },
  imgStyle: {
    width: 130,
    height: 130,
    marginRight: RFValue(5),
  },
  removeImgStyle: {
    position: 'absolute',
    top: RFValue(5),
    right: RFValue(10),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf:'flex-end',
    borderRadius: 12,
    height: 24, width: 24,
  },
  storyBoxView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 400,
    backgroundColor: 'grey',
    opacity: 0.8,
  },
  confettiView: {
    position: 'absolute',
    top: 0, left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },
  confettiImageBackground: {
    width: width,
    height: height * 0.65,
    justifyContent: 'center',
    alignItems: 'center',

  },
  confettiCross: {
    right: '10%',
    top: 5,
    position: 'absolute',
    zIndex: 999
  },
  confettiProfile: {
    width: 90,
    height: 90,
    marginTop: -50,
    borderRadius: 50
  },
  scrollBtn: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    zIndex: 1,
    height: wp(15),
    width: wp(15),
    justifyContent: 'center',
    alignItems: 'center'
  },
  createBtn:{
    height: 42,
    borderWidth: 1,
    width: width * 0.35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: RFValue(15),
    borderColor: '#20ACE2',
    backgroundColor: '#20ACE2',
  },
  cancelBtn:{
    height: 42,
    borderWidth: 1,
    width: width * 0.35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: RFValue(15),
    borderColor: '#F596A0',
  },
  nameView:{
    flexDirection: 'row',
    marginVertical: RFValue(5),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTop3:{
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: hp(3),
  },
  whatsOnYourMind:{
    flex: 1,
    borderRadius: wp(4),
    paddingVertical: RFValue(5),
    borderWidth: 1,
    borderColor: '#C7CCDA',
    overflow: 'hidden',
    height: hp(9),
  },
  whatsOnYourMindText:{
    color: '#C7CCDA',
    marginLeft: 10,
  },
  onceUponeTime:{
    textAlign: 'center',
    fontSize: RFValue(16),
    marginVertical: RFValue(5),
    marginLeft: RFValue(15),
    fontWeight: 'bold',
  },
  welcomeImgView:{
    width:'100%',
    height:200,
    overflow:'hidden',
  },
  welcomePMPImg:{
    width:undefined,
    height:undefined,
    flex:1,
    resizeMode:'contain'
  },
  closeIcon:{
    fontSize:20,
    color:black,
    alignSelf:'flex-end',
    position:'absolute',
    zIndex:1,
    top:30,
    right:20,
  },
  dontShowView:{
    backgroundColor:White,
    position:'absolute',
    zIndex:1,
    bottom:20,
    padding:10,
    right:0,
  },
  rowCenter:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  checkIcon:{
    fontSize:20,
    color:black
  },
  dontShowText:{
    marginLeft:5,
    fontSize:textInputFont,
    color:black,
  }
  

});
