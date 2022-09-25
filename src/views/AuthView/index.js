import React, { Component } from 'react';
import { StatusBar, Image, View , Text ,Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from './styles'
import MediumText from '../../components/common/MediumText';
import SmallText from '../../components/common/SmallText';
import { authText } from '../../constants/ConstantValues'
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import WhiteBtn from '../../components/common/WhiteBtn';
import {commonLogo}from '../../constants/ConstantValues'
import { Container, Content } from 'native-base';
import { darkSky } from '../../constants/colors';
import { THEME_FONT } from '../../constants/fontFamily';
// import RNOtpVerify from 'react-native-otp-verify';

class AuthView extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  // getHash = () =>
  // RNOtpVerify.getHash()
  //   .then((hash)=>{
  //     console.log('Hash value',hash)
  //   })
  //   .catch(console.log);

// startListeningForOtp = () =>
//   RNOtpVerify.getOtp()
//     .then((p) => {
//       console.log('Listner is active',p)
//       RNOtpVerify.addListener(this.otpHandler)
//     })
//     .catch(p => console.log(p));

// otpHandler = message => {
//   console.log('the message is : ', message);
  
// };


// componentDidMount() {
// if (Platform.OS === 'android') {
//     this.getHash();
//     this.startListeningForOtp();
// }
// }
// componentDidUpdate(){
//   console.log('componentDidUpdate')
// }

// componentWillUnmount() {
//   RNOtpVerify.removeListener();
  
// }





  render() {
    return (
      <Container style={styles.wraper}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        <Content>
        <Image
            style={[styles.petsLogo]} 
            resizeMode={'contain'}
            source={commonLogo}
          />

        <View style={styles.logoContainer}>
          <Image
            style={[styles.logoBg]}
            resizeMode={'contain'}
            source={require('../../assets/images/updated/intro.png')}
          />
        </View>


        <View style={styles.headingView}>
          <Text style={styles.heading}>PetMyPal</Text>
          <Text style={styles.sub_heading}>Where Pet Lovers Hangout!</Text>
          <Text style={styles.textStyle}>The
          <Text style={[{color:darkSky,fontSize:13,fontFamily:THEME_FONT}]}> free</Text>
          <Text style={styles.textStyle}>{authText}</Text>
          </Text>
        </View>


        <View style={styles.btnContainer}>
        <WhiteBtn
            title={'Take a Tour of PetMyPal'}
            onPress={() => {
              this.props.navigation.navigate('AppIntro');
            }}
            titleStyle={styles.titleStyle} 
            btnContainerStyle={styles.petmypalBtn}
            />
          <SkyBlueBtn
            title={'Sign In'}
            onPress={() => {
              this.props.navigation.navigate('LoginMethod');
            }}/>

          <WhiteBtn
            title={'Sign Up'}
            onPress={() => {
              this.props.navigation.navigate('ChoosePet');
              // this.props.navigation.navigate('UserDetails');

            }} 
            btnContainerStyle={{marginTop:20}}
            />

        </View>
        </Content>
      </Container>


    );
  }
}



const mapStateToProps = state => ({
  root: state.app.root,
});

const mapDispatchToProps = dispatch => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthView);
