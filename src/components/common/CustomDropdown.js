import React from 'react'
import { Platform } from 'react-native';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native'
import { grey, TEXT_INPUT_LABEL, darkSky, White, DANGER, black } from '../../constants/colors';
import { mediumText, textInputFont } from '../../constants/fontSize';
import { Icon } from 'native-base'
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { THEME_FONT } from '../../constants/fontFamily';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

let _height = 0

const CustomDropDown = (props) => {
    const { data , is_BreedSelected } = props
    return (
        <View>
            <View style={props.error ?
                [styles.outerView, props.containerStyle, { borderBottomColor: DANGER }] :
                [styles.outerView, props.containerStyle]
            }
                onLayout={(event) => {
                    _height = event.nativeEvent.layout.height;
                }}>
                <View style={styles.contentView}>
                    <Text
                        style={
                            props.error ?
                                [styles.label, { color: DANGER }]
                                : [styles.label]}>
                        {props.label}
                    </Text>
                </View>

                <View style={styles.container}>
                    <TextInput
                        placeholder={'Bread'}
                        // placeholder={props.placeholder}
                        placeholderTextColor={grey}
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
                        style={[styles.inputField]}
                    />
                    <TouchableOpacity style={styles.iconWraper}>
                        <Icon
                            onPress={props.onIconPress}
                            name={props.iconName}
                            type={props.iconType}
                            style={[styles.iconStyle, props.style]}
                        />
                    </TouchableOpacity>
                </View>

            </View>

     {!is_BreedSelected &&
            <View style={[styles.itemContainer]} >
                <View style={styles.dataContainer} >
                    <FlatList
                        data={data}
                        keyExtractor={(item) => { item }}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                  onPress={()=>props.onItemClick(item)}
                                >
                                 <Text style={styles.itemStyle} >{item}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </View>
   }


        </View>
    )
}
export default CustomDropDown;
const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    outerView: {
        borderBottomColor: grey,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 10,
        // maxHeight:totalSize(40)

    },

    label: {
        color: grey,
        fontSize: 15,

    },
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputField: {
        paddingVertical: Platform.OS == 'ios' ? 10 : 8,
        flex: 1,
        fontSize: textInputFont
    },
    iconWraper: {
        width: 30,
        height: 20,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    iconStyle: {
        color: TEXT_INPUT_LABEL,
        fontSize: 11,
        // backgroundColor:'red',
        width:wp(10),
        paddingVertical:10,
        textAlign:'center'
    },
    contentView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemContainer: {
        position: 'absolute',
        backgroundColor:White,
        shadowColor:'#000',
        shadowRadius:2,
        shadowOffset:{height:0 , width:0},
        shadowOpacity:0.4,
        elevation:10,
        paddingVertical:20,
        top: Platform.OS == 'ios' ? height(7) : height(9.5),
        width: width(91),
        zIndex: 1

    },
    dataContainer: {
        maxHeight: totalSize(20),
        // backgroundColor:'red',
        paddingHorizontal:10,
    },
    itemStyle:{
        color:black,
        fontFamily:THEME_FONT,
        fontSize:mediumText,
        fontWeight:'600',
        marginBottom:10,
    }
})
