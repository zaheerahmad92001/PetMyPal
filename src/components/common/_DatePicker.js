
import { Icon } from 'native-base';
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import { darkSky, White } from '../../constants/colors';
import { labelFont, mediumText, textInputFont } from '../../constants/fontSize';
import { Overlay } from 'react-native-elements';

import SkyBlueBtn from './SkyblueBtn';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const _DatePicker = (props) => {
    const { isVisible ,maxDate } = props
    // console.log('this is date picker componnt props', maxDate);
    return (
        <Overlay
            isVisible={isVisible ? isVisible : false}
            useNativeDriver={true}
            overlayStyle={styles.overlayStyle}
        >
            <View style={styles.wraper}>
                <View style={styles.header}>

                    <Text style={styles.textStyle}>{props.header}</Text>
                    <Icon
                        onPress={props.onClose}
                        name={props.iconName ? props.iconName : 'close'}
                        type={props.iconType ? props.iconType : 'Fontisto'}
                        style={styles.iconStyle}
                    />
                </View>

                <DatePicker
                    date={props?.date ?? new Date()}
                    onDateChange={props.onDateChange}
                    mode="date"
                    style={{ position: 'relative', marginVertical: 20 }}
                    minimumDate={props?.minimumDate ? new Date(props.minimumDate) : null}
                    maximumDate={maxDate ? maxDate  : maxDate}
                />

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={props.onSelect}
                    style={styles.btnView}>
                    <Text style={styles.okBtnStyle}>OK</Text>
                </TouchableOpacity>

            </View>

        </Overlay>
    )
}
export default _DatePicker;
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
    },

    wraper: {
        backgroundColor: White,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 22,
        borderBottomLeftRadius: 22,
        // marginHorizontal:25,
    },
    header: {
        backgroundColor: darkSky,
        height: RFValue(40),
        width: 'auto',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    textStyle: {
        color: White,
        fontSize: labelFont,
        marginLeft: 10,
        // fontWeight: 'bold'
    },
    titleStyle: {
        fontSize: 15,
        color: White
    },
    iconStyle: {
        marginRight: 10,
        color: White,
        fontSize: 20,
        marginTop: 0
    },
    btnView: {
        // paddingVertical: 10,
        paddingVertical: Platform.OS == 'android' ? 10 : 13,
        backgroundColor: darkSky,
        borderBottomEndRadius: 20,
        borderBottomLeftRadius: 20,
    },
    okBtnStyle: {
        fontSize: mediumText,
        marginLeft: 5,
        fontWeight: '600',
        color: White,
        textAlign: 'center',
    },

})