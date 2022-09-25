import React from 'react';
import {View, StyleSheet, Image, StatusBar} from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Header,
} from 'native-base';
import {THEME_FONT, THEME_BOLD_FONT} from '../../constants/fontFamily';
import {STATUSBAR, BGCOLOR} from '../../constants/colors';

const SquadlyHeader = props => {
  return (
    <Header style={{backgroundColor: BGCOLOR, borderBottomColor: BGCOLOR}}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1.5, flexDirection: 'row'}}>
          <Button transparent onPress={props.LeftPress}>
            <Image style={{width: 23, height: 23}} source={props.ImageLeft} />
          </Button>
        </View>
        <View style={{flex: 7, flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={styles.dashboardHeading}>{props.HeadingText}</Text>
        </View>
        <View
          style={{flex: 1.5, flexDirection: 'row', justifyContent: 'flex-end'}}>
          {props.ImageRight ? (
            <Button transparent onPress={props.RightPress}>
              <Image
                style={{width: 23, height: 23}}
                source={props.ImageRight}
              />
            </Button>
          ) : null}
        </View>
      </View>
    </Header>
  );
};

export default SquadlyHeader;

const styles = StyleSheet.create({
  dashboardHeading: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    color: '#000000',
  },
});
