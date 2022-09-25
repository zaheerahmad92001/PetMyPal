import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BG_LIGHT, TEXT_DARK} from '../../constants/colors';
import {THEME_BOLD_FONT} from '../../constants/fontFamily';
import {RFValue} from 'react-native-responsive-fontsize';

const LightButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.authButtonLight}>
           {Array.isArray(props.children) ? 
        <>
        <Text style={styles.textButtonLight}>{props.children[0]? props.children[0] : ''}</Text>
        <Text style={styles.textButtonLight}>{props.children[1]? props.children[1] : ''}</Text>
        <Text style={styles.textButtonLight}>{props.children[2]? props.children[2]: ''}</Text>
        </> : 
        <Text style={styles.textButtonLight}>{props.children ? props.children: ''}</Text>
      }
    </TouchableOpacity>
  );
};

var styles = StyleSheet.create({
  authButtonLight: {
    flex: 1,
    backgroundColor: '#E3EDF0',
    padding: RFValue(10),
    borderRadius: RFValue(50),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  textButtonLight: {
    color: TEXT_DARK,
    fontSize: RFValue(16),
    fontFamily: THEME_BOLD_FONT,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});

export default LightButton;
