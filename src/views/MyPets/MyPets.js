import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { Right, Icon as Ican, Left, Item, Label } from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import RNGooglePlaces from 'react-native-google-places';
import MapView, { Marker } from 'react-native-maps';
import { lostPet } from '../../services/index';
import { Divider } from 'react-native-elements'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';


import PMPHeader from '../../components/common/PMPHeader';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import InfoModal from '../../components/common/InfoModal';
const { petActivity, petFoundAction, ownerpets } = petMyPalApiService;
import { postTimeAndReaction } from '../../utils/DateFuncs';
import _DatePicker from '../../components/common/_DatePicker';
import { BG_DARK, HEADER, TEXT_LIGHT, darkSky, COLOR_TEXT_PRIMARY, darkGrey, PINK, TEXT_INPUT_LABEL, PLACE_HOLDER } from '../../constants/colors';
import { SERVER } from '../../constants/server';

const window = Dimensions.get('window');
const optionsStyles = {
  optionsContainer: {
    backgroundColor: 'white',
    marginTop: wp(8),
    width: wp(37),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsWrapper: {
    backgroundColor: 'white',
  },
  optionWrapper: {
    backgroundColor: 'white',
    margin: 5,
  },
  optionTouchable: {
    underlayColor: '#dedede',
    activeOpacity: 100,
  },
};
export class MyPets extends React.Component {
  state = {
    selectPet: '',
    showModal: false,
    locationName: '',
    petData: {},
    place: false,
    pet_key: undefined,
    token: undefined,
    user_id: undefined,
    petSelectedName: '',

    lostPetModal: false,
    petFoundPlaces: [],
    petFoundState: false,
    pet_name: undefined,
    petTime: undefined,
    lostDate: undefined,
    lostDateError: false,
    dateModal: false,
    activePetsActive: true,
    lostActive: false,
    deactiveActive: false,
    deceasedActive: false,
  };

  componentDidMount() {
    this.getToken();
  }
  componentWillUnmount() {
    this.timeCaller;
  }



  componentDidMount() { this.getToken(); }

  async getToken() {
    const TOKEN = await AsyncStorage.getItem(ACCESS_TOKEN);
    this.setState({
      token: JSON.parse(TOKEN).access_token,
      user_id: JSON.parse(TOKEN).user_id,
    });
  }

  goBack = () => { this.props.navigation.pop() };

  getLocation = async () => {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        this.setState({ locationName: place.address, place: place });
      })
      .catch(error => console.log(error.message));
  };
  async petActivityStatus(item) {
    const response = await petActivity(this.state.token, item.user_id, true);
    if (
      response?.data?.api_status == 200 &&
      response?.data?.activities?.length > 0
    ) {
      let { time, feeling } = postTimeAndReaction(
        response.data.activities[0]?.time,
      );
      this.setState({
        petFoundPlaces: response.data.activities,
        petData: item,
        petTime: time,
        pet_key: undefined,
      });
    } else {
      this.setState({ lostPetModal: true, pet_key: undefined });
      //Todo Not sure about the response
    }
  }
  petDetails(item) {
    return item.pet_lost == '1' && item.deceased == 0 && item.disabled == 0
      ? true
      : false;
  }

  closeModal = () => {
    this.setState({
      petFoundState: false,
      lostPetModal: false,
    });
  };

  onActivePetClick() {
    const { activePetsActive } = this.state
    this.setState({
      activePetsActive: !activePetsActive,
      lostActive: false,
      deactiveActive: false,
      deceasedActive: false
    })
  }

  onLostPetClick() {
    const { lostActive } = this.state
    this.setState({
      lostActive: !lostActive,
      activePetsActive: false,
      deactiveActive: false,
      deceasedActive: false
    })
  }

  onDeactiveClick() {
    const { deactiveActive } = this.state
    this.setState({
      deactiveActive: !deactiveActive,
      activePetsActive: false,
      lostActive: false,
      deceasedActive: false,

    })
  }
  onDeceasedClick() {
    const { deceasedActive } = this.state
    this.setState({
      deceasedActive: !deceasedActive,
      activePetsActive: false,
      lostActive: false,
      deactiveActive: false

    })
  }


  renderPetItem = (data, lostBtn) => {
    const { item, index } = data;
    // console.log('item', item)

    if (item?.avatar) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate({
              routeName: 'PetProfile',
              key: 'PetProfile',
              params: { item },
            });
          }}
          style={[
            styles.option1,
            { backgroundColor: Math.abs(index % 2) == 0 ? '#fae8ea' : 'white' },
          ]}
          key={index}>
          <View style={[styles.option, { height: wp(31) }]}>
            <View style={{ flexDirection: 'row', width: '50%' }}>
              <View style={styles.userView}>
                <Image style={styles.userImg}
                  source={{ uri: '' + item.avatar }}
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {item?.first_name} ({item?.pet_info?.pet_type_text})
                </Text>
                <View style={styles.dateView}>
                  <Image
                    style={styles.dateIcon}
                    source={require('../../assets/images/updated/cake-pink.png')}
                  />

                  <Text style={{ color: '#9e9e9e', marginLeft: 6 }}>
                    {moment(item.birthday).date() +
                      ', ' +
                      moment(item.birthday).format('MMM YYYY')}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                  <Image
                    style={styles.dateIcon}
                    source={require('../../assets/images/updated/gender-blue.png')}
                  />
                  <Text style={{ color: '#9e9e9e', marginLeft: 8 }}>
                    {item?.gender?.charAt(0).toUpperCase() +
                      item?.gender?.slice(1).toLowerCase()}
                  </Text>
                </View>
                {/* {this.petDetails(item) && <Text style={{ color: PINK, fontWeight: '500', marginTop: wp(1), width: wp(60) }}>Lost Since:{' '}<Text>{moment.unix(item?.lost_data?.lost_since_unix).format('MMM Do YYYY')}</Text></Text>} */}

                {this.petDetails(item) && <Text style={styles.lostSince}>Lost Since:{' '}<Text>{moment(item?.lost_data?.lost_date,'YYYY-MM-DD',).format('MMM Do YYYY')}</Text></Text>}
              
              </View>
            </View>

            <View style={styles.btnView}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate({
                    routeName: 'MyPetsWebView',
                    key: 'MyPetsWebView',
                    params: { url: `${SERVER}/qr/` + item?.pet_key },
                  })
                }
                style={styles.btnInnerView}>
                <Text style={styles.btnText}>Pet-ID</Text>
              </TouchableOpacity>
              {/* lostBtn && let me know if is it need creating issue @hammad */}
              {item.disabled != '1' && item.deceased != '1' && (['Cat', 'Dog'].includes(item?.pet_info?.pet_type_text)) ? (
                <Menu
                  onBackdropPress={() => this.setState({ pet_key: undefined })}
                  rendererProps={{ anchorStyle: { backgroundColor: 'red' } }}
                  opened={this.state.pet_key == item?.pet_key}>
                  <MenuTrigger>
                    <TouchableOpacity
                      onPress={() => {
                        if (this.petDetails(item)) {
                          this.setState({
                            pet_key: this.state.pet_key
                              ? undefined
                              : item?.pet_key,
                            petSelectedName: item.first_name

                          });
                        } else {
                          this.setState({ petData: item, showModal: true });
                        }
                      }}
                      style={{
                        height: 30,
                        width: 80,
                        borderRadius: 8,
                        backgroundColor: this.petDetails(item)
                          ? '#FD672A'
                          : '#f47d8a',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          alignItems: 'center',
                        }}>
                        {this.petDetails(item) ? 'Activity' : 'Pet Lost'}
                      </Text>
                    </TouchableOpacity>
                  </MenuTrigger>

                  <MenuOptions customStyles={optionsStyles}>
                    <MenuOption
                      style={styles.showActivity}
                      onSelect={() => this.petActivityStatus(item)}>
                      <Ican
                        type="FontAwesome5"
                        name="binoculars"
                        style={{
                          fontSize: RFValue(12),
                          color: 'black',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          marginRight: wp(5),
                        }}
                      />
                      <Text style={{ color: 'black' }}>View Activity</Text>
                    </MenuOption>
                    <MenuOption
                      style={styles.showActivity}
                      onSelect={() =>
                        this.petFound(item.user_id, item.first_name)
                      }>
                      <Ican
                        type="FontAwesome5"
                        name="check"
                        style={{
                          fontSize: RFValue(12),
                          color: 'black',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          marginRight: wp(5),
                        }}
                      />
                      <Text style={{ color: 'black' }}>Pet is Found</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              ) : <View style={{
                height: 30,
                width: 80,
              }} />}

            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  listOfPets = () => {
    const { mypets } = this.props;
    const { activePetsActive, lostActive, deactiveActive, deceasedActive } = this.state
    let active_pets = mypets.filter(
      item => item.pet_lost == 0 && item.deceased == 0 && item.disabled == 0,
    );

    let pet_lost = mypets.filter(
      item => item.pet_lost == '1' && item.deceased == 0 && item.disabled == 0,
    );
    let deceased = mypets.filter(
      item =>
        item.deceased == '1' && item.disabled == 0,
    );
    let deactive_date = mypets.filter(
      item => item.pet_lost == '0' && item.disabled == '1',
    );
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>

          <TouchableOpacity onPress={() => this.onActivePetClick()}>
            <View style={styles.row}>
              <Text style={styles.heading}>Active</Text>
              <Icon name={activePetsActive ? 'up' : 'down'} type={'AntDesign'} style={styles.up_down_arrow} />
            </View>
          </TouchableOpacity>

          {activePetsActive &&
            <FlatList
              disableVirtualization={true}
              scrollEnabled={true}
              horizontal={false}
              data={active_pets}
              renderItem={item => this.renderPetItem(item, true)}
              ListFooterComponent={<View style={{ height: 20 }} />}
            />
          }
          <View style={styles.line} />

        </View>

        <View>
          <TouchableOpacity onPress={() => this.onLostPetClick()} >
            <View style={styles.row}>
              <Text style={styles.heading}>Lost</Text>
              <Icon name={lostActive ? 'up' : 'down'} type={'AntDesign'} style={styles.up_down_arrow} />
            </View>
          </TouchableOpacity>

          {lostActive &&
            <FlatList
              disableVirtualization={true}
              scrollEnabled={true}
              horizontal={false}
              data={pet_lost}
              renderItem={item => this.renderPetItem(item, false)}
              ListFooterComponent={<View style={{ height: 20 }} />}
            />
          }
          <View style={styles.line} />
        </View>

        <View>

          <TouchableOpacity onPress={() => this.onDeactiveClick()}>
            <View style={styles.row}>
              <Text style={styles.heading}>Deactive</Text>
              <Icon name={deactiveActive ? 'up' : 'down'} type={'AntDesign'} style={styles.up_down_arrow} />
            </View>
          </TouchableOpacity>

          {deactiveActive &&
            <FlatList
              disableVirtualization={true}
              scrollEnabled={true}
              horizontal={false}
              data={deactive_date}
              renderItem={item => this.renderPetItem(item, false)}
              ListFooterComponent={<View style={{ height: 20 }} />}
            />
          }
          <View style={styles.line} />
        </View>
        <View style={{ marginBottom: wp(33) }}>

          <TouchableOpacity onPress={() => this.onDeceasedClick()}>
            <View style={styles.row}>
              <Text style={styles.heading}>Deceased</Text>
              <Icon name={deceasedActive ? 'up' : 'down'} type={'AntDesign'} style={styles.up_down_arrow} />
            </View>
          </TouchableOpacity>

          {deceasedActive &&
            <FlatList
              disableVirtualization={true}
              scrollEnabled={true}
              horizontal={false}
              data={deceased}
              renderItem={item => this.renderPetItem(item, false)}
              ListFooterComponent={<View style={{ height: 20 }} />}
            />}
          <View style={styles.line} />
        </View>
      </ScrollView>
    );
  };
  renderCommonButtons() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'baseline',
          marginVertical: wp(7),
        }}>
        <TouchableOpacity
          onPress={() =>
            this.setState({
              petFoundPlaces: [],
              lostPetModal: false,
              petFoundState: false,
            })
          }
          style={{
            borderRadius: 10,
            paddingVertical: wp(3),
            paddingHorizontal: wp(10),
            backgroundColor: '#20ACE2',
          }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>OK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            this.setState({
              petFoundPlaces: [],
              lostPetModal: false,
              petFoundState: false,
            })
          }
          style={{
            borderRadius: 10,
            paddingVertical: wp(3),
            paddingHorizontal: wp(7),
            backgroundColor: '#F47D8A',
            marginLeft: wp(5),
          }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  petFound(pet_id, pet_name) {
    this.props.petFoundAction(this.state.token, pet_id, this.props.navigation);
    this.setState({ petFoundState: true, pet_key: undefined, pet_name });
  }
  selectDate = (date) => {
    console.log('this is date lost ', date);

    this.setState({ lostDate: date })

  }
  handlePetDate = () => {
    console.log('handle date', this.state.lostDate);
    this.setState({ dateModal: false, lostDate: this.state?.lostDate ?? new Date() })
  }
  render() {
    const { mypets } = this.props;

    return (
      <MenuProvider>
        <View style={{ backgroundColor: 'white', flex: 1 }}>
          <PMPHeader
            centerText={'My Pets'}
            ImageLeftIcon={'arrow-back'}
            // RightText={'Add Pet'}
            LeftPress={() => this.goBack()}
            RightPress={() => this.props.navigation.navigate('PetAddView')} //this.state?.petFoundPlaces?.length>0?true:false
          />
          <Modal
            useNativeDriver
            animationInTiming={1000}
            animationOutTiming={500}
            isVisible={this.state?.petFoundPlaces?.length > 0 ? true : false}
            style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                height: wp(90),
                backgroundColor: 'white',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: wp(2),
              }}>
              <View style={{ flexDirection: 'row', marginTop: wp(5) }}>
                <Left
                  style={{
                    marginLeft: 'auto',
                    marginBottom: 'auto',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{ uri: '' + this.state.petData?.avatar }}
                    style={{
                      width: wp(10),
                      height: wp(10),
                      resizeMode: 'contain',
                      marginTop: wp(-2),
                      borderRadius: 5,
                      marginLeft: '5%',
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: wp(3),
                      marginTop: wp(-1),
                      fontWeight: 'bold',
                    }}>
                    {this.state.petData.first_name}
                  </Text>
                </Left>
                <Right
                  style={{
                    marginLeft: 'auto',
                    marginBottom: 'auto',
                    marginTop: wp(-3),
                  }}>
                  <Ican
                    onPress={() => this.setState({ petFoundPlaces: [] })}
                    name={'cross'}
                    type="Entypo"
                    style={{
                      fontSize: RFValue(25),
                      color: 'black',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                    }}
                  />
                </Right>
              </View>
              {this.state.petFoundPlaces?.length > 0 && (
                <MapView
                  style={{
                    width: '95%',
                    height: wp(58),
                    borderRadius: 10,
                    marginTop: wp(5),
                  }}
                  rotateEnabled={true}
                  scrollEnabled={true}
                  showsMyLocationButton={true}
                  showsUserLocation={true}
                  zoomEnabled={true}
                  showsCompass={true}
                  initialRegion={{
                    latitude: Number(
                      this.state?.petFoundPlaces[0]?.data?.latitude,
                    ),
                    longitude: Number(
                      this.state?.petFoundPlaces[0]?.data?.longitude,
                    ),
                    latitudeDelta: 0.01922,
                    longitudeDelta: 0.01421,
                  }}>
                  <Marker
                    key={0}
                    coordinate={{
                      latitude: Number(
                        this.state?.petFoundPlaces[0]?.data?.latitude,
                      ),
                      longitude: Number(
                        this.state?.petFoundPlaces[0]?.data?.longitude,
                      ),
                      latitudeDelta: 0.0122,
                      longitudeDelta: 0.0121,
                    }}
                    title={this.state?.petFoundPlaces[0]?.data?.address}
                  //description={marker.description}
                  />
                </MapView>
              )}
              <Text
                style={{ marginTop: wp(3), fontWeight: 'bold', width: '95%' }}>
                Last Seen:{' '}
                <Text style={{ fontWeight: 'normal', fontSize: 12 }}>
                  {this.state.petFoundPlaces[0]?.data?.address} {'   '}
                  <Text style={{ fontWeight: 'bold' }}>{this.state.petTime}</Text>
                </Text>
              </Text>
            </View>
          </Modal>
          <InfoModal
            isVisible={this.state.lostPetModal}
            onBackButtonPress={() => this.closeModal()}
            info={`Please be patient. As soon as someone scans ${this.state.petSelectedName}'s QR tag you will be able to view it's last known geolocation.`}
            headerText={'Pet Lost Activity'}
            // policy={passPolicy}
            onPress={() => this.closeModal()}
          />
          <InfoModal
            isVisible={this.state.petFoundState}
            onBackButtonPress={() => this.closeModal()}
            info={`Thank Goodness ${this.state.pet_name} Has Been Found`}
            onPress={() => this.closeModal()}
          />


          <View style={{ backgroundColor: 'white', marginBottom: 60 }}>
            {mypets?.length > 0 ? (
              this.listOfPets()
            ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginBottom: 8,
                  }}>
                  <Text style={{ fontWeight: '700' }}>No Pets Found</Text>
                </View>
              )}
          </View>
          <Modal isVisible={this.state.showModal} coverScreen={true}>
            <View style={styles.modal}>
              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.petHeader}>Lost My Pet </Text>
                  <TouchableOpacity
                    style={{ width: 30, height: 30, alignItems: 'flex-end' }}
                    onPress={() => this.setState({ showModal: false })}>
                    <Text style={{ fontSize: 24 }}>&#10005;</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ color: darkSky, fontWeight: 'bold', marginBottom: wp(1), fontSize: 18, textAlign: 'center' }}>
                  Lost and Found service is catered for Dogs and Cats.
                </Text>

                <Text style={styles.petBodyText}>
                  {`We are with you! Lets find ${this.state.petData.first_name
                    } together.`}
                </Text>
                <View style={{ marginTop: 20 }}>

                  <View style={styles.petDateRow}>
                    
                    <View style={{marginTop:6}}>
                      <Text style={styles.secondaryPetBody}>Selected Pet</Text>
                      <View style={{ flexDirection: 'row',alignItems:'center',marginTop:5 }}>
                        <View style={styles.imgView}>
                          <Image
                            style={styles.imgStyle}
                            source={{ uri: '' + this.state.petData?.avatar }}
                          />
                        </View>
                          <Text style={{ fontSize: 16, marginTop: wp(-2) , left:2, }}>
                            {this.state.petData?.first_name}
                          </Text>
                      </View>
                    </View>

                    <View style={{marginTop:-7}}>
                      <Label style={[styles.secondaryPetBody]}>Pet Lost Date</Label>
                      <TouchableOpacity
                        style={{ marginTop: wp(2) }}
                        onPress={() => this.setState({ dateModal: true })}>
                        <Text style={{ fontSize: 16, color: this.state?.lostDate ? 'black' : '#ced2de', letterSpacing: 1 }}>
                          {this.state?.lostDate ? moment(this.state.lostDate).format('MM/DD/YYYY') : 'Enter Date'}
                        </Text>
                      </TouchableOpacity>
                      <Divider/>
                    </View>
                    
                  </View>

                  <Divider style={{marginTop:7}}/>

                  <Text style={[styles.secondaryPetBody, { marginTop: 20 }]}>
                    Lost in area
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.getLocation()}
                    style={{ width: '100%', marginTop: 10 }}>
                    <Text
                      style={{
                        color:
                          this.state.locationName != '' ? 'black' : '#ced2de',
                        fontSize: 16,
                      }}>
                      {this.state.locationName != ''
                        ? this.state.locationName
                        : 'Enter Lost in area'}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexGrow: 1,
                      borderWidth: 0.5,
                      borderColor: '#dedede',
                      marginTop: 10,
                    }}
                  />
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => {

                      const { petData, locationName, place, lostDate } = this.state;
                      console.log('on save date', lostDate);
                      this.setState({ callApi: true });
                      if (place.location && petData.user_id && locationName != '' && lostDate) {
                        lostPet(
                          petData.user_id,
                          locationName,
                          place.location.latitude,
                          place.location.longitude,
                          lostDate,
                          data => {
                            this.setState({ showModal: false, callApi: false, locationName: '', lostDate: undefined });
                            this.timeCaller = setTimeout(() => {
                              this.props.ownerpets(
                                this.state.token,
                                this.props.navigation,
                              );

                            }, 1000)

                          },
                        );
                      } else {
                        this.setState({ callApi: false });
                      }
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'white',
                      }}>
                      {this.state.callApi ? 'Loading' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <_DatePicker
              maxDate={new Date()}
              date={this.state?.lostDate ?? new Date()}
              isVisible={this.state.dateModal}
              header={'Select Lost Date'}
              onDateChange={this.selectDate}
              onSelect={this.handlePetDate}
              onClose={this.handlePetDate}
            />
          </Modal>
        </View>
      </MenuProvider>
    );
  }
}
const styles = StyleSheet.create({
  choosePetContainer: {
    width: window.width * 0.8,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 0,
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  option1: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    // marginHorizontal: wp(5)

  },
  option: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  petOption: {
    width: window.width * 0.8 * 0.25 * 0.8,
    height: window.width * 0.8 * 0.25 * 0.8,
    backgroundColor: BG_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  petName: {
    color: '#000',
  },
  selectedOption: {
    backgroundColor: HEADER,
  },
  petImage: {
    width: window.width * 0.8 * 0.25 * 0.8 * 0.65,
    height: window.width * 0.8 * 0.25 * 0.8 * 0.65,
    resizeMode: 'contain',
    // tintColor: 'white',
  },
  extraMargin: {
    marginBottom: 10,
  },
  basicDetailsForm: {
    width: window.width * 0.8,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 16,
  },
  chosenPet: {
    justifyContent: 'space-around',
    marginVertical: 10,
    // flexDirection: 'row',
    alignItems: 'center',
  },
  pet: {},
  petOption: {
    width: window.width * 0.8 * 0.25 * 0.8,
    height: window.width * 0.8 * 0.25 * 0.8,
    backgroundColor: BG_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  petName: {
    color: TEXT_LIGHT,
    alignSelf: 'center',
  },
  petImage: {
    width: window.width * 0.8 * 0.25 * 0.8 * 0.65,
    height: window.width * 0.8 * 0.25 * 0.8 * 0.65,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  changePetText: {
    fontSize: 16,
    color: TEXT_LIGHT,
    textDecorationLine: 'underline',
    textDecorationColor: TEXT_LIGHT,
  },
  modal: {
    height: 'auto',
    backgroundColor: 'white',
    borderRadius: 20,
  },
  petHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    flexGrow: 1,
    textAlign: 'center',
    letterSpacing: 1,
    color: '#2C3C62',
    paddingLeft: 25,
  },
  petBodyText: {
    fontSize: 18,
    color: '#939BAF',
    textAlign: 'center',

  },
  secondaryPetBody: {
    fontWeight: '300',
    fontSize: 15,
    color: '#939BAF',
  },
  shareButton: {
    height: 45,
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#20ACE2',
    marginTop: 30,
    shadowColor: '#000',
    marginLeft: 'auto',
    marginRight: 'auto',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 10,
  },
  line: {
    width: '92%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PLACE_HOLDER,
    // marginBottom: wp(1),
    alignSelf: 'center',
  },
  showActivity: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(37),
    marginTop: wp(2),
    paddingVertical: wp(2),
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
  },

  petModal: {
    backgroundColor: 'white',
    maxHeight: 250,
    width: '90%',
    alignSelf: 'center',
    top: '40%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customDropDown: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: wp(17),
    left: wp(0),
    zIndex: 1,
    width: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(5),

  },
  heading: {
    paddingVertical: 10,
    alignItems: 'center',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: wp(4),
  },
  up_down_arrow: {
    fontSize: 20,
    color: TEXT_INPUT_LABEL
  },
  userView: {
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  userImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dateView: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  dateIcon: {
    width: 15,
    height: 15,
    resizeMode: 'cover',
  },
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    width: '50%',
    alignSelf: 'flex-end',
    bottom: 40,
    // marginLeft:10,
    // marginBottom: 0,
    // backgroundColor:'red',
  },
  btnInnerView: {
    height: 30,
    width: 80,
    borderRadius: 8,
    backgroundColor: '#20ace2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
  },
  imgView: {
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8,
  },
  imgStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  petDateRow:{ 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
     },
     lostSince:{ 
       color: PINK, 
       fontWeight: '500',
      marginTop: wp(1), 
      width: wp(60) 
    }

});
const mapStateToProps = state => {
  return {
    mypets: state.mypets ? state.mypets.pets : [],
  };
};
export default connect(mapStateToProps, { petFoundAction, ownerpets })(MyPets);
