import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import { black, DANGER, grey, placeholderColor, TEXT_INPUT_LABEL } from '../../constants/colors'
import { labelFont, textInputFont } from '../../constants/fontSize'
import Moment from 'moment';
import Label from './Label'
import { RFValue } from 'react-native-responsive-fontsize'

const DatePickerField = (props) => {
    const { errorDOB, onPress, dob, openModal , label , defaultValue } = props
    // {dob === '' ? Moment(user.birthday).format('MM/DD/YYYY') : Moment(this.state.newdate).format('MM/DD/YYYY')}
    let DOB  = Moment(dob).format('MM/DD/YYYY') 

    return (
        <View>
            <Label text={label}
                style={errorDOB ? [styles.errorLabel] : [styles.labelStyle]}
            />
            <View style={
                errorDOB ?
                    [styles.dateView, { borderBottomColor: DANGER }] :
                    StyleSheet.flatten([styles.dateView,props.dobStyle])
            }>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={onPress}
                >
                    <Text style={
                        dob ?
                            [styles.dateStyle] :
                            [styles.placeholderStyle]
                    }>{dob ? DOB :defaultValue}</Text>
                </TouchableOpacity>
                {openModal &&
                <Icon
                    onPress={openModal}
                    name={'questioncircle'}
                    type={'AntDesign'}
                    style={styles.iconColor}
                />
              }
            </View>
        </View>
    )
}
export default DatePickerField

const styles = StyleSheet.create({
    dateView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: grey

    },
    placeholderStyle: {
        color: grey,
        fontSize: textInputFont,
    },
    errorLabel: {
        color: DANGER,
        fontSize:textInputFont,
      },
      labelStyle:{
        color:grey,
        fontSize:textInputFont,
    },
    dateStyle: {
        color: black,
        fontSize: textInputFont,
    },
    iconColor: {
        fontSize: 20,
        color: TEXT_INPUT_LABEL
    },
})