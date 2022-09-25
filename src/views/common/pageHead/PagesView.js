import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import styles from './styles';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { HEADER, TEXT_LIGHT, TEXT_DARK } from './../../../constants/colors';
import DarkButton from './../../../components/commonComponents/darkButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class PageHead extends React.Component {

  render() {
    const { item, index, goPage } = this.props
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
        <View style={{
          borderColor: '#0000', // if you need 
          // overflow: 'hidden',
          borderWidth: 1,
          elevation: 5,
          shadowColor: '#0000',
          shadowOpacity: 12,
          // shadowRadius: 10,
          marginTop: hp(-8),
          backgroundColor: '#fff',
          height: hp(40),
          borderRadius: 20,
          width: wp(88)
        }}>
        </View>
      </View>
    );
  }
}

export default PageHead
