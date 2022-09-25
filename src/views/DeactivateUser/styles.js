import React from "react";
import { Platform ,Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { black, darkSky, grey, lightSky, PINK, TEXT_INPUT_LABEL } from "../../constants/colors";
import { labelFont, mediumText } from "../../constants/fontSize";
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');


const styles = StyleSheet.create({
    container:{
      marginHorizontal:25
    },
    textStyle:{
        color:TEXT_INPUT_LABEL,
        fontSize:labelFont,
        fontWeight:'500',
        marginTop:5,
    },
    heading:{
        color:PINK,
        fontWeight:'600',
        fontSize:mediumText,
        marginTop:10,
    },
    dateText:{
        color:black,
        fontSize:labelFont,
        fontWeight:'500',
        marginTop:10
    },
    btnView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:15,
    },
    btnStyle:{
        width:wp(41),
        marginTop:25,
    },
    passwordView:{
        marginTop:20,
    }
})
export default styles