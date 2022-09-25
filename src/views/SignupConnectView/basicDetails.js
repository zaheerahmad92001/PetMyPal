import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import BigHeading from '../../components/commonComponents/bigHeading';
import BigParagraph from '../../components/commonComponents/bigParagraph';
import ContactInput from '../../components/common/ContactInput';
import {BG_DARK, TEXT_LIGHT} from '../../constants/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import DarkButton from '../../components/commonComponents/darkButton';
import {TouchableOpacity} from 'react-native-gesture-handler';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const window = Dimensions.get('window');

const BasicDetails = ({
  currentPet,
  handleStepDown,
  petName,
  firstName,
  lastName,
  contact,
  error,
  cca2,
  callingCode,
  fetching,
  handleStepUp,
  handlePetNameChange,
  handleFirstNameChange,
  handleLastNameChange,
  handleContactChange,
  handleCountryChange,
}) => {
  return (
    <>
      <BigHeading>Create Account</BigHeading>
      <View style={styles.basicDetailsForm}>
        <BigParagraph>Select your pet category</BigParagraph>
        <View style={styles.chosenPet}>
          <View style={styles.pet}>
            <View style={styles.petOption}>
              <Image
                style={styles.petImage}
                source={{
                  uri: currentPet.image_thumb,
                }}
              />
            </View>
            <Text style={styles.petName}>{currentPet.name}</Text>
          </View>
          <TouchableOpacity onPress={handleStepDown}>
            <Text style={styles.changePetText}>Change Pet</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          value={petName}
          onChangeText={petName => {
            handlePetNameChange(petName);
          }}
          placeholder={'Pet Name'}
          style={
            error === 'Please fill all the fields' ||
            error === 'Username must be between 5 / 32 letters'
              ? {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: RFValue(10),
                  paddingHorizontal: RFValue(20),
                  borderRadius: RFValue(10),
                  borderWidth: RFValue(1),
                  borderColor: 'red',
                }
              : {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: RFValue(10),
                  paddingHorizontal: RFValue(20),
                  borderRadius: RFValue(10),
                }
          }
        />
        <TextInput
          value={firstName}
          onChangeText={firstName => {
            handleFirstNameChange(firstName);
          }}
          placeholder={'Pet Owner First Name'}
          style={
            error === 'Please fill all the fields' ||
            error === 'Username must be between 5 / 32 letters'
              ? {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: RFValue(10),
                  paddingHorizontal: RFValue(20),
                  borderRadius: RFValue(10),
                  borderWidth: RFValue(1),
                  borderColor: 'red',
                }
              : {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: RFValue(10),
                  paddingHorizontal: RFValue(20),
                  borderRadius: RFValue(10),
                }
          }
        />
        <TextInput
          value={lastName}
          onChangeText={lastName => {
            handleLastNameChange(lastName);
          }}
          placeholder={'Pet Owner Last Name'}
          style={
            error === 'Please fill all the fields' ||
            error === 'Username must be between 5 / 32 letters'
              ? {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: RFValue(10),
                  paddingHorizontal: RFValue(20),
                  borderRadius: RFValue(10),
                  borderWidth: RFValue(1),
                  borderColor: 'red',
                }
              : {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: RFValue(10),
                  paddingHorizontal: RFValue(20),
                  borderRadius: RFValue(10),
                }
          }
        />
        <View style={{paddingBottom: RFValue(10)}}>
          <ContactInput
            cca2={cca2}
            style={[styles.contactNum]}
            callingCode={callingCode}
            onChangeText={value => {
              handleContactChange(value);
            }}
            contact={contact}
            placeholder={'Mobile number'}
            select={country => {
              handleCountryChange(country);
            }}
          />
        </View>
        {fetching ? (
          <ActivityIndicator
            size={'large'}
            color={BG_DARK}
            style={{marginVertical: RFValue(5)}}
          />
        ) : (
          <DarkButton
            onPress={() => {
              handleStepUp();
            }}>
            Next
          </DarkButton>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  basicDetailsForm: {
    width: window.width * 0.8,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 16,
  },
  chosenPet: {
    justifyContent: 'space-around',
    marginVertical: 20,
    flexDirection: 'row',
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
  contactNum: {
    fontSize: RFValue(14),
    justifyContent: 'center',
  },
});

export default BasicDetails;
