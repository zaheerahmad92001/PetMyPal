import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  Image,
  TextInput,
  Keyboard,
  FlatList,
} from 'react-native';
import styles from './styles';
import {
  Container,
  Button,
  Icon,
  Drawer,
  Left,
  Body,
  Right,
  ListItem,
  Card,
} from 'native-base';
import { connect } from 'react-redux';
import { HEADER } from '../../constants/colors';
import PropTypes from 'prop-types';
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import PMPHeader from '../../components/common/PMPHeader';
import { RFValue } from 'react-native-responsive-fontsize';
import { sendMessage } from '../../services/index';
import { GiftedChat } from 'react-native-gifted-chat'
 
class ChatView extends React.Component {
  state = {
    messages: [],
  }
 
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }
 
  onSend(messages = []) {
    sendMessage(265,'message')
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }
 
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
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
)(ChatView);
