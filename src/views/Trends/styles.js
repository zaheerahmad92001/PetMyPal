import React from "react";
import { Platform ,Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { black, darkSky, PINK, TEXT_INPUT_LABEL } from "../../constants/colors";
import { labelFont } from "../../constants/fontSize";
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');


const styles = StyleSheet.create({
    content: {
        height: hp(100)
    },

    trendsView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    iconStyle: {
        color: TEXT_INPUT_LABEL,
        fontSize: 25,
    },
    trends: {
        color: PINK,
        fontSize: labelFont,
        fontWeight: 'bold',
    },
    smallText: {
        color: TEXT_INPUT_LABEL,
        fontWeight: '400',
        fontSize: 12,
        marginTop:5,
    },
    dividerStyle: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 10,
        marginBottom: 10,
    },

    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noTrend:{
        color:TEXT_INPUT_LABEL,
        fontSize:labelFont
    },



})
export default styles