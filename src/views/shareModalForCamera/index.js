
import React, { useState, useEffect } from 'react';
import { Button, Thumbnail, Item, Input, Label } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native';
import { TextInput } from 'react-native';
import { Share } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import requestRoutes from '../../utils/requestRoutes.json';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import { isEmpty } from 'lodash';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { updatepPostShareCount } from '../../redux/actions/user';
import { RFValue } from 'react-native-responsive-fontsize';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import DarkButton from '../../components/commonComponents/darkButton';
import { THEME_FONT } from '../../constants/fontFamily';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';
import { BLUE_NEW, HEADER, PINK, TEXT_INPUT_LABEL } from '../../constants/colors';
import { Createpost } from './../../services/index'
import { Icon } from 'native-base'
import { sendMessage, sendImage } from './../../services/index';
import { SvgUri } from 'react-native-svg';



const ShareModal = props => {

  const [profilePic] = useState(
    props.user === null
      ? 'no pic'
      : props.user && props.user?.user_data && props.user?.user_data?.avatar,
  );
  const [userId, setUserId] = useState(props.user?.user_data?.user_id);
  const [user, setUser] = useState([props.user.user_data])
  const [about, setAbout] = useState('');
  const [step, setStep] = useState(0);
  const [pageSelectId, setPageSelectId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [likedPages, setLikedPages] = useState([]);
  const [pages, setPages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [groupSelectId, setgroupSelectId] = useState([]);
  const [pets, setPets] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pixxyId, setPixxyId] = useState('')
  const [messagesIds, setMessagesIds] = useState([]);
  const [image, setImage] = useState(null)


  useEffect(() => {
    let imageData
    if (props?.viewerContent) {
      imageData = {
        name: props.viewerContent.name,
        type: props.viewerContent.type,
        uri: props.viewerContent.uri
      }
    }

    setImage(imageData)
    requestHandlerGetUserPage('get-my-pages', 'my_pages');
    requestHandlerGetUserLikedPage('get-my-pages', 'liked_pages');
    requestHandlerGetUserGroup('get-my-groups', 'my_groups');
    requestHandlerGetUserJoindGroup('get-my-groups', 'joined_groups');

    if (props.myPets) {
      setPets([...props.myPets]);
    }
  }, [props.myPets, props.viewerContent]);

  const onShare = async url => {
    try {
      const result = await Share.share(
        Platform.OS === 'ios'
          ? {
            url,
          }
          : {
            message: url,
          },
      );
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const stepUp = step => {
    setStep(step);
  };

  const showToast = msg => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const getAccessToken = async () => {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  };

  const requestHandlerGetUserPage = async (type, pagesType) => {
    getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', pagesType);
      data.append('user_id', props.user?.user_data?.user_id);
      try {
        const response = await fetch(
          SERVER +
          requestRoutes[type].route +
          '?access_token=' +
          JSON.parse(token).access_token,
          {
            method: requestRoutes[type].method,
            body: data,
            headers: {},
          },
        );
        const responseJson = await response.json();
        if (responseJson.api_status === 200) {
          setPages(responseJson.data);
        } else {
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    });
  };
  const requestHandlerGetUserLikedPage = async (type, pagesType) => {
    getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', pagesType);
      data.append('user_id', props.user?.user_data?.user_id);
      try {
        const response = await fetch(
          SERVER +
          requestRoutes[type].route +
          '?access_token=' +
          JSON.parse(token).access_token,
          {
            method: requestRoutes[type].method,
            body: data,
            headers: {},
          },
        );
        const responseJson = await response.json();
        if (responseJson.api_status === 200) {
          setLikedPages(responseJson.data);
        } else {
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    });
  };

  const requestHandlerGetUserGroup = async (type, pagesType) => {
    getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', pagesType);
      data.append('user_id', props.user?.user_data?.user_id);
      // data.append('limit', pagesType);
      // data.append('offset', pagesType);

      try {
        const response = await fetch(
          SERVER +
          requestRoutes[type].route +
          '?access_token=' +
          JSON.parse(token).access_token,
          {
            method: requestRoutes[type].method,
            body: data,
            headers: {},
          },
        );
        const responseJson = await response.json();
        if (responseJson.api_status === 200) {
          setGroups(responseJson.data);
        } else {
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    });
  };
  const requestHandlerGetUserJoindGroup = async (type, pagesType) => {
    getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', pagesType);
      data.append('user_id', props.user?.user_data?.user_id);
      // data.append('limit', pagesType);
      // data.append('offset', pagesType);

      try {
        const response = await fetch(
          SERVER +
          requestRoutes[type].route +
          '?access_token=' +
          JSON.parse(token).access_token,
          {
            method: requestRoutes[type].method,
            body: data,
            headers: {},
          },
        );
        const responseJson = await response.json();
        if (responseJson.api_status === 200) {
          setJoinedGroups(responseJson.data);
        } else {
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    });
  };



  const handleShareAsPixxy = async (type, petId, index) => {
    setLoading(true);

    let data = new FormData();
    getAccessToken()
      .then(async token => {
        data.append('postPhotos[]', props.viewerContent);
        data.append('description', about);
        data.append('user_id', petId);
        data.append('type', 'create');
        data.append('server_key', server_key);
        return fetch(
          SERVER +
          requestRoutes[type].route +
          '?access_token=' +
          JSON.parse(token).access_token,
          {
            method: requestRoutes[type].method,
            body: data,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

          .then(response => response.json())
          .then(json => {

            let newPets = pets
            if (json.api_status === '200' || json.api_status === 200) {
              setPixxyId(petId)
              newPets[index].sharePixxyData = petId;
              setPets([...newPets])

              props.updateState({
                // shareModalVisible: !props.modalVisible,
                viewerContent: {},
              });
              showToast("Shared on Pet's Pixxy");
              setAbout('');
              setLoading(false);
              // setStep(0);
            } else {
              showToast('Share Failed');
              // setStep(0);
              setLoading(false);
            }
          })
          .catch(error => {
            setLoading(false);
            console.log(error);
          });
      });
  };

  const handleShareAsPetPost = async (type, petId, index) => {
    setLoading(true);
    const URL = SERVER + '/app_api.php?application=phone&type=new_post';
    let data = new FormData();
    getAccessToken()
      .then(token => {
        data.append('postPhotos', props.viewerContent);
        data.append('postText', about);
        data.append('recipient_id', petId);

        // data.append('type', 'create');
        data.append('server_key', server_key);
        data.append('user_id', userId);

        data.append('s', JSON.parse(token).access_token);
        // data.append('server_key', server_key);

      })
      .then(async () => {
        return fetch(URL, {
          method: requestRoutes[type].method,
          body: data,
          headers: {},
        })
          .then(response => response.json())
          .then(json => {
            let newPets = pets
            if (json.api_status === '200' || json.api_status === 200) {
              newPets[index].sharetimelineid = petId
              setPets([...newPets])
              props.updateState({
                // shareModalVisible: !props.modalVisible,
                viewerContent: {},
              });
              showToast("Shared on Pet's Timeline");
              setAbout('');
              setLoading(false);
            } else {
              showToast('Share Failed');
              // setStep(0);
              setLoading(false);
            }
          })
          .catch(error => {
            setLoading(false);
            console.log(error);
          });
      });
  };
  const handlepostPage = async (page_id) => {
    setLoading(true);
    const URL = SERVER + '/app_api.php?application=phone&type=new_post';
    let data = new FormData();
    getAccessToken()
      .then(token => {
        data.append('postPhotos', props.viewerContent);
        data.append('postText', about);
        data.append('user_id', userId);
        data.append('page_id', page_id);
        data.append('s', JSON.parse(token).access_token);
        // data.append('server_key', server_key);

      })
      .then(async () => {
        return fetch(URL, {
          method: 'POST',
          body: data,
          headers: {},
        })
          .then(response => response.json())
          .then(json => {
            if (json.api_status === '200' || json.api_status === 200) {
              props.updateState({
                // shareModalVisible: !props.modalVisible,
                viewerContent: {},
              });
              showToast("Shared");
              setAbout('');
              setLoading(false);
            } else {
              showToast('Share Failed');
              setStep(0);
              setLoading(false);
            }
          })
          .catch(error => {
            setLoading(false);
            console.log(error);
          });
      });
  };
  const handlepostGroup = async (group_id) => {
    setLoading(true);
    const URL = SERVER + '/app_api.php?application=phone&type=new_post';
    let data = new FormData();
    getAccessToken()
      .then(token => {
        data.append('postPhotos', props.viewerContent);
        data.append('postText', about);
        data.append('user_id', userId);
        data.append('group_id', group_id);
        data.append('s', JSON.parse(token).access_token);
        // data.append('server_key', server_key);

      })
      .then(async () => {
        return fetch(URL, {
          method: 'POST',
          body: data,
          headers: {},
        })
          .then(response => response.json())
          .then(json => {
            if (json.api_status === '200' || json.api_status === 200) {
              props.updateState({
                // shareModalVisible: !props.modalVisible,
                viewerContent: {},
              });
              setgroupSelectId([...groupSelectId, Number(group_id)]);

              showToast("Shared");
              setAbout('');
              setLoading(false);
            } else {
              showToast('Share Failed');
              setStep(0);
              setLoading(false);
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
  };



  function updateDate() {
    props.viewerContent.post_share = Number(props.viewerContent.post_share) + 1;
    dispatch(updatepPostShareCount(props.viewerContent?.post_id))
  }

  function checkIds(id) {
    return groupSelectId?.includes(Number(id)) ? true : false
  }
  function checkMessagesIds(id) {

    return messagesIds?.includes(Number(id)) ? true : false

  }

  return (
    <>
      {props.modalVisible ? <View style={styles.backdrop} /> : null}
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
          if (step !== 0) {
            setStep(0);
          } else {
            props.updateState({
              shareModalVisible: !props.modalVisible,
              viewerContent: {},
            });
            setAbout('');
            setLoading(false);
          }
        }}>
        <View style={styles.centeredView}>
          <View style={{ flex: 1, height: 20 }}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.updateState({
                  shareModalVisible: !props.modalVisible,
                  viewerContent: {},
                });
                setAbout('');
                setStep(0);
                setLoading(false);
              }}
              style={{ height: '100%' }}>
              <View style={{ height: '100%' }} />
            </TouchableWithoutFeedback>

          </View>
          <View style={styles.modalView}>
            {loading ? (
              <View style={styles.loadingScreen}>
                <ActivityIndicator
                  size={'large'}
                  color={HEADER}
                  style={{ marginVertical: RFValue(5), flex: 1 }}
                />
              </View>
            ) : null}
            <View style={{ width: screenWidth - 30 }}>
              <View style={{ marginBottom: wp(6), marginTop: wp(4), marginHorizontal: wp(2) }}>

                <View style={{ marginBottom: wp(2), flexDirection: 'row', justifyContent: 'space-between' }}>
                  {step != 0 ? <TouchableWithoutFeedback
                    onPress={() => {
                      setStep(0);
                    }}>
                    <Image style={{ width: 15, height: 15, resizeMode: 'contain' }}
                      source={require('./../../assets/images/updated/left-arrow.png')} />

                  </TouchableWithoutFeedback> :
                    <TouchableWithoutFeedback>
                      <Text></Text>
                    </TouchableWithoutFeedback>}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setAbout('');
                      setStep(0);
                      setLoading(false);
                      props.updateState({
                        shareModalVisible: !props.modalVisible,
                        viewerContent: {},
                      });
                    }}>
                    <Image style={{ width: 10, height: 10, resizeMode: 'contain' }}
                      source={require('./../../assets/images/updated/share/close.png')} />

                  </TouchableWithoutFeedback>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Thumbnail
                    square
                    source={{ uri: profilePic }}
                    style={{
                      backgroundColor: '#F2F2F2',
                      borderRadius: wp(2),
                      width: wp(12), height: wp(12),
                    }}
                  />
                  <View style={{ marginLeft: wp(4) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        style={{ fontSize: RFValue(16), fontFamily: THEME_FONT, fontWeight: 'bold' }}>
                        {props.user &&
                          props.user?.user_data &&
                          props.user?.user_data?.full_name}
                      </Text>
                    </View>
                  </View>

                </View>
                {step != 0 && (<View style={{ marginTop: wp(4) }}>
                  <TextInput
                    textAlignVertical="top"
                    onChangeText={t => setAbout(t)}
                    multiline={true}
                    placeholder="Share with comments"
                    defaultValue={about}
                    style={{
                      height: 60,
                      borderColor: '#0000001A',
                      borderWidth: 1,
                      // marginLeft: 64,
                      paddingLeft: 12,
                      borderRadius: 12,
                    }}
                  />
                </View>)}
                {step === 0 ? (
                  // All Share Options
                  <View style={{ marginVertical: wp(2) }}>
                    <Item>

                      <TouchableOpacity
                        onPress={() => {
                          setLoading(true);
                          Createpost(userId, props.viewerContent, (post) => {
                            props.updateState({
                              // shareModalVisible: !props.modalVisible
                            });
                            setLoading(false);
                          })
                        }}
                        style={styles.linkButton}>
                        <Image
                          style={{ width: 23, height: 23, resizeMode: 'contain' }}
                          source={require('./../../assets/images/updated/share/timeline.png')} />


                        <Text style={styles.link}>Share on Timeline</Text>
                      </TouchableOpacity>
                    </Item>


                    <Item>
                      <TouchableOpacity
                        onPress={() => stepUp(1)}
                        style={styles.linkButton}>
                        <Image
                          style={{ width: 25, height: 25, resizeMode: 'contain' }}
                          source={require('./../../assets/images/updated/share/petProfile.png')} />

                        <Text style={styles.link}>Share on Pet Profile</Text>
                      </TouchableOpacity>
                    </Item>

                    <Item>
                      <TouchableOpacity
                        onPress={() => stepUp(3)}
                        style={styles.linkButton}>

                        <Image
                          style={{ width: 25, height: 25, resizeMode: 'contain', marginLeft: wp(1) }}
                          source={require('./../../assets/images/updated/share/grp.png')} />

                        <Text style={styles.link}>Share in a Community</Text>
                      </TouchableOpacity>
                    </Item>
                    <TouchableOpacity onPress={() => stepUp(4)} style={styles.linkButton}>
                      <Image
                        style={{ width: 25, height: 25, resizeMode: 'contain', marginLeft: wp(2) }}
                        source={require('./../../assets/images/updated/share/send.png')} />

                      <Text style={styles.link}>Share in a Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onShare(props.viewerContent.uri)}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: wp(3), paddingHorizontal: wp(2) }}

                    >
                      <Icon type="FontAwesome5" name="external-link-alt" style={{ fontSize: 18, color: '#4f5d7c', marginLeft: wp(2) }} />
                      <Text style={styles.link}>External Share</Text>
                    </TouchableOpacity>

                  </View>
                ) : step === 1 ? (

                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.titleSteps}>Share on Pet Profile</Text>
                    <ScrollView style={styles.listContainer}>
                      <View style={styles.verticalList}>

                        {pets.map((pet, index) => {
                          if (!isEmpty(pet)) {
                            return (
                              <Item key={index}>
                                <View style={styles.verticalListItem}>
                                  <View style={styles.left}>
                                    <Thumbnail
                                      square
                                      source={{ uri: pet.avatar }}
                                      style={{
                                        backgroundColor: '#F2F2F2',
                                        borderRadius: wp(2),
                                        width: wp(11), height: wp(11),
                                      }}
                                    />
                                    <Text
                                      style={{ marginLeft: 10, fontWeight: 'bold' , width:RFValue(80)}}>
                                      {pet.name}
                                    </Text>
                                  </View>
                                  <View style={styles.right}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 12, marginTop: 10 }}>
                                      <TouchableOpacity
                                        disabled={pet.sharePixxyData ? true : false}
                                        onPress={() => {
                                          handleShareAsPixxy('pixxy', pet.user_id, index)
                                        }
                                        }
                                        style={[styles.btn, { backgroundColor: pet.sharePixxyData ? 'gray' : 'white', borderColor: pet.sharePixxyData ? TEXT_INPUT_LABEL : BLUE_NEW }]}>
                                        <Text numberOfLines={1}
                                          style={[styles.shareLink, { fontWeight: 'bold', color: pet?.sharePixxyData ? 'white' : HEADER }]} note>
                                          Pixxy</Text>
                                      </TouchableOpacity>

                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                      <TouchableOpacity
                                        disabled={pet.sharetimelineid ?? false}
                                        onPress={() =>
                                          handleShareAsPetPost('pixxy', pet.user_id, index)
                                        }
                                        style={[styles.btn, { backgroundColor: pet.sharetimelineid ? 'gray' : BLUE_NEW, borderColor: pet.sharetimelineid ? TEXT_INPUT_LABEL : BLUE_NEW },
                                        ]}>
                                        <Text numberOfLines={1}
                                          style={[styles.shareLink, { fontWeight: 'bold', color: 'white' }]} note>
                                          Timeline
                                        </Text>
                                      </TouchableOpacity>

                                    </View>
                                  </View>

                                </View>
                              </Item>
                            )
                          }
                        })}
                      </View>
                    </ScrollView>
                  </View>
                ) : step === 2 ? (
                  <View style={{ marginTop: 10 }}>
                    {/* <Text style={styles.titleSteps}>Share on a Page</Text> */}
                    <ScrollView style={styles.listContainer}>
                      <View style={styles.horizontalList}>
                        {pages.map((page, index) => (
                          <TouchableOpacity
                            onPress={() =>
                              handlepostPage(page.page_id)
                            }
                            key={index}>
                            <View style={{ marginBottom: wp(5) }}>
                              <View style={{
                                borderWidth: page.page_id == pageSelectId ? 2 : 0,
                                borderColor: '#f47d8a',
                                borderRadius: wp(2),
                                padding: 3
                              }}>
                                <Thumbnail
                                  medium
                                  square
                                  source={{ uri: page.avatar }}
                                  style={{ width: wp(35), height: hp(10), borderRadius: wp(2), }}
                                />
                              </View>
                              <Text style={{ textAlign: 'center', color: page.page_id == pageSelectId ? '#f47d8a' : '#182A53' }}>{page.name}</Text>

                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                ) : step === 3 ? (
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.titleSteps}>Share on a Community</Text>
                    <ScrollView style={styles.listContainer}>
                      <View style={styles.horizontalList}>

                        {groups?.map((group, index) => (
                          <TouchableOpacity
                            disabled={checkIds(group.group_id) ? true : false}
                            onPress={() => handlepostGroup(group.group_id)}
                            key={index}
                            style={{ width: '33%', alignItems: 'center', marginVertical: wp(2.5) }}
                          >
                            {group?.avatar?.includes('.svg') ?
                              <View
                                style={{
                                  borderWidth:
                                    checkIds(group.group_id) ? 2 : 2,
                                  borderColor: checkIds(group.group_id) ? PINK : TEXT_INPUT_LABEL,
                                  borderRadius: wp(2),
                                  padding: 3,
                                }}
                              >
                                <SvgUri
                                  width={RFValue(45)}
                                  height={RFValue(45)}
                                  uri={group?.avatar}
                                />

                              </View> :
                              <View
                                style={{
                                  borderWidth:
                                    checkIds(group.group_id) ? 2 : 2,
                                  borderColor: checkIds(group.group_id) ? PINK : TEXT_INPUT_LABEL,
                                  borderRadius: wp(2),
                                  padding: 3,
                                }}>
                                <Thumbnail
                                  square
                                  source={{ uri: "" + group.avatar }}
                                  style={{
                                    width: RFValue(45),
                                    height: RFValue(45),
                                    borderRadius: wp(2),
                                  }}
                                />
                              </View>

                            }

                            <Text style={{ textAlign: 'center', color: group.group_id == groupSelectId ? '#f47d8a' : '#182A53' }}>
                              {group?.name}
                            </Text>
                          </TouchableOpacity>
                        ))}

                      </View>
                    </ScrollView>
                  </View>
                ) : step === 4 ? (
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.titleSteps}>Share in a Message</Text>

                    <ScrollView style={styles.listContainer}>
                      <Text style={[styles.titleSteps, { left: 3 }]}>Following</Text>
                      <View style={styles.verticalList}>
                        {
                       
                        props?.friends?.following.map((friend, index) => (
                          friend?.parent_id == '0' ?
                          <Item key={index}>
                            <View style={styles.verticalListItem}>
                              <View style={styles.left}>
                                <Thumbnail
                                  square
                                  source={{ uri: friend.avatar }}
                                  style={{
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: wp(2),
                                    width: wp(11), height: wp(11),
                                  }}
                                />
                                <Text
                                  style={{ marginLeft: 10, fontWeight: 'bold' }}>
                                  {friend.name}
                                </Text>
                              </View>
                              <View style={styles.right}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                  <TouchableOpacity
                                    disabled={checkMessagesIds(friend?.user_id) ? true : false}
                                    onPress={() => {
                                      sendImage(friend?.user_id, about, image, userId, status => {
                                        if (status) {
                                          showToast(`Shared successfully  to ${friend.full_name}`)
                                          setMessagesIds([...messagesIds, Number(friend?.user_id)]);

                                          //  (props?.petData||props?.pixxyData) ? props.updateShareCount(props.viewerContent?.post_id) : updateDate();
                                        } else {
                                          console.warn('Message is not sent find out the issue!')
                                        }
                                      },
                                      );



                                    }}
                                    style={[styles.btn, {
                                      backgroundColor: checkMessagesIds(friend.user_id) ? 'gray' : 'white',
                                      borderColor: checkMessagesIds(friend.user_id) ? 'gray' : HEADER
                                    }]}

                                  >
                                    <Text numberOfLines={1} style={[styles.shareLink,
                                    { fontWeight: 'bold', color: checkMessagesIds(friend.user_id) ? 'white' : HEADER }]} note>Send</Text>
                                  </TouchableOpacity>

                                </View>
                              </View>
                            </View>
                          </Item>
                          :
                          null
                        )
                      
                        )
                      
                    
                      }
                      </View>
                    </ScrollView>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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

    // textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: HEADER,
    paddingHorizontal: 5,
  },
});

const mapStateToProps = state => ({
  user: state.user.user,
  myPets: state.mypets.pets,
  friends: state.friends.friends,

});

export default connect(mapStateToProps)(ShareModal);
