import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Card, CardItem, Body, Left, Right, Icon} from 'native-base';
import {STATUS} from '../../constants/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import {THEME_FONT} from '../../constants/fontFamily';
import {convertDateToString} from '../../utils/DateFuncs';
// import console = require('console');
import moment from 'moment';

const BlockCard = props => {
  const resched =
    props.old &&
    props.item.job.status !== 'Completed' &&
    props.item.job.status !== 'Accepted';
  const clockIn = props.item.job.clockIn;
  const clockOff = props.item.job.clockOff;

  if (!props.tracking) {
    return (
      <Card
        style={{
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          margin: 15,
          paddingVertical: 10,
        }}>
        <CardItem style={{borderRadius: 20}}>
          <Left>
            <Text style={styles.Headings}>Status</Text>
          </Left>
          <Body>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                if (resched && !props.item.job.rescheduled) props.onPress();
              }}>
              <View
                style={[
                  styles.circle,
                  {backgroundColor: STATUS[props.item.job.status]},
                ]}
              />
              <View style={{marginLeft: 10}}>
                <Text style={styles.Text}>{props.item.job.status}</Text>
              </View>
              {
                // {resched  &&  !props.item.job.rescheduled?
                // <View style={{ marginLeft: 10 }}>
                // 	<Icon type="MaterialIcons" style={styles.iconRestore} name={'restore'}/>
                // </View>:null
              }
            </TouchableOpacity>
          </Body>
        </CardItem>

        <CardItem style={{borderRadius: 20}}>
          <Left>
            <Text style={styles.Headings}>Date</Text>
            <Text style={styles.Text}>
              {convertDateToString(new Date(props.item.job.day))}
            </Text>
          </Left>
        </CardItem>

        <CardItem style={{borderRadius: 20}}>
          <Left>
            <Text style={styles.Headings}>Location</Text>
            <Text style={styles.Text}>{props.item.job.location}</Text>
          </Left>
        </CardItem>

        <CardItem style={{borderRadius: 20}}>
          <View>
            <View>
              <Text style={styles.Headings}>Description</Text>
            </View>
            <View>
              <Text style={styles.Text}>{props.item.job.description}</Text>
            </View>
          </View>
        </CardItem>
      </Card>
    );
  } else {
    const _from = props.item.job.from.replace(':', '');
    const _to = props.item.job.to.replace(':', '');
    var _Scheduled = Math.abs(_from - _to).toString();
    // var _Actual = Math.abs(clockOff.clockOffTime-clockIn.clockInTime).toString();

    // var clockOffTest = new Date(clockOff.clockOffTime);
    const diffTime = Math.abs(clockOff.clockOffTime - clockIn.clockInTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.warn(diffTime);
    var diffHrs = moment(clockOff.clockOffTime).diff(
      moment(clockIn.clockInTime),
      'hours',
    );
    // var diffHrs= Math.floor((diffTime % 86400000)/3600000);
    var _Actual = Math.round(((diffTime % 86400000) % 3600000) / 60000);
    // console.warn(diffHrs,convertDateTimeToString(clockOffTest),diffDays);
    if (_Scheduled.length == 3) {
      _Scheduled = '0' + _Scheduled;
    }
    _Scheduled = _Scheduled.slice(0, 2) + ':' + _Scheduled.slice(-2);
    if (diffHrs == 0) {
      if (_Actual <= 9) {
        _Actual = '00:0' + _Actual;
      } else {
        _Actual = '00:' + _Actual;
      }
    } else {
      diffHrs = ('0' + diffHrs).slice(-2);
      if (_Actual <= 9) {
        _Actual = diffHrs + ':0' + _Actual;
      } else {
        _Actual = diffHrs + ':' + _Actual;
      }
    }
    return (
      <Card
        style={{
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          margin: 15,
          paddingVertical: 10,
        }}>
        <CardItem style={{borderRadius: 20}}>
          <Left>
            <Text style={styles.Headings}>Status</Text>
          </Left>
          <Body>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                if (resched && !props.item.job.rescheduled) props.onPress();
              }}>
              <View
                style={[
                  styles.circle,
                  {backgroundColor: STATUS[props.item.job.status]},
                ]}
              />
              <View style={{marginLeft: 10}}>
                <Text style={styles.Text}>{props.item.job.status}</Text>
              </View>
              {
                // {resched  &&  !props.item.job.rescheduled?
                // <View style={{ marginLeft: 10 }}>
                // 	<Icon type="MaterialIcons" style={styles.iconRestore} name={'restore'}/>
                // </View>:null
              }
            </TouchableOpacity>
          </Body>
        </CardItem>

        <CardItem style={{borderRadius: 20}}>
          <Left>
            <Text style={styles.Headings}>Clock In</Text>
            <Text style={styles.Text}>
              {clockIn
                ? convertDateToString(new Date(clockIn.clockInTime)) +
                  ' ' +
                  ('0' + (clockIn.hour ? clockIn.hour : '0')).slice(-2) +
                  ':' +
                  ('0' + (clockIn.mins ? clockIn.mins : '0')).slice(-2)
                : 'Not Available'}
            </Text>
          </Left>
        </CardItem>

        <CardItem style={{borderRadius: 20}}>
          <Left>
            <Text style={styles.Headings}>Clock Out</Text>
            <Text style={styles.Text}>
              {clockIn
                ? convertDateToString(new Date(clockOff.clockOffTime)) +
                  ' ' +
                  ('0' + (clockOff.hour ? clockOff.hour : '0')).slice(-2) +
                  ':' +
                  ('0' + (clockOff.mins ? clockOff.mins : '0')).slice(-2)
                : 'Not Available'}
            </Text>
          </Left>
        </CardItem>

        <CardItem style={{borderRadius: 20}}>
          <Left>
            <Text style={styles.Headings}>Scheduled</Text>
            <Text style={styles.Text}>{_Scheduled}</Text>
          </Left>
        </CardItem>
        <CardItem style={{borderRadius: 20}}>
          <Left>
            <Text style={styles.Headings}>Actual</Text>
            <Text style={styles.Text}>{_Actual}</Text>
          </Left>
        </CardItem>
      </Card>
    );
  }
};
export default BlockCard;
const styles = StyleSheet.create({
  circle: {
    width: 17,
    height: 17,
    borderRadius: 17 / 2,
    backgroundColor: 'white',
  },
  Text: {
    fontFamily: THEME_FONT,
    fontStyle: 'normal',
    fontSize: RFValue(12),
    color: '#C5CEE0',
    flex: 5,
  },
  Headings: {
    fontFamily: THEME_FONT,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: RFValue(14),
    color: '#000000',
    flex: 5,
  },
  iconRestore: {
    fontSize: RFValue(18),
    color: '#C5CEE0',
    flex: 5,
  },
});
