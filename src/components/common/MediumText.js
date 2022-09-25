import React ,{Component}from 'react'
import{View , Text , TouchableOpacity , StyleSheet ,}from 'react-native'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { black } from '../../constants/colors';

const MediumText=(props)=>{
 return(
     <Text style={[styles.textStyle,props.style]}>{props.text}</Text>
 )
}
export default MediumText
const styles = StyleSheet.create({
    textStyle:{
        color:black,
        fontSize:18,
        fontWeight:'bold'
    }
})