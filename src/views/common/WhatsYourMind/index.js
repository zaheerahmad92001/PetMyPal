import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { HEADER, TEXT_LIGHT, TEXT_DARK, BLUE_NEW } from './../../../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class WhatsYourMind extends React.Component {

  render() {
    const { item, index, StatusView } = this.props
    return (
      <View style={{
        backgroundColor: '#FFFFFF',
        paddingVertical: wp(4),
        marginTop: wp(4),
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,

        elevation: 14,
      }}>

        <View style={{
          flexDirection: 'row',
          backgroundColor: '#FFFFFF',
          // marginTop: hp(3),
        }}>
          <TouchableOpacity
            onPress={StatusView}
            style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                borderRadius: wp(4),
                paddingVertical: RFValue(5),
                borderWidth: 1,
                borderColor: '#C7CCDA',
                overflow: 'hidden',
                height: hp(9)
              }}>
              <Text
                style={{
                  // backgroundColor: 'white',
                  color: '#C7CCDA',
                  marginLeft: 10
                }}>
                What's on your mind?
        </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default (WhatsYourMind);
