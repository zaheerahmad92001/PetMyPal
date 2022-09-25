import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  black,
  DANGER,
  darkGrey,
  darkSky,
  grey,
  PINK,
  White,
} from '../../constants/colors';
import { popUpImg } from '../../constants/ConstantValues';
import { errorFont, labelFont, mediumText } from '../../constants/fontSize';
import { Overlay } from 'react-native-elements';
import HTML from 'react-native-render-html';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomLoader from './CustomLoader';
import { Platform } from 'react-native';
import { INCORRECT_PASSWORD, LongAboutParseHtml } from '../helpers';
import { THEME_FONT } from '../../constants/fontFamily';

const imgMarginBottom = 45;
const imgHeight = 90;
const imgWidth = 90;
const topMargin = 15;
const horizontalPadding = 25;

const InfoModal = props => {
  const {
    info,
    policy,
    isVisible,
    userPassword,
    passError,
    leftAlign,
  } = props;

  return (
    <Overlay
      isVisible={isVisible ? isVisible : false}
      onBackdropPress={props.onBackButtonPress}
      onBackButtonPress={props.onBackButtonPress}
      useNativeDriver={true}
      overlayStyle={styles.overlayStyle}
    // style={{marginBottom:0}}
    >
      <View style={[styles.modalStyling, props.modalView]}>
        <View style={styles.imgContainer}>
          <View style={styles.imgStyle}>
            <Image source={popUpImg} style={styles.avatarStyle} />
          </View>
        </View>

        <View style={styles.contentStyling}>
          {props.policy ? (
            <View style={styles.textContainer}>
              <View style={styles.policyStyle}>
                <View style={styles.circle} />
                <Text style={styles.textStyle}>{info.point1}</Text>
              </View>

              <View style={styles.policyStyle}>
                <View style={styles.circle} />
                <Text style={styles.textStyle}>{info.point2}</Text>
              </View>
              <View style={styles.policyStyle}>
                <View style={styles.circle} />
                <Text style={styles.textStyle}>{info.point3}</Text>
              </View>
              <View style={styles.policyStyle}>
                <View style={styles.circle} />
                <Text style={styles.textStyle}>{info.point4}</Text>
              </View>
            </View>
          ) : props.info ? (
            <View style={
              leftAlign ?
              styles.textLeftAlign:
              styles.textContainer
              }>
              <Text style={
                leftAlign ?
                styles.info_textLeftAlignStyle:
                styles.info_textStyle
                }>
                  {/* {LongAboutParseHtml(props.info)} */}
                  {props.info}
                </Text>
            </View>
          ) : props.showDelete ? (
            <View style={styles.deleteView}>
              {passError == INCORRECT_PASSWORD ?
                <Text style={styles.wrongPass}>Incorrect Password!</Text>
                :
                <Text style={styles.greyText}>Please Enter Your Password</Text>
              }
              <TextInput
                secureTextEntry
                onChangeText={userPassword}
                style={
                  passError == INCORRECT_PASSWORD ?
                  [styles.formControlError]
                  :
                  [styles.formControl]
                }
              />
          
            </View>
          ) : null

          }

        </View>

        {props.showDelete &&
          <View style={styles.btnWraper}>
            {props.processing ?
              <View style={styles.loaderStyle}>
                <CustomLoader 
                loaderContainer={{height:40}}
                />
              </View> :
              <TouchableOpacity
                activeOpacity={1}
                onPress={props.onDoneBtnPress}
                style={[styles.OkbtnView]}
              >
                <View style={styles.btnWithIcon}>
                  <Text style={styles.okBtnStyle}>{props.DoneTitle}</Text>
                </View>
              </TouchableOpacity>
            }
            <TouchableOpacity
              activeOpacity={1}
              onPress={props.onCancelBtnPress}
              style={[styles.CancelbtnView]}
            >
              <View style={styles.btnWithIcon}>
                <Text style={styles.okBtnStyle}>{props.CancelTitle}</Text>
              </View>
            </TouchableOpacity>
          </View>

        }

        {!props.showDelete &&
          <TouchableOpacity
            activeOpacity={1}
            onPress={props.onPress}
            style={styles.btnView}>
            <View style={styles.btnWithIcon}>
              <Text style={styles.okBtnStyle}>OK</Text>
            </View>
          </TouchableOpacity>}
      </View>
    </Overlay>
  );
};
export default InfoModal;

