import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Platform, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'
import { grey, TEXT_INPUT_LABEL, DANGER, darkSky, placeholderColor, black } from "../../constants/colors";
import { textInputFont } from "../../constants/fontSize";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";

const TextField = (props) => {
    
    return (
        <View style={props.error ?
            [styles.outerView, props.containerStyle, { borderBottomColor: DANGER }] :
            [styles.outerView, props.containerStyle]
        }>
            <View style={styles.contentView}>
                <Text
                    style={
                        props.error ?
                            [styles.label, { color: DANGER }]
                            : [{...styles.label,color:props?.labelColor??grey}]}>
                    {props.label}
                </Text>

                {props.policy &&
                    <TouchableOpacity
                        onPress={props.showPolicy}
                    >
                        <View style={styles.contentView}>
                            <Text style={styles.policyStyle}> (</Text>
                              <Icon
                                name={'info-with-circle'}
                                type={'Entypo'}
                                style={styles.InfoiconStyle}
                              />
                            {/* <Text style={styles.policyStyle}>Policy</Text> */}
                            <Text style={styles.policyStyle}>)</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
            <View style={styles.container}>
                <TextInput
                    placeholder={props.placeholder}
                    placeholderTextColor={placeholderColor}
                    value={props.value}
                    onChangeText={props.onChangeText}
                    secureTextEntry={props.secureTextEntry}
                    editable={props.editable}
                    multiline={props.multiline}
                    maxLength={props.maxLength}
                    keyboardType={props.keyboardType}
                    returnKeyType={props.returnKeyType}
                    ref={props.ref}
                    onSubmitEditing={props.onSubmitEditing}
                    blurOnSubmit={false}
                    style={[styles.inputField,{textAlignVertical: 'top'},props.emailStyle]}
                    numberOfLines={props.numberOfLines}
                   
                    
                />
                <Icon
                    onPress={props.onIconPress}
                    name={props.iconName}
                    type={props.iconType}
                    style={[styles.iconStyle, props.style]}
                />
            </View>
        </View>
    )
}
export default TextField;

const styles = StyleSheet.create({
    outerView: {
        borderBottomColor: grey,
        borderBottomWidth: 1,
        marginBottom: 10,

    },

    label: {
        color: grey,
        fontSize:textInputFont,

    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center'
    },
    inputField: {
        paddingVertical: Platform.OS == 'ios' ? 10 : 8,
        flex: 1,
        fontSize: textInputFont,
        paddingLeft:0,
        color:black
    },
    iconStyle: {
        color: TEXT_INPUT_LABEL,
        fontSize: 22,
        textAlign:'center',
        width:wp(10)
    },
    InfoiconStyle:{
       color:darkSky,
       fontSize:15,
       textAlign:'center',
       marginTop:2,
    //    marginLeft:10,
    },
    contentView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    policyStyle: {
        color: darkSky,
        fontSize: textInputFont
    }
})