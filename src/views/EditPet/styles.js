import { StyleSheet, Dimensions } from 'react-native';
import { THEME_FONT } from '../../constants/fontFamily';
import { RFValue } from 'react-native-responsive-fontsize';

import {TEXT_DARK, TEXT_INPUT_LABEL, White, BGCOLOR, darkSky, PINK, grey, black , DANGER } from '../../constants/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { labelFont, mediumText, textInputFont } from '../../constants/fontSize';
const window = Dimensions.get('window');

const imgHeight = 80
const imgWidth = 80

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
  },
  inputLabel: {
    marginTop: 5,
    fontSize:textInputFont,
    color:'grey'
  },
  coverImg: {
    width: '100%',
    height: hp(37),
  },
  
  backdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 400,
    backgroundColor: 'grey',
    opacity: 0.8,
  },
  modal: {
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 500,
    alignSelf: 'center',
    width: window.width * 0.9,
    borderRadius: 10,
    top: window.height * 0.1,
    padding: RFValue(20),
  },

  viewForInput: {
    paddingHorizontal: wp(7),
    paddingVertical: wp(4),
    borderColor: '#0000', // if you need 
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#0000',
    shadowOpacity: 12,
    backgroundColor: '#fff',
    marginBottom: RFValue(15),
  },
  nameStyle: {
    color: TEXT_DARK,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  joiningDate: {
    color: TEXT_INPUT_LABEL,
    textAlign: 'center'
  },
  NameText: {
    fontSize:mediumText, 
    color: TEXT_DARK,
    fontWeight: 'bold',
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
    height: RFValue(100),
    justifyContent: 'center',
  },
 
  bottomText: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    color: 'grey',
    marginBottom: RFValue(10),
  },


  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: RFValue(20)
  },

  yellowBtn: {
    paddingVertical: wp(3),
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#FFAF3E',
  },

  greyBtn: {
    paddingVertical: wp(3),
    paddingHorizontal: wp(25),
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#182A53'
  },

  btnText: {
    fontWeight: '700',
    alignSelf: 'center',
    color: '#182A53',
  },

  imgStyle: {
    flex: 1,
    width: null,
    height: null,
  },
  overlayStyle: {
    paddingTop: 15,
    paddingHorizontal: 25,
    width: wp(90),
    borderRadius: 20,
    backgroundColor: White,
  },
  outerView: {
    paddingTop: 15,
    width: wp(90),
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
    backgroundColor: White,
  },

  d_containerStyle: {
    backgroundColor: 'white',
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 5,
  },
  inputContainerStyle: {
    borderBottomWidth:1,
    borderBottomColor:grey
  },

  deceasedCloseBtn: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 20,
    top: 15,
    zIndex: 1,
  },
  header: {
    position: 'absolute',
    marginTop: hp(2),
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    color: darkSky,
    fontSize: 30,
  },

  downArrow: {
    color: TEXT_INPUT_LABEL,
    fontSize: 11,
    width: wp(10),
    marginRight:4,
    textAlign: 'right',
  },

  headerText: {
    color:darkSky,
    fontSize: RFValue(14),
    fontWeight: 'bold',
    width:'87%',
    textAlign:'center'

  },
  cardView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cardStyle: {
    borderColor: '#0000',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    marginTop: hp(-12),
    backgroundColor: '#fff',
    borderRadius: 20,
    width: wp(88),
    paddingBottom: hp(3),
    marginBottom: wp(6)
  },
  imgStyle: {
    width: null,
    height: null,
    flex: 1
  },
  imgView: {
    width: imgWidth,
    height: imgHeight,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'grey',
    marginTop: -40
  },
  nameStyle: {
    color: TEXT_DARK,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  
  btnContainerStyle: {
    width: wp(45),
    alignSelf: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.2
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  btnOuterView: {
    flexDirection: 'row',
  },
  btnView: {
    flexDirection: 'row',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    width: wp(45),
    height: 40,
    borderColor: '#F596A0'
  },

  
  deceasedText: {
    color: TEXT_DARK,
    marginTop: 5,
  },
  checkbox: {
    marginRight: RFValue(15),
    borderRadius: 4,
    borderColor: '#465575',
    borderWidth: 1,
    marginLeft: wp(-3)
  },
  saveBtn: {
    width: wp(90),
    alignSelf: 'center',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingVertical: 15

  },
  OkbtnView: {
    width: wp(45),
    borderBottomLeftRadius:20,
    borderBottomRightRadius:0,
    borderTopRightRadius:0,
    borderTopLeftRadius:0,
    backgroundColor: darkSky
  },
  CancelbtnView: {
    width: wp(45),
    borderBottomLeftRadius:0,
    borderBottomRightRadius:20,
    borderTopRightRadius:0,
    borderTopLeftRadius:0,
    borderColor:PINK,
    borderWidth:StyleSheet.hairlineWidth,
    backgroundColor: PINK
  },
  stopWishView:{
      flexDirection: 'row',
      marginVertical: RFValue(15),
  },
  loaderPosition:{
    position:'absolute',
    top:50,
    justifyContent:'center',
    zIndex:1,
    elevation:10,
    width:'100%',
    alignItems:'center'
  },
  petSizeView:{
    borderBottomColor:grey,
    borderBottomWidth:1,
  },
  labelStyle:{ 
    color: TEXT_INPUT_LABEL,
    marginTop: 7,
    marginBottom:5, 
    fontSize: 15 
  },
  breedViewError: {
    paddingVertical: 10,
    borderBottomWidth:1,
    borderBottomColor: DANGER
  },
  breedView: {
    paddingVertical: 10,
    borderBottomWidth:1,
    borderBottomColor: grey
  },
  breadInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  breedText: {
    flex: 1,
    color: black,
    fontSize:textInputFont,
  },
  
  



});
