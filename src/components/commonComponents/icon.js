import React from 'react';
import {Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default ({name, platform, size, ...props}) => {
  return platform ? (
    <Icon name={name} size={size} {...props} />
  ) : (
    <Icon
      name={Platform.OS === 'ios' ? `ios-${name}` : `md-${name}`}
      {...props}
    />
  );
};
