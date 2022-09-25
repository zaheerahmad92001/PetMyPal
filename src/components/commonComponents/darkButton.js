import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  TEXT_DARK,
  TEXT_LIGHT,
  BG_DARK_DISABLED,
  BLUE_HELF_NEW,
  BLUE_NEW
} from '../../constants/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import {THEME_BOLD_FONT} from '../../constants/fontFamily';
import LinearGradient from 'react-native-linear-gradient';

const DarkButton = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={props.disabled ? styles.disableButton : styles.authButtonDark}
      disabled={props.disabled}>
      <LinearGradient
        colors={props.disabled ? ['#CACACA', '#CACACA']:[BLUE_NEW, BLUE_HELF_NEW]}
        style={[styles.linearGradient, props.date && { height: 40}]}>
        {Array.isArray(props.children) ? 
        <>
        <Text style={styles.textButtonDark}>{props.children[0]? props.children[0] : ''}</Text>
        <Text style={styles.textButtonDark}>{props.children[1]? props.children[1] : ''}</Text>
        <Text style={styles.textButtonDark}>{props.children[2]? props.children[2]: ''}</Text>
        </> : 
        <Text style={styles.textButtonDark}>{props.children ? props.children: ''}</Text>
      }
      </LinearGradient>
    </TouchableOpacity>
  );
};

var styles = StyleSheet.create({
  authButtonDark: {
    flex: 1,
    backgroundColor: TEXT_DARK,
    borderRadius: RFValue(13),
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  },

  disableButton: {
    backgroundColor: BG_DARK_DISABLED,
    flex: 1,
    borderRadius: RFValue(13),
    marginHorizontal: RFValue(5),
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  },

  textButtonDark: {
    color: TEXT_LIGHT,
    fontSize: RFValue(16),
    fontFamily: THEME_BOLD_FONT,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linearGradient: {
    flex: 1,
    borderRadius: RFValue(13),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default DarkButton;
