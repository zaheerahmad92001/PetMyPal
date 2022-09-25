import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
} from 'native-base';
import {STATUS, BLACK} from '../../constants/colors';
import {THEME_FONT} from '../../constants/fontFamily';
import FastImage from 'react-native-fast-image';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const DetailInfoBar = props => (
  <Card style={{borderRadius: 20, backgroundColor: BLACK, paddingVertical: 15}}>
    <CardItem
      style={{borderRadius: 20, backgroundColor: BLACK, alignItems: 'center'}}>
      <Left style={{flex: 8}}>
        {props.item.user.image ? (
          <FastImage
            style={{
              backgroundColor: 'white',
              width: 43,
              height: 43,
              borderRadius: 43 / 2,
            }}
            source={{uri: ""+ props.item.user.image}}
          />
        ) : (
          <FastImage
            style={{width: 43, height: 43, borderRadius: 43 / 2}}
            source={require('../../assets/images/iconRoundW.png')}
          />
        )}
        <Body>
          <Text style={styles.textTime} note>
            {props.item.job.from} - {props.item.job.to}
          </Text>
          <Text style={styles.textSquad}>{props.item.user.name}</Text>
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

export default DetailInfoBar;

var styles = StyleSheet.create({
  circle: {
    width: 17,
    height: 17,
    borderRadius: 17 / 2,
  },
  textTime: {
    fontFamily: THEME_FONT,
    fontSize: RFValue(10),
    color: '#FFFFFF',
  },
  textSquad: {
    fontFamily: THEME_FONT,
    fontSize: RFValue(18),
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