const styles = StyleSheet.create({

  overlayStyle: {
    backgroundColor: 'transparent',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 22,
    marginLeft: 25,
    marginRight: 25,
    paddingLeft: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingRight: 0,
    minWidth:wp(80),
    maxWidth: wp(80)
  },

  modalStyling: {
    backgroundColor: White,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 22,
    // marginHorizontal: 25,
  },

  contentStyling: {
    marginTop: -imgMarginBottom + -8,
    paddingVertical: topMargin,
  },
  iconStyle: {
    color: black,
    // color: White,
    fontSize: 30,
    alignSelf: 'flex-end',
  },
  textStyle: {
    color: grey,
    fontSize: labelFont,
    // flex: 1,
  },
  info_textStyle: {
    color: black,
    fontSize: labelFont,
    textAlign: 'center',
  },
  info_textLeftAlignStyle:{
    color: black,
    fontSize: labelFont,
  },

  imgStyle: {
    width: 100,
    height: 100
  },
  headerText: {
    color: White,
    fontSize: labelFont,
    fontWeight: '600'
  },
  policyStyle: {
    flexDirection: 'row',
    marginBottom: 5
    // alignItems: 'center',
  },
  circle: {
    height: 8,
    width: 8,
    borderRadius: 8 / 2,
    backgroundColor: grey,
    marginRight: 10,
    alignSelf: 'flex-start',
    marginTop: 7,
  },
  btnView: {
    // paddingVertical: 3,
    backgroundColor: darkSky,
    backgroundColor: darkSky,
    borderBottomEndRadius: 20,
    borderBottomLeftRadius: 20,
    marginBottom: -1
  },
  btnWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS == 'android' ? 10 : 13,
    // paddingVertical: 10,
  },
  okBtnStyle: {
    fontSize: mediumText,
    marginLeft: 5,
    fontWeight: '600',
    color: White
  },
  imgContainer: {
    width: imgWidth,
    height: imgHeight,
    borderRadius: imgHeight / 2,
    alignItems: 'center',
    alignSelf: 'center',
    bottom: imgMarginBottom
  },
  imgStyle: {
    width: imgWidth,
    height: imgHeight
  },
  avatarStyle: {
    width: null,
    height: null,
    flex: 1,
  },
  textContainer: {
    paddingHorizontal: horizontalPadding,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  textLeftAlign:{
    paddingHorizontal: horizontalPadding,
  },


  formControl: {
    height: 38,
    borderColor: '#707070',
    borderWidth: 1,
    fontSize: RFValue(14),
    width: '90%',
    borderRadius: 5,
    marginTop: 15,
    color:black,
    paddingHorizontal: 5
  },
  formControlError:{
    height: 38,
    borderColor:PINK,
    borderWidth: 1,
    fontSize: RFValue(14),
    width: '90%',
    borderRadius: 5,
    marginTop: 15,
    color:black,
    paddingHorizontal: 5
  },

  deleteView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWraper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    top:2,

  },
  CancelbtnView: {
    width: '50%',
    borderBottomEndRadius: 20,
    backgroundColor: PINK,
    height: 45,
    // marginTop: 30
  },
  OkbtnView: {
    width: '50%',
    borderBottomLeftRadius: 20,
    backgroundColor: darkSky,
    height: 45,
    // marginTop: 30,
  },
  btnWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS == 'android' ? 10 : 13,
  },
  okBtnStyle: {
    fontSize: mediumText,
    fontWeight: '600',
    color: White
  },
  loaderStyle: {
    width:'50%',
    alignItems: 'center',
    zIndex: 1
  },
  greyText: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    color:grey,
  },
  wrongPass: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    color:PINK,
  },

})


// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import {
//   black,
//   DANGER,
//   darkGrey,
//   darkSky,
//   grey,
//   White,
// } from '../../constants/colors';
// import {popUpImg} from '../../constants/ConstantValues';
// import {errorFont, labelFont, mediumText} from '../../constants/fontSize';
// import {Overlay} from 'react-native-elements';
// import Modal from 'react-native-modal'
// import HTML from 'react-native-render-html';
// import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// const imgMarginBottom = 45;
// const imgHeight = 90;
// const imgWidth = 90;
// const topMargin = 15;
// const horizontalPadding = 25;

// const InfoModal = props => {
//   const {info, policy, isVisible} = props;

//   return (
//     <Overlay
//       isVisible={isVisible ? isVisible : false}
//       onBackdropPress={props.onBackButtonPress}
//       onBackButtonPress={props.onBackButtonPress}
//       useNativeDriver={true}
//       style={styles.overlayStyle}

//       //  {...props}

