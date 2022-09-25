import React, {Component} from 'react';
import {View, StyleSheet, Text, ImageBackground} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import YouTube from 'react-native-youtube';
import {youtube_key} from '../../constants/server';
import {
  text1Pmp,
  text2Pmp,
  text3Pmp,
  text4Pmp,
} from '../../constants/ConstantValues';
import PMPHeader from '../../components/common/PMPHeader';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import {black, White} from '../../constants/colors';
import styles from './styles';
import {ScrollView} from 'react-native-gesture-handler';

class PmpTour extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tourModal: false,
      isReady: false,
      vHeight: 300,
      quality: false,
    };
    this.youtubeRef = React.createRef();
  }

  onYoutubeError = e => {
    console.log('on youtube error', e.error);
  };
  onVideoStateChange = e => {
    console.log('on video state chanage', e.state);
  };
  handleOnReady = e => {
    console.log('handle on ready state');
    this.setState({isReady: true, vHeight: 300});
  };

  render() {
    const {
      upDown,
      panelProps,
      tourModal,
      vHeight,
      quality,
      isReady,
    } = this.state;

    return (
      <ImageBackground
        source={require('../../assets/images/pmpBG.jpg')}
        style={{width: '100%', height: '100%'}}>
        <PMPHeader
          appLogo={true}
          pmplogoStyle={{tintColor: White}}
          ImageLeftIcon={true}
          backArrowColor={White}
          LeftPress={() => this.props.navigation.goBack()}
          HashTagPress={() => this.handleHashTag()}
        />
        <ScrollView>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                marginHorizontal: 25,
                marginTop: hp(1.5),
              }}>
              <YouTube
                videoId="7bb0HV0rmYw"
                ref={this.youtubeRef}
                play={true}
                fullscreen={false}
                controls={1}
                loop={false} // control whether the video should loop when ended
                showinfo={false}
                apiKey={youtube_key}
                onReady={this.handleOnReady}
                onChangeState={this.onVideoStateChange}
                onChangeQuality={e => this.setState({quality: e.quality})}
                onError={this.onYoutubeError}
                // style={{ alignSelf: 'stretch', height: vHeight, width: wp(100)}}
                style={{height: wp(60), width: wp(90)}}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Where Pet Lovers</Text>
              <Text style={styles.text}>Hangout!</Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}>
              <Text style={[styles.textStyle, {marginTop: hp(2)}]}>
                {text1Pmp}
              </Text>
              <Text style={styles.textStyle}>{text2Pmp}</Text>
              <Text style={styles.textStyle}>{text3Pmp}</Text>
              <Text style={styles.textStyle}>{text4Pmp}</Text>
            </View>
            <SkyBlueBtn
              title={'Skip'}
              titleStyle={{color: black}}
              onPress={() => this.props.navigation.goBack()}
              btnContainerStyle={styles.btnContainerStyle}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
``;
export default PmpTour;
