import React from 'react';
import {
  StyleSheet,
  Platform,
  Dimensions,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  Image,
  PixelRatio
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
// import styles from './styles';
import { Thumbnail, Container, Header, Content, Left } from 'native-base';
import { connect } from 'react-redux';
import { userEdit } from '../../redux/actions/user';

import {RFValue} from 'react-native-responsive-fontsize';
import {THEME_BOLD_FONT} from '../../constants/fontFamily';
class MainLogo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }

  render() {
    const { testImage, goBack, phone,text } = this.props
    var open = false
    if (phone) {
      if (phone.number!="") {
        var open = true

      }
    }
    return (
      <View style={{  width: '100%' }}>
        <ImageBackground source={require('./../../assets/images/updated/commonLogoBackrond.png')} style={styles.image}>
          <TouchableOpacity style={{ paddingTop: 20, paddingLeft: 20 }} onPress={() => { goBack() }}>
            <Image
              style={styles.logoback}
              source={require('./../../assets/images/updated/left-arrow.png')} />
          </TouchableOpacity>

          <View style={{ justifyContent: 'center', height: PixelRatio.getPixelSizeForLayoutSize(110) }}>
            <View style={styles.optionsContainerTop}>
              <View style={styles.optionsContainer}>
                <Image
                  style={[styles.logoBg, { resizeMode: 'cover' }]}
                  source={require('./../../assets/images/updated/commonLogo.png')}
                />
              </View>
              <View style={styles.optionsContainerText}>
                <Image
                  style={[styles.logoBgText, { resizeMode: 'contain' }]}
                  source={testImage}
                />
              </View>

            </View>
            {open && <View style={{ margin: 12, justifyContent: 'center' }}>
              <Text style={{ textAlign: 'center' }}>Verification code has been sent to your mobile number +{phone.callingCode + " " + phone.number}</Text>

            </View>}
            {text && <View style={{ margin: 12,marginTop: 5, justifyContent: 'center' }}>
              <Text style={styles.subText}>{this.props.text}</Text>

            </View>}
          </View>
        </ImageBackground>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  optionsContainerTop: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',

  },

  subText: {
    // color: TEXT_LIGHT,
    fontSize: RFValue(16),
    fontFamily: THEME_BOLD_FONT,
    textAlign: 'center',
    paddingHorizontal: RFValue(15),
    fontWeight: '600',
  },
  logoback: {
    width: PixelRatio.getPixelSizeForLayoutSize(3),
    height: PixelRatio.getPixelSizeForLayoutSize(7),
  },
  optionsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  image: {
    width: '100%',
    height: PixelRatio.getPixelSizeForLayoutSize(110),
  },
  optionsContainerText: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20
  },
  logoBg: {
    width: PixelRatio.getPixelSizeForLayoutSize(40),
    height: PixelRatio.getPixelSizeForLayoutSize(25),
    // resizeMode: 'contain',
  },
  logoBgText: {
    width: PixelRatio.getPixelSizeForLayoutSize(50),
    height: PixelRatio.getPixelSizeForLayoutSize(11),
  }
});

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  loginEdit: user => dispatch(userEdit(user)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainLogo);
