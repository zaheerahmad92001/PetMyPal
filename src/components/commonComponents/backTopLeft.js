import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Icon from './icon';
import {TEXT_LIGHT} from '../../constants/colors';

const BackTopLeft = ({stepBackHandler}) => {
  return (
    <TouchableWithoutFeedback onPress={stepBackHandler} style={styles.logo}>
      <View style={styles.container}>
        <Icon
          name="chevron-back-outline"
          color={TEXT_LIGHT}
          size={24}
          platform="both"
        />
        <Text style={styles.text}>back</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
var styles = StyleSheet.create({
  logo: {
    alignSelf: 'flex-start',
    marginTop: RFValue(4),
    marginLeft: RFValue(8),
    width: 120,
    resizeMode: 'contain',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: TEXT_LIGHT,
    lineHeight: 18,
    fontSize: 16,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    marginHorizontal: 10,
  },
});

export default BackTopLeft;
