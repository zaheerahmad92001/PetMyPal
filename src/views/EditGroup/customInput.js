import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet, Dimensions, Text, View, Platform } from 'react-native';
import { Input } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import { Divider } from 'react-native-elements';
import { useSelector } from 'react-redux';


import { DANGER, grey, TEXT_GREY, TEXT_INPUT_LABEL } from '../../constants/colors';
import _DropDown from '../../components/common/dropDown';
import { textInputFont } from '../../constants/fontSize';


const CustomInput = (props) => {

    const {
        field: { name, onBlur, onChange, value },
        form: { errors, touched, setFieldTouched, setFieldValue },
        ...inputProps
    } = props;


    const hasError = errors[name] && touched[name];
    return (
        <View style={{ width: '100%', alignItems: 'center' }}>
            <Input
                style={[hasError ? StyleSheet.flatten([styles.textInput, { borderColor: 'red' }]) : StyleSheet.flatten([styles.textInput, { height: (inputProps?.disabled || name == 'About') ? 'auto' : 38 }])]}
                value={value}
                onChangeText={(text) => {onChange(name)(text)}}
                onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                }}

                multiline
                {...inputProps}
            />
            {hasError && <Text style={[styles.errorText, { marginLeft: wp(6), marginTop: wp(2) }]}>{errors[name]}</Text>}
        </View>
    )
}

const PetCategory = (props) => {
    const reducerState = useSelector(state => state.groups);
    const {
        field: { name, onBlur, onChange, value },
        form: { errors, touched, setFieldTouched, setFieldValue },
        ...inputProps
    } = props;
    const hasError = errors[name] && touched[name];
    const [category, selectCategory] = React.useState(props?.defaultValue ?? '');
    
    const [petCategory, setpetCategory] = useState(null)



    return (
        <>
            <_DropDown
                data={reducerState?.petCategoryArray ?? []}
                selectedValue={category}
                staticValue={'Select Category'}
                placeholder={true}
                style={{ backgroundColor: 'none', width: wp(90), alignSelf: 'center', color: value ? 'black' : '#bebebe', }}
                error={hasError}
                dropdownPosition={-4.5}
                pickerStyle={{ width: wp(90), alignSelf: 'center', marginLeft: 15 }}
                onChangeText={(text) => { setFieldValue(name, text); selectCategory(text) }}
            />
            <Divider style={{ borderBottomColor: hasError ? DANGER : grey, borderBottomWidth: hasError ? 0.8 : 0.7, width: wp(89), alignSelf: 'center' }} />

            {hasError && <Text style={[styles.errorText, { marginLeft: wp(6), marginTop: wp(2) }]}>{errors[name]}</Text>}
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    textInput: {
        height: 38,
        borderColor: '#bebebe',
        borderBottomWidth: 1,
        fontSize: RFValue(14),
        width: '90%',
        fontSize:textInputFont,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: wp(2),
        marginTop: wp(Platform.OS == 'ios' ? 1 : 0),
        marginLeft: -3


    },
    errorText: {
        fontSize: 10,
        color: 'red',
        alignSelf: 'flex-start',
        marginLeft: -wp(2)

    },
    errorInput: {
        borderColor: 'red',
    },

})
export { CustomInput, PetCategory };
