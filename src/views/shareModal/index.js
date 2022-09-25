import React, { useState, useEffect } from 'react';
import { Thumbnail, Item, Icon } from 'native-base';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { SvgUri } from 'react-native-svg';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Share,
  Keyboard,
} from 'react-native';
import _ from 'lodash';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFValue } from 'react-native-responsive-fontsize';
import { connect, useDispatch } from 'react-redux';

import { THEME_FONT } from '../../constants/fontFamily';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { BLUE_NEW, DANGER, HEADER, PINK, TEXT_INPUT_LABEL } from '../../constants/colors';
import { getFollowFollowing } from '../../services/index';
import { sendMessage } from '../../services/index';
import { addFriends } from '../../redux/actions/friends';
import requestRoutes from '../../utils/requestRoutes.json';
import { updatepPostShareCount } from '../../redux/actions/user';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
const { petOwnerNewsFeed } = petMyPalApiService;
import Cross from '../../assets/Event-Icons-svg/cross.svg'



const ShareModal = props => {
  const [profilePic, setProfilePic] = useState(props?.user?.user_data?.avatar ?? '');
  const [about, setAbout] = useState('');
  const [aboutError, setAboutError] = useState(false)
  const [step, setStep] = useState(0);
  const [pageSelectId, setPageSelectId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [groupSelectIds, setgroupSelectIds] = useState([]);
  const [messagesIds, setMessagesIds] = useState([]);
  const [pets, setPets] = useState(props?.myPets);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props?.myPets) {
      setPets(props.myPets)
    }
    setProfilePic(props?.user?.user_data?.avatar)


  }, [props?.user?.user_data?.avatar])

  useEffect(() => {

    commonApisCall();

  }, [props.modalVisible])

  function commonApisCall() {
    getFollowFollowing(f => {
      if (f?.data) {
        props.addFriends(f.data)
      }
    });

    requestHandlerGetUserGroup('get-my-groups', 'my_groups');
    requestHandlerGetUserJoindGroup('get-my-groups', 'joined_groups');
  }

  function updateDate() {
    props.viewerContent.post_share = Number(props.viewerContent.post_share) + 1;
    dispatch(updatepPostShareCount(props.viewerContent?.post_id))
  }

  const onShare = async url => {
    try {
      const result = await Share.share(
        Platform.OS === 'ios' ? { url }
          : { message: url },
      );
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
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

  const stepUp = step => { setStep(step) };

  const showToast = msg => { Toast.show(msg, Toast.SHORT) };

  function checkIds(id) {
    return groupSelectIds?.includes(Number(id)) ? true : false
  }

  const getAccessToken = async () => {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  };

  function updatePetsStateToInitial() {
    let updatePets = pets;
    updatePets.forEach(item => {
      if (item?.sharePetId) {
        item.sharePetId = undefined;
        item.shareGroupId
      }
      if (item?.sharePixxyId) {
        item.sharePixxyId = undefined;
      }
    });
    setPets(updatePets)
  }

  function checkMessagesIds(id) {

    return messagesIds?.includes(Number(id)) ? true : false

  }


  const requestHandlerGetUserGroup = async (type, pagesType) => {
    getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', pagesType);
      data.append('user_id', props?.user?.user_data?.user_id);

      try {
        const response = await fetch( SERVER + requestRoutes[type].route +'?access_token=' +JSON.parse(token).access_token,
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
        console.log(error);
      }
    });
  };

  const requestHandlerGetUserJoindGroup = async (type, pagesType) => {
    getAccessToken().then(async token => {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', pagesType);
      data.append('user_id', props?.user?.user_data?.user_id);
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
        console.log(error);
      }
    });
  };


  const handleShareOnTimeline = async type => {

    getAccessToken().then(async token => {
      const { access_token } = JSON.parse(token);
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', 'share_post_on_timeline');
      data.append('id', props.viewerContent.photo_pixxy[props.imageIndex]?.post_id ?? props.viewerContent?.post_id);// TODO Not sure how can we share specific image by using its id
      data.append('user_id', props?.user?.user_data?.user_id);
      data.append('text', props.viewerContent.Orginaltext);
      // data.append('text', about);
      setLoading(true);

      try {
        const response = await fetch(
          SERVER + requestRoutes[type].route + '?access_token=' + access_token,

          {
            method: requestRoutes[type].method,
            body: data,
            headers: {},
          },
        );
        const responseJson = await response.json();
        if (responseJson.api_status === 200) {
          props?.petData || props?.pixxyData
            ?
            props.updateShareCount(props.viewerContent?.post_id)
            :
            updateDate();
          if (!props?.noNeedToLoadNewsFeed) {
            dispatch(petOwnerNewsFeed(access_token, 'get_news_feed', false, 'firstTimeLoadData'))
          }
          showToast('Shared on Timeline');
          setAbout('');
          setLoading(false);
          setStep(0);
        } else {
          showToast('Share Failed');
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        alert('Network Error');
      }
    });
  };

  // const handleShareOnPage = async (type, pageId) => {
  //   setPageSelectId(pageId);
  //   getAccessToken().then(async token => {
  //     const { access_token } = JSON.parse(token);
  //     const data = new FormData();
  //     data.append('server_key', server_key);
  //     data.append('type', 'share_post_on_page');
  //     data.append('id', props.viewerContent.post_id);
  //     data.append('page_id', pageId);
  //     data.append('text', about);
  //     let result = [];
  //     setLoading(true);
  //     try {
  //       const response = await fetch(
  //         SERVER + requestRoutes[type].route + '?access_token=' + access_token,
  //         {
  //           method: requestRoutes[type].method,
  //           body: data,
  //           headers: {},
  //         },
  //       );
  //       const responseJson = await response.json();
  //       if (responseJson.api_status === 200) {
  //         (props?.petData || props?.pixxyData) ? props.updateShareCount(props.viewerContent?.post_id) : updateDate();
  //         setPageSelectId(0);
  //         props.updateState({
  //           shareModalVisible: !props.modalVisible,
  //           viewerContent: {},
  //         });
  //         updateDate()
  //         //showToast('Shared on Page');
  //         setAbout('');
  //         setStep(0);
  //         setLoading(false);
  //       } else {
  //         setPageSelectId(0);
  //         showToast('Share Failed');
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setLoading(false);
  //       setPageSelectId(0);
  //       alert('Network Error');
  //     }
  //   });
  // };

  const handleShareOnGroup = async (type, groupId, index) => {

    getAccessToken().then(async token => {
      const { access_token } = JSON.parse(token);
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('type', 'share_post_on_group');
      data.append('id', props.viewerContent.post_id);
      data.append('group_id', groupId);
      data.append('text', about);
      setLoading(true);
      try {
        const response = await fetch(
          SERVER + requestRoutes[type].route + '?access_token=' + access_token,
          {
            method: requestRoutes[type].method,
            body: data,
            headers: {},
          },
        );
        const responseJson = await response.json();
        if (responseJson.api_status === 200) {

          setgroupSelectIds([...groupSelectIds, Number(groupId)]);
          (props?.petData || props?.pixxyData) ? props.updateShareCount(props.viewerContent?.post_id) : updateDate();
          updateDate();
          showToast('Shared on Community');
          setAbout('');
          setLoading(false);
        } else {
          showToast('Share Failed');
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        alert('Network Error');
      }
    });
  };

  const handleShareAsPixxy = async (type, petId, index) => {
    setLoading(true);
    let data = new FormData();
    var photo = {};
    getAccessToken()
      .then(async token => {
        if (props.viewerContent.postFile) {
          photo = {
            uri: props.viewerContent.postFile,
            type: 'image/jpeg',
            name: 'photo.jpg',
          };
          data.append('postPhotos[]', photo);
        } else {
          props.viewerContent.photo_multi.forEach((item, i) => {
            data.append(`postPhotos[${i}]`, {
              uri: item.image,
              type: 'image/jpeg',
              name: `filename${i}.jpg`,
            });
          });
        }
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
        ).then(response => response.json())
          .then(json => {
            if (json.api_status === '200' || json.api_status === 200) {
              let newPets = pets;
              newPets[index].sharePixxyId = petId;
              (props?.petData || props?.pixxyData) ? props.updateShareCount(props.viewerContent?.post_id) : updateDate();
              showToast("Shared on Pet's Pixxy");
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

  const handleShareAsPetPost = async (type, petId, index) => {


    setLoading(true);
    const URL = SERVER + '/app_api.php?application=phone&type=new_post';
    let data = new FormData();
    var photo = {};
    getAccessToken()
      .then(token => {
        if (props.viewerContent.postFile) {
          if (
            props.viewerContent.postFile.includes('jpeg') ||
            props.viewerContent.postFile.includes('jpg') ||
            props.viewerContent.postFile.includes('gif') ||
            props.viewerContent.postFile.includes('png')
          ) {
            photo = {
              uri: props.viewerContent.postFile,
              type: 'image/jpeg',
              name: 'photo.jpg',
            };
            data.append('postFile', photo);
          } else {
            photo = {
              name: 'video.mp4',
              uri: props.viewerContent.postFile,
              type: 'video/mp4',
            };
            data.append('postVideo', photo);
          }
        } else if (
          props.viewerContent.photo_multi &&
          props.viewerContent.photo_multi.length > 0
        ) {
          props.viewerContent.photo_multi.forEach((item, i) => {
            data.append('postPhotos[]', {
              uri: item.image,
              type: 'image/jpeg',
              name: `filename${i}.jpg`,
            });
          });
        }
        else if (props.viewerContent?.pixxy_photos?.length > 0) {
          props.viewerContent?.pixxy_photos.forEach((item, i) => {
            data.append('postPhotos', {
              uri: item,
              type: 'image/jpeg',
              name: 'photo.jpg',
            });
          })
        }
        
        else if(props.viewerContent?.photo_pixxy?.length > 0){
          props.viewerContent?.photo_pixxy.forEach((item, i) => {
            data.append('postPhotos', {
              uri: item?.image,
              type: 'image/jpeg',
              name: 'photo.jpg',
            });
          });
        }

       
        else if (props?.viewerContent?.postMap) {
          data.append('postMap', props?.viewerContent?.postMap);

        } else if (props?.viewerContent?.color_post) {
          data.append('post_color', props?.viewerContent?.color_id)
        }
        !_.isEmpty(about) && data.append('postText', about);
        data.append('recipient_id', petId);
        data.append('s', JSON.parse(token).access_token);
        data.append('server_key', server_key);
        data.append('user_id', props?.user?.user_data?.user_id);
        console.log('data sending to server', data);
        // return false
      })
      .then(async () => {
        try {
          return fetch(URL, {
            method: 'POST',
            body: data,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
            .then(response => response.json())
            .then(json => {
              if (json.api_status === '200' || json.api_status === 200) {
                let newPets = pets;
                newPets[index].sharePetId = petId;
                (props?.petData || props?.pixxyData) ? props.updateShareCount(props.viewerContent?.post_id) : updateDate();
                showToast("Shared on Pet's Timeline");
                setLoading(false);
              } else {
                showToast('Share Failed');
                setLoading(false);
              }
            })
            .catch(error => {
              console.log(error);
            });
        } catch (error) {
          console.log(error)

        }
      })

  };

 function closeKeyboard (){ 
   Keyboard.dismiss()
  }

  return (
    <>
      {props.modalVisible ? <View style={styles.backdrop} /> : null}
      <Modal
        animationType="slide"
        transparent={true}
        avoidKeyboard={true}
        visible={props.modalVisible}
        onRequestClose={() => {
          if (step !== 0) {
            setStep(0);
          } else {
            props.updateState({
              shareModalVisible: !props.modalVisible,
              viewerContent: {},
            });
            updatePetsStateToInitial();
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
                updatePetsStateToInitial();
                setgroupSelectIds([]);
                setMessagesIds([])
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
              <View
                style={{
                  marginBottom: wp(6),
                  marginTop: wp(4),
                  marginHorizontal: wp(2),
                }}>
                <View
                  style={{
                    marginBottom: wp(2),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {step != 0 ? (
                    <TouchableOpacity
                      style={{ height: 30, width: 30 }}
                      onPress={() => {
                        setStep(0);
                        setPets([...props.myPets]);
                      }}>
                      <Image
                        style={{ width: 15, height: 15, resizeMode: 'contain' }}
                        source={require('./../../assets/images/updated/left-arrow.png')}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableWithoutFeedback>
                      <Text />
                    </TouchableWithoutFeedback>
                  )}
                  <TouchableOpacity
                    style={{ height: 35, paddingLeft: 23, }}
                    onPress={() => {
                      setAbout('');
                      setStep(0);
                      setLoading(false);
                      updatePetsStateToInitial();
                      setgroupSelectIds([]);
                      setMessagesIds([]);
                      props.updateState({
                        shareModalVisible: !props.modalVisible,
                        viewerContent: {},
                      });


                    }}>
                    <Cross
                      width={15}
                      height={15}
                      alignSelf={'center'}
                      top={5}
                    />

                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Thumbnail
                    square
                    source={{ uri: "" + profilePic }}
                    style={{
                      backgroundColor: '#F2F2F2',
                      borderRadius: wp(2),
                      width: wp(12),
                      height: wp(12),
                    }}
                  />
                  <View style={{ marginLeft: wp(4) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        style={{
                          fontSize: RFValue(16),
                          fontFamily: THEME_FONT,
                          fontWeight: 'bold',
                        }}>
                        {props?.user &&
                          props?.user?.user_data &&
                          props?.user?.user_data?.full_name}
                      </Text>
                    </View>
                  </View>
                </View>
                {/* {step != 0 && groups.length > 0 && ( */}
                {step != 0 && (
                  <View style={{ marginTop: wp(4) }}>
                    <TextInput
                      textAlignVertical="top"
                      onChangeText={(t) => {
                        setAbout(t)
                        setAboutError(false)
                      }}
                      multiline={true}
                      placeholder="Share with comments"
                      defaultValue={about}
                      returnKeyType='done'
                      onSubmitEditing={closeKeyboard}
                      style={{
                        height: 60,
                        borderColor: aboutError ? DANGER : '#0000001A',
                        borderWidth: 1,
                        paddingLeft: 12,
                        borderRadius: 12,
                      }}
                    />
                  </View>
                )}
                {step === 0 ? (
                  <View style={{ marginVertical: wp(2) }}>

                    {props?.user?.user_data?.user_id != props?.viewerContent?.user_id ?
                      <Item>
                        <TouchableOpacity
                          onPress={() => handleShareOnTimeline('get_news_feed_posts')}
                          style={styles.linkButton}>
                          <Image
                            style={{ width: 23, height: 23, resizeMode: 'contain', marginLeft: 3 }}
                            source={require('./../../assets/images/updated/share/timeline.png')}
                          />
                          <Text style={styles.link}>Share on Timeline</Text>
                        </TouchableOpacity>
                      </Item> : null
                    }

                    <Item>
                      <TouchableOpacity
                        onPress={() => {
                          stepUp(1)
                          setAboutError(false)
                        }}
                        style={styles.linkButton}>
                        <Image
                          style={styles.shareInMsgImg}
                          source={require('./../../assets/images/updated/share/petProfile.png')}
                        />
                        <Text style={styles.link}>Share on Pet Profile</Text>
                      </TouchableOpacity>
                    </Item>

                    <Item>
                      <TouchableOpacity
                        onPress={() => {
                          stepUp(3)
                          setAboutError(false)
                        }}
                        style={styles.linkButton}>
                        <Image
                          style={styles.shareInMsgImg}
                          source={require('./../../assets/images/updated/share/grp.png')}
                        />

                        <Text style={styles.link}>Share in a Community</Text>
                      </TouchableOpacity>
                    </Item>
                    <Item>
                      <TouchableOpacity
                        onPress={() => stepUp(4)}
                        style={styles.linkButton}>
                        <Image
                          style={styles.shareInMsgImg}
                          source={require('./../../assets/images/updated/share/send.png')}
                        />
                        <Text style={styles.link}>Share in a Message</Text>
                      </TouchableOpacity>
                    </Item>
                    <TouchableOpacity
                      onPress={() => onShare(props.viewerContent.url)}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: wp(3), paddingHorizontal: wp(2) }}>
                      <Icon type="FontAwesome5" name="external-link-alt" style={{ fontSize: 18, color: '#4f5d7c', marginRight: 2 }} />
                      <Text style={styles.link}>External Share</Text>
                    </TouchableOpacity>

                  </View>
                ) : step === 1 ? (
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.titleSteps}>Share on Pet Profile</Text>
                    <ScrollView style={styles.listContainer}>
                      <View style={styles.verticalList}>
                        {!_.isUndefined(pets) && pets.map((pet, index) => {
                          if (props?.own_pet != pet?.user_id && !_.isEmpty(pet)) {

                            return (
                              <Item
                                key={index}>
                                <View style={styles.verticalListItem} key={index}>
                                  <View style={styles.left}>
                                    <Thumbnail
                                      square
                                      source={{ uri: "" + pet.avatar }}
                                      style={styles.petThumb}
                                    />
                                    <Text
                                      numberOfLines={1}
                                      style={{ marginLeft: 10, fontWeight: 'bold', width: RFValue(80) }}>
                                      {pet.name}
                                    </Text>
                                  </View>
                                  <View style={styles.right}>
                                    {(props.viewerContent.photo_multi &&
                                      props.viewerContent.photo_multi.length > 0) ||
                                      props.viewerContent.postFile ? (

                                      <View style={styles.pixxyBtn}>
                                        <TouchableOpacity
                                          disabled={pet?.sharePixxyId ?? false}
                                          onPress={
                                            about.trim().length > 0 ?
                                              () => { handleShareAsPixxy('pixxy', pet.user_id, index) } :
                                              () => setAboutError(true)
                                          }
                                          style={[styles.btn, { backgroundColor: pet.sharePixxyId ? 'gray' : 'white', borderColor: pet.sharePixxyId ? TEXT_INPUT_LABEL : BLUE_NEW }]}>
                                          <Text
                                            numberOfLines={1}
                                            style={[styles.shareLink, { fontWeight: 'bold', color: pet?.sharePixxyId ? 'white' : HEADER },
                                            ]}
                                            note>
                                            Pixxy
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    ) : null}

                                    <View
                                      style={styles.timeLineBtn}>
                                      <TouchableOpacity
                                        disabled={
                                          pet?.sharePetId ?? false
                                        }
                                        onPress={
                                          about.trim().length > 0 ?
                                            () => handleShareAsPetPost('pixxy', pet.user_id, index) :
                                            () => setAboutError(true)
                                        }
                                        style={[styles.btn, { backgroundColor: pet?.sharePetId ? 'gray' : BLUE_NEW, borderColor: pet?.sharePetId ? TEXT_INPUT_LABEL : BLUE_NEW },
                                        ]}>
                                        <Text
                                          numberOfLines={1}
                                          style={[styles.shareLink, { fontWeight: 'bold', color: 'white' }]}
                                          note>
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
                  // ) : step === 2 ? (
                  //   <View style={{ marginTop: 10 }}>
                  //     <Text style={styles.titleSteps}>Share on a Page</Text>
                  //     <ScrollView style={styles.listContainer}>
                  //       <View style={styles.horizontalList}>
                  //         {pages.map((page, index) => (
                  //           <TouchableOpacity
                  //             key={index}
                  //             onPress={() =>
                  //               handleShareOnPage(
                  //                 'get_news_feed_posts',
                  //                 page.page_id,
                  //               )
                  //             }>
                  //             <View style={{ marginBottom: wp(5) }}>
                  //               <View
                  //                 style={{
                  //                   borderWidth:
                  //                     page.page_id == pageSelectId ? 2 : 0,
                  //                   borderColor: '#f47d8a',
                  //                   borderRadius: wp(2),
                  //                   padding: 3,
                  //                 }}>
                  //                 <Thumbnail
                  //                   medium
                  //                   square
                  //                   source={{ uri: "" + page.avatar }}
                  //                   style={{
                  //                     width: wp(35),
                  //                     height: hp(10),
                  //                     borderRadius: wp(2),
                  //                   }}
                  //                 />
                  //               </View>
                  //               <Text
                  //                 style={{
                  //                   textAlign: 'center',
                  //                   color:
                  //                     page.page_id == pageSelectId
                  //                       ? '#f47d8a'
                  //                       : '#182A53',
                  //                 }}>
                  //                 {page.name}
                  //               </Text>
                  //             </View>
                  //           </TouchableOpacity>
                  //         ))}
                  //       </View>
                  //     </ScrollView>
                  //   </View>
                ) : step === 3 ? (
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.titleSteps}>Share on a Community</Text>
                    {(groups.length > 0 || joinedGroups.length > 0) ?
                      <ScrollView style={styles.listContainer}>
                        <View style={styles.horizontalList}>
                          {joinedGroups.map((group, index) => (
                            <TouchableOpacity
                              disabled={checkIds(group.group_id) ? true : false}
                              onPress={
                                about.trim().length > 0 ?
                                  () => handleShareOnGroup('get_news_feed_posts', group.group_id, index) :
                                  () => setAboutError(true)
                              }
                              style={{ width: '33%', alignItems: 'center', marginVertical: wp(2.5) }}
                              key={index}>

                              {group?.avatar?.includes('.svg') ?
                                <View
                                  style={{
                                    borderWidth:
                                      checkIds(group.group_id) ? 2 : 2,
                                    borderColor: checkIds(group.group_id) ? PINK : TEXT_INPUT_LABEL,
                                    borderRadius: wp(2),
                                    padding: 3,
                                  }}>
                                  <SvgUri
                                    width={RFValue(45)}
                                    height={RFValue(45)}
                                    uri={group?.avatar}
                                  /></View> :
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
                              <Text
                                style={{
                                  textAlign: 'center',
                                  width: wp(30),
                                  marginVertical: wp(1),
                                  color:
                                    checkIds(group.group_id)
                                      ? '#f47d8a'
                                      : '#182A53',
                                }}>
                                {group.name.length > 10 ? group.name.substr(0, 10) + '..' : group.name}
                              </Text>
                              {group.privacy == 2 && <Icon name="lock" type="EvilIcons" style={{ fontSize: 25, color: PINK, position: 'absolute', top: !group?.avatar?.includes('.svg') ? wp(19.5) : wp(19.5) }} />}
                            </TouchableOpacity>
                          ))}

                        </View>
                      </ScrollView>
                      : <Text style={{ paddingVertical: wp(3), color: PINK, fontWeight: 'bold' }}>Please Create a Community or Follow a Coummunity!</Text>
                    }
                  </View>
                ) : step === 4 ? (
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.titleSteps}>Share in a Message</Text>
                    <ScrollView style={styles.listContainer}>

                      <Text style={styles.titleSteps}>Following</Text>
                      <View style={styles.verticalList}>
                        {props.friends?.following?.map((friend, index) => (
                          friend?.parent_id == '0' ?
                            <Item
                              key={index}>
                              <View style={styles.verticalListItem}>
                                <View style={styles.left}>
                                  <Thumbnail
                                    square
                                    source={{ uri: "" + friend.avatar }}
                                    style={{
                                      backgroundColor: '#F2F2F2',
                                      borderRadius: wp(2),
                                      width: wp(11),
                                      height: wp(11),
                                    }}
                                  />
                                  <Text
                                    style={{ marginLeft: 10, fontWeight: 'bold' }}>
                                    {friend.full_name}
                                  </Text>
                                </View>
                                <View style={styles.right}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                    }}>
                                    <TouchableOpacity
                                      disabled={checkMessagesIds(friend?.user_id) ? true : false}
                                      onPress={() => {
                                        sendMessage(friend?.user_id, about + ' ' + props?.viewerContent?.url, '' + new Date(), status => {
                                          if (status) {
                                            Toast.show(`Shared successfully  to ${friend.full_name}`, Toast.SHORT)
                                            setMessagesIds([...messagesIds, Number(friend?.user_id)]);
                                            (props?.petData || props?.pixxyData) ? props.updateShareCount(props.viewerContent?.post_id) : updateDate();
                                          } else {
                                            console.warn('Message is not sent findout the issue!')
                                          }
                                        },
                                        );



                                      }}
                                      style={[styles.btn, { backgroundColor: checkMessagesIds(friend.user_id) ? 'gray' : 'white', borderColor: checkMessagesIds(friend.user_id) ? 'gray' : HEADER }]}>
                                      <Text
                                        numberOfLines={1}
                                        style={[
                                          styles.shareLink,
                                          { fontWeight: 'bold' },

                                        ]}
                                        note>
                                        {friend?.loading ? 'loading' : 'Send'}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </Item>
                            : null
                        )

                        )}
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
    borderColor: BLUE_NEW,
  },
  modalView: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: screenWidth,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  openButton: {
    position: 'absolute',
    top: 22,
    right: 16,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  link: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#182A53',
  },
  titleSteps: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#182A53',
  },
  linkButton: {
    paddingVertical: wp(3),
    flexDirection: 'row',
    alignItems: 'center'
  },
  listContainer: {
    maxHeight: 240,
    marginTop: 10,
  },
  horizontalList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5

  },
  horizontalListItem: {
    width: (screenWidth - 30) / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  thirdListItem: {
    marginRight: 0,
  },
  verticalListItem: {
    width: '100%',
    alignItems: 'center',
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
    textDecorationStyle: 'solid',
    textDecorationColor: HEADER,
    paddingHorizontal: 5,
  },
  petThumb: {
    backgroundColor: '#F2F2F2',
    borderRadius: wp(2),
    width: wp(11),
    height: wp(11),
  },
  pixxyBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 10,
  },
  timeLineBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  shareInMsgImg: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 2
  }


});

const mapStateToProps = state => ({
  user: state.user.user,
  myPets: state.mypets.pets,
  friends: state.friends.friends,

});
const mapDispatchToProps = dispatch => ({
  addFriends: users => dispatch(addFriends(users)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShareModal);
