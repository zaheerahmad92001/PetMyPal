import React, { Component} from 'react';
import {TouchableOpacity} from 'react-native';
import { View, Icon } from "native-base";
const TouchableIconBox = (props) => {
   return (
           <TouchableOpacity onPress={props.onPress} style={{ width: props.size, height: props.size, backgroundColor: '#222326', justifyContent: 'center', alignItems: 'center',borderRadius:props.size * 0.1, borderRadius:10 }} >
               <Icon name={props.IconName} type={props.IconType} style={{ color: 'white', fontSize: props.size*0.5 }} />
           </TouchableOpacity>
   )
}
export default TouchableIconBox;
