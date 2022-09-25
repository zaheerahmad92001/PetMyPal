import React from 'react';
import {Keyboard,} from 'react-native';
import {Container,} from 'native-base';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {userEdit, userSave, saveWorkSpace} from '../../redux/actions/user';

import PetOwnerView from '../PetOwnerView';

import PMPHeader from '../../components/common/PMPHeader';

import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import {ACCESS_TOKEN} from '../../constants/storageKeys';



class HomeView extends React.Component {
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
      imageDispaly: this.props.imageDispaly,
      commentData: this.props.commentData,
      token:'',
      user_id:'',
      pets: [],
      loadingPets:false,
    };
  }

  componentDidMount() {}

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  componentWillUnmount() {
    console.log('will unmount Home')
  }

  componentWillReceiveProps(props) {

    this.setState({
      commentData: props.commentData,
      imageDispaly: props.imageDispaly,
    });
  }

  goBack = () => {
    this.props.navigation.pop();
  };

  switchScreen(index) {
    this.setState({index: index});
  }

  closeControlPanel = () => {
    this._drawer.close();
  };


  openControlPanel = () => {
    this._drawer.open();
  };


  closeControlPanel = () => {
    this._drawer._root.close();
  };

  handleHashTag =()=>{
    this.props.navigation.navigate('Trends')
  }


  openControlPanel = () => {
    Keyboard.dismiss();
    this.timeoutCheck = setTimeout(() => {
      this._drawer._root.open();
    }, 300);
  };




  render() {
    const {index, imageDispaly, commentData , pets} = this.state;

    return (
      <Container>
        <PMPHeader
          appLogo={true}
          //  menuImg={menuImg}
           menuImg={true}
          LeftPress={() => this.props.drawerOpen()}
          RightPress={() => this.props.navigation.navigate('SearchView')}
          ImageRightIcon={'search'}
          HashTagIcon={'hashtag'}
          HashTagIconType={'Fontisto'}
          // hashtag={hashtag}
          HashTagPress={()=>this.handleHashTag()}
        />
       
     <PetOwnerView
          commentCount={this.props.commentCount}
          // commentData={commentData}     // zaheer ahmad remove it
          // commentOpen={this.props.commentOpen}   // zaheer ahmad remove it
          // onCommentDataChange={this.props.onCommentDataChange}  // zaheer ahmad remove it
          onImageDataChange={this.props.onImageDataChange}
          imageDispaly={imageDispaly}
          navigation={this.props.navigation}
          petsData = {pets}
          
        />
  
      </Container>
    );
  }
}

const mapStateToProps = state => ({user: state.user.user,});
const mapDispatchToProps = dispatch => ({saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),});
export default connect( mapStateToProps,mapDispatchToProps,)(HomeView);
