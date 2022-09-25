import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {TEXT_LIGHT} from '../../constants/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import {THEME_BOLD_FONT} from '../../constants/fontFamily';

const MediumHeading = props => {
  return <Text style={styles.mainText}>{props.children}</Text>;
};

var styles = StyleSheet.create({
  mainText: {
    color: TEXT_LIGHT,
    fontSize: RFValue(26),
    fontFamily: THEME_BOLD_FONT,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: RFValue(20),
    marginBottom: RFValue(10),
  },
});

export default MediumHeading;
