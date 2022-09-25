
import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function({item, events, navigation}){
    function getFullDate(date) {
        if (date.includes('-')) {
          var modifyDate = date.toString().split('-');
          var standardDateFormat = modifyDate[0] + '/' + modifyDate[1] + '/' + modifyDate[2];
          return standardDateFormat;
        }
        return date;
    
    
      }
    return(
         <TouchableOpacity
              style={[styles.bodyContainer, { marginBottom: item.id == events[events?.length - 1].id ? 20 : 0 }]}
              onPress={() => navigation.navigate('EventDetails', { item: item, btnShow: false, myEvent: true })}
              key={item.id}>
              <View style={{ borderRadius: 10, overflow: 'hidden', marginTop: wp(5) }}>
                <Image source={{ uri: item.cover }}
                  style={{ width: '100%', height: 140, borderRadius: 10 }} />
              </View>
              <Text style={styles.text}>{item?.name}</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoSubContainer}>
                  <Image source={require('./../../assets/images/updated/eventTimer.png')} style={{ width: 20, height: 20 }} />
                  <Text style={{ marginLeft: 6, color: 'gray' }}>{getFullDate(item?.start_date ?? 0)}</Text>
                  <Text style={{ color: 'gray' }}>{'-' + getFullDate(item?.end_date ?? 0)}</Text>
                </View>
                <View style={{ width: '40%', flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('./../../assets/images/updated/eventTimer.png')} style={{ width: 20, height: 20 }} />
                  <Text style={{ marginLeft: 4, color: 'gray' }}>{item?.start_time?.substring(0, 5)}</Text>
                  <Text style={{ color: 'gray' }}>{'-' + item?.end_time?.substring(0, 5)}</Text>
                </View>
              </View>

              <View style={[styles.infoSubContainer, { marginTop: wp(1) }]}>
                <Image source={require('./../../assets/images/updated/eventLocation.png')} style={{ width: 20, height: 20 }} />
                <Text style={{ marginLeft: 8, color: 'gray' }}>{item?.location}</Text>
              </View>
              <TouchableOpacity onPress={()=>aboutModal(item.description)}>
              <Text style={{ marginLeft: 8, color: 'gray', marginTop: 12 }}>{item.description}</Text>
              </TouchableOpacity>

            </TouchableOpacity>
          )


    
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
          justifyContent: 'space-between',
          marginTop: 4,
          flexDirection: 'row',
          alignItems: 'center',
        },
        infoSubContainer: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          width: '60%',
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