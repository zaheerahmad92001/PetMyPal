import React from 'react';
import {View,StyleSheet} from 'react-native';


export default function LoaderWrapper(props){
    if (React.isValidElement(props.children)) {
        return(
            <View style={StyleSheet.flatten([styles.loaderWrapper,props.style])}>
                {props.children}  
            </View>
        )
      }
      return null;
   

}
const styles = StyleSheet.create({
    loaderWrapper:{
        position:'absolute',
        top:30,width:'100%',
        alignItems:'center'
    }

})
