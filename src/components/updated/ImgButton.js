import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, PixelRatio } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
import { THEME_BOLD_FONT } from '../../constants/fontFamily';
import LinearGradient from 'react-native-linear-gradient';

const ImgButton = props => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}
    style={props.disabled ? styles.disableButton : styles.authButtonDark}
    disabled={props.disabled}>
      <Image
        style={styles.logoText2}
        source={props.url} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  logoText2: {
    width: PixelRatio.getPixelSizeForLayoutSize(110),
    height: PixelRatio.getPixelSizeForLayoutSize(22),
    // resizeMode: 'contain',
  },
  signupText: {
    width: PixelRatio.getPixelSizeForLayoutSize(80),
    // height: PixelRatio.getPixelSizeForLayoutSize(22),
    // resizeMode: 'contain',
  },
  logoText: {
    width: PixelRatio.getPixelSizeForLayoutSize(50),
    height: PixelRatio.getPixelSizeForLayoutSize(22),
    // resizeMode: 'contain',
  },
  bottomOptions: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',

    paddingBottom: RFValue(40),
  },
  options: {
    paddingTop: RFValue(10),
  },
  buttons: {
    height: 42,
    marginBottom: 10,
    width: 320,
    alignItems: 'center'
  },
  icon: {
    marginHorizontal: 20,
  },
});

export default ImgButton;
