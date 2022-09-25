import React from 'react';
import {Container} from 'native-base';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import HomePage from '../HomeView';
import {saveWorkSpace} from '../../redux/actions/user';
import {ACCESS_TOKEN} from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import ImageView from 'react-native-image-viewing';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import NotificationsView from '../NotificationsView';
import PetProfile from './PetProfile';
import AddFooter from '../FooterBarView/AddFooter';
import styles from './styles';

class FooterBarView extends React.Component {
  modal = React.createRef();

  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      commented: 0,
      sendCommentLoading: false,
      imageDispaly: [{uri: ''}],
      isVisible: false,
      petDetail:'',
  
    };
  }

  componentDidMount() {
    var pet_details=this.props.navigation.getParam('item');
    this.setState({
      petDetail:pet_details
    })

  }
  componentWillReceiveProps(props) {}
  componentWillUnmount() {}

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }
  goBack = () => { this.props.navigation.pop() };

  switchScreen(index) { 
    this.props.navigation.navigate('FooterBarView')
  }
  
  onImageDataChange = imageDispaly => {
    this.setState({imageDispaly, isVisible: true});
  };


  render() {
    let AppComponent = null;
    if (this.state.index === 0) {
      AppComponent = HomePage;
    } else if (this.state.index === 1) {
      AppComponent = NotificationsView;
    } else if (this.state.index === 2) {
      AppComponent = HomePage;
    } else if (this.state.index === 3) {
      AppComponent = HomePage;
    } else if (this.state.index === 5) {
      AppComponent = HomePage;
    } else {
      AppComponent = HomePage;
    }

    const {
      index, 
      commented, 
      commentData,
       imageDispaly, 
       isVisible, 
       petDetail,
       } = this.state;
    return (
      <>
        {this.state.sendCommentLoading ? (
        <PlaceholderLoader />
        ) : null}
        

          <Container style={styles.container}>
            <PetProfile
              imageDispaly={imageDispaly}
              commentCount={commented}
              // commentOpen={this.onOpen}
              drawerOpen={this.openControlPanel}
              // onCommentDataChange={this.onCommentDataChange}
              onImageDataChange={this.onImageDataChange}
              petDetails={petDetail}
              navigation={this.props.navigation}
            />
            <AddFooter 
             index={ index } 
             switchScreen={(f) => this.switchScreen(f) } 
             navigation={this.props.navigation} 
             />
             
          </Container>

        <ImageView
          backgroundColor={'#000000'}
          animationType={'fade'}
          swipeToCloseEnabled={true}
          images={imageDispaly}
          presentationStyle="overFullScreen"
          visible={isVisible}
          onRequestClose={() => {
            this.setState({isVisible: false});
          }}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  workspace: state.user.workspace,
});

const mapDispatchToProps = dispatch => ({
  saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FooterBarView);