//     >
//       <View style={[styles.modalStyling, props.modalView]}>
//         <View style={styles.imgContainer}>
//           <View style={styles.imgStyle}>
//             <Image source={popUpImg} style={styles.avatarStyle} />
//           </View>
//         </View>
//         {props.children}
//         <View style={styles.contentStyling}>
//           {props.policy ? (
//             <View style={styles.textContainer}>
//               <View style={styles.policyStyle}>
//                 <View style={styles.circle} />
//                 <Text style={styles.textStyle}>{info.point1}</Text>
//               </View>

//               <View style={styles.policyStyle}>
//                 <View style={styles.circle} />
//                 <Text style={styles.textStyle}>{info.point2}</Text>
//               </View>
//               <View style={styles.policyStyle}>
//                 <View style={styles.circle} />
//                 <Text style={styles.textStyle}>{info.point3}</Text>
//               </View>
//               <View style={styles.policyStyle}>
//                 <View style={styles.circle} />
//                 <Text style={styles.textStyle}>{info.point4}</Text>
//               </View>
//             </View>
//           ) : (
//             <View style={styles.textContainer}>
//               <Text style={styles.info_textStyle}>{props.info}</Text>
//               {/* <HTML baseFontStyle={styles.textStyle} html={props.info} /> */}
//             </View>
//           )}
//         </View>
//         {!props.showDelete&&
//         <TouchableOpacity
//           activeOpacity={1}
//           onPress={props.onPress}
//           style={styles.btnView}>
//           <View style={styles.btnWithIcon}>
//             <Text style={styles.okBtnStyle}>OK</Text>
//           </View>
//         </TouchableOpacity>}
//       </View>
//     </Overlay>
//   );
// };
// export default InfoModal;

// const styles = StyleSheet.create({

//     overlayStyle: {
//         backgroundColor: 'transparent',
//         borderTopRightRadius: 20,
//         borderTopLeftRadius: 20,
//         borderBottomRightRadius: 22,
//         borderBottomLeftRadius: 22,
//         justifyContent:'center',
//         alignItems:'center',
//         minWidth:wp(80),

//     },

//     modalStyling: {
//         backgroundColor: White,
//         borderTopRightRadius: 20,
//         borderTopLeftRadius: 20,
//         borderBottomRightRadius: 22,
//         borderBottomLeftRadius: 22,
//         justifyContent:'center',
//         alignItems:'center'
//         // marginHorizontal: 25,
//     },

//   contentStyling: {
//     marginTop: -imgMarginBottom + -8,
//     paddingVertical: topMargin,
//   },
//   iconStyle: {
//     color: black,
//     // color: White,
//     fontSize: 30,
//     alignSelf: 'flex-end',
//   },
//   textStyle: {
//     color: grey,
//     fontSize: labelFont,
//     // flex: 1,
//   },
//   info_textStyle:{
//     color: black,
//     fontSize: labelFont,
//     textAlign:'center',
//   },

//     imgStyle: {
//         width: 100,
//         height: 100
//     },
//     headerText: {
//         color: White,
//         fontSize: labelFont,
//         fontWeight: '600'
//     },
//     policyStyle: {
//         flexDirection: 'row',
//         marginBottom: 5
//         // alignItems: 'center',
//     },
//     circle: {
//         height: 8,
//         width: 8,
//         borderRadius: 8 / 2,
//         backgroundColor: grey,
//         marginRight: 10,
//         alignSelf: 'flex-start',
//         marginTop: 7,
//     },
//     btnView: {
//         // paddingVertical: 3,
//         backgroundColor: darkSky,
//         backgroundColor: darkSky,
//         borderBottomEndRadius: 20,
//         borderBottomLeftRadius: 20,
//         marginBottom:-1,
//         minWidth:wp(73)
//     },
//     btnWithIcon: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: Platform.OS == 'android' ? 10 : 13,
//         // paddingVertical: 10,
//     },
//     okBtnStyle: {
//         fontSize: mediumText,
//         marginLeft: 5,
//         fontWeight: '600',
//         color: White
//     },
//     imgContainer: {
//         width: imgWidth,
//         height: imgHeight,
//         borderRadius: imgHeight / 2,
//         alignItems: 'center',
//         alignSelf: 'center',
//         bottom: imgMarginBottom
//     },
//     imgStyle: {
//         width: imgWidth,
//         height: imgHeight
//     },
//     avatarStyle: {
//         width: null,
//         height: null,
//         flex: 1,
//     },
//     textContainer: {
//         paddingHorizontal: horizontalPadding,
//         justifyContent:'center',
//         alignItems:'center'
//     }
// })
