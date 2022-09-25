import React from 'react'
import { TouchableOpacity, } from 'react-native';
import { View, Text, StyleSheet, Image } from 'react-native'
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { black, darkSky, PINK, White } from '../../constants/colors';
import { labelFont, mediumText } from '../../constants/fontSize';
import { popUpImg } from '../../constants/ConstantValues'
import { Platform } from 'react-native';
import CustomLoader from './CustomLoader';


const imgMarginBottom = 45
const imgHeight = 90
const imgWidth = 90
const topMargin = 15
const horizontalPadding = 25


const ConfirmModal = (props) => {
    return (
        <Modal
            isVisible={props.isVisible}
            useNativeDriver={true}
            style={styles.modalStyling, { marginBottom: 0 }}
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

                <View style={{ marginTop: -imgMarginBottom, }}>
                    <View style={styles.contentStyling}>
                        <Text style={styles.textStyle}>{props.info}</Text>
                    </View>

                    <View style={styles.btnWraper}>
                        {props.processing ?
                            <View style={styles.loaderStyle}>
                                <CustomLoader />
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
                </View>
            </View>

        </Modal>
    )
}
export default ConfirmModal;

const styles = StyleSheet.create({
    modalStyling: {
        backgroundColor: White,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginHorizontal: 25,
    },

    header: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingTop: 20,
        paddingBottom: 10,
    },
    contentStyling: {
        paddingVertical: topMargin,
        paddingHorizontal: horizontalPadding,
        // justifyContent:'center',
        // alignContent:'center'

    },

    textStyle: {
        color: black,
        fontSize: labelFont,
        textAlign: 'center',
    },
    imgStyle: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    errorText: {
        color: White,
        fontSize: 20,
        // fontWeight:'bold'
    },
    CancelbtnView: {
        width: '50%',
        borderBottomEndRadius: 20,
        backgroundColor: PINK,
        marginTop: 3
    },
    OkbtnView: {
        width: '50%',
        borderBottomLeftRadius: 20,
        backgroundColor: darkSky,
        marginTop: 3,
    },
    btnWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // paddingVertical: 10,
        paddingVertical: Platform.OS == 'android' ? 10 : 13,
    },
    okBtnStyle: {
        fontSize: mediumText,
        fontWeight: '600',
        color: White
    },
    btnWraper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        // marginHorizontal: 25,

        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    iconsStyle: {
        color: White,
        fontSize: 18,
    },
    loaderStyle: {
        width: wp(35),
        alignItems: 'center',
        zIndex: 1
    },
    nameStyle: {
        color: black,
        fontSize: labelFont,
        marginTop: 5,
        marginBottom: 10,
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
    }

})
