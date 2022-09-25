import React from 'react';
import styles from './styles';
import {Container, Icon, Drawer, Thumbnail} from 'native-base';
import {connect} from 'react-redux';
import {
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {HEADER} from '../../constants/colors';
import PropTypes from 'prop-types';
import HomePage from '../HomeView';
import Messages from './../Messages';
import {userEdit, userSave, saveWorkSpace} from '../../redux/actions/user';
import ControlPanel from '../../presentation/ControlPanel';
import {RFValue} from 'react-native-responsive-fontsize';
import {Modalize} from 'react-native-modalize';
import {THEME_FONT} from '../../constants/fontFamily';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import {ACCESS_TOKEN} from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import {server_key, SERVER} from '../../constants/server';
import CameraView from './../CameraView';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import Mention from '../common/InputMention';

import NotificationsView from '../NotificationsView';
import MyPets from '../MyPets';
import MyPetsPanel from './MyPetsPanel';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import AddFooter from './AddFooter';
import {postTimeAndReaction} from '../../utils/DateFuncs';
import {commonState} from '../../components/common/CommomState';

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
      // show: this.props.workspace !== null || ! typeof this.props.workspace === 'undefined' ? this.props.workspace.show : true,
      // showModal: true,
      // commentData: [],
      // post: null,
      // userProfilePic:
      //   this.props?.user == null
      //     ? null
      //     : this.props.user?.user_data?.avatar
      //     ? this.props.user?.user_data?.avatar
      //     : '',

      // loading: false,
      // commentText: '',
      // disabled: false,
      commented: 0,
      sendCommentLoading: false,
      months: commonState.months,
      reaction: commonState.reaction,
      imageDispaly: [{uri: null}],
      isVisible: false,
      petModalVisible: false,
      openMyPet: false,
    };
    this.focusInput = React.createRef();
  }

  componentDidMount() {}

  componentWillReceiveProps(props) {
    if (this.props.navigation.getParam('notifications')) {
      this.setState({ index: 1});
    }

    if (this.props.navigation.getParam('goHome')) {
      this.setState({ index: 0,});
    }
  }

  componentWillUnmount() {
    this.setState({loading: false});
  }

  // async getAccessToken() {
  //   const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
  //   return access_token;
  // }

  goBack = () => {
    this.props.navigation.pop();
  };

  switchScreen(index) {
    if (this.state.openMyPet) {
      this.setState({index: 4});
    } else {
      this.setState({index});
    }
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.current.open();
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

  // showToast = msg => {
  //   ToastAndroid.show(msg, ToastAndroid.SHORT);
  // };

  // onOpen = () => {
  //   this.requestHandlerFetchPostComment();

  //   const modal = this.modal.current;

  //   if (modal) {
  //     this.setState({showModal: true, commented: 0});
  //     modal.open();
  //   }
  // };

  // closeModal = () => {
  //   this.setState({showModal: false});

  //   setTimeout(() => {
  //     if (this.modal.current) {
  //       this.modal.current.close();
  //     }
  //   }, 500);
  // };

  // async requestHandlerFetchPostComment() {
  //   this.setState({loading: true});
  //   this.getAccessToken().then(async token => {
  //     const data = new FormData();
  //     data.append('server_key', server_key);
  //     data.append('type', 'fetch_comments');
  //     data.append('post_id', this.state.post.id);
  //     data.append('sort', 'desc');
  //     try {
  //       const response = await fetch(
  //         SERVER +
  //           '/api/comments?access_token=' +
  //           JSON.parse(token).access_token,
  //         {
  //           method: 'POST',
  //           body: data,
  //           headers: {},
  //         },
  //       );
  //       const responseJson = await response.json();
  //       if (responseJson.api_status === 200) {
  //         this.setState({commentData: responseJson.data, loading: false});
  //       } else {
  //         this.setState({loading: false});
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // }


  // async requestHandlerCreateComment() {
  //   const scope = this;
  //   scope.setState({disabled: false, sendCommentLoading: true});

  //   this.getAccessToken().then(async token => {
  //     const data = new FormData();
  //     data.append('server_key', server_key);
  //     data.append('type', 'create');
  //     data.append('post_id', this.state.post.id);
  //     data.append('text', this.state.commentText);
  //     try {
  //       let commentData = scope.state.commentData;
  //       const response = await fetch(
  //         SERVER +
  //           '/api/comments?access_token=' +
  //           JSON.parse(token).access_token,
  //         {
  //           method: 'POST',
  //           body: data,
  //           headers: {},
  //         },
  //       );
  //       const responseJson = await response.json();
  //       if (responseJson.api_status === 200) {
  //         commentData = commentData.unshift(responseJson.data);
  //         scope.setState({
  //           commentData,
  //           disabled: false,
  //           commentText: '',
  //           sendCommentLoading: false,
  //         });
  //         this.showToast('Comment has been posted');
  //         this.closeModal();
  //       } else {
  //         alert('Failed to post comment');
  //         scope.setState(
  //           {
  //             commentData,
  //             disabled: true,
  //             sendCommentLoading: false,
  //             commentText: '',
  //           },
  //           () => {},
  //           // scope.flatList.scrollToEnd({animated: true}),
  //         );
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // }

  // async requestHandlerReactionComment(reaction, comment) {
  //   this.getAccessToken().then(async token => {
  //     const data = new FormData();
  //     data.append('server_key', server_key);
  //     data.append('type', 'reaction_comment');
  //     data.append('comment_id', comment.id);
  //     data.append('reaction', reaction);
  //     try {
  //       const response = await fetch(
  //         SERVER +
  //           '/api/comments?access_token=' +
  //           JSON.parse(token).access_token,
  //         {
  //           method: 'POST',
  //           body: data,
  //           headers: {},
  //         },
  //       );
  //       const responseJson = await response.json();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // }

  // reactions = (item, index) => {
  //   const {commentData} = this.state;
  //   const scope = this;
  //   setTimeout(function() {
  //     (commentData[index].reactionVisible = false),
  //       scope.setState({commentData});
  //   }, 4000);

  //   return (
  //     <View
  //       style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
  //       <TouchableOpacity
  //         onPress={() => {
  //           commentData[index].reaction.is_reacted
  //             ? (commentData[index].reaction.count =
  //                 commentData[index].reaction.count)
  //             : (commentData[index].reaction.count =
  //                 commentData[index].reaction.count + 1);
  //           commentData[index].reactionVisible = false;
  //           commentData[index].reaction.type = 'Like';
  //           commentData[index].reaction.is_reacted = true;
  //           this.setState({commentData}, () =>
  //             this.requestHandlerReactionComment(item.reaction.type, item),
  //           );
  //         }}>
  //         <FastImage
  //           style={styles.imgIcon}
  //           source={{
  //             uri:
  //               'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/like.gif',
  //           }}
  //         />
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         onPress={() => {
  //           commentData[index].reaction.is_reacted
  //             ? (commentData[index].reaction.count =
  //                 commentData[index].reaction.count)
  //             : (commentData[index].reaction.count =
  //                 commentData[index].reaction.count + 1);
  //           commentData[index].reactionVisible = false;
  //           commentData[index].reaction.type = 'Love';
  //           commentData[index].reaction.is_reacted = true;
  //           this.setState({commentData}, () =>
  //             this.requestHandlerReactionComment(item.reaction.type, item),
  //           );
  //         }}>
  //         <FastImage
  //           style={styles.imgIcon}
  //           source={{
  //             uri:
  //               'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/love.gif',
  //           }}
  //         />
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         onPress={() => {
  //           commentData[index].reaction.is_reacted
  //             ? (commentData[index].reaction.count =
  //                 commentData[index].reaction.count)
  //             : (commentData[index].reaction.count =
  //                 commentData[index].reaction.count + 1);
  //           commentData[index].reactionVisible = false;
  //           commentData[index].reaction.type = 'HaHa';
  //           commentData[index].reaction.is_reacted = true;
  //           this.setState({commentData}, () =>
  //             this.requestHandlerReactionComment(item.reaction.type, item),
  //           );
  //         }}>
  //         <FastImage
  //           style={styles.imgIcon}
  //           source={{
  //             uri:
  //               'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/haha.gif',
  //           }}
  //         />
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         onPress={() => {
  //           commentData[index].reaction.is_reacted
  //             ? (commentData[index].reaction.count =
  //                 commentData[index].reaction.count)
  //             : (commentData[index].reaction.count =
  //                 commentData[index].reaction.count + 1);
  //           commentData[index].reactionVisible = false;
  //           commentData[index].reaction.type = 'Wow';
  //           commentData[index].reaction.is_reacted = true;
  //           this.setState({commentData}, () =>
  //             this.requestHandlerReactionComment(item.reaction.type, item),
  //           );
  //         }}>
  //         <FastImage
  //           style={styles.imgIcon}
  //           source={{
  //             uri:
  //               'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/wow.gif',
  //           }}
  //         />
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         onPress={() => {
  //           commentData[index].reaction.is_reacted
  //             ? (commentData[index].reaction.count =
  //                 commentData[index].reaction.count)
  //             : (commentData[index].reaction.count =
  //                 commentData[index].reaction.count + 1);
  //           commentData[index].reactionVisible = false;
  //           commentData[index].reaction.type = 'Sad';
  //           commentData[index].reaction.is_reacted = true;
  //           this.setState({commentData}, () =>
  //             this.requestHandlerReactionComment(item.reaction.type, item),
  //           );
  //         }}>
  //         <FastImage
  //           style={styles.imgIcon}
  //           source={{
  //             uri:
  //               'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/sad.gif',
  //           }}
  //         />
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         onPress={() => {
  //           commentData[index].reaction.is_reacted
  //             ? (commentData[index].reaction.count =
  //                 commentData[index].reaction.count)
  //             : (commentData[index].reaction.count =
  //                 commentData[index].reaction.count + 1);
  //           commentData[index].reactionVisible = false;
  //           commentData[index].reaction.type = 'Angry';
  //           commentData[index].reaction.is_reacted = true;
  //           this.setState({commentData}, () =>
  //             this.requestHandlerReactionComment(item.reaction.type, item),
  //           );
  //         }}>
  //         <FastImage
  //           style={styles.imgIcon}
  //           source={{
  //             uri:
  //               'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/angry.gif',
  //           }}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  // renderItem = ({item, index}) => {
  //   const {commentData, reaction, months} = this.state;
  //   let {time} = postTimeAndReaction(item.time);
  //   return (
  //     <View style={{marginVertical: RFValue(10)}} key={index}>
  //       <View style={{flex: 1, flexDirection: 'row'}}>
  //         <Thumbnail
  //           // small
  //           square
  //           source={{
  //             uri: '' + item?.publisher?.avatar ? item?.publisher?.avatar : '',
  //           }}
  //           style={{
  //             backgroundColor: '#F2F2F2',
  //             borderRadius: wp(3),
  //           }}
  //         />
  //         <View
  //           style={{
  //             backgroundColor: '#F0F1F4',
  //             flex: 1,
  //             borderRadius: 8,
  //             paddingVertical: 8,
  //             paddingHorizontal: 10,
  //             marginLeft: 10,
  //           }}>
  //           <View
  //             style={{flexDirection: 'row', justifyContent: 'space-between'}}>
  //             <Text style={{fontWeight: 'bold'}}>
  //               {item.publisher.first_name}
  //             </Text>
  //             <Text style={{color: '#8B94A9'}}>{time}</Text>
  //           </View>
  //           <Text style={{marginHorizontal: 2, color: '#465575', fontSize: 13}}>
  //             {item.text}
  //           </Text>
  //         </View>
  //       </View>
  //       {item.reactionVisible ? this.reactions(item, index) : null}
  //       <View
  //         style={{
  //           flex: 1,
  //           flexDirection: 'row',
  //           paddingLeft: RFValue(50),
  //           paddingTop: RFValue(5),
  //           marginLeft: 10,
  //         }}>
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             paddingHorizontal: RFValue(10),
  //             alignItems: 'center',
  //           }}>
  //           <TouchableOpacity
  //             onPress={
  //               item.reaction.is_reacted
  //                 ? () => {
  //                     item.reaction.is_reacted = false;
  //                     item.reaction.count = item.reaction.count - 1;
  //                     item.reaction.type = '';
  //                     this.setState({commentData}, () =>
  //                       this.requestHandlerReactionComment('', item),
  //                     );
  //                   }
  //                 : () => {
  //                     item.reaction.count = item.reaction.count + 1;
  //                     item.reaction.type = 'Like';
  //                     item.reaction.is_reacted = true;
  //                     this.setState({commentData}, () =>
  //                       this.requestHandlerReactionComment('Like', item),
  //                     );
  //                   }
  //             }
  //             onLongPress={() => {
  //               (commentData[index].reactionVisible = true),
  //                 this.setState({commentData});
  //             }}
  //             style={{flexDirection: 'row'}}>
  //             <Icon
  //               name="hearto"
  //               type="AntDesign"
  //               style={{fontSize: RFValue(16)}}
  //             />
  //             <Text
  //               style={{
  //                 fontFamily: THEME_FONT,
  //                 fontSize: RFValue(12),
  //                 alignSelf: 'flex-start',
  //                 paddingHorizontal: RFValue(10),
  //               }}>
  //               {' ' + item.reaction.count}
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };

  // onCommentDataChange = (commentData, post) => {
  //   let result = [];
  //   commentData.forEach(element => {
  //     element = {...element, reactionVisible: false};
  //     result.push(element);
  //   });
  //   this.setState({commentData: result, post});
  // };

  onImageDataChange = imageDispaly => {
    this.setState({imageDispaly, isVisible: true});
  };

  // sendPressed = () => {
  //   const {commentText} = this.state;
  //   if (commentText) {
  //     this.setState({disabled: true, commented: this.state.commented + 1}, () =>
  //       this.requestHandlerCreateComment(),
  //     );
  //   }
  // };

  // renderSheet = () => {
  //   const {commentData, userProfilePic, loading, commentText} = this.state;
  //   return (
  //     <View style={styles.bottomSheet}>
  //       <View style={{flex: 1}}>
  //         {loading && <PlaceholderLoader />}
  //         {commentData.length === 0 && loading === false ? (
  //           <View style={{flex: 1, justifyContent: 'center'}}>
  //             <Icon
  //               type={'Foundation'}
  //               name={'comments'}
  //               style={{
  //                 color: 'gray',
  //                 fontSize: RFValue(98),
  //                 alignSelf: 'center',
  //               }}
  //             />
  //             <Text
  //               style={{
  //                 fontFamily: THEME_FONT,
  //                 fontSize: RFValue(16),
  //                 alignSelf: 'center',
  //                 color: 'gray',
  //               }}>
  //               No Comments on this post
  //             </Text>
  //           </View>
  //         ) : loading === false ? (
  //           <View
  //             style={{
  //               flex: 1,
  //               marginHorizontal: wp(7),
  //               marginVertical: RFValue(10),
  //             }}>
  //             <FlatList
  //               disableVirtualization={true}
  //               ref={ref => {
  //                 this.flatList = ref;
  //               }}
  //               keyboardShouldPersistTaps="always"
  //               nestedScrollEnabled={true}
  //               scrollEnabled={true}
  //               horizontal={false}
  //               data={
  //                 Array.isArray(commentData) && commentData.concat()?.reverse()
  //               }
  //               extraData={this.state}
  //               keyExtractor={(item, index) => index.toString()}
  //               renderItem={this.renderItem}
  //             />
  //           </View>
  //         ) : null}
  //       </View>

  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             paddingVertical: RFValue(10),
  //             backgroundColor: '#FFFFFF',
  //             marginHorizontal: wp(7),
  //             marginBottom: hp(2),
  //           }}>
  //           <View
  //             style={{
  //               flex: 1,
  //               borderRadius: RFValue(10),
  //               borderWidth: 1,
  //               borderColor: HEADER,
  //               overflow: 'hidden',
  //               flexDirection: 'row',
  //               alignItems: 'center',
  //               marginRight: RFValue(4),
  //             }}>
  //             <TextInput
  //               style={{
  //                 height: wp(8),
  //                 borderRadius: RFValue(10),
  //                 borderColor: HEADER,
  //                 overflow: 'hidden',
  //                 flexDirection: 'row',
  //                 alignItems: 'center',
  //                 marginRight: RFValue(4),
  //                 textAlignVertical: 'center',
  //                 paddingLeft: wp(2),
  //                 paddingTop: wp(2),
  //               }}
  //               autoFocus
  //               placeholder={'Post a Comment'}
  //               value={commentText}
  //               onChangeText={commentText => {
  //                 this.setState({commentText});
  //               }}
  //               multiline={true}
  //             />
  //             {/* <Mention
  //             placeholder={'Post a Comment'}
  //             value={commentText}
  //             onChangeText={commentText => {
  //               this.setState({commentText});
  //             }}
  //             multiline={true}
  //             //  style={{ flex: 1 }}
  //           /> */}
  //           </View>
  //           <TouchableWithoutFeedback
  //             style={{
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //               position: 'absolute',
  //             }}
  //             onPress={this.sendPressed}>
  //             <Icon
  //               type={'FontAwesome'}
  //               name={'send'}
  //               style={
  //                 commentText
  //                   ? {
  //                       color: HEADER,
  //                       fontSize: RFValue(22),
  //                       textAlign: 'right',
  //                       marginLeft: RFValue(10),
  //                     }
  //                   : {
  //                       color: '#707070',
  //                       fontSize: RFValue(22),
  //                       textAlign: 'right',
  //                       marginLeft: RFValue(10),
  //                     }
  //               }
  //             />
  //           </TouchableWithoutFeedback>
  //         </View>
  //       {/* </KeyboardAvoidingView> */}
  //     </View>
  //   );
  // };


  updateState = state => {
    this.setState(state);
  };

  render() {
    let AppComponent = null;

    if (this.state.index === 0) {
      AppComponent = HomePage;
    } else if (this.state.index === 1) {
      AppComponent = NotificationsView;
    } else if (this.state.index === 2) {
      AppComponent = Messages;
    } else if (this.state.index === 3) {
      AppComponent = CameraView;
    } else if (this.state.index === 4) {
      AppComponent = HomePage; //MyPets;
    }

    const {
      index, commented, 
      // commentData,
       imageDispaly,
       isVisible
      } = this.state;
    return (
      <>
        {this.state.sendCommentLoading ? <PlaceholderLoader /> : null}
        <Drawer
          ref={ref => {
            this._drawer = ref;
          }}
          // side="right"
          content={
            <ControlPanel
              navigation={this.props.navigation}
              drawerClose={this.closeControlPanel}
            />
          }
          onClose={() => {
            this.closeControlPanel();
          }}
          openDrawerOffset={0.2}
          panCloseMask={0.2}
          negotiatePan={true}>
          <Container style={styles.container}>
            <AppComponent
              scrollToPost={this.state.postId}
              commentCount={commented}
              imageDispaly={imageDispaly}
              // commentData={commentData}  zaheer ahmad remove it
              // commentOpen={this.onOpen}  // zaheer ahmad remove it 
              Increment={this.state.commented}
              drawerOpen={this.openControlPanel}
              // onCommentDataChange={this.onCommentDataChange} // zaheer ahmad remove it
              onImageDataChange={this.onImageDataChange}
              navigation={this.props.navigation}
            />
            <AddFooter
              index={index}
              switchScreen={f => this.switchScreen(f)}
              navigation={this.props.navigation}
            />
{/* 
            <Modalize
              adjustToContentHeight
              ref={this.modal}
              onClosed={() => {
                this.setState({commentData});
              }}>
              {this.renderSheet()}
            </Modalize> */}

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
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FooterBarView);
