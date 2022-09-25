import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';

import ClockSvg from '../../assets/Event-Icons-svg/clock.svg';
import LocationSvg from '../../assets/Event-Icons-svg/location.svg';
import PersonPlusSvg from '../../assets/Event-Icons-svg/person-plus.svg';
import GroupSvg from '../../assets/Event-Icons-svg/woman-man.svg';
import { darkSky, PINK } from '../../constants/colors';
import EventEmpty from './EventEmpty';
import { ShortAboutParseHtml } from '../../components/helpers';


function Interested({ events, pressInterestEvent, pressGoingEvent, goToCreate, navigation, showButtons, ...rest }) {
  const { aboutModal } = rest;

let currentDate = new Date()
 let cdate =  fullDate(currentDate)
 let [c_month ,c_date, c_year] = cdate.split('-')

  function getFullDate(date) {

   return moment(date, 'MM-DD-YYYY').format("ll").split(',')[0];

  }
  function getFullTime(time) {

    return moment(time, 'HH:mm:ss').format('HH:mm')

  }

  function fullDate(date) {
    return moment(date).format('MM-DD-YYYY')
  }

  if (events?.length > 0) {
    return (

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, i }) => {
          
      //     let [e_month ,e_date, e_year] = item.end_date.split('-')
      //     var current_date = new Date(c_year,c_month - 1, c_date);
      //     var event_date = new Date(e_year, e_month - 1, e_date)
      
      // let pastEvetn = false
      // if(current_date > event_date){
      //   pastEvetn = true
      // }else {
      //   pastEvetn = false
      // }


          return (
            <TouchableOpacity key={i}

              style={[styles.bodyContainer, { marginBottom: item.id == events[events?.length - 1].id ? 20 : 0 }]}
              onPress={() => navigation.navigate('EventDetails', { item: item, btnShow: true, goingShow: true, interestShow: true })}
            >
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
              {showButtons && <View style={{ width: '100%', flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={styles.defaultButton}
                  onPress={() => {
                    pressInterestEvent(item.id)
                  }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#20ACE2' }}>Interested</Text>

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    pressGoingEvent(item.id)
                  }}
                  style={styles.shadowButton}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>Going</Text>

                </TouchableOpacity>
              </View>}

            </TouchableOpacity>
          )
        }}
      />
    )
  } else {
    return (
      <EventEmpty create={true} goToCreate={() => goToCreate.navigate({
        routeName: 'CreateEvent',
        key: 'CreateEvent'
      })} />
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
    alignItems: 'center',
   
  },
  infoSubContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  

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
    width: '45%',
    height: 50,

    borderRadius: 15,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#20ACE2",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 8,

  }
})

export default React.memo(Interested);