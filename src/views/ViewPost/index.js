import React from 'react';
import styles from './styles';
import {
  Container,
  Icon,
  Drawer,
  Thumbnail,
} from 'native-base';
import {connect} from 'react-redux';
import {
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ToastAndroid,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {HEADER} from '../../constants/colors';
import PropTypes from 'prop-types';
import {userEdit, userSave, saveWorkSpace} from '../../redux/actions/user';
import {savePostId} from '../../redux/actions/post';

import ControlPanel from '../../presentation/ControlPanel';
import {RFValue} from 'react-native-responsive-fontsize';
import {Modalize} from 'react-native-modalize';
import {THEME_FONT} from '../../constants/fontFamily';
import {ACCESS_TOKEN} from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import {server_key, SERVER} from '../../constants/server';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import ViewPost from './ViewPost';
import {postTimeAndReaction} from '../../utils/DateFuncs';
import {commonState} from '../../components/common/CommomState';
import CustomLoader from '../../components/common/CustomLoader';


class Index extends React.Component {
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
      showModal: false,
      commentData: [],
      post: null,
      refresh: false,
      userProfilePic:
        this.props.user === null ? 'no pic' : this?.props?.user?.user_data.avatar,
      loading: false,
      commentText: '',
      disabled: false,
      commented: 0,
      sendCommentLoading: false,
      months: commonState.months,
      postId: '',
      reaction: commonState.reaction,
      imageDispaly: [{uri: ''}],
      isVisible: false,
    };
  }

  componentDidMount() {
    this.props.savePostId(this.props.navigation.getParam('postId'));
    this.setState({
      postId: this.props.navigation.getParam('postId'),
    });
  }
  componentWillReceiveProps(props) {
    this.props.savePostId(this.props.navigation.getParam('postId'));
    this.setState({
      postId: this.props.navigation.getParam('postId'),
    });
  }
  componentWillUnmount() {}

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  goBack = () => {
    this.props.navigation.pop();
  };

  switchScreen(index) {
    // this.setState({index: index});
    this.props.navigation.navigate({
      routeName: 'FooterBarView',
      key: 'FooterBarView',
    });
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

  showToast = msg => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  onOpen = () => {
    this.requestHandlerFetchPostComment();

    const modal = this.modal.current;

    if (modal) {
      this.setState({showModal: true, commented: 0});
      modal.open();
    }
  };
  closeModal = () => {
    // this.props.saveWorkSpace({ show: true });

    this.setState({showModal: false});

    setTimeout(() => {
      if (this.modal.current) {
        this.modal.current.close();
      }
    }, 500);
  };

  async requestHandlerFetchPostComment() {
    this.setState({loading: true});
    this.getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', 'fetch_comments');
      data.append('post_id', this.props.navigation.getParam('postId'));
      data.append('sort', 'desc');

      try {
        const response = await fetch(
          SERVER +
            '/api/comments?access_token=' +
            JSON.parse(token).access_token,
          {
            method: 'POST',
            body: data,
            headers: {},
          },
        );
      } catch (error) {
        console.log(error);
      }
    });
  }

  async requestHandlerCreateComment() {
    const scope = this;
    scope.setState({disabled: false, sendCommentLoading: true});

    this.getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', 'create');
      data.append('post_id', this.state.postId);
      data.append('text', this.state.commentText);
      try {
        let commentData = scope.state.commentData;
        const response = await fetch(
          SERVER +
            '/api/comments?access_token=' +
            JSON.parse(token).access_token,
          {
            method: 'POST',
            body: data,
            headers: {},
          },
        );
        const responseJson = await response.json();
        if (responseJson.api_status === 200) {
          commentData = commentData.concat(responseJson.data);
          scope.setState({
            commentData,
            disabled: false,
            commentText: '',
            sendCommentLoading: false,
          });
          this.showToast('Comment has been posted');
          this.closeModal();
        } else {
          scope.setState(
            {
              commentData,
              disabled: true,
              sendCommentLoading: false,
              commentText: '',
            },
            () => {},
            // scope.flatList.scrollToEnd({animated: true}),
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  async requestHandlerReactionComment(reaction, comment) {
    this.getAccessToken().then(async token => {

      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', 'reaction_comment');
      data.append('comment_id', comment.id);
      data.append('reaction', reaction);

      try {
        const response = await fetch(
          SERVER +
            '/api/comments?access_token=' +
            JSON.parse(token).access_token,
          {
            method: 'POST',
            body: data,
            headers: {},
          },
        );
      } catch (error) {
        console.log(error);
      }
    });
  }

  reactions = (item, index) => {
    const {commentData} = this.state;
    const scope = this;
    setTimeout(function() {
      (commentData[index].reactionVisible = false),
        scope.setState({commentData});
    }, 4000);

    return (
      <View
        style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity
          onPress={() => {
            commentData[index].reaction.is_reacted
              ? (commentData[index].reaction.count =
                  commentData[index].reaction.count)
              : (commentData[index].reaction.count =
                  commentData[index].reaction.count + 1);
            commentData[index].reactionVisible = false;
            commentData[index].reaction.type = 'Like';
            commentData[index].reaction.is_reacted = true;
            this.setState({commentData}, () =>
              this.requestHandlerReactionComment(item.reaction.type, item),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/like.gif',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            commentData[index].reaction.is_reacted
              ? (commentData[index].reaction.count =
                  commentData[index].reaction.count)
              : (commentData[index].reaction.count =
                  commentData[index].reaction.count + 1);
            commentData[index].reactionVisible = false;
            commentData[index].reaction.type = 'Love';
            commentData[index].reaction.is_reacted = true;
            this.setState({commentData}, () =>
              this.requestHandlerReactionComment(item.reaction.type, item),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/love.gif',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            commentData[index].reaction.is_reacted
              ? (commentData[index].reaction.count =
                  commentData[index].reaction.count)
              : (commentData[index].reaction.count =
                  commentData[index].reaction.count + 1);
            commentData[index].reactionVisible = false;
            commentData[index].reaction.type = 'HaHa';
            commentData[index].reaction.is_reacted = true;
            this.setState({commentData}, () =>
              this.requestHandlerReactionComment(item.reaction.type, item),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/haha.gif',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            commentData[index].reaction.is_reacted
              ? (commentData[index].reaction.count =
                  commentData[index].reaction.count)
              : (commentData[index].reaction.count =
                  commentData[index].reaction.count + 1);
            commentData[index].reactionVisible = false;
            commentData[index].reaction.type = 'Wow';
            commentData[index].reaction.is_reacted = true;
            this.setState({commentData}, () =>
              this.requestHandlerReactionComment(item.reaction.type, item),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/wow.gif',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            commentData[index].reaction.is_reacted
              ? (commentData[index].reaction.count =
                  commentData[index].reaction.count)
              : (commentData[index].reaction.count =
                  commentData[index].reaction.count + 1);
            commentData[index].reactionVisible = false;
            commentData[index].reaction.type = 'Sad';
            commentData[index].reaction.is_reacted = true;
            this.setState({commentData}, () =>
              this.requestHandlerReactionComment(item.reaction.type, item),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/sad.gif',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            commentData[index].reaction.is_reacted
              ? (commentData[index].reaction.count =
                  commentData[index].reaction.count)
              : (commentData[index].reaction.count =
                  commentData[index].reaction.count + 1);
            commentData[index].reactionVisible = false;
            commentData[index].reaction.type = 'Angry';
            commentData[index].reaction.is_reacted = true;
            this.setState({commentData}, () =>
              this.requestHandlerReactionComment(item.reaction.type, item),
            );
          }}>
          <FastImage
            style={styles.imgIcon}
            source={{
              uri:
                'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/angry.gif',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  renderItem = ({ item, index }) => {
    const { commentData, reaction, months } = this.state;
    let { time } = postTimeAndReaction(item.time);
    return (
      <View style={{ marginVertical: RFValue(10) }}  key={index} >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Thumbnail
            // small
            square
            source={{ uri: item.publisher.avatar ? item.publisher.avatar : '' }}
            style={{
              backgroundColor: '#F2F2F2',
              borderRadius: wp(3),
            }}
          />
          <View style={{ backgroundColor: '#F0F1F4', flex: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, marginLeft: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <Text style={{ fontWeight: 'bold' }}>{item.publisher.first_name}</Text>
              <Text style={{ color: '#8B94A9' }}>{time}</Text>
            </View>
            <Text style={{ marginHorizontal: 2, color: '#465575', fontSize: 13 }}>{item.text}</Text>

          </View>
        </View>
        {item.reactionVisible ? this.reactions(item, index) : null}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingLeft: RFValue(50),
            paddingTop: RFValue(5),
            marginLeft: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: RFValue(10),
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={
                item.reaction.is_reacted
                  ? () => {
                    item.reaction.is_reacted = false;
                    item.reaction.count = item.reaction.count - 1;
                    item.reaction.type = '';
                    this.setState({ commentData }, () =>
                      this.requestHandlerReactionComment('', item),
                    );
                  }
                  : () => {
                    item.reaction.count = item.reaction.count + 1;
                    item.reaction.type = 'Like';
                    item.reaction.is_reacted = true;
                    this.setState({ commentData }, () =>
                      this.requestHandlerReactionComment('Like', item),
                    );
                  }
              }
              onLongPress={() => {
                (commentData[index].reactionVisible = true),
                  this.setState({ commentData });
              }}
              style={{ flexDirection: 'row' }}>
              <Icon
                name="hearto"
                type="AntDesign"
                style={{ fontSize: RFValue(16) }}
              />
              <Text
                style={{
                  fontFamily: THEME_FONT,
                  fontSize: RFValue(12),
                  alignSelf: 'flex-start',
                  paddingHorizontal: RFValue(10),
                }}>
                {' ' + item.reaction.count}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: RFValue(10),
              alignItems: 'center',
            }}>
            <TouchableOpacity style={{ flexDirection: 'row' }}>
              <Icon
                name="message-outline"
                type="MaterialCommunityIcons"
                style={{ fontSize: RFValue(16) }}
              />
              <Text
                style={{
                  fontFamily: THEME_FONT,
                  fontSize: RFValue(12),
                  alignSelf: 'flex-start',
                  paddingHorizontal: RFValue(10),
                }}>
                Reply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };



  onCommentDataChange = (commentData, post) => {
    let result = [];
    commentData.forEach(element => {
      element = {...element, reactionVisible: false};
      result.push(element);
    });
    this.setState({commentData: result, post});
  };

  onImageDataChange = imageDispaly => {
    this.setState({imageDispaly, isVisible: true});
  };

  sendPressed = () => {
    const {commentText} = this.state;
    if (commentText) {
      this.setState({disabled: true, commented: this.state.commented + 1}, () =>
        this.requestHandlerCreateComment(),
      );
    }
  };

  renderSheet = () => {
    const {commentData, userProfilePic, loading, commentText} = this.state;
    return (
      <View style={styles.bottomSheet}>
        <ScrollView
          keyboardShouldPersistTaps="never"
          nestedScrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}>
          <View style={{flex: 1}}>
            {loading ? (
              <CustomLoader/>
            ) : null}
            {commentData.length === 0 && loading === false ? (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Icon
                  type={'Foundation'}
                  name={'comments'}
                  style={{
                    color: 'gray',
                    fontSize: RFValue(98),
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={{
                    fontFamily: THEME_FONT,
                    fontSize: RFValue(18 - 2),
                    alignSelf: 'center',
                    color: 'gray',
                  }}>
                  No Comments on this post
                </Text>
              </View>
            ) : loading === false ? (
              <View
                style={{
                  flex: 1,
                  marginHorizontal: RFValue(10),
                  marginVertical: RFValue(10),
                }}>
                <FlatList
                  disableVirtualization={true}
                  ref={ref => {
                    this.flatList = ref;
                  }}
                  keyboardShouldPersistTaps="never"
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                  horizontal={false}
                  data={Array.isArray(commentData) && commentData.concat()?.reverse()}
                  extraData={this.state}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderItem}
                />
              </View>
            ) : null}
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: RFValue(10),
            backgroundColor: '#FFFFFF',
            marginHorizontal: wp(7)
          }}>
          <View
            style={{
              flex: 1,
              borderRadius: RFValue(10),
              borderWidth: 1,
              borderColor: HEADER,
              overflow: 'hidden',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: RFValue(4),
            }}>
            <TextInput
              placeholder={'Post a Comment'}
              value={commentText}
              onChangeText={commentText => {
                this.setState({ commentText });
              }}
              multiline={true}
              style={{
                height: wp(8),
                borderRadius: RFValue(10),
                borderColor: HEADER,
                overflow: 'hidden',
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: RFValue(4),
                textAlignVertical: 'center',
                paddingLeft: wp(2),
                paddingTop:wp(2)
              }}
            />

          </View>
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={() => {
              this.sendPressed();
            }}>
            <Icon
              type={'FontAwesome'}
              name={'send'}
              style={
                commentText
                  ? {
                    color: HEADER,
                    fontSize: RFValue(22),
                    textAlign: 'right',
                    marginLeft: RFValue(10),
                  }
                  : {
                    color: '#707070',
                    fontSize: RFValue(22),
                    textAlign: 'right',
                    marginLeft: RFValue(10),
                  }
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {
      index,
      show,
      commentData,
      imageDispaly,
      isVisible,
      commented,
    } = this.state;
    return (
      <>
        {this.state.sendCommentLoading ? (
        <PlaceholderLoader />
        ) : null}
        <Drawer
          ref={ref => {
            this._drawer = ref;
          }}
          side="right"
          content={
            <ControlPanel
              navigation={this.props.navigation}
              drawerClose={this.closeControlPanel}
            />
          }
          onClose={() => {
            this.closeControlPanel();
          }}
          //   captureGestures={true}
          panOpenMask={0.7}
          negotiatePan={true}>
          <Container style={styles.container}>
            <ViewPost
              POST_ID={this.props.navigation.getParam('postId')}
              commentCount={commented}
              imageDispaly={imageDispaly}
              commentData={commentData}
              commentOpen={this.onOpen}
              drawerOpen={this.openControlPanel}
              onCommentDataChange={this.onCommentDataChange}
              onImageDataChange={this.onImageDataChange}
              navigation={this.props.navigation}
            />
            <Modalize
              adjustToContentHeight
              ref={this.modal}
              onClosed={() => {
                this.setState({commentData});
              }}>
              {this.renderSheet()}
            </Modalize>
          </Container>
        </Drawer>
        <ImageView
          backgroundColor={'#000000'}
          animationType={'fade'}
          swipeToCloseEnabled={true}
          images={imageDispaly}
          //imageIndex={0}
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
  savePostId: id => dispatch(savePostId(id)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Index);
