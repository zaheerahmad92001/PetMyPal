import React ,{Component}from 'react'
import {Text , StyleSheet} from 'react-native'
import { DANGER, grey, TEXT_INPUT_LABEL } from '../../constants/colors';
import { labelFont } from '../../constants/fontSize';

const Label =(props)=>{
    const {error} = props
    return(
        <Text
         style={
        error?
            [styles.labelError,props.style]
        :
             [styles.labelStyle,props.style]
            }
        >{props.text}</Text>
    )
} 
export default Label ;

const styles = StyleSheet.create({
    labelStyle:{
        color:grey,
        fontSize:14,
    },
    labelError:{
        color:DANGER,
        fontSize:14,
    }
})