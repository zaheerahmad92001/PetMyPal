import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ImageBackground,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback, Dimensions
} from 'react-native';
import { Thumbnail, Button, Icon } from 'native-base';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import { THEME_FONT } from '../../constants/fontFamily';
import { grey, HEADER, PINK, White } from '../../constants/colors';
import VideoPlayer from 'react-native-video-controls';
import moment from 'moment';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';



import FastImage from 'react-native-fast-image';
import Emoji from 'react-native-emoji';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CommentsView from './../../views/ComponentsNew/commentsView';

import PostLink from './PostLink';
import { postTimeAndReaction } from '../../utils/DateFuncs';
import MentionHashtagTextView from "react-native-mention-hashtag-text";
import YoutubePlayer from 'react-native-youtube-iframe';
import { Pages } from 'react-native-pages';
import { Divider } from 'react-native-elements'
import { sponsored_Icon, playBtn } from '../../constants/ConstantValues'

let imgHeight = 300;
let mapHeight = 300;
let videoToImg = '';
var screenWidth = Dimensions.get('window').width;
var imageHeight = Dimensions.get('window').width / 2;

export default (RenderItemCard = ({
  item,
  index,
  state,
  props,
  modalVisible,
  onPressOut,
  onLongPress,
  reactions,
  shareModalVisible,
  getFeelingIcon,
  handleTrends,
  selectedPost,
  postsOf,
  nodeRef,
  ReportPost,
  DeletePost,
  UpdatePost,
}) => {
  const { reaction } = state;
  const [videomodal, setvideomodal] = useState(false);
  const [video, setvideo] = useState('')
  let _menu = useRef()
  var _time = ''
  let { time, feeling } = postTimeAndReaction(item.time);
  let { time: originalTime, feeling: originalFeeling } = postTimeAndReaction(
    item.shared_info && item.shared_info.time,
  );
  if (item?.postFile_width && item?.postFile_width) {
    screenWidth = Dimensions.get('window').width;
    const scaleFactor = item?.postFile_width / screenWidth;
    imageHeight = Math.round(item?.postFile_height / scaleFactor);
  }
  if (!item?.postFile_width && item?.event?.width) {
    screenWidth = Dimensions.get('window').width;
    const scaleFactor = item?.event?.width / screenWidth;
    imageHeight = Math.abs(item?.event?.height / scaleFactor);
  }

  let userId = undefined
  if (props?.user?.user_data) {
    userId = props?.user?.user_data?.user_id   // becoze  we r getting user from redux as state.user.user on some screens
  } else {
    userId = props?.user?.user?.user_data?.user_id  // becoze on petOwnerView we r getting user from redux as state.user due to some other props i am not changing it
  }

  function formatedDate({ date, time }) {
    if (date && time) {
      return moment(date, 'YYYY-MM-DD').format("ll").split(',')[0];
    }
  }

  if (time?.includes('ago') || time?.includes('Just now')) {
    _time = time
  } else {
    _time = `${time} ago`
  }

  let photoList = [];
  if (item?.photo_pixxy?.length > 0) {
    item?.photo_pixxy?.forEach(i => {
      photoList.push({ image: i.image });
    });
  } else if (item?.photo_multi?.length > 0) {
    item.photo_multi.forEach(i => {
      photoList.push({ image: i.image });
    });
  } else if (item.postPhoto) {
    photoList.push({ image: item.postPhoto });
  } else if (
    item?.postFile_full?.toLowerCase()?.includes('jpeg') ||
    item?.postFile_full?.toLowerCase()?.includes('jpg') ||
    item?.postFile_full?.toLowerCase()?.includes('gif') ||
    item?.postFile_full?.toLowerCase()?.includes('png')
  ) {
    photoList.push({ image: item.postFile_full });
  }

  if (
    item?.postFile_full?.includes('.mp4') ||
    item?.postFile_full?.includes('.mp3')
  ) {
    let extension = item?.postFile_full?.split('.').pop()
    let firtst = item?.postFile_full.replace('/video', '/photo')
    let second = firtst.replace('_video', '_photo_small')
    videoToImg = second.replace(extension, 'jpg')
    // photoList.push({ image: item.postFile_full });

  }


  function displayArt() {
    if (item?.color_post?.color_1 && item.color_post.color_1 != '') {
      return (
        <LinearGradient
          colors={[item?.color_post.color_1, item.color_post.color_2]}
          style={styles.gradientStyle}>
          <Text style={[styles.showdec, { color: item?.color_post.text_color, textAlign: 'center' }]}>
            {item?.Orginaltext}
          </Text>
        </LinearGradient>
      );
    } else if (item?.color_post?.full_image && item.color_post.full_image != '') {
      return (
        <ImageBackground
          source={{
            uri: item?.color_post?.full_image ? '' + item.color_post.full_image : null,
          }}
          style={styles.imgBG}>
          <Text
            style={{
              color: item.color_post.text_color,
              fontSize: 28,
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
            {item?.Orginaltext}
          </Text>
        </ImageBackground>
      );
    }
  }

  function displayPdf() {
    return (
      <View
        style={styles.imgBG}>
        <TouchableOpacity
          onPress={async () => await Linking.openURL(item.postFile_full)}>
          <FastImage
            source={require('../../assets/images/pdf.png')}
            style={{ width: 100, height: 100 }}
          />
          <Text style={{ fontSize: 18 }}>{item?.postFileName}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function displayMap() {
    let map = `https://maps.googleapis.com/maps/api/staticmap?center=${item?.postMap}&zoom=15&size=400x300&maptype=roadmap&markers=color:red%7Clabel:A%7C${item?.postMap}&key=AIzaSyB1ATljOQdQSbKf_-icbQbfQqBqZlmwD0I`;
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <FastImage
          style={{ width: '100%', height: mapHeight }}
          resizeMode="cover"
          source={{ uri: map ? map : null }}
        />
      </View>
    );
  }

  function displayPostSticker() {
    return (
      <View style={styles.Sticker}>
        <FastImage
          style={{
            width: null,
            height: null,
            flex: 1,
          }}
          source={{ uri: item.postSticker ? '' + item.postSticker : null }}
        />
      </View>
    );
  }

  const goToScreen = () => {

    let rid = item.recipient.type;

    if (item?.group_id != 0) {
      props.navigation.navigate({
        routeName: 'Group',
        key: 'Group',
        params: { group: item.group_recipient },
      });
    } else if (item?.page_id != 0) {
      props.navigation.navigate({
        routeName: 'Page',
        key: 'Page',
        params: { page: item?.publisher },
      });
    }
    else if (item?.event_id != 0) {
      props.navigation.navigate({
        routeName: 'EventDetails',
        key: 'EventDetails',
        params: { item: item?.event, btnShow: true, goingShow: true, interestShow: true },
      });
    } else if (rid == "pet") {
      props.navigation.navigate({
        routeName: 'PetProfile',
        key: 'PetProfile',
        params: { item: item?.recipient },
      });
    } else if (item?.parent_id != '0') {
      props.navigation.navigate({
        routeName: 'PetProfile',
        key: 'PetProfile',
        params: { item: item?.shared_info?.publisher },
      });
    } else if (item?.user_id != 0) {
      if (item?.user_id == userId) { // remove .user
        props.navigation.navigate('UserProfile');
      }
    }


  };


  const goToShareScreen = () => {
    if (item?.publisher?.type == 'user') {

      if (userId == item?.publisher?.user_id) { // remove .user
        props.navigation.navigate('UserProfile');
      } else {
        props.navigation.navigate({
          routeName: 'Profile',
          key: 'Profile',
          params: { user_id: item?.user_id },
        });
      }
    } else if (item?.publisher?.type == 'pet') {
      if (item?.recipient_id != '0') {  // 14-03-2022 
        props.navigation.navigate({
          routeName: 'PetProfile',
          key: 'PetProfile',
          params: { item: item?.publisher?.user_id },
        });
      }
    } else if (item?.shared_info) {
      if (item?.shared_info?.group_id != 0) {
        props.navigation.navigate({
          routeName: 'Group',
          key: 'Group',
          params: { group: item?.shared_info?.group_id },
        });
      } else if (item?.shared_info?.page_id != 0) {
        props.navigation.navigate({
          routeName: 'Page',
          key: 'Page',
          params: { page: item?.shared_info?.page_id },
        });
      } else if (item?.shared_info.event_id != '0') {
        if (item?.shared_info?.user_id == props?.user?.user_data?.user_id) {
          props.navigation.navigate('UserProfile');
        } else {
          props.navigation.navigate({
            routeName: 'Profile',
            key: 'Profile',
            params: { user_id: item?.publisher?.user_id },
          });
        }
      } else if (item?.publisher.user_id != '0') {
        if (item?.publisher?.user_id == props?.user?.user_data?.user_id) {
          props.navigation.navigate('UserProfile');
        } else {
          props.navigation.navigate({
            routeName: 'Profile',
            key: 'Profile',
            params: { user_id: item?.publisher?.user_id },
          });
        }
      }
    }
  };


  const goToPostDetailScreen = (item, index) => {
    selectedPost(item, index) // parent fun call
    _menu?.hide()
    props.navigation.navigate({
      routeName: 'PostDetail',
      key: 'PostDetail',
      params: item,
    });
  }

  const goToSharedPostUser = () => {

    if (item?.shared_info?.publisher?.type == 'user') {
      // if (item?.publisher?.type == 'user') { //16 feb 2022
      console.log('item?.publisher?.type', item?.publisher?.type);

      if (userId == item?.shared_info?.publisher?.user_id) { // remove .user
        props.navigation.navigate('UserProfile');
      } else {
        props.navigation.navigate({
          routeName: 'Profile',
          key: 'Profile',
          params: { user_id: item?.shared_info?.publisher?.user_id },
        });
      }

    }
    else if (item?.shared_info?.publisher?.type == 'pet') {
      // else if (item?.publisher?.type == 'pet') { //16 feb 2022
      props.navigation.navigate({
        routeName: 'PetProfile',
        key: 'PetProfile',
        params: { item: item.shared_info?.publisher },
      });
    }
  }

  const showMenu = () => { _menu.show() }

  return (
    <View>
      {
        item?.shared_info ?
          <View ref={ref => nodeRef(item.post_id, ref)} key={item.id}
            style={styles.arrayBorder}>
            <View style={[styles.containerView]}>
              <View style={styles.rowCenter}>
                <TouchableOpacity
                  style={styles.btnStyle}
                  onPress={() => { goToShareScreen() }}>
                  <Thumbnail
                    square
                    source={{
                      uri: item?.publisher?.avatar
                        ? '' + item?.publisher?.avatar
                        : null,
                    }}
                    style={{ backgroundColor: '#F2F2F2', width: item.postText ? 60 : 60, height: item.postText ? 60 : 60 }}
                  />
                </TouchableOpacity>

                <View style={styles.headerView}>
                  <View style={styles.rowSpaceBetween}>
                    <View style={[styles.rowCenter], { width: wp(68), flexDirection: 'row', }}>
                      <Text
                        onPress={() => goToShareScreen()}
                        style={styles.publisherName}>
                        {item?.publisher?.name}
                      </Text>
                      {item?.group_id == '0' ? // 04/03/2022
                        <Text style={{ ...styles.feelings }}> shared a post </Text>
                        :
                        <View style={styles.rowCenter}>
                          <Icon
                            name={'arrowright'}
                            type={'AntDesign'}
                            style={styles.rightArrow}
                          />
                          <Text
                            onPress={() => goToScreen()}
                            style={styles.publisherName}>
                            {item?.group_recipient?.group_name.length > 10 ? item?.group_recipient?.group_name.toString().substring(0,10) + '...' : `${item?.group_recipient?.group_name}`}
                          </Text>
                        </View>
                      }
                    </View>
                    <TouchableOpacity
                      onPress={() => showMenu()}
                      style={styles.menuContainer}>
                      <Icon name={'more-vertical'} type={'Feather'} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.menuView}>

                    <Menu ref={(ref) => { _menu = ref }}>
                      <MenuItem
                        style={styles.menuItemStyle}
                        onPress={() => goToPostDetailScreen(item, index)}>View Post</MenuItem>
                      <MenuDivider />
                      {userId != item?.user_id ?    /// User can`t Report his/her post
                        <MenuItem
                          style={styles.menuItemStyle}
                          onPress={() => {
                            _menu?.hide()
                            ReportPost(item, index)
                          }}>Report Post</MenuItem> : null}
                      <MenuDivider />
                      {userId == item?.user_id ?
                        <MenuItem
                          style={styles.menuItemStyle}
                          onPress={() => {
                            _menu?.hide()
                            DeletePost(item, index)
                          }}>Delete
                        </MenuItem> : null
                      }
                      <MenuDivider />
                      {userId == item?.user_id ?
                        <MenuItem
                          style={styles.menuItemStyle}
                          onPress={() => {
                            _menu?.hide()
                            UpdatePost(item, index)
                          }}>Update
                        </MenuItem> : null
                      }

                    </Menu>
                  </View>

                  <Text style={styles.timeText}>{_time}</Text>

                </View>
              </View>

              <View style={[styles.rowCenter, { padding: 10 }]}>
                {item?.group_id == '0' ?     // 04/03/2022
                  <TouchableOpacity
                    style={{ ...styles.btnStyle, alignSelf: 'flex-start' }}
                    onPress={() => goToSharedPostUser()}>
                    <Thumbnail
                      square
                      source={{
                        uri: item?.shared_info?.publisher?.avatar
                          ? '' + item?.shared_info?.publisher?.avatar
                          : null,
                      }}
                      style={{ backgroundColor: '#F2F2F2' }}
                    />
                  </TouchableOpacity> : null
                }

                {/* Publisher name and image */}

                {item?.group_id == '0' ?   // 04/03/2022
                  <View style={{marginTop: 15 }}>

                    <View style={styles.rowCenter}>
                      <Text
                        style={styles.publisherName}
                        onPress={() => goToSharedPostUser()}>
                        {item?.shared_info?.publisher?.name}
                      </Text>

                      {item?.shared_info?.pixxy_name ?
                        <View style={styles.rowCenter}>
                          <Icon
                            name={'arrowright'}
                            type={'AntDesign'}
                            style={styles.rightArrow}
                          />
                          <Text style={styles.publisherName}>Pixxy</Text>
                        </View>
                        : null
                      }

                      {item?.page_event_id != '0' ?
                        <Text style={styles.feelings}>  Created new event</Text>
                        : null
                      }
                    </View>

                    <View style={styles.rowCenter}>
                      {item.postFeeling ? (
                        <>
                          <Text
                            style={styles.feelings}>
                            {originalFeeling} {item.postFeeling}
                          </Text>
                          <Emoji
                            name={getFeelingIcon(item.postFeeling)}
                            style={styles.emojiStyle}
                          />
                        </>
                      ) : null}
                    </View>
                    <Text style={styles.timeText}>{originalTime}</Text>
                  </View>
                  : null
                }
              </View>

              <View style={{ height: 'auto' }}>
                <TouchableOpacity
                  onPress={() => { goToPostDetailScreen(item, index) }}
                  style={{ marginHorizontal: wp(4) }}
                >
                  {item?.postLink ?
                    <PostLink item={item} />
                    : (item?.postText && !item?.color_post) ? (
                      <View style={{ marginVertical: wp(0) }}>
                        <MentionHashtagTextView
                          mentionHashtagPress={handleTrends}
                          trend_data={item}
                          mentionHashtagColor={PINK}>
                          {item?.Orginaltext}
                        </MentionHashtagTextView>
                      </View>
                    ) : null}
                </TouchableOpacity>

                {/* {!item.postText && item?.event ? ( */}
                {item?.event ? (   //25-03-2022
                  <View style={{ marginBottom: wp(14) }}>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate('EventDetails', { item: item?.event, btnShow: true, goingShow: true, interestShow: true })}
                      style={styles.imgContainer(screenWidth, imageHeight)}
                    >
                      <Image
                        source={{ uri: item?.event?.cover }}
                        style={styles.imgStyle}
                      />
                      <View style={{ marginHorizontal: wp(4) }}>
                        <Text style={{ marginVertical: wp(2) }}>{item?.event?.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Icon type="FontAwesome5" name="calendar" style={{ fontSize: 20, marginLeft: 2, marginRight: 5, marginVertical: 5 }} />
                          <Text>{formatedDate({ date: item?.event?.start_date, time: item?.event?.start_time })} {'-'} {formatedDate({ date: item?.event?.end_date, time: item?.event?.end_time })}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>



              <View style={{ borderRadius: 5, marginTop: 10, }}>
                <View
                  style={{ width: '100%' }}>
                  {photoList?.length > 0 ? (
                    <View style={styles.imgContainer(screenWidth, imageHeight)}>
                      <Pages
                        key={index}
                        indicatorColor={PINK}
                        indicatorOpacity={0.2}
                        indicatorPosition={photoList?.length > 1 ? 'bottom' : 'none'}
                      >
                        {photoList?.map((obj, ind) => {
                          let extension = obj?.image?.split('.').pop().toLowerCase()
                          let firtst = obj?.image.replace('/video', '/photo')
                          let second = firtst.replace('_video', '_photo_small')

                          extension != 'jpeg' ||
                            extension != 'jpg' ||
                            extension != 'gif' ||
                            extension != 'png' ?

                            videoToImg = second.replace(extension, 'jpg')
                            :
                            null

                          return (
                            <TouchableOpacity
                              key={index}
                              activeOpacity={1}
                              onPress={() => modalVisible(photoList, item)}
                              style={{ flex: 1, }}>
                              {extension == 'jpeg' ||
                                extension == 'jpg' ||
                                extension == 'gif' ||
                                extension == 'png' ?

                                <Image
                                  style={styles.imgStyle}
                                  source={{ uri: obj.image }}
                                />
                                :
                                <Image
                                  style={styles.imgStyle}
                                  source={{ uri: videoToImg }} />
                                // <Image source={{ uri: obj.image }} />

                              }
                            </TouchableOpacity>
                          )
                        })

                        }
                      </Pages>
                    </View>
                  ) : null}
                  {
                    item?.postFile_full?.includes('.mp4') ||
                      item?.postFile_full?.includes('.mp3') ?

                      <TouchableWithoutFeedback
                        onPress={() => {
                          setvideo(item?.postFile_full)
                          setvideomodal(!videomodal)
                        }}
                      >

                        <View>
                          <Image
                            source={{ uri: videoToImg }}
                            resizeMode={'cover'}
                            style={{ width: '100%', height: 300 }}
                          />
                          <View style={styles.playbtnView}>
                            <Image
                              source={playBtn}
                              resizeMode={'contain'}
                            />
                          </View>
                        </View>

                      </TouchableWithoutFeedback>

                      :
                      item?.postYoutube ?
                        <View style={styles.video}>
                          <YoutubePlayer
                            height={250}
                            width={'100%'}
                            videoId={item?.postYoutube}
                          />
                        </View>
                        : null

                  }

                
                  {!_.isNull(item.postSticker) && !_.isEmpty(item.postSticker)
                    ? displayPostSticker()
                    : null}
                  {item.postFile != '' &&
                    item?.postFile?.includes('pdf') &&
                    displayPdf()}
                  {item.postMap != '' &&
                    displayMap()}
                  {item?.color_post != '' &&
                    displayArt()
                  }
                  {item.reactionVisible ? reactions(item, index) : null}
                </View>
              </View>
              <View style={{ marginHorizontal: wp(4) }}>
                <View style={styles.rowCenter}>
                  <View style={styles.rowCenterInnerView}>
                    <View style={styles.btnOuterView}>
                      <Button
                        onPress={() => onLongPress(index)}
                        onPressOut={() => onPressOut(index)}
                        transparent>
                        {item?.reaction?.is_reacted ? (
                          <FastImage
                            style={styles.imgIcon1}
                            source={require('../../assets/images/reactions/final-0006.png')}
                            
                            // source={{
                            //   uri: reaction[(item?.reaction?.type)]
                            //     ? '' + reaction[item.reaction.type]
                            //     : null,
                            // }}
                          />
                        ) : (
                          <IonicIcon name="heart-outline" color="#424242" size={20} />
                        )}

                        <Text
                          adjustsFontSizeToFit
                          minimumFontScale={0.5}
                          style={{
                            fontSize: RFValue(12),
                            fontFamily: THEME_FONT,
                            textAlign: 'center',
                          }}>
                          {'' + item?.reaction?.count}
                        </Text>
                      </Button>

                      <View
                        style={{
                          borderRadius: 12,
                          overflow: 'hidden',
                          height: hp(4),
                          justifyContent: 'center',
                        }}>
                        <Button
                          style={{
                            alignSelf: 'center',
                            backgroundColor: '#FDEDEE',
                            paddingHorizontal: 15,
                          }}
                          onPress={() => goToPostDetailScreen(item, index)}
                          transparent>
                          <MIcon name="comment-outline" color="#F596A0" size={20} />
                          <Text
                            adjustsFontSizeToFit
                            minimumFontScale={0.5}
                            style={{
                              fontSize: RFValue(12),
                              color: '#F596A0',
                              fontFamily: THEME_FONT,
                            }}>
                            {' ' + item?.post_comments}
                          </Text>
                        </Button>
                      </View>
                    </View>
                    <Button transparent onPress={() => shareModalVisible(item)}>
                      <IonicIcon
                        name="md-share-social-outline"
                        color="#424242"
                        size={20}
                      />
                      <Text
                        adjustsFontSizeToFit
                        minimumFontScale={0.5}
                        style={{
                          fontSize: RFValue(12),
                          fontFamily: THEME_FONT,
                          textAlign: 'center',
                        }}>
                        {' ' + item?.post_share}
                      </Text>
                    </Button>
                  </View>
                </View>
                <CommentsView
                  openComments={() => goToPostDetailScreen(item, index)}
                  item={item}
                  user={props.user}
                  navigation={props.navigation}
                  postTimeAndReaction={postTimeAndReaction}
                />
              </View>
            </View>
          </View>

          :

          <View
            ref={ref => nodeRef(item.post_id, ref)}
            key={item.id}
            style={[styles.outerView]}
          >

            {
              item.postType == 'custom_post' ||
                item.postType == 'advertisement' ?
                <View style={styles.sponsoredOuterView}>
                  <Divider
                    color={PINK}
                    width={4}
                    style={styles.divider}

                  />
                  <View style={styles.sponsoredView}>
                    <Thumbnail
                      source={sponsored_Icon}
                      small
                      style={{ width: 15, height: 15, right: 5 }}
                    />
                    <Text style={styles.sponsoredText}>Sponsored Woof!</Text>
                  </View>
                </View>
                : null
            }

            <View style={styles.containerView}>
              <View style={
                item.postType == 'custom_post' ||
                  item.postType == 'advertisement' ?
                  [styles.rowCenter, { marginTop: 10 }] :
                  [styles.rowCenter]
              }>

                <TouchableOpacity
                  style={{ ...styles.btnStyle, alignSelf: 'flex-start' }}
                  onPress={() => { goToShareScreen() }}>
                  <Thumbnail
                    square
                    source={{
                      uri: item?.publisher?.avatar
                        ? '' + item?.publisher?.avatar
                        : item?.group_id != 0
                          ? '' + item?.group_recipient?.avatar
                          : '',
                    }}
                  />
                </TouchableOpacity>

                {/* Publisher name and image */}
                <View style={[styles.headerView]}>
                  <View style={styles.rowSpaceBetween}>
                    <View style={[styles.rowCenter,]}>

                      <Text onPress={() => { goToShareScreen() }}
                        style={styles.publisherName}>
                        {item?.publisher?.name}
                      </Text>



                      {/* Recipient View // shared on  */}

                      {
                        item.recipient_id != '0' && item?.event && item?.postText ?
                          <View style={[styles.recipientView, { marginTop: 2 }]}>
                            <Icon
                              name={'arrowright'}
                              type={'AntDesign'}
                              style={styles.rightArrow}
                            />
                            <Text
                              onPress={() => goToScreen()}
                              style={styles.publisherName}>
                              {item?.event?.name?.length > 10 ? item?.event?.name.toString().substring(0, 10) + '...' : item?.event?.name}
                            </Text>
                          </View>
                          : null
                      }

                      {
                        item.recipient_id != '0' && postsOf != item.recipient_id ?
                          // postsOf just avoid to show own name when user visit to that Profile
                          <View style={[styles.recipientView, { marginTop: 2 }]}>
                            <Icon
                              name={'arrowright'}
                              type={'AntDesign'}
                              style={styles.rightArrow}
                            />
                            <Text
                              onPress={() => goToScreen()}
                              style={styles.publisherName}>
                              {item?.recipient?.full_name.length > 10 ? item?.recipient?.full_name.toString().substring(0, 10) + '...' : `${item?.recipient?.full_name}`}
                            </Text>
                          </View>
                          : null
                      }

                      {
                        (item?.group_id != 0 && item?.user_id != 0) ||
                          (item?.page_id != 0 && item?.user_id != 0) ?
                          postsOf != item?.group_id ?   // just avoid to show own name when user visit that group / community  
                            <TouchableOpacity
                              onPress={() => { goToScreen() }}>
                              <IonicIcon
                                name="arrow-forward-outline"
                                color="#424242"
                                size={20}
                                style={{ marginBottom: wp(-6) }}
                              />
                              <Text style={styles.groupName}>
                                {item?.group_recipient?.group_title.length > 10 ? item?.group_recipient?.group_title?.substring(0,10) + '...' : item?.group_recipient?.group_title}
                              </Text>
                            </TouchableOpacity>
                            : null
                          : null
                      }
                      {
                        item?.page_event_id != '0' ?
                          <Text style={styles.feelings}>  Created new event</Text>
                          : null
                      }
                    </View>

                    <TouchableOpacity
                      onPress={() => showMenu()}
                      style={styles.menuContainer}>
                      <Icon name={'more-vertical'} type={'Feather'} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.menuView}>
                    <Menu ref={(ref) => { _menu = ref }}>
                      <MenuItem onPress={() => goToPostDetailScreen(item, index)}>View Post</MenuItem>
                      <MenuDivider />
                      {userId != item?.user_id ?  // User can`t report his/her post
                        <MenuItem
                          style={styles.menuItemStyle}
                          onPress={() => {
                            _menu?.hide()
                            ReportPost(item, index)
                          }}>Report Post</MenuItem> : null}

                      {userId == item?.user_id ?
                        <MenuItem
                          style={styles.menuItemStyle}
                          onPress={() => {
                            _menu?.hide()
                            DeletePost(item, index)
                          }}>Delete
                        </MenuItem> : null}
                      <MenuDivider />
                      {userId == item?.user_id ?
                        <MenuItem
                          style={styles.menuItemStyle}
                          onPress={() => {
                            _menu?.hide()
                            UpdatePost(item, index)
                          }}>Update
                        </MenuItem> : null
                      }
                    </Menu>
                  </View>

                  <View style={[styles.rowCenter, { marginTop: -8 }]}>
                    {item?.postFeeling ? (
                      <>
                        <Text style={styles.feelings}>{feeling} {item?.postFeeling}</Text>
                        <Emoji name={getFeelingIcon(item.postFeeling)} style={styles.emojiStyle} />
                      </>
                    ) : null}
                  </View>
                  <Text style={styles.timeText}>{_time}</Text>
                </View>
              </View>


              <View style={{ height: 'auto', }}>
                <TouchableOpacity
                  onPress={() => { goToPostDetailScreen(item, index) }}
                  style={{ marginHorizontal: wp(4) }}
                >
                  {item?.postLink ?
                    <PostLink item={item} />
                    : (item?.postText && !item?.color_post) ? (
                      <View style={{ marginVertical: wp(2) }}>

                        <MentionHashtagTextView
                          mentionHashtagPress={handleTrends}
                          trend_data={item}
                          mentionHashtagColor={PINK}>
                          {item?.Orginaltext}
                        </MentionHashtagTextView>
                      </View>
                    ) : null}
                </TouchableOpacity>

                {/* {!item.postText && item?.event ? (   */}
                {item?.event ? (  // 25-03-2022
                  <View style={{ marginBottom: wp(16) }}>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate('EventDetails', { item: item?.event, btnShow: true, goingShow: true, interestShow: true })}
                      style={styles.imgContainer(screenWidth, imageHeight)}>

                      <Image
                        source={{ uri: item?.event?.cover }}
                        style={styles.imgStyle} />

                      <View style={{ marginHorizontal: wp(4) }}>
                        <Text style={{ marginVertical: wp(2) }}>{item?.event?.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Icon type="FontAwesome5" name="calendar" style={{ fontSize: 20, marginLeft: 2, marginRight: 5, marginVertical: 5 }} />
                          <Text>{formatedDate({ date: item?.event?.start_date, time: item?.event?.start_time })} {'-'} {formatedDate({ date: item?.event?.end_date, time: item?.event?.end_time })}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null}

              </View>



              <View style={styles.rowCenter}>
                <View style={{ width: '100%' }}>
                  {photoList?.length > 0 ? (
                    <View style={styles.imgContainer(screenWidth, imageHeight)}>
                      <Pages
                        key={index}
                        indicatorColor={PINK}
                        indicatorOpacity={0.2}
                        indicatorPosition={photoList?.length > 1 ? 'bottom' : 'none'}
                      >
                        {photoList?.map((obj, index) => {

                          let extension = obj?.image?.split('.').pop().toLowerCase()
                          let firtst = obj?.image.replace('/video', '/photo')
                          let second = firtst.replace('_video', '_photo_small')

                          {
                            extension != 'jpeg' ||
                              extension != 'jpg' ||
                              extension != 'gif' ||
                              extension != 'png' ?
                              videoToImg = second.replace(extension, 'jpg')
                              :
                              null
                          }

                          return (
                            <TouchableOpacity
                              key={index}
                              activeOpacity={1}
                              onPress={() => modalVisible(photoList, item)}
                            >
                              {extension == 'jpeg' ||
                                extension == 'jpg' ||
                                extension == 'gif' ||
                                extension == 'png' ?

                                <Image
                                  source={{ uri: obj.image }}
                                  style={styles.imgStyle}
                                />
                                :
                                <View>
                                  <Image
                                    source={{ uri: videoToImg }}
                                    style={styles.imgStyle}
                                  />
                                </View>
                              }
                            </TouchableOpacity>
                          )
                        })

                        }
                      </Pages>
                    </View>
                  )
                    : null}

                  {item?.postFile_full?.includes('.mp4') ||
                    item?.postFile_full?.includes('.mp3') ?
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setvideo(item?.postFile_full)
                        setvideomodal(true)
                      }}
                    >

                      <View>
                        <Image
                          source={{ uri: videoToImg }}
                          resizeMode={'cover'}
                          style={{ width: '100%', height: 300 }}
                        />
                        <View style={styles.playbtnView}>
                          <Image
                            source={playBtn}
                            resizeMode={'contain'}
                          />
                        </View>
                      </View>

                    </TouchableWithoutFeedback>

                    :
                    item?.postYoutube ?
                      <View style={styles.video}>
                        <YoutubePlayer
                          height={250}
                          width={'100%'}
                          videoId={item?.postYoutube}
                        />
                      </View>
                      : null

                  }

                  {!_.isNull(item.postSticker) && !_.isEmpty(item.postSticker)
                    ? displayPostSticker()
                    : null}
                  {item?.postMap != '' &&
                    // item.postMap.includes('https') &&
                    displayMap()
                  }

                  {item?.color_id != '' &&
                    displayArt()
                  }

                  {
                    item?.postFile != '' &&
                    item?.postFile?.includes('pdf') &&
                    displayPdf()
                  }

                  {item?.reactionVisible ? reactions(item, index) : null}
                </View>
              </View>
              <View style={{ marginHorizontal: wp(4) }}>
                <View style={styles.rowCenter}>
                  <View style={styles.middleView}>
                    <View style={styles.btnContainer}>
                      <Button
                        // onPress={() => is_reacted(item)}
                        onPress={() => onLongPress(index)}
                        onPressOut={() => onPressOut(index)}
                        transparent>
                        {item?.reaction?.is_reacted ? (
                          <FastImage
                            style={styles.imgIcon1}
                            source={{
                              uri: reaction[(item?.reaction?.type)]
                                ? '' + reaction[(item?.reaction?.type)]
                                : null,
                            }}
                          />
                        ) : (
                          <IonicIcon name="heart-outline" color="#424242" size={20} />
                        )}
                        <Text
                          adjustsFontSizeToFit
                          minimumFontScale={0.5}
                          style={{
                            fontSize: RFValue(12),
                            fontFamily: THEME_FONT,
                            textAlign: 'center',
                          }}>
                          {' ' + item?.reaction?.count}
                        </Text>
                      </Button>

                      <View style={styles.CommentsBtnView}>
                        <Button
                          style={styles.CommentsBtnStyle}
                          onPress={() => goToPostDetailScreen(item, index)}
                          // onPress={() => openComments(item, index)} zaheer ahmad remove it
                          transparent>
                          <MIcon name="comment-outline" color="#F596A0" size={20} />
                          <Text
                            adjustsFontSizeToFit
                            minimumFontScale={0.5}
                            style={styles.commentsCount}>
                            {' ' + item?.post_comments}
                          </Text>
                        </Button>
                      </View>
                    </View>

                    <Button transparent onPress={() => shareModalVisible(item)}>
                      <IonicIcon
                        name="md-share-social-outline"
                        color="#424242"
                        size={20}
                      />
                      <Text
                        adjustsFontSizeToFit
                        minimumFontScale={0.5}
                        style={styles.postShareCount}>
                        {' ' + item.post_share}
                      </Text>
                    </Button>
                  </View>

                </View>

                <CommentsView
                  openComments={() => goToPostDetailScreen(item, index)}
                  // openComments={() => openComments(item, index)} // zaheer replace it 
                  item={item}
                  user={props.user}
                  navigation={props.navigation}
                  postTimeAndReaction={postTimeAndReaction}
                />


              </View>
            </View>
          </View>
      }

      <Modal animationType="slide"
        transparent={true}
        visible={videomodal}
        onRequestClose={() => { setvideomodal(false) }}>
        <View style={{ flex: 1, backgroundColor: '#000', height: hp(60), }}>
          <TouchableOpacity
            onPress={() => { setvideomodal(false) }}
            style={styles.openModalView}
          >
            <MIcon name='close-thick' color='#fff' size={30} />
          </TouchableOpacity>


          <VideoPlayer
            source={{ uri: '' + video }}
            disableFullscreen={true}
            tapAnywhereToPause={true}
            disableBack={true}
            disableVolume
            loop={true}
            seekColor={HEADER}
          />

        </View>
      </Modal>
    </View>


  );
});



const styles = StyleSheet.create({
  arrayBorder: {
    backgroundColor: 'white',
    marginBottom: 2,
    borderTopColor: '#ffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  imgIcon1: {
    width: RFValue(20),
    height: RFValue(20),
  },
  showdec: { fontSize: 28, fontWeight: 'bold' },
  middleView: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(35),
    alignContent: 'center',
    alignItems: 'center',
  },
  CommentsBtnView: {
    borderRadius: 12,
    overflow: 'hidden',
    height: hp(4),
    justifyContent: 'center',
  },
  CommentsBtnStyle: {
    alignSelf: 'center',
    backgroundColor: '#FDEDEE',
    paddingHorizontal: 15,
  },
  commentsCount: {
    fontSize: RFValue(12),
    color: '#F596A0',
    fontFamily: THEME_FONT,
  },
  postShareCount: {
    fontSize: RFValue(12),
    fontFamily: THEME_FONT,
    textAlign: 'center',
  },
  publisherName: {
    fontSize: RFValue(14),
    fontFamily: THEME_FONT,
    fontWeight: 'bold',
    // width:RFValue(120)


  },

  recipientView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -6,
    // backgroundColor:'red',
  },
  rightArrow: {
    fontSize: 20,
    color: grey,
    top: 2,
    paddingHorizontal: 3,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feelings: {
    fontSize: RFValue(12),
    fontFamily: THEME_FONT,
    color: grey,
    marginTop: 2,
    // marginLeft: RFValue(5),
  },
  baseFontStyle: {
    fontSize: 14,
    flex: 8,
    flexWrap: 'wrap',
    fontWeight: 'normal',
    color: '#465575',
    // color: 'red',
  },
  outerView: {
    backgroundColor: White,
    marginBottom: 5,
    flex: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  containerView: {
    paddingVertical: RFValue(10),
    // paddingHorizontal: wp(4),
  },

  textMergen: {
    marginVertical: 12,
    marginHorizontal: wp(4)
  },

  btnStyle: {
    marginRight: RFValue(8),
    overflow: 'hidden',
    borderRadius: wp(3),
    marginHorizontal: wp(4),
    marginVertical: wp(2),
  },
  timeText: {
    fontSize: RFValue(10),
    fontFamily: THEME_FONT,
    // marginTop: wp(-5),
    marginBottom: wp(2)
  },
  groupName: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    fontWeight: 'bold',
    width: 'auto',
    marginLeft: wp(5),
    width: RFValue(100)
  },
  Sticker: {
    height: imgHeight,
    width: '100%',
    overflow: 'hidden',
    //borderRadius: 10,

    resizeMode: 'contain',
  },
  video: {
    flex: 1,
    width: '100%',
    height: 250,
    alignSelf: 'center',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },

  pageView: {
    height: 300,
    width: '100%',
  },
  rowCenterInnerView: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnOuterView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(35),
    alignContent: 'center',
    alignItems: 'center',
  },
  sponsoredText: {
    color: PINK,
    fontSize: 12,
  },
  divider: {
    width: '100%',
    // top:20,
    zIndex: 1,
    position: 'absolute'
  },
  sponsoredOuterView: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
  },
  sponsoredView: {
    alignSelf: 'flex-end',
    top: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,

  },
  playbtnView: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%'
  },
  imgBG: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openModalView: {
    marginTop: hp(5),
    alignSelf: 'flex-end',
    marginRight: wp(3),
  },
  emojiStyle: {
    fontSize: 16,
    marginLeft: 5,
  },
  resizeImage: {
    width: '100%',
    height: 300,



  },
  imgContainer: (width, height) => ({
    width: width,
    height: height
  }),
  imgStyle: {
    width: '100%',
    height: '100%'
  },
  menuContainer: {
    width: RFValue(35),
    height: RFValue(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    position: "absolute",
    top: 30,
  },
  headerView: {
    // marginLeft: RFValue(10),
    width: wp(77)
  },

  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradientStyle: {
    width: 'auto',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemStyle: {
    height: 35,
  }



});
