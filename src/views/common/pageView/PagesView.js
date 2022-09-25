import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet
} from 'react-native';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SvgUri } from 'react-native-svg';

import styles from './styles';
import { connect } from 'react-redux';
import { HEADER, TEXT_LIGHT, TEXT_DARK, BLUE_NEW, darkSky } from './../../../constants/colors';
import SvgMemberIcon from '../../../assets/images/members-icon.svg';
import JoinButton from './../../../components/common/JoinButton';

class PageView extends React.Component {
  callback = (id) => {

    this.props.callBack(id)
  }
  render() {

    const { item, index, goPage, callBack } = this.props
    return (
      <View
        key={index}
        style={{
          // flex: 1,
          backgroundColor: '#ffff',
          marginTop: wp(10),
          marginBottom: wp(5),
          marginHorizontal: wp(2),
          borderRadius: RFValue(12),
          width: 200,
          height: hp(Platform.OS == 'ios' ? 24 : 25),
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,

          elevation: 9,
        }}>

        <TouchableOpacity
          style={{ padding: 0, justifyContent: 'center', alignItems: 'center' }}
          onPress={goPage}>
          {item?.avatar?.includes('.svg') ?
            <SvgUri
              width={RFValue(45)}
              height={RFValue(45)}
              uri={item?.avatar}
            /> :
            <FastImage
              style={{
                alignSelf: 'center',
                backgroundColor: 'black',
                width: wp(20),
                height: hp(10),
                marginTop: wp(-9),
                borderRadius: wp(2),
              }}
              source={{ uri: item?.avatar?.replace(/\s/g, '') }}
            />}
        </TouchableOpacity>
        <Text style={StyleSheet.flatten([styles.eNameText, { width: '100%', textAlign: 'center', marginTop: wp(2) }])} numberOfLines={1} note>
          {item.group_title}
        </Text>
        <View style={{ flexDirection: 'column', width: '100%', justifyContent: 'space-between' }}>
          {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={styles.eNameText} numberOfLines={1} note>
              {item.page_title ? item.page_title : item.group_title}
            </Text>
          </View> */}
          <View style={{ alignItems: 'center', marginTop: wp(2), width: '100%' }}>
            <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
              {/* <SvgMemberIcon width={16} height={16} /> */}
              <Text style={[styles.eContentTextSmall]} note>
                Members:{' '}<Text style={{ color: darkSky }}>{item.members}</Text>
              </Text>
              {!_.isEmpty(item?.category) && <Text style={[styles.eContentTextSmall, { marginTop: wp(1) }]} note>
                {'Created On:'}{' '}
                <Text style={{ color: darkSky }}>{item.registered}</Text>
              </Text>}
              <Text style={[styles.eContentTextSmall, { marginVertical: wp(1) }]} note>
                {'Category: '}{' '}
                <Text style={{ color: darkSky }}>{item?.category}</Text>
              </Text>
            </View>
          </View>

        </View>
        <JoinButton item={item} callBack={this.callback} />
      </View>
    );
  }
}

export default (PageView);
