import { Icon } from 'native-base';
import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Image } from 'react-native'
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { black, DANGER, darkSky, grey, HEADER, White } from '../../constants/colors';
import { labelFont, largeText, mediumText } from '../../constants/fontSize';
import { popUpImg ,Artboard } from '../../constants/ConstantValues'
import { TouchableWithoutFeedback } from 'react-native';
import { Platform } from 'react-native';
import { Overlay } from 'react-native-elements';


const imgMarginBottom = 45
const imgHeight = 90
const imgWidth = 90
const topMargin = 15
const horizontalPadding = 25

const ErrorModal = (props) => {
    const {isVisible ,postReport } = props
    return (
        <Overlay
            isVisible={isVisible ? isVisible: false}
            useNativeDriver={true}
            animationIn={props.animationIn}
            animationInTiming={props.animationInTiming}
            animationOut={props.animationOut}
            overlayStyle={styles.overlayStyle}
            // style={{marginBottom:0}}
        >
            <View style={styles.modalStyling}>

                <View style={styles.imgContainer}>
                    <View style={styles.imgStyle}>
                        <Image
                            source={postReport? Artboard: popUpImg}
                            style={styles.avatarStyle}
                        />
                    </View>
                </View>

                <View style={{ marginTop: -imgMarginBottom, }}>
                    <View style={styles.contentStyling}>
                        {props.heading ?
                        <Text style={styles.headingStyle}>{props.heading}</Text> : null
                        }
                        <Text style={props.heading?[styles.textStyleTwo]:[styles.textStyle]}>{props.info}</Text>
                    </View>


                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={props.onBackButtonPress}
                        style={styles.btnView}
                    >
                        <View style={styles.btnWithIcon}>
                            <Text style={styles.okBtnStyle}>OK</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>

        </Overlay>
    )
}
export default ErrorModal;

const styles = StyleSheet.create({

    overlayStyle: {
        backgroundColor: 'transparent',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 22,
        borderBottomLeftRadius: 22,
        // marginLeft: 25, 
        // marginRight: 25,
        width:wp(80),
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

    imgContainer: {
        width: imgWidth,
        height: imgHeight,
        borderRadius: imgHeight / 2,
        alignItems: 'center',
        alignSelf: 'center',
        bottom: imgMarginBottom
    },

    contentStyling: {
        paddingHorizontal:horizontalPadding,
        marginTop:topMargin/2,
        marginBottom:topMargin,
        justifyContent: 'center',
        alignItems: 'center',
        },

    textStyle: {
        color: black,
        fontSize: labelFont,
        // marginTop:10,
    },
    textStyleTwo:{
        color: black,
        fontSize: labelFont,
        marginTop:5, 
        textAlign:'center'
    },
    imgStyle: {
        width: imgWidth,
        height: imgHeight
    },

    btnView: {
        // paddingVertical: 3,
        backgroundColor: darkSky,
        borderBottomEndRadius: 20,
        borderBottomLeftRadius: 20,
    },
    btnWithIcon: {
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical:Platform.OS=='android'? 10 :13,
    },
    okBtnStyle: {
        fontSize: mediumText,
        marginLeft: 5,
        fontWeight: '600',
        color: White
    },
    avatarStyle: {
        width: null,
        height: null,
        flex: 1,
    },
    headingStyle: {
        color: black,
        fontSize: labelFont,
        fontWeight: 'bold',
    }
})
