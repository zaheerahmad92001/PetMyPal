import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EventEmpty from './EventEmpty';
import React, { Component } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';

import ClockSvg from '../../assets/Event-Icons-svg/clock.svg';
import LocationSvg from '../../assets/Event-Icons-svg/location.svg';
import PersonPlusSvg from '../../assets/Event-Icons-svg/person-plus.svg';
import GroupSvg from '../../assets/Event-Icons-svg/woman-man.svg';
import { darkSky, PINK } from '../../constants/colors';
import { ShortAboutParseHtml } from '../../components/helpers';

function Going({ events, pressGoingEvent, navigation, ...rest }) {
  const { aboutModal } = rest;

  function getFullDate(date) {

    return moment(date, 'MM-DD-YYYY').format("ll").split(',')[0];

  }
  function getFullTime(time) {

    return moment(time, 'HH:mm:ss').format('HH:mm')

  }


  if (events?.length > 0) {
    return (
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item, i }) => {
          return (
            <TouchableOpacity
              style={[styles.bodyContainer, { marginBottom: item.id == events[events?.length - 1].id ? 20 : 0 }]}
              onPress={() => navigation.navigate('EventDetails', { item: item, btnShow: true, goingShow: true, interestShow: false, color: true })}
              key={i}>
              <View style={{ borderRadius: 10, overflow: 'hidden', marginTop: wp(5) }}>
                <Image source={{ uri: item.cover }}
                  style={{ width: '100%', height: 140, borderRadius: 10 }} />
              </View>
              <Text style={styles.text}>{item?.name}</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoSubContainer}>
                  <ClockSvg width={18} height={18} />
                  <Text style={{ marginLeft: 10, color: 'gray', fontWeight: 'bold', fontSize: 13 }}>{getFullDate(item?.start_date ?? 0)}</Text>
                  <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 13 }}>{' ' + getFullTime(item?.start_time)}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'gray' }}>{' '}-{' '}</Text>
                  <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 13 }}>{getFullDate(item?.end_date ?? 0)}</Text>
                  <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 13 }}>{' ' + getFullTime(item?.end_time)}</Text>
                </View>
              </View>
              <View style={[styles.infoSubContainer, { marginTop: wp(3) }]}>
                <LocationSvg width={20} height={20} />
                <Text style={{ marginLeft: 8, color: 'gray' }}>{item?.location}</Text>
              </View>
              <View style={{ marginTop: wp(3) }}>
              <TouchableOpacity onPress={()=> navigation.navigate({
                    routeName: 'Profile',
                    key: 'Profile',
                    params: { user_id: item?.user_data?.user_id,item: item?.user_data },
                  })} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <GroupSvg width={21} height={21} />
                  <Text style={{ marginLeft: 8, color: 'gray' }}>{item?.user_data?.name}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(2.5) }}>
                  <PersonPlusSvg width={20} height={20} />

                  <Text style={{ marginLeft: 8, color: darkSky }}>{item?.interestedUsers.length ?? 0}{' '}Interested<Text style={{ color: PINK }}>{'  '}{item?.goingUsers.length ?? 0}{''} Going</Text></Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => aboutModal(item.description)}>
              <View style={{  marginTop: 12, width: '100%', alignItems:'center' }}>
                <Text style={{color: 'gray'}}  >{ShortAboutParseHtml(item.description)}</Text>
                </View>
              </TouchableOpacity>
              <View style={{ width: '100%', flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={() => {
                    pressGoingEvent(item.id)
                  }}
                  style={styles.shadowButton}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>Not Going</Text>

                </TouchableOpacity>
              </View>

            </TouchableOpacity>
          )
        }}
      />
    )
  } else {
    return (
      <EventEmpty />
    )
  }
}
const styles = StyleSheet.create({
  bodyContainer: {
    marginTop: 20,
    paddingHorizontal: '5%',
    paddingBottom: '5%',
    marginHorizontal: '5%',
    borderRadius: 15,
    shadowColor: "#20ACE2",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 8,
    backgroundColor: 'white'
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 9,
    marginVertical: 5
  },
  infoContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoSubContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'

  },
  defaultButton: {
    width: '45%',
    height: 50,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: '#20ACE2',
    justifyContent: 'center',
    alignItems: 'center'

  },
  shadowButton: {
    width: '100%',
    height: 50,

    borderRadius: 15,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(244, 125, 138, 0.8)",
    shadowColor: "#000",


  }
})

export default React.memo(Going);