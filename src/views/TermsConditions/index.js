import React, {Component,createRef} from 'react';
// import {} from 'react-native';
import styles from './styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {View} from 'react-native'
import {
  Thumbnail,
  Container,
} from 'native-base';
import { connect } from 'react-redux';
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import { WebView } from 'react-native-webview';
import { SERVER } from '../../constants/server';
import PMPHeader from '../../components/common/PMPHeader';
import CustomLoader from '../../components/common/CustomLoader';
import { color } from 'react-native-reanimated';

class TermsConditions extends Component {
 
  constructor(props){
    super(props)
    this.setState={} 

    this.webviewRef = createRef()
  }

  goBack = () => { this.props.navigation.pop()};

  render() {
    
    return (
      <Container style={styles.container}>
       <PMPHeader
          ImageLeftIcon={true}
          LeftPress={() => this.goBack()}
          centerText={'Terms & Conditions'}
          longWidth={true}
          headerStyle={{backgroundColor:'#fff'}}
        />

          <WebView
              useWebKit={true}
              source={{uri: `${SERVER}/terms/terms`}}
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
              renderLoading={() => (
               <CustomLoader/>
              )
              
             }
              ref={this.webviewRef}
              onNavigationStateChange={(navState) => {
                  // this.setState({canGoBack:navState.canGoBack})
                // console.log('navigation state change ' ,navState.canGoBack)
            }}
      />
    
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  workspace: state.user.workspace,
});

const mapDispatchToProps = dispatch => ({
  saveLoginUser: user => dispatch(userEdit(user)),
  saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TermsConditions);
