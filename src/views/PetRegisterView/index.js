import React from 'react';
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  ImageBackground,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {THEME_BOLD_FONT} from '../../constants/fontFamily';
import {HEADER} from '../../constants/colors';
class AuthView extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {}

  render() {
    return (
      <ImageBackground
        source={require('../../assets/images/authBackground.png')}
        resizeMode="cover"
        style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />

        <View style={{flex: 1}}>
          <Image
            style={{
              alignSelf: 'flex-end',
              marginTop: RFValue(20),
              marginRight: RFValue(15),
            }}
            source={require('../../assets/images/logo.png')}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: RFValue(80),
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: RFValue(22),
                fontFamily: THEME_BOLD_FONT,
                fontWeight: 'bold',
                textAlign: 'center',
                paddingHorizontal: RFValue(20),
              }}>
              Share your pet life with Pals
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: RFValue(14),
                fontFamily: THEME_BOLD_FONT,
                textAlign: 'center',
                paddingHorizontal: RFValue(15),
              }}>
              Sharing pet stories wa not that easy. Just create an account and
              use it like other social media sites
            </Text>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: RFValue(20),
                paddingHorizontal: RFValue(20),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('PetRegisterStepsView');
                }}
                style={{
                  flex: 1,
                  backgroundColor: HEADER,
                  padding: RFValue(10),
                  borderRadius: RFValue(20),
                  marginHorizontal: RFValue(5),
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: RFValue(16),
                    fontFamily: THEME_BOLD_FONT,
                    textAlign: 'center',
                    paddingHorizontal: RFValue(15),
                  }}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

const mapStateToProps = state => ({
  root: state.app.root,
});

const mapDispatchToProps = dispatch => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthView);
