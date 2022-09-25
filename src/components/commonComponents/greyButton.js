import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  TEXT_GREY,
  DISABLEDGRADIENTTOP,
  DISABLEDGRADIENTBOTTOM,
} from '../../constants/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import {THEME_BOLD_FONT} from '../../constants/fontFamily';
import LinearGradient from 'react-native-linear-gradient';

const DarkButton = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={styles.authButtonDark}
      disabled={props.disabled}>
      <LinearGradient
        colors={props.disabled ? ['#CACACA', '#CACACA']:[DISABLEDGRADIENTTOP, DISABLEDGRADIENTBOTTOM]}
        style={styles.linearGradient}>
        <Text style={styles.textButtonDark}>{props.children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

var styles = StyleSheet.create({
  authButtonDark: {
    flex: 1,
    backgroundColor: '#D6D8DB',
    borderRadius: RFValue(50),
    marginHorizontal: RFValue(5),
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  },

  textButtonDark: {
    color: 'black',
    fontSize: RFValue(16),
    fontFamily: THEME_BOLD_FONT,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: RFValue(15),
    fontWeight: 'bold',
  },
  linearGradient: {
    flex: 1,
    borderRadius: RFValue(50),
    justifyContent: 'center',
  },
});

export default DarkButton;
