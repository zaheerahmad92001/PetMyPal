import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import BigHeading from '../../components/commonComponents/bigHeading';
import BigParagraph from '../../components/commonComponents/bigParagraph';
import ContactInput from '../../components/common/ContactInput';
import {BG_DARK, TEXT_DARK, HEADER} from '../../constants/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import DarkButton from '../../components/commonComponents/darkButton';
import Heading from '../../components/commonComponents/heading';
import CheckBox from '../../components/common/Checkbox';
import {THEME_BOLD_FONT} from '../../constants/fontFamily';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const window = Dimensions.get('window');

const Password = ({
  error,
  handleStepUp,
  accept,
  handleTermsChange,
  password,
  confirm_password,
  handlePasswordChange,
  handleConfirmPasswordChange,
  handlePasswordsPressed,
  fetching,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);

  return (
    <>
      <BigHeading>Create Account</BigHeading>
      <View style={styles.petDetailsForm}>
        <View>
          <TextInput
            value={password}
            onChangeText={password => {
              handlePasswordChange(password);
            }}
            secureTextEntry={passwordVisible ? false : true}
            placeholder={'Password'}
            style={
              error === 'Please fill all the fields' ||
              error === 'Your password does not match' ||
              error === 'Password is too short'
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
          <TouchableOpacity
            style={{
              position: 'absolute',
              zIndex: 500,
              right: 15,
              top: 11,
            }}
            onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              size={25}
              name={passwordVisible ? 'eye' : 'eye-off'}
              color={TEXT_DARK}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TextInput
            value={confirm_password}
            secureTextEntry={passwordVisible2 ? false : true}
            onChangeText={confirm_password => {
              handleConfirmPasswordChange(confirm_password);
            }}
            placeholder={'Re-type Password'}
            style={
              error === 'Please fill all the fields' ||
              error === 'Your password does not match'
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
          <TouchableOpacity
            style={{
              position: 'absolute',
              zIndex: 500,
              right: 15,
              top: 11,
            }}
            onPress={() => setPasswordVisible2(!passwordVisible2)}>
            <Icon
              size={25}
              name={passwordVisible2 ? 'eye' : 'eye-off'}
              color={TEXT_DARK}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginVertical: 20}}>
          <TouchableOpacity
            onPress={handleTermsChange}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: RFValue(10),
            }}>
            <CheckBox size={20} selected={accept} />
            <Text
              style={{
                marginLeft: RFValue(15),
                color: 'white',
                fontSize: RFValue(14),
                fontFamily: THEME_BOLD_FONT,
                textAlign: 'center',
              }}>
              I Accept terms and conditions
            </Text>
          </TouchableOpacity>
        </View>

        {fetching ? (
          <ActivityIndicator
            size={'large'}
            color={HEADER}
            style={{marginVertical: RFValue(5)}}
          />
        ) : (
          <DarkButton onPress={handlePasswordsPressed}>Next</DarkButton>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  petDetailsForm: {
    width: window.width * 0.8,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 5,
  },
  // chosenPet: {
  //   justifyContent: 'space-around',
  //   marginVertical: 20,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // pet: {},
  // petOption: {
  //   width: window.width * 0.8 * 0.25 * 0.8,
  //   height: window.width * 0.8 * 0.25 * 0.8,
  //   backgroundColor: BG_DARK,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 40,
  // },
  // petName: {
  //   color: TEXT_LIGHT,
  //   alignSelf: 'center',
  // },
  // petImage: {
  //   width: window.width * 0.8 * 0.25 * 0.8 * 0.65,
  //   height: window.width * 0.8 * 0.25 * 0.8 * 0.65,
  //   resizeMode: 'contain',
  // },
  // changePet: {
  //   backgroundColor: 'red',
  // },
  // changePetText: {
  //   fontSize: 22,
  //   color: TEXT_LIGHT,
  //   textDecorationLine: 'underline',
  //   textDecorationColor: TEXT_LIGHT,
  // },
  // optionContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   marginVertical: 20,
  // },
  // option: {
  //   width: window.width * 0.8 * 0.33,
  //   height: window.width * 0.8 * 0.33,
  //   marginBottom: 16,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // petOption: {
  //   width: window.width * 0.8 * 0.25 * 0.8,
  //   height: window.width * 0.8 * 0.25 * 0.8,
  //   backgroundColor: BG_DARK,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 40,
  // },
  // petName: {
  //   color: TEXT_LIGHT,
  // },
  // selectedOption: {
  //   backgroundColor: HEADER,
  // },
  // petImage: {
  //   width: window.width * 0.8 * 0.25 * 0.8 * 0.65,
  //   height: window.width * 0.8 * 0.25 * 0.8 * 0.65,
  //   resizeMode: 'contain',
  // },
});

export default Password;
