import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown'
import { RFValue } from 'react-native-responsive-fontsize'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { black, DANGER, grey, placeholderColor, PLACE_HOLDER, selectedItemColor, TEXT_INPUT_LABEL, White } from '../../constants/colors'
import { textInputFont } from '../../constants/fontSize'


const _DropDown = (props) => {
    const {
        placeholder,
        renderAccessory,
        error,
    } = props
    return (
        <Dropdown
            dropdownOffset={{ top: 0 }}
            // labelFontSize={12}
            // fontSize={50}
            pickerStyle={props.pickerStyle}
            baseColor={TEXT_INPUT_LABEL}
            textColor={placeholder? placeholderColor :black}
            itemColor={grey}
            selectedItemColor={placeholder?placeholderColor:selectedItemColor}
            renderAccessory={renderAccessory}
            containerStyle={error ?
                [styles.d_containerErrorStyle,props.style] : 
                [styles.d_containerStyle,props.style]}
            inputContainerStyle={{ borderBottomWidth:0,marginBottom:-4 }}
            itemTextStyle={props.itemTextStyle}
            label=''
            style={StyleSheet.flatten([props.style,{fontSize:textInputFont,marginLeft:3,}]) }
            data={props.data}
            value={props.selectedValue ? props.selectedValue : props.staticValue}
            onChangeText={props.onChangeText}
            dropdownPosition={props.dropdownPosition}
            dropdownWidth={props.dropdownWidth}
            dropdownMargins={{min:props?.margin??5}}
            // pickerStyle={{borderBottomWidth:0}}
           
          />
    )

}
export default _DropDown;

const styles = StyleSheet.create({
    d_containerStyle: {
       // backgroundColor:'transparent',
        // height:33,
        paddingVertical:0,
        marginTop:0,
        paddingLeft: 0,
        borderRadius: 5,
        // borderBottomColor: grey,
        borderBottomWidth:0,
        justifyContent:'center',

    },
    d_containerErrorStyle: {
        backgroundColor:'transparent',
        paddingVertical:0,
        marginTop: 0,
        paddingLeft: 0,
        borderRadius: 5,
        // borderBottomColor:DANGER ,
        borderBottomWidth:0
    },
})