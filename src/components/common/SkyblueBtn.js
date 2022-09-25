import React ,{Component}from 'react'
import{View , Text , TouchableOpacity , StyleSheet ,}from 'react-native'
import { darkSky, White } from '../../constants/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Platform } from 'react-native';

const SkyBlueBtn=(props)=>{
    return(
        
            <TouchableOpacity style={[styles.container,props.btnContainerStyle]}
              onPress={props.onPress}
              disabled={props.disabled}
            >
             <Text style={[styles.btnHeading,props.titleStyle]}>{props.title}</Text>
            </TouchableOpacity>
        
    )
}
export default SkyBlueBtn ;

const styles  = StyleSheet.create({
    container:{
        backgroundColor:darkSky,
        width:wp(80),
        paddingVertical:Platform.OS==='android'? 10:13,
        borderRadius:15,
        borderColor:darkSky,
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center'
    },
    
    btnHeading:{
        color:White,
        fontSize:15,
        fontWeight:'bold'
    }
})