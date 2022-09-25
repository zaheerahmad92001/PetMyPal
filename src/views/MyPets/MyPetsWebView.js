import React,{Component,createRef} from 'react';
import {StyleSheet,Dimensions ,ActivityIndicator , View} from 'react-native';
import {WebView} from 'react-native-webview';
import {BG_DARK,HEADER,TEXT_LIGHT, White,} from '../../constants/colors';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PMPHeader from '../../components/common/PMPHeader';
import {connect} from 'react-redux';
import CustomLoader from '../../components/common/CustomLoader';

const window = Dimensions.get('window');
export class MyPets extends React.Component {

  constructor(props){
    super(props)
    this.state={}
    this.webviewRef = createRef()

  }

  goBack = () => {this.props.navigation.pop();}
  IndicatorLoadingView (){
    return(
      <View
      style={styles.IndicatorStyle}
      >
    <CustomLoader/>
    </View>
    )
    
  }
  // IndicatorLoadingView() {
  //   return (
  //     <ActivityIndicator
  //       color="#3235fd"
  //       size="large"
  //       style={styles.IndicatorStyle}
  //     />
  //   );
  // }

  render() {
    return (
      <View style={{flex:1,backgroundColor:White}}>

        <PMPHeader
          centerText={'My Pet ID'}
          ImageLeftIcon={'arrow-back'}
          // RightText={'Add Pet'}
          LeftPress={() => this.goBack()}
          // RightPress={() => this.props.navigation.navigate('PetAddView')}
        />

        <WebView
          style={{flex: 1, width: '100%'}}
          useWebKit={true}
          source={{uri: ""+ this?.props?.navigation?.state?.params?.url}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          originWhitelist={['http://*', 'https://*', 'intent://*']}
          scalesPageToFit={true}
          startInLoadingState={true}
          mixedContentMode={"always"}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={true}
          allowsBackForwardNavigationGestures={true}
          allowsLinkPreview={false}
          renderLoading={this.IndicatorLoadingView}
          ref={this.webviewRef}
          onNavigationStateChange={(navState) => {
            // this.setState({canGoBack:navState.canGoBack})
            // console.log('navigation state change ' ,navState.canGoBack)
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  // choosePetContainer: {
  //   width: window.width * 0.8,
  //   alignSelf: 'center',
  //   marginBottom: 30,
  //   marginTop: 0,
  // },
  // optionContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   alignSelf: 'center',
  //   justifyContent: 'center',
  //   alignContent: 'center',
  //   alignItems: 'center',
  // },
  // option: {
  //   paddingBottom: 8,
  //   marginHorizontal: hp(3),
  //   flex: 1,
  //   paddingTop: 6,
  //   borderBottomWidth: 0.5,
  //   borderBottomColor: '#acb3c0',
  //   flexDirection: 'row',
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
  //   color: '#000',
  // },
  // selectedOption: {
  //   backgroundColor: HEADER,
  // },
  // petImage: {
  //   width: window.width * 0.8 * 0.25 * 0.8 * 0.65,
  //   height: window.width * 0.8 * 0.25 * 0.8 * 0.65,
  //   resizeMode: 'contain',
  //   // tintColor: 'white',
  // },
  // extraMargin: {
  //   marginBottom: 10,
  // },
  // basicDetailsForm: {
  //   width: window.width * 0.8,
  //   alignSelf: 'center',
  //   marginBottom: 30,
  //   marginTop: 16,
  // },
  // chosenPet: {
  //   justifyContent: 'space-around',
  //   marginVertical: 10,
  //   // flexDirection: 'row',
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
  //   tintColor: 'white',
  // },
  // changePetText: {
  //   fontSize: 16,
  //   color: TEXT_LIGHT,
  //   textDecorationLine: 'underline',
  //   textDecorationColor: TEXT_LIGHT,
  // },
  IndicatorStyle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }

});
const mapStateToProps = state => {
  return {
    mypets: state.mypets ? state.mypets.pets : [],
  };
};
export default connect(mapStateToProps)(MyPets);
