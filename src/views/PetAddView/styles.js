import React from 'react'
import { StyleSheet , Dimensions,} from 'react-native';
import { BG_DARK, black, DANGER, grey, HEADER, TEXT_INPUT_LABEL, TEXT_LIGHT } from '../../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';
import { labelFont, textInputFont } from '../../constants/fontSize';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    wraper: {
      flex: 1,
    },
    choosePetContainer: {
      width: window.width * 0.8,
      alignSelf: 'center',
      marginBottom: 30,
      marginTop: 0,
    },
    optionContainer: {
      // flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      // marginVertical: 20,
    },
    option: {
      width: window.width * 0.8 * 0.25,
      height: window.width * 0.8 * 0.25,
      marginBottom: 11,
      justifyContent: 'center',
      alignItems: 'center',
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
    petView: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    indicator: {
      marginVertical: RFValue(5),
      width: 24,
      marginHorizontal: 'auto',
    },
    selectedPetStyle: {
      width: window.width * 0.8 * 0.25 * 0.8,
      height: window.width * 0.8 * 0.25 * 0.8,
      borderColor: '#f598a2',
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
    },
    unSelectedPets: {
      width: window.width * 0.8 * 0.25 * 0.8,
      height: window.width * 0.8 * 0.25 * 0.8,
      borderColor: '#f4f4f4',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      borderLeftWidth: 0.3,
      borderTopWidth: 0.3,
    },
    imgStyle: {
      width: window.width * 0.8 * 0.25 * 0.8 * 0.65,
      height: window.width * 0.8 * 0.25 * 0.8 * 0.65,
    },
    petimgView: {
      width: window.width * 0.8 * 0.25 * 0.8,
      height: window.width * 0.8 * 0.25 * 0.8,
      borderColor: '#ece9e9',
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15
    },
    petName2: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: 16
    },
    btnView: {
      justifyContent: 'center',
      // marginTop: wp(1),
      marginBottom: 5,
      // marginTop: 15,
    },
    label: {
      color: TEXT_INPUT_LABEL,
      fontSize: 15,
    },
    intlPhoneInputStyle: {
      paddingLeft: 2,
      paddingVertical: 0,
      borderBottomColor: grey,
      borderBottomWidth: StyleSheet.hairlineWidth,
      paddingBottom: Platform.OS == 'ios' ? 10 : null,
      marginTop: Platform.OS === 'android' ? 0 : 10,
    },
    breedView: {
        paddingVertical: 10,
        borderBottomWidth:1,
        borderBottomColor: grey
      },
      breedViewError: {
        paddingVertical: 10,
        borderBottomWidth:1,
        borderBottomColor: DANGER
      },
      breadInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      },
      breedText: {
        flex: 1,
        color: black,
        fontSize:textInputFont,
      },
      iconStyle: {
        color: TEXT_INPUT_LABEL,
        fontSize: 11,
        width: wp(10),
        textAlign: 'center'
      },
      ddContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 10,
        alignItems: 'center',
        marginTop:Platform.OS=='ios'?10:20
      },
      bottomBorderError: {
        width: wp(88),
        // height: StyleSheet.hairlineWidth,
        height:1,
        backgroundColor: DANGER,
        marginTop: 5
      },
      bottomBorder: {
        width: wp(88),
        height: 1,
        backgroundColor: grey,
        marginTop: 5
      },
  
  });
  export default styles
  