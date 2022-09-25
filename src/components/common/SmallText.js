import React ,{Component}from 'react'
import{View , Text , TouchableOpacity , StyleSheet ,}from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { grey } from '../../constants/colors';

const SmallText=(props)=>{
 return(
     <Text style={[styles.textStyle,props.style]}>{props.text}</Text>
 )
}
export default SmallText
const styles = StyleSheet.create({
    textStyle:{
        color:grey,
        fontSize:12,
    }
})