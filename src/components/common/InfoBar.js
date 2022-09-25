import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, CardItem, Thumbnail, Text, Left, Body, Right} from 'native-base';
import {STATUS} from '../../constants/colors';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
import FastImage from 'react-native-fast-image';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const InfoBar = props => (
  <Card style={{borderRadius: 20}}>
    <CardItem style={{borderRadius: 20}}>
      <Left style={{flex: 8}}>
        {props.item.user.image ? (
          <FastImage
            style={{
              backgroundColor: 'black',
              width: 37,
              height: 37,
              borderRadius: 37 / 2,
            }}
            source={{uri: ""+ props.item.user.image}}
          />
        ) : (
          <Thumbnail
            style={{width: 37, height: 37, borderRadius: 37 / 2}}
            source={require('../../assets/images/iconRound.png')}
          />
        )}
        <Body>
          <Text style={styles.textTime} note>
            {props.item.job.from} - {props.item.job.to}
          </Text>
          <Text numberOfLines={1} style={styles.textSquad}>
            {props.item.user.name}
          </Text>
        </Body>
      </Left>
      <Right style={{flex: 2}}>
        <View
          style={[
            styles.circle,
            {backgroundColor: STATUS[props.item.job.status]},
          ]}
        />
      </Right>
    </CardItem>
  </Card>
);

export default InfoBar;

var styles = StyleSheet.create({
  circle: {
    width: 15,
    height: 15,
    borderRadius: 100 / 2,
  },
  textTime: {
    fontFamily: THEME_FONT,
    fontSize: RFValue(10),
    color: 'rgba(34, 35, 38, 0.6)',
  },
  textSquad: {
    fontFamily: THEME_BOLD_FONT,
    fontSize: RFValue(12),
    fontWeight: '500',
    color: '#222326',
  },
});
