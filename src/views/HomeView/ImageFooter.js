import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  Thumbnail,
  Container,
  Header,
  Content,
  Left,
  Button,
  Body,
  Right,
  Card,
  Form,
  Input,
  Item,
  CardItem,
  Icon,
} from 'native-base';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {THEME_FONT} from '../../constants/fontFamily';

const ImageFooter = ({imageIndex, imagesCount}) => (
  <View style={styles.root}>
    <CardItem style={{backgroundColor: 'transparent'}}>
      <Left>
        <Button transparent>
          <Icon name="thumbs-up" />
          <Text
            style={{
              fontSize: RFValue(14),
              fontFamily: THEME_FONT,
              color: 'white',
            }}>
            {' '}
            0 Likes
          </Text>
        </Button>
      </Left>
      <Body style={{justifyContent: 'center'}}>
        <Button transparent>
          <Icon name="chatbubbles" />
          <Text
            style={{
              fontSize: RFValue(14),
              fontFamily: THEME_FONT,
              color: 'white',
            }}>
            {' '}
            0 Comments
          </Text>
        </Button>
      </Body>
      <Right>
        <Button transparent>
          <Icon name="share" />
          <Text
            style={{
              fontSize: RFValue(14),
              fontFamily: THEME_FONT,
              color: 'white',
            }}>
            {' '}
            Share
          </Text>
        </Button>
      </Right>
    </CardItem>
  </View>
);

const styles = StyleSheet.create({
  root: {
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF',
    height: 64,
    backgroundColor: '#00000077',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#FFF',
  },
});

export default ImageFooter;
