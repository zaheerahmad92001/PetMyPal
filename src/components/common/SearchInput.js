import React from 'react';
import {StyleSheet} from 'react-native';
import {Container, Header, Item, Input, Button, Text} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
const Search_Input = props => (
  <Item regular style={styles.Input}>
    <Input
      placeholder={props.placeholder}
      placeholderTextColor={props.placeholderTextColor}
      value={props.value}
      onChangeText={props.onChangeText}
      autoCapitalize={props.autoCapitalize}
      secureTextEntry={props.secureTextEntry}
      keyboardType={props.keyboardType}
    />
    <Ionicons name={props.icon} size={22} onPress={props.onPress} />
  </Item>
);
export default Search_Input;

const styles = StyleSheet.create({
  Input: {
    paddingHorizontal: RFValue(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0000001A',
    borderRadius: 10,
    height: 42,
    width: '90%',
  },
});
