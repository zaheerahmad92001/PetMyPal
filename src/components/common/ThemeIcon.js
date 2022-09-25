import React from 'react';
import {View, StyleSheet, Image, StatusBar} from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Header,
  Icon,
} from 'native-base';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
import {STATUSBAR, BGCOLOR} from '../../constants/colors';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const ThemeIcon = props => {
  return (
    <View style={styles.IconBackground}>
      <Icon name={props.icon} onPress={props.onPress} />
    </View>
  );
};

export default ThemeIcon;

const styles = StyleSheet.create({
  IconBackground: {
    fontSize: RFValue(20),
    fontFamily: THEME_BOLD_FONT,
    borderRadius: 14,
    backgroundColor: BLACK,
    height: 50,
    width: 50,
  },
});
