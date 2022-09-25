import React from "react";
import { Platform } from "react-native";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { black, darkSky, grey, lightSky, PINK, TEXT_DARK, TEXT_INPUT_LABEL, White } from "../../constants/colors";
import { THEME_BOLD_FONT, THEME_FONT } from "../../constants/fontFamily";
import { labelFont, mediumText, textInputFont } from "../../constants/fontSize";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({

    imgView: {
        height: Platform.OS == 'ios' ? 200 : 200,
        width: '100%',
        // backgroundColor:'red'
    },
    imgStyle: {
        width: null,
        height: null,
        flex: 1,
    },
    contentView: {
        marginHorizontal: 20,
        marginTop: Platform.OS == 'android' ? -5 : 0
        // backgroundColor:'red'
    },
    textStyle: {
        color: TEXT_DARK,
        fontFamily: THEME_FONT,
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 22,
        textAlign:'center'
    },
    uploadImg: {
        color: TEXT_INPUT_LABEL,
        fontFamily: THEME_BOLD_FONT,
        fontSize: 15,
        marginTop: 20,
    },
    breedImgView: {
        // height:220,
        height: Platform.OS == 'android' ? 180 : 200,
        width: '100%',
        backgroundColor: 'rgb(240,241,244)',
        overflow: 'hidden',
        marginTop: 15,
        borderRadius: 10,
        // justifyContent:'center',
        // alignItems:'center'
    },

    emp_breedImgView: {
        height: Platform.OS == 'android' ? 180 : 200,
        width: '100%',
        backgroundColor: 'rgb(240,241,244)',
        overflow: 'hidden',
        marginTop: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    btnView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginTop: 15,
    },
    camBtn: {
        flex: 4,
        paddingVertical: 10,
        borderWidth: 2,
        marginRight: RFValue(10),
        borderColor: '#00000021',
        borderRadius: RFValue(15),
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconStyle: {
        alignSelf: 'center',
        color: TEXT_DARK,
        fontSize: 25,
    },
    btnText: {
        fontSize: 12,
        alignSelf: 'center',
        color: TEXT_DARK,
    },
    retryBtn: {
        width: wp(40),
        backgroundColor: White,
        // paddingVertical:Platform.OS=='android'?10 :10,
        // borderWidth:2
    },
    fintBreedBtn: {
        width: wp(40),
        // paddingVertical:Platform.OS=='android'?10 :10,
    },
    titleStyle: {
        color: darkSky
    },

    resultView: {
        // backgroundColor: lightSky,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    resultContainer: {
        marginTop: 20,
    },
    results: {
        paddingVertical: 20,
        flex: 1
    },
    res_Img: {
        width: 100,
        height: 100,
        // marginTop:30,
        overflow: "hidden",
        borderRadius: 10,
        // backgroundColor:darkSky,
        // justifyContent:'center',
        // alignItems:'center',
        backgroundColor: 'rgb(240,241,244)',
        // alignSelf:'flex-start'
    },
    heading: {
        color: black,
        fontWeight: 'bold',
        fontSize: mediumText,
    },
    typeHeading: {
        color: darkSky,
        fontWeight: 'bold',
        fontSize: labelFont,
        marginTop: 15,
    },
    percentage: {
        color: PINK,
        fontWeight: 'bold',
        fontSize: textInputFont,
    },
    feedbackView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        // marginTop: 30,
    },
    textView: {
        flex: 1,
    },
    likeDislikeView: {
        width: wp(40),
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    feedbackText: {
        color: black,
        fontSize: 15,
        fontWeight: 'normal',
        lineHeight: 22,
        width:wp(60)

    },
    likeDislikeInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent:'center',
    },
    feedbackTextStyle: {
        color: TEXT_DARK,
        fontFamily: THEME_FONT,
        fontSize: 15,
        fontWeight: '500',
    },
    dislikefeedback: {
        marginHorizontal: 20,
        marginTop: 20
    },
    closeIcon: {
        color: TEXT_INPUT_LABEL,
        fontSize: 25,
        // right: 10,
        top:2
    },
    moreBreedView: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginTop:20,
        marginBottom:20,
        alignItems:'center',
        

    },
    moreBreedView_dislike:{
        flexDirection: 'row',
        marginHorizontal: 15,
        marginTop:0,
        marginBottom:20,
        alignItems:'center',
    },

    backArrow: {
        color: PINK,
        fontSize: 20,
    },
    morebreeText: {
        color: PINK,
        fontSize: mediumText,
        
    },
    instructionsView:{
      marginTop:20,  
    },
    boldText: {
        color: TEXT_DARK,
        fontFamily: THEME_FONT,
        fontSize: 20,
        fontWeight:"bold",
        marginBottom:5,
    },
    instructionTextView:{
        flexDirection:'row',
         alignItems:'center',
         marginBottom:3
    },
    countText:{
        width:'10%',
        alignSelf:'flex-start',
        color: TEXT_DARK,
        fontFamily: THEME_FONT,
        fontSize: 15,
        fontWeight: '500',
    },
    instructionText:{
        width:'90%',
        color: TEXT_DARK,
        fontFamily: THEME_FONT,
        fontSize: 15,
        fontWeight: '500',
    },
    resultsFigure:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    likeView:{
        height:38,
        width:38,
        borderRadius:38/2,
        borderColor:grey,
        borderWidth:0.7,
        justifyContent:'center',
        alignItems:'center',
    }

})
export default styles