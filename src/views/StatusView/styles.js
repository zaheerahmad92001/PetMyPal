import { StyleSheet, Platform, Dimensions } from 'react-native';
import {heightPercentageToDP as hp,widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { THEME_FONT } from '../../constants/fontFamily';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import {  RFValue } from 'react-native-responsive-fontsize';
import {black, darkSky, HEADER, lightSky, PINK } from '../../constants/colors';
import { TEXT_DARK } from '../../constants/colors';
export default StyleSheet.create({
  tags: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
  },
  checkBox: {
    backgroundColor: 'white',
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  tagIcon: {
    fontSize: RFValue(16 - 2),
    color: '#222326',
    paddingLeft: 4,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  tagText: {
    textAlign: 'center',
    fontSize: RFValue(13),
    fontFamily: THEME_FONT,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  iconStyle:{ 
    alignSelf: 'center',
    color:TEXT_DARK,
    fontSize:25,
 },
  camBtn:{
    flex: 4,
    paddingVertical:10,
    borderWidth:2,
    marginRight: RFValue(10),
     borderColor:'#00000021',
    borderRadius: RFValue(15),
    alignItems: 'center',
    justifyContent:'center',
},
videoPopup:{
  flexDirection:'row',
  alignSelf:'flex-start',
  marginLeft:wp(2),
  width:wp(40),
  
},
dialogBox:{
height:hp(20),
width:wp(50),
alignItems:'center',
justifyContent:'center'
},
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 220,
  },
  imageThumbnail1: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 220,
    width: screenWidth,
  },
  removeImgIcon: {
    position: 'absolute',
    top: RFValue(10),
    left: RFValue(10),
    backgroundColor: 'white',
    borderRadius: 50,
  },
  modal: {
    backgroundColor: 'white',
    position: 'absolute',
    padding: RFValue(20),
    zIndex: 500,
    width: '100%',
    //marginHorizontal: RFValue(20),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 5,
    top: 40,
  },
  backdrop: {
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
    zIndex: 400,
    backgroundColor: '#000000A1',
    opacity: 0.6,
  },
  feelingHeading: {
    fontSize: RFValue(14),
    color: 'grey',
    marginBottom: RFValue(15),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: THEME_FONT,
  },
  iconBody: {
    height: 85,
    width: (Dimensions.get('window').width - 60) / 3,
    borderWidth: 1.5,
    borderColor: '#D5D8E3',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 25,
    height: 35,
    resizeMode: 'contain',

  },
  iconText: {
    color: '#7E889F'
  },
  artColors: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 10
  },
  wrapView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  timelineText: {
    backgroundColor: lightSky,
    marginRight: 12,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  text: {
    color: darkSky,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
  },
  timeLineBtn: {
    backgroundColor: lightSky,
    marginRight: 12,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  publish: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  feeling: {
    fontSize: RFValue(16 - 2),
    color: 'white',
    padding: 5,
    backgroundColor: HEADER,
  },
  pageView: {
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    marginLeft: 'auto',
    marginRight: 'auto',

   
    
  },
  playerView: {
    flex: 1,
    flexDirection: 'column',
    height: 300,
  },
  post_array: {
    flex: 1,
    width: screenWidth,
    height: 300,
    alignSelf: 'center',
    backgroundColor: black,
  },
  artColor: {
    backgroundColor: '#bebebe',
    flexDirection: 'column',
    height:wp(100),
    width:wp(90),
    resizeMode: 'cover',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    justifyContent:'center',
    alignItems:'center'
  },
  artTextField: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color:black,
    paddingHorizontal:wp(10)

  },
  artImageDesign:{
    height:wp(100),
    width:wp(90),
    resizeMode: 'cover',
    justifyContent:'center',
    alignItems:'center'
  },
  linearGradient:{
    width: wp(90),
    height: wp(100),
    justifyContent:'center',
    alignItems:'center',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
   
  },
  buttonContainer: {
    // marginTop: hp(7),
    alignSelf: 'center',
    zIndex:1
  },
  
  doneBtn: {
    backgroundColor: PINK,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '50%',
    borderBottomRightRadius:20,
  },
  selectArt: {
    backgroundColor:darkSky,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '50%',
   borderBottomLeftRadius:20
  },
  emojiText: {
    fontSize: RFValue(12),
    color: 'grey',
  },
  mentionTextField: {
    marginHorizontal: Platform.OS == 'android' ? 5 : 10,
    fontSize: 18,
    paddingVertical: Platform.OS == 'android' ? 10 : 13,
  },
  feelingView:{
      flexDirection: 'row',
      marginBottom: 10,
      alignItems: 'center',
  },
  emojiContainer:{
      flexDirection: 'row', 
      alignItems: 'center' ,
       marginBottom:Platform.OS=='android'?4:5
  },
  gifView:{
    marginBottom:15,
  
  },
  modalStyle:{
    flexDirection:'row',
    flexWrap:'wrap',
    width:Dimensions.get('window').width,
    marginLeft:-18,
    bottom:0,
    // width:widthPercentageToDP(90)
  },
  handleStyle:{
      alignSelf: 'center',
      top: 8,
      width: 45,
      height: 5,
      borderRadius: 5,
      opacity:1,
      backgroundColor:darkSky,
  },
  overlayStyle:{
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  headerComponent:{
    width:wp(90),
    paddingVertical:wp(3),
    justifyContent:'center',
    alignItems:'center',
    marginLeft:20,
  },
  textInput:{
    width:wp(80),
    borderWidth:1,
    borderColor:'#bebebe',
    paddingVertical:Platform.OS=='android'?10:13,
    // height:wp(10),
    borderRadius:5,
    paddingLeft:5,
    alignSelf:'center',
    color:'#000'
  },
  videoView:{
    flex: 1,
    flexDirection: 'column',
    height: 300,
  },
  videoSelected:{
  flex: 1,
  width: screenWidth,
  height: 300,
  alignSelf: 'center',
  backgroundColor: 'black',
},
imgOuterView:{ 
  flex: 1, 
  flexDirection:'column',
  margin: 1,
  marginTop:10,
},
activePost:{
    fontFamily: THEME_FONT,
    fontSize: RFValue(18),
    color: HEADER,
  },
  rightSide:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: wp(6),
  },
  palyerView:{
    marginBottom:12
  }


});
