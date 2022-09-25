import React , {Component}from 'react'
import {Text , StyleSheet}from 'react-native';
import { DANGER } from '../../constants/colors';
import { errorFont } from '../../constants/fontSize';

const ErrorMsg =(props)=>{
    return(
        <Text style={[styles.textStyle,props.style]} >{props.errorMsg}</Text>
    )
}
export default ErrorMsg
const styles = StyleSheet.create({
    textStyle:{
        color:DANGER,
        fontSize:errorFont
    }
})