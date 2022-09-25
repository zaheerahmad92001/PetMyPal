
import React, { useState, useEffect } from 'react';
import { Button, Thumbnail, Item, Input, Label, Icon } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import { TextInput } from 'react-native';
import { Share } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { SvgUri } from 'react-native-svg';
import requestRoutes from '../../utils/requestRoutes.json';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { THEME_FONT } from '../../constants/fontFamily';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';
import { BLUE_NEW, HEADER, PINK, TEXT_INPUT_LABEL } from '../../constants/colors';
import EventEmitter from '../../services/eventemitter';

const GroupPagePixxy = props => {

  const [profilePic] = useState(
    props.user === null
      ? 'no pic'
      : props.user && props.user?.user_data && props.user?.user_data?.avatar,
  );
  const [step, setStep] = useState(0);
  const [pageSelectId, setPageSelectId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [likedPages, setLikedPages] = useState([]);
  const [pages, setPages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [groupSelectIds, setgroupSelectIds] = useState([]);
  const [pets, setPets] = useState(props.myPets);

  useEffect(() => {


    EventEmitter.on('removeIds', petBtnStatus);
    EventEmitter.on('InitialStateofPets', updatePetsStateToInitial);
    // requestHandlerGetUserPage('get-my-pages', 'my_pages');
    // requestHandlerGetUserLikedPage('get-my-pages', 'liked_pages');
    requestHandlerGetUserGroup('get-my-groups', 'my_groups');
    requestHandlerGetUserJoindGroup('get-my-groups', 'joined_groups');

    if (props.myPets) {
      setPets(props.myPets);
    }
    return () => {
      updatePetsStateToInitial();
      EventEmitter.off('removePetId', petBtnStatus);
      EventEmitter.off('InitialStateofPets', petBtnStatus)
    }
  }, [groupSelectIds, setPets]);

  // console.log('my pets ' , props.myPets )

  const stepUp = step => {
    setStep(step);
  };
  function updatePetsStateToInitial() {

    let updatePets = props.myPets;
    updatePets.forEach(item => {
      if (item.sharePetId) {
        item.sharePetId = undefined;
      }
      if (item.sharePixxyId) {
        item.sharePixxyId = undefined;
      }
    });
    setPets(updatePets);
    setPageSelectId([]);

  }
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
        console.log(error);
      }
    });
  };



  function petBtnStatus({ id, index, type }) {
    if (type == 'pet') {
      let newPets = props.myPets;
      if (newPets.length > 0) {
        if (newPets[index].sharePetId) {
          newPets[index].sharePetId = undefined;
        } else {
          newPets[index].sharePetId = id;
        }
        setPets(newPets);
      }
    }
    else {

      if (groupSelectIds?.includes(Number(id))) {
        setgroupSelectIds(groupSelectIds.filter(item => item != Number(id)))

      }
    }

  }

  function checkIds(id) {
    return groupSelectIds?.includes(Number(id)) ? true : false
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
              forApiData: {}
            });
            setLoading(false);
          }
        }}>
        <View style={styles.centeredView}>
          <View style={{ flex: 1, height: 20 }}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.updateState({
                  shareModalVisible: !props.modalVisible
                });
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

                <View style={{ marginBottom: wp(2), flexDirection: 'row', justifyContent: 'space-between', }}>
                  {step != 0 ? <TouchableWithoutFeedback
                    onPress={() => {
                      setStep(0);
                    }}>
                     <Icon
                name={'chevron-back'}
                type="Ionicons"
                style={{fontSize:25,color:BLUE_NEW}}
               
              />

                  </TouchableWithoutFeedback> :
                    <TouchableWithoutFeedback>
                      <Text></Text>
                    </TouchableWithoutFeedback>}
                  <TouchableOpacity
                    style={{ paddingLeft: 20 }}
                    onPress={() => {
                      setStep(0);
                      setLoading(false);
                      props.updateState({
                        shareModalVisible: !props.modalVisible
                      });
                    }}>
                    <Image style={{ width: 15, height: 15, resizeMode: 'contain' }}
                      source={require('./../../assets/images/updated/share/close.png')} />

                  </TouchableOpacity>
                </View>
                {step === 0 && (
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
                        <Text style={{ fontSize: RFValue(16), fontFamily: THEME_FONT, fontWeight: 'bold' }}>
                          {props?.user?.user_data?.full_name}
                        </Text>
                      </View>
                    </View>

                  </View>
                )}
                {step === 0 ? (
                  // All Share Options
                  <View style={{ marginVertical: wp(2) }}>
                    <Item>
                      <TouchableOpacity
                        onPress={() => stepUp(1)}
                        style={styles.linkButton}>
                        <Image
                          style={{ width: 25, height: 25, resizeMode: 'contain' }}
                          source={require('./../../assets/images/updated/share/petProfile.png')} />
                        <Text style={styles.link}>Pet Profile</Text>
                      </TouchableOpacity>
                    </Item>
                    {/* <Item>
                      <TouchableOpacity
                        onPress={() => stepUp(2)}
                        style={styles.linkButton}>
                        <Image
                          style={{ width: 25, height: 25, resizeMode: 'contain' }}
                          source={require('./../../assets/images/updated/share/page.png')} />
                        <Text style={styles.link}>Pages</Text>
                      </TouchableOpacity>
                    </Item> */}
                    <Item>
                      <TouchableOpacity
                        onPress={() => stepUp(3)}
                        style={styles.linkButton}>
                        <Image
                          style={{ width: 25, height: 25, resizeMode: 'contain', marginLeft: wp(1) }}
                          source={require('./../../assets/images/updated/share/grp.png')} />
                        <Text style={styles.link}>Communities</Text>
                      </TouchableOpacity>
                    </Item>

                  </View>
                ) : step === 1 ? (
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.titleSteps}>Pet Profile</Text>
                    <ScrollView style={styles.listContainer}>
                      <View style={styles.verticalList}>
                        {pets.map((pet, index) => {
                     
                          if (!_.isEmpty(pet) && !_.isUndefined(pet.id)) {

                            return (

                              <Item key={index}>
                                <View style={styles.verticalListItem}>
                                  <View style={styles.left}>
                                    <Thumbnail
                                      square
                                      source={{ uri: pet?.avatar }}
                                      style={{
                                        backgroundColor: '#F2F2F2',
                                        borderRadius: wp(2),
                                        width: wp(11), height: wp(11),
                                      }}
                                    />
                                    <Text
                                    numberOfLines={1}
                                      style={{ marginLeft: 10, fontWeight: 'bold' , width:RFValue(80)}}>
                                      {pet.name}
                                    </Text>
                                  </View>
                                  <View style={styles.right}>

                                    {props.shareOnPixxy ?
                                      <View style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 12, marginTop: 10 }}>
                                        <TouchableOpacity
                                          onPress={() => {
                                            let list = props.viewerContent
                                            let find = list.pets.findIndex(obj => obj.pet.id == pet.id && obj?.Pixxy)
                                            if (find == -1) {
                                              list.pets.push({ Pixxy: true, pet: pet })
                                              let listApi = props.forApiData
                                              listApi.pets.push(JSON.stringify({ 'Pixxy': true, 'pet_id': pet.id }))
                                              props.updateState({
                                                viewerContent: list,
                                                forApiData: listApi
                                              });
                                            }
                                          }}
                                          style={styles.btn}>
                                          <Text numberOfLines={1} style={[styles.shareLink, { fontWeight: 'bold' }]} note>Pixxy</Text>
                                        </TouchableOpacity>
                                      </View>
                                      : null
                                    }

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                      <TouchableOpacity
                                        disabled={pet?.sharePetId ? true : false}
                                        onPress={() => {
                                          let list = props.viewerContent
                                          let find = list.pets.findIndex(obj => obj.pet.id == pet.id && obj?.Timeline)
                                          if (find == -1) {
                                            list.pets.push({ Timeline: true, pet: pet, index: index })
                                            let listApi = props.forApiData
                                            petBtnStatus({ id: pet.id, index, type: 'pet' });
                                            listApi.pets.push(JSON.stringify({ 'Timeline': true, 'pet_id': pet.id, index: index }))
                                            props.updateState({
                                              viewerContent: list,
                                              forApiData: listApi
                                            });
                                          }
                                        }}
                                        style={[styles.btn, { backgroundColor: pet?.sharePetId ? TEXT_INPUT_LABEL : BLUE_NEW, borderColor: pet?.sharePetId ? TEXT_INPUT_LABEL : BLUE_NEW }]}>
                                        <Text numberOfLines={1} style={[styles.shareLink, { fontWeight: 'bold', color: 'white' }]} note>Timeline</Text>
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
                  //     <Text style={styles.titleSteps}>Pages</Text>
                  //     <ScrollView style={styles.listContainer}>
                  //       <View style={styles.horizontalList}>
                  //         {pages.map((page, index) => (
                  //           <TouchableOpacity
                  //             onPress={() => {
                  //               let list = props.viewerContent
                  //               let find = list.page.findIndex(obj => obj.id == page.id)
                  //               if (find == -1) {
                  //                 list.page.push(page)
                  //                 let listApi = props.forApiData
                  //                 listApi.page.push({ "page_id": page.id })
                  //                 props.updateState({
                  //                   viewerContent: list,
                  //                   forApiData: listApi
                  //                 });
                  //               }
                  //             }}>
                  //             <View style={{ marginBottom: wp(5) }}>
                  //               <View style={{
                  //                 borderWidth: page.page_id == pageSelectId ? 2 : 0,
                  //                 borderColor: '#f47d8a',
                  //                 borderRadius: wp(2),
                  //                 padding: 3
                  //               }}>
                  //                 <Thumbnail
                  //                   medium
                  //                   square
                  //                   source={{ uri: page.avatar }}
                  //                   style={{ width: wp(35), height: hp(10), borderRadius: wp(2), }}
                  //                 />
                  //               </View>
                  //               <Text style={{ textAlign: 'center', color: page.page_id == pageSelectId ? '#f47d8a' : '#182A53' }}>{page.name}</Text>

                  //             </View>
                  //           </TouchableOpacity>
                  //         ))}
                  //       </View>
                  //     </ScrollView>
                  //   </View>
                ) : step === 3 ? (
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.titleSteps}>Communities</Text>
                    <ScrollView style={styles.listContainer}>
                      <View style={styles.horizontalList}>
                        {/* ! owner groups may be needed in future */}
                        {/* {groups.map((group, index) => (
                          <TouchableOpacity
                            onPress={() => {
                              let list = props.viewerContent
                              let find = list.group.findIndex(obj => obj.id == group.id)
                              if (find == -1) {
                                list.group.push(group)
                                let listApi = props.forApiData
                                listApi.group.push({ "id": group.id })
                                props.updateState({
                                  viewerContent: list,
                                  forApiData: listApi
                                });
                              }
                              setgroupSelectIds([...groupSelectIds,Number(group.id)]);
                            }}
                           
                            style={{width:'33%',alignItems:'center',marginVertical:wp(3)}}
                          >
                            <View
                              style={{
                                borderWidth: checkIds(group.id) ? 2 : 0,
                                borderColor: '#f47d8a',
                                borderRadius: wp(2),
                                padding: 3,
                              }}
                            >
                              {group?.avatar?.includes('.svg') ?
                                <SvgUri
                                  width={RFValue(45)}
                                  height={RFValue(45)}
                                  uri={group?.avatar}
                                />: 
                              <Thumbnail
                                square
                                source={{ uri: group.avatar }}
                                style={{
                                  width:RFValue(45) ,
                                  height: RFValue(45),
                                  borderRadius: wp(2),
                                }}
                              />}
                              
                            </View>
                            <Text style={{ textAlign: 'center', color:  checkIds(group.id) ? '#f47d8a' : '#182A53' }}>
                            {group.name.length>10?group.name.substr(0,10)+'..':group.name}
                            </Text>
                            {group.privacy==2&&<Icon name="lock" type="EvilIcons" style={{fontSize:25,color:PINK,position:'absolute',top:!group?.avatar?.includes('.svg')?wp(18):wp(18)}} />}
                          </TouchableOpacity>
                        ))} */}
                        {joinedGroups.map((group, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              let list = props.viewerContent
                              let find = list.group.findIndex(obj => obj.id == group.id)
                              if (find == -1) {
                                list.group.push(group)
                                let listApi = props.forApiData
                                listApi.group.push({ "id": group.id })
                                props.updateState({
                                  viewerContent: list,
                                  forApiData: listApi
                                });
                              }
                              setgroupSelectIds([...groupSelectIds, Number(group.id)]);
                            }}

                            style={{ width: '33%', alignItems: 'center', marginVertical: wp(3) }}
                          >
                            <View
                              style={{
                                borderWidth: checkIds(group.id) ? 2 : 2,
                                borderColor:checkIds(group.id)?PINK:TEXT_INPUT_LABEL,
                                borderRadius: wp(2),
                                padding: 3,
                              }}
                            >
                              {group?.avatar?.includes('.svg') ?
                                <SvgUri
                                  width={RFValue(45)}
                                  height={RFValue(45)}
                                  uri={group?.avatar}
                                /> :
                                <Thumbnail
                                  square
                                  source={{ uri: group.avatar }}
                                  style={{
                                    width: RFValue(45),
                                    height: RFValue(45),
                                    borderRadius: wp(2),
                                  }}
                                />}

                            </View>
                            <Text style={{ textAlign: 'center', color: checkIds(group.id) ? '#f47d8a' : '#182A53' }}>
                              {group.name.length > 10 ? group.name.substr(0, 10) + '..' : group.name}
                            </Text>
                            {group.privacy == 2 && <Icon name="lock" type="EvilIcons" style={{ fontSize: 25, color: PINK, position: 'absolute', top: !group?.avatar?.includes('.svg') ? wp(19.5) : wp(19.5) }} />}
                          </TouchableOpacity>
                        ))}

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
    justifyContent: 'space-evenly',
    marginBottom: wp(5)
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

const mapStateToProps = state => {
  return{
  user: state.user.user,
  myPets: state.mypets.pets,
  }
};

export default connect(mapStateToProps)(GroupPagePixxy);
