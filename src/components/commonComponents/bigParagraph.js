import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {TEXT_LIGHT} from '../../constants/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import {THEME_BOLD_FONT} from '../../constants/fontFamily';

const BigParagraph = props => {
  return <Text style={styles.subText}>{props.children}</Text>;
};

var styles = StyleSheet.create({
  subText: {
    fontSize: RFValue(16),
    fontFamily: THEME_BOLD_FONT,
    textAlign: 'center',
    paddingHorizontal: RFValue(15),
    fontWeight: '600',
  },
});

export default BigParagraph;
