import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native'

const FullPageBackground = props => {
  return (
    <ImageBackground
      source={props.image}
      resizeMode= 'cover'
      style={styles.container}>
      {props.children}
    </ImageBackground>
  )
}

var styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  }
});

export default FullPageBackground
