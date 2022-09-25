import {Icon} from 'native-base';
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  black,
  DANGER,
  darkSky,
  grey,
  HEADER,
  PINK,
  White,
} from '../../constants/colors';
import {labelFont, mediumText, textInputFont} from '../../constants/fontSize';
import {Platform} from 'react-native';
import HTML from 'react-native-render-html';

const imgMarginBottom = 45;
const imgHeight = 90;
const imgWidth = 90;
const topMargin = 15;
const horizontalPadding = 25;

const DecriptionModel = props => {
  const {about, isVisible,onCancelBtnPress} = props;
  return (
    <Modal
      isVisible={isVisible}
      useNativeDriver={true}
      style={(styles.modalStyling, {marginBottom: 0})}>
      <View style={styles.modalStyling}>
        <View>
          <View style={styles.contentStyling}>
            <ScrollView>
              <HTML baseFontStyle={styles.aboutText} html={about} />
            </ScrollView>
          </View>

          <View style={styles.btnWraper}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={onCancelBtnPress}
              style={[styles.OkbtnView]}>
              <View style={styles.btnWithIcon}>
                <Text style={styles.okBtnStyle}>Ok</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default DecriptionModel;

const styles = StyleSheet.create({
  modalStyling: {
    backgroundColor: White,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    marginHorizontal: 25,
  },

  header: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingTop: 20,
    paddingBottom: 10,
  },
  contentStyling: {
    paddingVertical: topMargin,
    paddingHorizontal: horizontalPadding,
    height: 200,
  },

  textStyle: {
    color: black,
    fontSize: labelFont,
    textAlign: 'center',
  },
  imgStyle: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  errorText: {
    color: White,
    fontSize: 20,
    // fontWeight:'bold'
  },
  OkbtnView: {
    width: '50%',
    borderBottomEndRadius: 20,
    backgroundColor: PINK,
    marginTop: 3,
  },
  OkbtnView: {
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomEndRadius: 20,
    backgroundColor: darkSky,
    marginTop: 3,
  },
  btnWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 10,
    paddingVertical: Platform.OS == 'android' ? 10 : 13,
  },
  okBtnStyle: {
    fontSize: mediumText,
    fontWeight: '600',
    color: White,
  },
  btnWraper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    // marginHorizontal: 25,

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconsStyle: {
    color: White,
    fontSize: 18,
  },
  loaderStyle: {
    width: wp(35),
    alignItems: 'center',
    zIndex: 1,
  },
  nameStyle: {
    color: black,
    fontSize: labelFont,
    marginTop: 5,
    marginBottom: 10,
  },
  imgContainer: {
    width: imgWidth,
    height: 30,
    borderRadius: imgHeight / 2,
    alignItems: 'center',
    alignSelf: 'center',
    bottom: imgMarginBottom,
  },
  imgStyle: {
    width: imgWidth,
    height: imgHeight,
  },
  avatarStyle: {
    width: null,
    height: null,
    flex: 1,
  },
  textContainer: {
    paddingHorizontal: horizontalPadding,
  },
});
