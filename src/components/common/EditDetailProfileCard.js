import React from 'react';
import {View, StyleSheet, Image, Linking, TouchableOpacity} from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Container,
} from 'native-base';
import {THEME_FONT} from '../../constants/fontFamily';
import FastImage from 'react-native-fast-image';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

class EditDetailProfileCard extends React.Component {
  render() {
    return (
      <Card style={{flex: 1, borderRadius: 20, padding: 10}}>
        {this.props.item.image ? (
          <TouchableOpacity onPress={this.props.onPress}>
            <FastImage
              style={{
                alignSelf: 'center',
                backgroundColor: 'black',
                width: 90,
                height: 90,
                borderRadius: 90 / 2,
              }}
              large
              source={{uri: ""+ this.props.item.image}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.props.onPress}>
            <FastImage
              style={{
                alignSelf: 'center',
                backgroundColor: 'black',
                width: 90,
                height: 90,
                borderRadius: 90 / 2,
              }}
              large
              source={require('../../assets/images/iconRound.png')}
            />
          </TouchableOpacity>
        )}
        <CardItem style={{flex: 1, borderRadius: 20}}>
          <Body>
            <Text style={[styles.Title]}>{this.props.item.name}</Text>
          </Body>
        </CardItem>
        <CardItem style={{borderRadius: 20}}>
          <Left />
          <Body>
            <Button
              onPress={() => {
                this.props.item.contact
                  ? Linking.openURL(`tel:${this.props.item.contact}`)
                  : Linking.openURL(`tel:${this.props.item.phoneNumber}`);
              }}
              style={{alignSelf: 'center'}}
              transparent>
              <Thumbnail
                square
                source={require('../../assets/images/call.png')}
              />
            </Button>
          </Body>
          <Right />
        </CardItem>
      </Card>
    );
  }
}
export default EditDetailProfileCard;
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
