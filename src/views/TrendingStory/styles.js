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

    imgView: {
        height: Platform.OS == 'ios' ? 300 : 290,
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        zIndex: -1

    },
    imgStyle: {
        width: null,
        height: null,
        flex: 1,
        bottom: Platform.OS == 'ios' ? hp(-12) : hp(-10),
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
    bottomSheet: {
        flex: 1,
        height: screenHeight * 0.8,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 0},
        elevation: Platform.OS === 'ios' ? 5 : 10,
        shadowRadius: 5,
        shadowOpacity: 0.4,
      },
      imgIcon: {
        width: RFValue(36),
        height: RFValue(36),
      },



})
export default styles