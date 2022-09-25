import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, TextInput, Image} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
const InputIcon = props => {
  return (
    <View style={styles.containerStyle}>
      <View style={{flex: 1, marginRight: 10}}>
        <TextInput
          style={styles.inputStyle}
          placeholder={props.placeholder}
          placeholderTextColor={'#979797'}
          value={props.value}
          onChangeText={props.onChangeText}
        />
      </View>
      <Image style={styles.imageStyle} source={props.imagesource} />
    </View>
  );
};
export default InputIcon;

const styles = StyleSheet.create({
  inputStyle: {
    color: '#222326',
    fontSize: RFValue(14),
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: screenHeight * 0.08,
    width: screenWidth * 0.8,
  },
  labelStyle: {
    fontSize: RFValue(16),
  },
  containerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 10,
    height: screenHeight * 0.08,
    width: screenWidth * 0.8,
  },

  IconView: {
    width: screenWidth * 0.18,
    height: screenHeight * 0.09,
    borderRadius: 10,
    backgroundColor: '#222326',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});
