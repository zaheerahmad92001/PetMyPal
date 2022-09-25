import React from 'react';
import {View, Text, StatusBar, FlatList, Dimensions} from 'react-native';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import styles from './styles';
import {Container, Icon, Left, Body, ListItem, Right} from 'native-base';
import {connect} from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PropTypes from 'prop-types';
import {saveWorkSpace} from '../../redux/actions/user';
import PMPHeader from '../../components/common/PMPHeader';
import {RFValue} from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import {getAllMessages} from '../../services/index';
import {chatList} from '../../redux/actions/messages';
import NothingSvg from '../../assets/Pixxy/noPixxy.svg';
import moment from 'moment';


class Messages extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  renderItem = ({item, index}) => {
    // console.log('item.last_message.time_text',item)
    let msgTime = ''
    if(moment.unix(item?.last_message?.time).fromNow().includes('minutes')){
     msgTime =  moment.unix(item?.last_message?.time).fromNow().replace('minutes','min')
    }else if(moment.unix(item?.last_message?.time).fromNow().includes('a minute ago')){
     msgTime =  '1 min ago'
    }else if(moment.unix(item?.last_message?.time).fromNow().includes('seconds')){
      msgTime = 'just now'
    }else {
      msgTime =  moment.unix(item?.last_message?.time).fromNow()
    }
    return (
      <View
      key={index}
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          justifyContent:'center',
          marginTop: RFValue(5),
          marginBottom: RFValue(5),
        }}>
        <ListItem
          noBorder
          avatar
          onPress={() =>
            this.props.navigation.navigate({
              routeName: 'Chat',
              key: 'Chat',
              params: {userId: item.user_id, avatar: item.avatar,  chatName: item?.first_name},
            })
          }>
          <Left style={{justifyContent: 'center'}}>
          {item.avatar.includes('https://') && <FastImage
              style={{
                alignSelf: 'center',
                backgroundColor: 'black',
                width: RFValue(45),
                height: RFValue(45),
                borderRadius:8,
                // borderRadius: RFValue(45) / 2,
              }}
              source={{uri: ""+ item.avatar}}
            />}
          </Left>
          <Body>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.eNameText} numberOfLines={1} note>
                {item?.full_name}
              </Text>
            </View>
            <Text numberOfLines={2} style={styles.eContentText} note>
              {item?.last_message?.text?item?.last_message?.text:'...' }
            </Text>
          </Body>
          <Right>
            <Text style={styles.timeText} numberOfLines={1} note>
              {/* {moment.unix(item?.last_message?.time).fromNow()} */}
              {item.last_message.time_text}
            </Text>
            { item?.count > 0 && <Text style={{backgroundColor: '#f596a0', borderRadius: 12, paddingVertical: 2, paddingHorizontal: 8, marginRight: 12}} numberOfLines={1} note>
              {item.count > 0 && item.count}
            </Text>}
          </Right>
        </ListItem>
      </View>
    );
  };
  componentDidMount() {
    this.setState({loading: true});
    getAllMessages(messageList => {
      this.setState({loading: false});
      if (messageList.length > 0) {
        this.props.chatList(messageList);
      }
    });
  }
  render() {
    const {loading} = this.state;
    return (
      <Container style={styles.container}>
        <StatusBar
          backgroundColor={'white'}
          barStyle={'dark-content'}
          translucent={false}
        />
        <PMPHeader 
        LeftPress={this.props.drawerOpen} 
        centerText={'Conversation'} 
        />
        {loading ? (
          <PlaceholderLoader />
        ):this.props.listChat?.length>0? (
          <FlatList
            disableVirtualization={true}
            ref={ref => {
              this.flatList = ref;
            }}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
            scrollEnabled={true}
            horizontal={false}
            data={this.props.listChat}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            style={{marginVertical: RFValue(5)}}
          />
        ): 
          <View style={styles.nothingSVG}><NothingSvg/></View>
      }
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  listChat: state.messages.chatList,
  chatListlUnread: state.messages.chatListlUnread,
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  chatList: payload => dispatch(chatList(payload)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Messages);
