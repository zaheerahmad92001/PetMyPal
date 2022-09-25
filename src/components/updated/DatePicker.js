import React, { useState } from 'react';
import { View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import DatePicker from 'react-native-date-picker';
import DarkButton from './../commonComponents/darkButton';
import {
  Text,
  Image,
  ScrollView
} from 'react-native';
export default DatePickers = ({ select,minimumDate }) => {
  const [date, setDate] = useState(new Date())
  return (
    <View
      style={{
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 500,
        width: 310,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        top: 25,
      }}>
      <DatePicker
        date={date}
        onDateChange={date => {setDate(date)}}
        mode="date"
        style={{ position: 'relative', marginVertical: 20 }}
        minimumDate={minimumDate?new Date(minimumDate):new Date()}
      />

      <View
        style={{
          height: 42,
          width: 100,
          alignSelf: 'center',
          marginBottom: RFValue(10),
        }}>
        <DarkButton onPress={() =>select(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate())}>OK</DarkButton>
      </View>
    </View>

  );
};
