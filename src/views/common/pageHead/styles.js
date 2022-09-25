import { StyleSheet, Platform, Dimensions } from 'react-native';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFValue } from 'react-native-responsive-fontsize';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  bottomSheet: {
    height: screenHeight * 0.42,
    backgroundColor: '#F7FAFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    elevation: Platform.OS === 'ios' ? 5 : 10,
    shadowRadius: 5,
    shadowOpacity: 0.4,
    alignItems: 'center',
  },
  imgIcon: {
    width: RFValue(36),
    height: RFValue(36),
  },
  imgIcon1: {
    width: RFValue(20),
    height: RFValue(20),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000033",

  },
  modalView: {
    backgroundColor: "#fff",
    alignItems: "center",
    width: screenWidth - 20
  },
  openButton: {
    backgroundColor: "#fff",
    borderRadius: 100,
    // padding: 2,
    elevation: 2,
    position: 'absolute',
    top: 10,
    right: 10,
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  infoIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

});
