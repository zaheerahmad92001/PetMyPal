import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import styles from './styles';
import {
  Container,
  Content,
  Left,
  Right,
  Icon,
} from 'native-base';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {userEdit} from '../../redux/actions/user';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {HEADER} from '../../constants/colors';
import LogoTopRight from '../../components/commonComponents/logoTopRight';
import FullPageBackground from '../../components/commonComponents/fullPageBackground';

class SignupView extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  goBack = () => {
    this.props.navigation.pop();
  };

  render() {
    return (
      <Container style={styles.container}>
        <FullPageBackground
          image={require('../../assets/images/authBackground.png')}>
          <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />

          <Content contentContainerStyle={{flex: 1}}>
            <LogoTopRight image={require('../../assets/images/logo.png')} />
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                paddingBottom: RFValue(40),
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: RFValue(24 - 2),
                  
                  fontWeight: 'bold',
                  textAlign: 'center',
                  paddingHorizontal: RFValue(20),
                }}>
                Share your pet life with Pals
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: RFValue(16 - 2),
                  
                  textAlign: 'center',
                  paddingHorizontal: RFValue(15),
                }}>
                Sharing pet stories wa not that easy. Just create an account and
                use it like other social media sites
              </Text>
              <View
                style={{
                  flex: 0.35,
                  paddingTop: RFValue(20),
                  paddingHorizontal: RFValue(40),
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: HEADER,
                    marginVertical: RFValue(5),
                    borderRadius: RFValue(20),
                    flexDirection: 'row',
                  }}>
                  <Left
                    style={{flex: 0.1, alignItems: 'center', paddingLeft: 20}}>
                    <Icon
                      style={{color: 'blue', fontSize: RFValue(35 - 2)}}
                      color={'blue'}
                      name="logo-facebook"
                    />
                  </Left>
                  <Right
                    style={{flex: 0.9, alignItems: 'center', marginLeft: -20}}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: RFValue(18 - 2),
                        
                        padding: RFValue(10),
                      }}>
                      Connect with facebook
                    </Text>
                  </Right>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: 'white',
                    marginVertical: RFValue(5),
                    borderRadius: RFValue(20),
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Left
                    style={{flex: 0.1, alignItems: 'center', paddingLeft: 25}}>
                    <Icon
                      style={{color: 'red', fontSize: RFValue(30 - 2)}}
                      name="logo-googleplus"
                    />
                  </Left>
                  <Right
                    style={{flex: 0.9, alignItems: 'center', marginLeft: -20}}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: RFValue(18 - 2),
                        
                        textAlign: 'center',
                        padding: RFValue(10),
                      }}>
                      Connect with gmail
                    </Text>
                  </Right>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('SignupConnectView');
                  }}
                  style={{
                    backgroundColor: HEADER,
                    marginVertical: RFValue(5),
                    borderRadius: RFValue(20),
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Left
                    style={{flex: 0.1, alignItems: 'center', paddingLeft: 25}}>
                    <Icon
                      type="MaterialIcons"
                      style={{fontSize: RFValue(35 - 2), color: '#EEC937'}}
                      name="email"
                    />
                  </Left>
                  <Right
                    style={{flex: 0.9, alignItems: 'center', marginLeft: -20}}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: RFValue(18 - 2),
                        
                        textAlign: 'center',
                        padding: RFValue(10),
                      }}>
                      Connect with email
                    </Text>
                  </Right>
                </TouchableOpacity>
              </View>
            </View>
          </Content>
        </FullPageBackground>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  loginEdit: user => dispatch(userEdit(user)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupView);
