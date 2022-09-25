import React, {Component} from 'react';
import {StyleSheet, TextInput, Platform} from 'react-native';
import {COLOR_BRAND, COLOR_DANGER, BLACK} from '../../constants/colors';
import {THEME_FONT} from '../../constants/fontFamily';
import {RFValue} from 'react-native-responsive-fontsize';
import {TextInputMask} from 'react-native-masked-text';
import {View, Icon} from 'native-base';

const Text_Input = props => {
  return (
    <View style={styles.upperView}>
      {props.maskType === 'contact' ? (
        <TextInputMask
          style={styles.inputStyle}
          type={'cel-phone'}
          options={{
            maskType: 'INTERNATIONAL',
            withDDD: true,
            dddMask: '(92)',
          }}
          value={props.value}
          placeholder={props.placeholder}
          placeholderTextColor={'#979797'}
          keyboardType={props.keyboardType}
          onChangeText={props.onChangeText}
          keyboardType={props.keyboardType}
        />
      ) : props.maskType === 'time' ? (
        <TextInputMask
          ref={ref => (props.ref = ref)}
          type={'datetime'}
          options={{
            format: 'HH:mm',
          }}
          placeholder={props.placeholder}
          placeholderTextColor={'#979797'}
          keyboardType={props.keyboardType}
          onChangeText={props.onChangeText}
          value={props.value}
        />
      ) : (
        <TextInput
          style={[styles.inputStyle, props.style]}
          selection={props.selection}
          placeholder={props.placeholder}
          placeholderTextColor={'#979797'}
          value={props.value}
          onFocus={props.onFocus}
          autoCapitalize={props.autoCapitalize}
          editable={props.editable}
          keyboardType={props.keyboardType}
          onChangeText={props.onChangeText}
          keyboardType={props.keyboardType}
          secureTextEntry={props.secureTextEntry}
        />
      )}
      {props.error ? (
        <Icon name="error" type="MaterialIcons" style={styles.iconStyle} />
      ) : null}
    </View>
  );
};
export default Text_Input;
const styles = StyleSheet.create({
  iconStyle: {
    fontSize: RFValue(18),
    color: COLOR_DANGER,
  },
  inputStyle: {
    color: BLACK,
    fontSize: RFValue(14),
    backgroundColor: '#FFFFFF',
    fontFamily: THEME_FONT,
    flex: 1,
  },
  upperView: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: Platform.OS === 'ios' ? 15 : 5,
  },
});
