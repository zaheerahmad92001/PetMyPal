import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

const LogoTopRight = props => {
  return <Image style={styles.logo} source={props.image} />;
};

var styles = StyleSheet.create({
  logo: {
    alignSelf: 'flex-end',
    marginTop: RFValue(10),
    marginRight: RFValue(10),
    width: 100,
    resizeMode: 'contain',
  },
});

export default LogoTopRight;
