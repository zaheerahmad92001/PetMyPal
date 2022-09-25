import {Button, Footer, FooterTab, Thumbnail} from 'native-base';
import React, {useState, useEffect} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {TextInput} from 'react-native';
import {Share} from 'react-native';
// import { AsyncStorage } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import requestRoutes from '../../utils/requestRoutes.json';

import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
import {RFValue} from 'react-native-responsive-fontsize';
// import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import DarkButton from '../../components/commonComponents/darkButton';
import {THEME_FONT} from '../../constants/fontFamily';
import {SERVER, server_key} from '../../constants/server';
import {ACCESS_TOKEN} from '../../constants/storageKeys';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native';
import {HEADER, TEXT_DARK, TEXT_LIGHT} from '../../constants/colors';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddFooter from './../FooterBarView/AddFooter';

const PetModal = props => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (props.myPets) {
      setPets([...props.myPets]);
    }
  }, [props.myPets]);

  const switchScreen = index => {
    props.updateState({petModalVisible: !props.modalVisible});
    if (props.navigation.state.routeName === 'FooterBarView' && index !== 4) {
      props.updateState({index});
    }
  };

  return (
    <>
      {props.modalVisible ? <View style={styles.backdrop} /> : null}
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
          props.updateState({petModalVisible: !props.modalVisible});
        }}>
        <View style={styles.centeredView}>
          <View style={{flex: 1, height: 20}}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.updateState({petModalVisible: !props.modalVisible});
              }}
              style={{height: '100%'}}>
              <View style={{height: '100%'}} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.modalView}>
            <View style={{marginTop: 20}}>
              <Text style={styles.link}>My Pets</Text>
              <ScrollView style={styles.listContainer}>
                <View style={styles.horizontalList}>
                  {pets.map((pet, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        props.updateState({
                          petModalVisible: !props.modalVisible,
                        });
                        props.navigation.navigate({
                          routeName: 'PetProfile',
                          key: 'PetProfile',
                          params: {item: pet},
                        });
                      }}
                      key={item.id}>
                      <View
                        style={
                          (index + 1) % 4 === 0
                            ? {
                                ...styles.horizontalListItem,
                                ...styles.fourthListItem,
                              }
                            : styles.horizontalListItem
                        }>
                        <Thumbnail
                          medium
                          source={{uri: ""+ pet.avatar}}
                          style={{borderWidth: 2, borderColor: '#04B7EB'}}
                        />
                        <Text styles={{fontWeight: 'bold'}}>{pet.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
        <AddFooter index={ index } switchScreen={(f) => this.switchScreen(f) } navigation={props.navigation} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#000000a1',
    width: screenWidth,
    height: screenHeight,
    zIndex: 100,
  },
  centeredView: {
    flex: 1,
    // height: screenHeight - 55,
    // backgroundColor: "#000000a1",
  },
  modalView: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: screenWidth,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // position: 'absolute',
    // bottom: 55
  },

  link: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkButton: {
    paddingVertical: 6,
    flexDirection: 'row',
  },
  listContainer: {
    maxHeight: 200,
    marginTop: 20,
    width: screenWidth - 30,
  },
  horizontalList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  horizontalListItem: {
    width: (screenWidth - 30) / 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  fourthListItem: {
    marginRight: 0,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  shareLink: {
    color: HEADER,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: HEADER,
    paddingHorizontal: 5,
  },

  iconContainer: {
    backgroundColor: TEXT_LIGHT,
    width: 32,
    height: 32,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    backgroundColor: TEXT_DARK,
    width: 32,
    height: 32,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIcon: {
    color: TEXT_DARK,
    // fontSize: 14,
    margin: 0,
    padding: 0,
  },
  homeButtonContainer: {
    backgroundColor: TEXT_DARK,
    width: 48,
    height: 48,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    color: TEXT_LIGHT,
    // fontSize: 14,
    margin: 0,
    padding: 0,
  },
  selectedIcon: {
    color: '#fff',
  },
  footerText: {
    color: '#5A5959',
    fontSize: 8,
  },
});

const mapStateToProps = state => ({
  user: state.user.user,
  myPets: state.mypets.pets,
});

export default connect(mapStateToProps)(PetModal);
