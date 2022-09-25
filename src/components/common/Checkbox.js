import React, {Component} from 'react';

import {View} from 'native-base';
import Icon from '../commonComponents/icon';
import {TEXT_LIGHT, TEXT_DARK} from '../../constants/colors';

const CheckBox = props => {
  return props.selected ? (
    <View
      style={{
        width: props.size,
        height: props.size,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: props.size * 0.1,
      }}>
      <Icon name="checkmark" color={TEXT_DARK} size={props.size} />
    </View>
  ) : (
    <View
      style={{
        width: props.size,
        height: props.size,
        backgroundColor: '#FFFFFF',
        borderRadius: props.size * 0.1,
      }}
    />
  );
};

export default CheckBox;
