
import React, { useState, useEffect } from 'react';
import { Button, Thumbnail, Item, Input, Label, Icon } from 'native-base';
import { Modal, StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, Image, FlatList, TouchableWithoutFeedback,KeyboardAvoidingView,Keyboard } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { THEME_FONT } from '../../constants/fontFamily';
import { BLUE_NEW, HEADER } from '../../constants/colors';
import { CreateComment, getComments } from '../../services/index';
import { TEXT_DARK, TEXT_LIGHT, FOOTER_ICON_NEW, FOOTER_ICON_ACTIVE_NEW, FOOTER_ICON_ACTIVE_Border_NEW } from '../../constants/colors';
import { postTimeAndReaction } from '../../utils/DateFuncs';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';



const CommentsModal = props => {
  const [loading, setLoading] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [commentText, setCommentText] = useState('');
  useEffect(() => {
    setLoading(true)
    getComments(props.viewerContent.post_id, (item) => {
      setLoading(false)
      setCommentData(item)
    })
  }, []);
  const renderItem = ({ item, index }) => {
    let { time } = postTimeAndReaction(item.time);
    return (
      <View style={{ marginVertical: RFValue(10) }} key={index}>
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
      </View>
    );
  };

  const sendPressed = () => {
    if (commentText) {
      setLoading(true)
      CreateComment(props.viewerContent.post_id, commentText, () => {
        getComments(props.viewerContent.post_id, (item) => {
          props.viewerContent.post_comments = parseInt(props.viewerContent.post_comments, 10) + 1;
          props.updateComment(item.length);
          setLoading(false)
          setCommentText("")
          setCommentData(item)
        })
      })
    }
  };

  return (

    // {props.modalVisible ? <View style={styles.backdrop} /> : null}
    <Modal

      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.updateState({
          CommentsModalVisible: !props.modalVisible,
          viewerContent: {},
        });
      }}>
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <View style={styles.centeredView}>
          <View style={{ flex: 1, marginTop: 30, height: 20 }}>

            <View style={styles.bottomSheet}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    props.updateState({
                      CommentsModalVisible: !props.modalVisible,
                      viewerContent: {},
                    });
                  }}>
                  <Image style={{ width: 13, height: 13, resizeMode: 'contain' }}
                    source={require('./../../assets/images/updated/share/close.png')} />

                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                {loading && (
                  <PlaceholderLoader />
                )}
                {commentData.length === 0 && loading === false ? (
                  <View style={{ flex: 1, justifyContent: 'center' }}>
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
                        fontSize: RFValue(16),
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
                      marginHorizontal: wp(7),
                      marginVertical: RFValue(10),
                    }}>
                    <FlatList
                      disableVirtualization={true}
                      keyboardShouldPersistTaps="always"
                      nestedScrollEnabled={true}
                      scrollEnabled={true}
                      horizontal={false}
                      data={Array.isArray(commentData) && commentData.concat()?.reverse()}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={renderItem}
                    />
                  </View>
                ) : null}
              </View>
              <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS == "ios" ? 30 : 20}
                behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: RFValue(10),
                    backgroundColor: '#FFFFFF',
                    marginHorizontal: wp(7)
                  }}>

                  <TextInput
                    style={{
                      height: wp(10),
                      width: '85%',
                      borderRadius: RFValue(10),
                      borderWidth: 1,
                      borderColor: HEADER,
                      overflow: 'hidden',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: RFValue(4),
                      textAlignVertical: 'center',
                      paddingLeft: wp(2)
                    }}

                    placeholder={' Post a Comment'}
                    value={commentText}
                    onChangeText={commentText => {
                      setCommentText(commentText)
                    }}
                    multiline={true}

                  />


                  <TouchableOpacity
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => {
                      sendPressed();
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
              </KeyboardAvoidingView>
            </View>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    flex: 1,
    height: screenHeight * 0.8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    elevation: Platform.OS === 'ios' ? 5 : 10,
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  
  imgIcon: {
    width: RFValue(30),
    height: RFValue(30),
  },
  imgIcon1: {
    width: RFValue(20),
    height: RFValue(20),
  },

  iconContainer: {
    backgroundColor: TEXT_LIGHT,
    width: 32,
    height: 32,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    backgroundColor: FOOTER_ICON_ACTIVE_NEW,
    width: 37,
    height: 48,
    shadowColor: '#000000',
    marginTop: -20,
    borderRadius: 6,
    borderColor: FOOTER_ICON_ACTIVE_Border_NEW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIcon: {
    color: FOOTER_ICON_NEW,
    // fontSize: 14,
    margin: 0,
    padding: 0,
  },
  homeButtonContainer: {
    backgroundColor: TEXT_DARK,
    width: 48,
    height: 48,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    color: TEXT_LIGHT,
    // fontSize: 14,
    margin: 0,
    padding: 0,
  },
  selectedIcon: {
    color: '#fff',
  },
  footerText: {
    color: '#fff',
    fontSize: 10,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#000000a1',
    width: screenWidth,
    height: screenHeight,
    zIndex: 100,
  },
  centeredView: {
    flex: 1,
    // height: screenHeight - 55,
    // backgroundColor: "#000000a1",
  },
  btn: {
    flexDirection: 'row',
    height: hp(4),
    width: wp(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: BLUE_NEW
  },
  modalView: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: screenWidth,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // height: 200
  },
  openButton: {
    // borderRadius: 100,
    // padding: 2,
    // elevation: 2,
    position: 'absolute',
    top: 22,
    right: 16,
    height: 32,
    // width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  link: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#182A53'
  },
  titleSteps: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#182A53'
  },
  linkButton: {
    paddingVertical: wp(3),
    flexDirection: 'row',
  },
  listContainer: {
    maxHeight: 240,
    marginTop: 10,
  },
  horizontalList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  },
  horizontalListItem: {
    width: (screenWidth - 30) / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  thirdListItem: {
    marginRight: 0,
  },
  // verticalList: {
  //   // flexDirection: 'row',
  //   // flexWrap: 'wrap',
  // },
  verticalListItem: {
    width: '100%',
    alignItems: 'center',
    // marginBottom: 20,
    marginVertical: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingScreen: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#00000010',
    position: 'absolute',
    bottom: 0,
    zIndex: 1000000,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  shareLink: {
    color: HEADER,
    // textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: HEADER,
    paddingHorizontal: 5,
  },
});

const mapStateToProps = state => ({
  user: state.user.user,
  myPets: state.mypets.pets,
});

export default connect(mapStateToProps)(CommentsModal);
