import React from 'react';
import {StatusBar,Keyboard} from 'react-native';
import styles from './styles';
import {Container,} from 'native-base';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {userEdit, userSave, saveWorkSpace} from '../../redux/actions/user';

import PMPHeader from '../../components/common/PMPHeader';
import PixxyWorldView from '../PixxyWorldView';

class PixxyView extends React.Component {
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
      // isVisible: false,
      imageDispaly: this.props.imageDispaly,
      commentData: this.props.commentData,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {}

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
  openControlPanel = () => {
    Keyboard.dismiss();
    this.timeoutCheck = setTimeout(() => {
      this._drawer._root.open();
    }, 300);
  };
  render() {
    const {index, imageDispaly, commentData} = this.state;
    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        <PMPHeader
          centerText={'Pixxy'}
          // ImageLeftIcon={'menu'}
          LeftPress={() => this.props.drawerOpen()}
          // RightPress={() => this.props.navigation.navigate('SearchView')}
          ImageRightIcon={'search'}
        />
        <PixxyWorldView
          commentData={commentData}
          commentOpen={this.props.commentOpen}
          onCommentDataChange={this.props.onCommentDataChange}
          onImageDataChange={this.props.onImageDataChange}
          imageDispaly={imageDispaly}
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PixxyView);
