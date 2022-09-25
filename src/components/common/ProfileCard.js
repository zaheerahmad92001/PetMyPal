import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
} from 'native-base';
import {THEME_FONT} from '../../constants/fontFamily';
import FastImage from 'react-native-fast-image';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const ProfileCard = props => (
  <Card style={{flex: 1, borderRadius: 20, padding: 10}}>
    {props.profile.image ? (
      <FastImage
        style={{
          alignSelf: 'center',
          backgroundColor: 'black',
          width: 80,
          height: 80,
          borderRadius: 80 / 2,
        }}
        large
        source={{uri: ""+ props.profile.image}}
      />
    ) : (
      <Thumbnail
        style={{alignSelf: 'center'}}
        large
        source={require('../../assets/images/iconRound.png')}
      />
    )}
    <CardItem style={{flex: 1, borderRadius: 20}}>
      <Body>
        <Text style={[styles.Title]}>{props.profile.name}</Text>
      </Body>
    </CardItem>

    <CardItem style={{borderRadius: 20}}>
      <Left>
        <Button onPress={props.phoneCall} transparent>
          <Thumbnail square source={props.ImageLeft} />
        </Button>
      </Left>

      <Body>
        <Button
          style={{alignSelf: 'center'}}
          onPress={props.textMsg}
          transparent>
          <Thumbnail square source={props.ImageCenter} />
        </Button>
      </Body>

      <Right>
        <Button onPress={props._Email} transparent>
          <Thumbnail square source={props.ImageRight} />
        </Button>
      </Right>
    </CardItem>
  </Card>
);

export default ProfileCard;

var styles = StyleSheet.create({
  Title: {
    fontFamily: THEME_FONT,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: RFValue(18),
    color: '#222326',
    alignSelf: 'center',
  },
});
