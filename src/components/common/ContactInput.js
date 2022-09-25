import React, {Component, useState} from 'react';
import {StyleSheet, TextInput, Platform, Text, Dimensions} from 'react-native';
import {COLOR_BRAND, COLOR_DANGER, BLACK, grey, DANGER} from '../../constants/colors';
import {THEME_FONT} from '../../constants/fontFamily';
import {RFValue} from 'react-native-responsive-fontsize';
import {View, Icon} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CountryPicker, {
  getAllCountries,
  getCallingCode,
  DEFAULT_THEME,
} from 'react-native-country-picker-modal';
import { textInputFont } from '../../constants/fontSize';
import TextInputMask from 'react-native-text-input-mask';
import {width, height , totalSize} from 'react-native-dimension'

const ContactInput = props => {
  const [visible, setVisible] = useState(false);
  const switchVisible = () => setVisible(!visible);

  return (
    <View
      style={
        props.error ? [styles.upperView, props.marginLeft,{borderBottomColor:DANGER}] 
        : [styles.upperView, props.marginLeft]
      }>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent:'center',
          alignItems: 'center',
          // width:width(20),
          // backgroundColor:'red', 
          
        }}
        onPress={() => switchVisible()}>
        <CountryPicker
          visible={false}
          countryCode={props.cca2}
          translation={'common'}
          withCallingCode={true}
          withAlphaFilter
          withFilter
          // theme={{flagSizeButton: RFValue(25)}}
          theme={{flagSizeButton:Platform.OS==='ios' ? 20:15}}
          onSelect={props.select}
          containerButtonStyle={{
            padding: 0,
            // marginTop:Platform.OS==='ios'? -5: -10,
            fontSize:textInputFont,
            // backgroundColor:'red'
          }}
          {...{
            modalProps: {
              visible,
            },
            onClose: () => setVisible(false),
            // onOpen: () => setVisible(true),
          }}
        />

      <Text 
           style={{
             fontSize:textInputFont, 
             alignItems: 'center',
              textAlign: 'center',
              top:Platform.OS==='ios' ?2:0 
              }}>
          +{props.callingCode}
      </Text>
      
      </TouchableOpacity>
      <View style={styles.inputStyle}>
        <TextInputMask
          style={[
            {
              //color: BLACK,
              fontSize:textInputFont,
              padding: 0,
              // backgroundColor:'red',
              fontFamily: THEME_FONT,
            
            },
          ]}
          selection={props.selection}
          placeholder={props.placeholder}
          placeholderTextColor={'#979797'}
          value={props.contact}
          maxLength={21}
          onFocus={props.onFocus}
          autoCapitalize={props.autoCapitalize}
          editable={props.editable}
          onChangeText={props.onChangeText}
          keyboardType={'number-pad'}
          secureTextEntry={props.secureTextEntry}
          disabled={props.disabled ? true : false}
          mask={"([000]) [000]-[000]-[000]-[000]"}
        />
      </View>
    </View>
  );
};
export default ContactInput;
const styles = StyleSheet.create({
  iconStyle: {
    fontSize: RFValue(18),
    color: COLOR_DANGER,
  },
  inputStyle: {
    //backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 10,
    justifyContent: 'center',
    flex: 1,
    //marginVertical:5
  },
  upperView: {
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:grey,
    paddingHorizontal: 10,
    borderRadius: RFValue(10),
    paddingVertical: Platform.OS === 'ios' ? 15 : 5,
    height: 49,
  },
});
