import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import BigHeading from '../../components/commonComponents/bigHeading';
import BigParagraph from '../../components/commonComponents/bigParagraph';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Arrowdown from 'react-native-vector-icons/SimpleLineIcons';
import ContactInput from '../../components/common/ContactInput';
import {
  TEXT_INPUT_LABEL,
  PLACE_HOLDER,
  HEADER,
  TEXT_DARK,
} from '../../constants/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import DarkButton from '../../components/commonComponents/darkButton';
import DatePicker from 'react-native-date-picker';

import RadioForm from 'react-native-simple-radio-button';
var radio_btn_props = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
];

import {Item,Input,Label} from 'native-base';
import {Icon} from 'native-base';


const window = Dimensions.get('window');

const PetDetails = ({
  handleStepUp,
  fetching,
  avatarSource,
  petName,
  error,
  petsFill,
  petGender,
  petSizes,
  petSizesKeys,
  selectedPet,
  selectedSubPet,
  selectedPetSize,
  petSubTypes,
  handlePetSubTypeSelect,
  handlePetSizeSelect,
  handlePetBirthdayChange,
  handlePetGenderChange,
  handlePetNameChange,
  handlePetAvatar,
}) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectM, setSelectM] = useState(0);
  const [selectY, setSelectY] = useState(-1);
  var Years = [];
  for (let i = 0; i <= 30; i++) {
    Years.push(<Picker.Item label={'' + i} value={i} color={'black'} />);
  }
  var months = [];
  for (let i = 1; i <= 12; i++) {
    months.push(<Picker.Item label={'' + i} value={'' + i} color={'black'} />);
  }
  const setBirthDate = () => {
    setShow(false);
    handlePetBirthdayChange(
      `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
    );
  };
  const setBirth = () => {
    let totalMonths = selectM;
    if (selectY > 0) {
      totalMonths = selectM * selectY;
    }
    var x = new Date();
    x.setMonth(x.getMonth() - totalMonths);
  };
  return (
    <>
      {show ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 400,
          }}
        />
      ) : null}
      {show ? (
        <View
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            zIndex: 500,
            width: 310,
            borderRadius: 15,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
            top: 25,
            left: window.width - window.width / 2 - 310 / 2,
          }}>
          <DatePicker
            date={date}
            onDateChange={setDate}
            mode="date"
            style={{position: 'relative', marginVertical: 20}}
          />
          <View
            style={{
              height: 42,
              marginVertical: RFValue(15),
              marginHorizontal: RFValue(20),
            }}>
            <DarkButton onPress={setBirthDate}>OK</DarkButton>
          </View>
        </View>
      ) : null}
      {fetching || (petSubTypes <= 0 && selectedPet !== 6) ? (
        <ActivityIndicator
          size={'large'}
          color={HEADER}
          style={{marginVertical: RFValue(20)}}
        />
      ) : (
        <>
          <View style={styles.petImageContainer}>
            <Image
              resizeMode={'cover'}
              style={styles.petImage}
              source={
                avatarSource
                  ? avatarSource
                  : {uri:'https://petmypal.com/upload/photos/d-cover.jpg?cache=0'}
              }
            />
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={handlePetAvatar}>
              <Icon type="FontAwesome" name="pencil" style={styles.editIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.petDetailsForm}>
            <Item stackedLabel>
              <Label style={{color: petsFill.Name ? 'red' : TEXT_INPUT_LABEL}}>Name</Label>
              <Input
                value={petName}
                onChangeText={petName => {handlePetNameChange(petName);}}
                style={{marginLeft: wp(-1)}}
                placeholderTextColor={PLACE_HOLDER}
                placeholder={'Enter Name'}
              />
            </Item>

            <View>
              {selectedPet !== 6 ? (
                <Item stackedLabel>
                  <Label
                    style={{
                      color: petsFill.Subtype ? 'red' : TEXT_INPUT_LABEL,
                    }}>
                    Breed
                  </Label>
                  <View style={{width: '100%'}}>
                    <Picker
                      mode="dialog"
                      style={{marginLeft: wp(-2)}}
                      selectedValue={selectedSubPet}
                      onValueChange={handlePetSubTypeSelect}>
                      <Picker.Item
                        label="Enter Breed"
                        value="0"
                        color={TEXT_INPUT_LABEL}
                      />
                      {petSubTypes &&
                        petSubTypes.map((value, index) => (
                          <Picker.Item
                            label={value.name}
                            color={'black'}
                            value={value.id}
                            key={index}
                          />
                        ))}
                    </Picker>
                  </View>
                </Item>
              ) : null}
              {selectedPet === 2 ? (
                <Item stackedLabel>
                  <Label
                    style={{
                      color:
                        error === 'Please fill all the fields'
                          ? 'red'
                          : TEXT_INPUT_LABEL,
                    }}>
                    Size
                    {/* {error} */}
                  </Label>
                  <View style={{width: '100%'}}>
                    <Picker
                      mode="dialog"
                      style={{marginLeft: wp(-2)}}
                      selectedValue={selectedPetSize}
                      onValueChange={handlePetSizeSelect}>
                      <Picker.Item
                        label="Enter Size"
                        value="0"
                        color={TEXT_INPUT_LABEL}
                      />
                      {petSizesKeys &&
                        petSizesKeys.map((pet, i) => (
                          <Picker.Item
                            color={'black'}
                            label={petSizes[pet]}
                            value={pet}
                            key={i}
                          />
                        ))}
                    </Picker>
                  </View>
                </Item>
              ) : null}
              
              <View style={{flexDirection: 'row'}}>
                <Item stackedLabel>
                {/* <Label style={{width: wp(30)}} /> */}

                  <Label
                    style={{
                      width: wp(30),
                      color:petsFill.Birthday? 'red': TEXT_INPUT_LABEL,
                    }}>
                    Age
                  </Label>
                  <View style={{width: '100%' ,}}>
                    <Picker
                      mode="dropdown"
                      style={{marginLeft: wp(-2)}}
                      selectedValue={selectY}
                      onValueChange={y => {
                        setSelectY(y);
                        setBirth();
                      }}>
                      <Picker.Item
                        label="Year"
                        value="-1"
                        color={PLACE_HOLDER}
                      />
                      {Years}
                    </Picker>
                  </View>
                </Item>

                <Item stackedLabel>
                  <Label style={{width: wp(30)}} />

                  <View style={{width: '100%'}}>
                    <Picker
                      mode="dropdown"
                      selectedValue={selectM}
                      // onValueChange={setSelectM}
                      style={{marginLeft: wp(-2)}}
                      onValueChange={y => {
                        setSelectM(y);
                        setBirth();
                      }}>
                      <Picker.Item
                        label="Month"
                        value="0"
                        color={PLACE_HOLDER}
                      />
                      {months}
                    </Picker>
                  </View>
                </Item>
              </View>

            <Item
                stackedLabel
                style={{ alignItems: 'flex-start' }}
              >
                <Label style={petsFill.Gender ?[styles.inputLabel,{color:'red'}]:[styles.inputLabel]}>Gender</Label>

            <RadioForm
                  style={{ marginTop: 15  }}
                  radio_props={radio_btn_props}
                  initial={petGender === 'male' ? 0 :petGender==='female' ? 1:-1}
                  formHorizontal={true}
                  labelHorizontal={true}
                  labelColor={'red'}
                  buttonColor={'#40c4ff'}
                  selectedButtonColor={'#40c4ff'}
                  // onPress={(value) => this.setState({ report: value })}
                  onPress={handlePetGenderChange}
                  buttonInnerColor={'red'}
                  buttonOuterColor={'black'}
                  animation={true}
                  buttonWrapStyle={{ marginLeft: 10 }}
                  buttonSize={10}
                  labelStyle={{ fontSize: RFValue(16), color: TEXT_DARK, paddingRight: 20 }}
                />
          </Item>

            </View>
            <View style={{height: 42, marginTop: hp(4)}}>
              <DarkButton
                onPress={() => {
                  if (selectY == -1 || selectM == 0) {
                    var yx = new Date();
                    handlePetBirthdayChange(
                      `${yx.getDay()}-${yx.getMonth() +
                        1}-${yx.getFullYear()}`,
                    );
                  } else {
                    let totalMonths = selectM;
                    if (selectY > 0) {
                      totalMonths = selectM * selectY;
                    }
                    var x = new Date();
                    x.setMonth(x.getMonth() - totalMonths);
                    console.log(
                      x,
                      `01-${x.getMonth() + 1}-${x.getFullYear()}`,
                      'date',
                    );
                    handlePetBirthdayChange(
                      `01-${x.getMonth() + 1}-${x.getFullYear()}`,
                    );
                  }
                  if (!avatarSource) {
                    alert('Please select pet image');
                  } else {
                  
                    handleStepUp();
                  }
                }}>
                Next
              </DarkButton>
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  petDetailsForm: {
    width: window.width * 0.8,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 16,
  },
  petImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginVertical: 20,
  },
  petImage: {
    height: window.width * 0.26,
    width: window.width * 0.26,
    backgroundColor: '#F0F0F0',
    borderRadius: 13,
  },
  editIconContainer: {
    width: RFValue(35),
    height: RFValue(35),
    borderRadius: RFValue(35 / 2),
    backgroundColor: HEADER,
    borderWidth: RFValue(1),
    borderColor: 'white',
    position: 'absolute',
    zIndex: 300,
    justifyContent: 'center',
    right: '36%',
  },
  editIcon: {
    textAlign: 'center',
    color: 'white',
    fontSize: RFValue(16),
  },
  inputLabel: {
    color: '#000',
    marginTop:5,
  },
});

export default PetDetails;
