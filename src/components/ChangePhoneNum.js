import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { black, DANGER, darkSky, grey, HEADER, PINK, PLACE_HOLDER, TEXT_INPUT_LABEL, White } from '../constants/colors';
import { Icon, Item } from 'native-base';
import SkyBlueBtn from './common/SkyblueBtn';
import { RFValue } from 'react-native-responsive-fontsize';
import { mediumText, textInputFont } from '../constants/fontSize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ContactInput from '../components/common/ContactInput';
import Modal from 'react-native-modal';
import Label from './common/Label';
import ErrorMsg from './common/ErrorMsg';
import { Capitalize } from '../utils/RandomFuncs';
import { popUpImg, blackLoader, phoneText, editPhoneText } from '../constants/ConstantValues'
import LottieView from 'lottie-react-native';
import IntlPhoneInput from 'react-native-intl-phone-input';
import { Platform } from 'react-native';
import { Overlay } from 'react-native-elements';






const imgMarginBottom = 45
const imgHeight = 90
const imgWidth = 90
const topMargin = 15
const horizontalPadding = 25


const ChangePhoneNumber = (props) => {
    const { 
         visible, cca2,
         callingCode,
         contact, 
         error, 
         sending,
         exist,
         
         } = props
    return (
        <Overlay
            isVisible={visible? visible:false}
            onBackdropPress={props.toggleOverlay}
            useNativeDriver={true}
            animationIn={props.animationIn}
            animationOut={props.animationOut}
            animationOutTiming={props.animationOutTiming}
            overlayStyle={styles.overlayStyle}
            // style={{marginBottom:0}}
            >

      <View style={styles.modalStyling}>
            <View style={styles.imgContainer}>
                <View style={styles.imgStyle}>
                    <Image
                        source={popUpImg}
                        style={styles.avatarStyle}
                    />
                </View>
            </View>


            <View style={styles.container}>
                <Label
                    style={error ? [styles.labelWithError] : [styles.label]}
                    text='Phone Number' />

                {/* <ContactInput
                    cca2={cca2}
                    callingCode={callingCode}
                    onChangeText={props.changeContact}
                    marginLeft={{ marginLeft: wp(-3) }}
                    placeholderTextColor={PLACE_HOLDER}
                    contact={contact}
                    placeholder={'Phone number'}
                    select={props.changeCountry}
                    error={error}
                /> */}
                <IntlPhoneInput 
                   defaultCountry={cca2}
                   flagStyle={{fontSize:15}}
                   phoneInputStyle={{color:black}}
                   onChangeText={props.changeContact}
                   setDefaultValue={props.setDefaultValue}
                   defaultVlaue={props.defaultVlaue}
                   containerStyle={styles.intlPhoneInputStyle}
                   placeholder={props.defaultVlaue}
                 
                   />

                 {!error && !exist &&
                   <Label
                    text={editPhoneText}
                     style={{ ...styles.bdyText }}
                    />}

                {error &&
                    <ErrorMsg
                        errorMsg={'Please Check Your Phone Number'}
                        style={styles.errorText}
                    />
                }
                {exist &&
                <ErrorMsg
                  errorMsg={'Phone Number Already Exist'}
                  style={styles.errorText}
                />
                }
                 
            </View>

            
            <View style={styles.btnWraper}>
                    {sending ?
                        <View style={styles.loaderStyle}>
                            <LottieView
                                style={{ height: 40 }}
                                autoPlay
                                source={blackLoader}
                            />
                        </View> :
                        <TouchableOpacity
                           activeOpacity={1}
                           onPress={props.registerPhoneNumber}
                            style={styles.OkbtnView}
                        >
                            <View style={styles.btnWithIcon}>
                                <Text style={styles.okBtnStyle}>{'Update'}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={props.toggleOverlay}
                        style={styles.CancelbtnView}
                    >
                        <View style={styles.btnWithIcon}>
                            <Text style={styles.okBtnStyle}>{'Cancel'}</Text>
                        </View>
                    </TouchableOpacity>
            </View>


           </View>
        </Overlay>
    )
}
export default ChangePhoneNumber

const styles = StyleSheet.create({
    
    overlayStyle: {
        backgroundColor: 'transparent',
        borderTopRightRadius: 22,
        borderTopLeftRadius: 22,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        width:wp(80),
        // marginLeft: 25, 
        // marginRight: 25,
        paddingLeft: 0,
        paddingBottom: 0,
        paddingTop: 0,
        paddingRight: 0
    },

    modalStyling: {
        backgroundColor: White,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 22,
        borderBottomLeftRadius: 22,
        // marginHorizontal: 25,
    },

    
    changePh: {
        color: White,
        fontSize: textInputFont,
        marginLeft: 10,
        fontWeight: 'bold'
    },
    iconStyle: {
        marginRight: 10,
        color: White,
        fontSize: 20,
    },
    container: {
        paddingHorizontal: 20,
        marginTop: -imgMarginBottom,
    },
    btnContainerStyle: {
        marginTop: 10,
        alignSelf: 'center'
    },
    label: {
        marginTop:7,
    },
    labelWithError: {
        marginTop:7,
        color: DANGER
    },
    errorText: {
        marginTop: 10,
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
    btnView: {
        paddingVertical: 15,
        backgroundColor: darkSky,
        borderBottomEndRadius: 20,
        borderBottomLeftRadius: 20,
        marginTop:20,
    },
    
    btnWraper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width:'100%',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        marginTop:10,
    },
    loaderStyle: {
        width: wp(35),
        alignItems: 'center',
        zIndex: 1
    },
    OkbtnView:{
        width:'50%',
        // paddingTop: 3,
        // paddingBottom: 3,
        borderBottomLeftRadius:20,
        backgroundColor: darkSky
    },
    btnWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical:Platform.OS=='android'? 10 :13,
    },
    okBtnStyle: {
        fontSize: mediumText,
        fontWeight: '600',
        color: White
    },
    CancelbtnView: {
        width:'50%',
        borderBottomEndRadius: 20,
        backgroundColor:PINK
    },
    intlPhoneInputStyle:{
        paddingLeft:2,
        paddingVertical:0,
        borderBottomColor:grey,
        borderBottomWidth:StyleSheet.hairlineWidth,
        paddingBottom:Platform.OS=='ios'?10:null,
        marginTop:Platform.OS==='android'? 0:10,
    },
    bdyText: {
        marginTop: 2,
        fontSize: 12,
        color: darkSky,
        marginBottom: 20,
      },
})