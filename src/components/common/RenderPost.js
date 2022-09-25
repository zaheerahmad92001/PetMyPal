import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ImageBackground,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback, Alert, Dimensions
} from 'react-native';
import { Thumbnail, Button, Icon } from 'native-base';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import { THEME_FONT } from '../../constants/fontFamily';
import { grey, HEADER, PINK, White } from '../../constants/colors';
import VideoPlayer from 'react-native-video-controls';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import Emoji from 'react-native-emoji';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, } from 'react-native-responsive-screen';
import PostLink from './PostLink';
import { postTimeAndReaction } from '../../utils/DateFuncs';
import MentionHashtagTextView from "react-native-mention-hashtag-text";
import YoutubePlayer from 'react-native-youtube-iframe';
import { Pages } from 'react-native-pages';
import { Divider } from 'react-native-elements'
import { sponsored_Icon, playBtn } from '../../constants/ConstantValues'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';


const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

let imgHeight = 300;
let mapHeight = 300;
let videoToImg = '';




export default (RenderPost = ({
  item,
  index,
  state,
  props,
  focusOnInput,
  modalVisible,
  onPressOut,
  onLongPress,
  reactions,
  shareModalVisible,
  getFeelingIcon,
  handleTrends,
  nodeRef,
  ReportPost,
  DeletePost,
  UpdatePost,
}) => {

  var screenWidth = Dimensions.get('window').width;
  var imageHeight = Dimensions.get('window').width / 2;
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
    photoList.push({ image: item?.postFile_full });
  }


  if (
    item?.postFile_full?.includes('.mp4') ||
    item?.postFile_full?.includes('.mp3')
  ) {
    let extension = item?.postFile_full?.split('.').pop()
    let firtst = item?.postFile_full.replace('/video', '/photo')
    let second = firtst.replace('_video', '_photo_small')
    videoToImg = second.replace(extension, 'jpg')
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
          source={{ uri: item?.color_post?.full_image ? '' + item.color_post.full_image : null }}
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
    let pid = item?.shared_info?.publisher?.parent_id
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
        params: { item: item?.event },
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
      if (item?.user_id == props?.user?.user?.user_data?.user_id) {
        props.navigation.navigate('UserProfile');
      }
    }
  };


  const goToShareScreen = () => {

    if (item?.publisher?.type == 'user') {
      if (props?.user?.user?.user_data?.user_id == item?.publisher?.user_id) {
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
    } else if (
      item?.shared_info
    ) {
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
      }
      else if (item?.shared_info.event_id != '0') {
        if (item?.shared_info?.user_id == props?.user?.user_data?.user_id) {
          props.navigation.navigate('UserProfile');
        } else {
          props.navigation.navigate({
            routeName: 'Profile',
            key: 'Profile',
            params: { user_id: item?.publisher?.user_id },
          });
        }
      }
      else if (
        item?.publisher.user_id != '0'
      ) {
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

  const goToSharedPostUser = () => {
    if (item?.publisher?.type == 'user') {

      if (props?.user?.user?.user_data?.user_id == item?.shared_info?.publisher?.user_id) {
        props.navigation.navigate('UserProfile');
      } else {
        props.navigation.navigate({
          routeName: 'Profile',
          key: 'Profile',
          params: { user_id: item?.shared_info?.publisher?.user_id },
        });
      }
    }
    else if (item?.publisher?.type == 'pet') {
      console.log('pet profile', item);
      props.navigation.navigate({
        routeName: 'PetProfile',
        key: 'PetProfile',
        params: { item: item.shared_info?.publisher },
      });
    }
  }

  const showMenu = () => { _menu.show() }

  return (
    // item?.shared_info ? (
    //   <View ref={ref => nodeRef(item.post_id, ref)} key={item.id}
    //     style={styles.outerView}>
    //     <View>
    //       <View style={styles.rowCenter}>
    //         <TouchableOpacity
    //           style={styles.btnStyle}
    //           onPress={() => { goToShareScreen() }}>
    //           <Thumbnail
    //             square
    //             source={{
    //               uri: item?.publisher?.avatar
    //                 ? '' + item?.publisher?.avatar
    //                 : null,
    //             }}
    //             style={{ backgroundColor: '#F2F2F2', width: item.postText ? 60 : 60, height: item.postText ? 60 : 60 }}
    //           />
    //         </TouchableOpacity>
    //         <View style={{ marginLeft: RFValue(10) }}>
    //           <View style={styles.rowCenter}>
    //             <Text
    //               onPress={() => goToShareScreen()}
    //               style={styles.publisherName}>
    //               {item?.publisher?.name}
    //             </Text>
    //             <Text style={styles.feelings}> shared a post </Text>
    //           </View>
    //           <View style={styles.rowCenter}>
    //             <Text style={styles.timeText}>{_time}</Text>
    //           </View>

    //         </View>

    //       </View>


    //       {/* recepient view  */}

    //       <View style={[styles.rowCenter, { padding: 10 }]}>
    //         <TouchableOpacity
    //           style={styles.btnStyle}
    //           onPress={() => goToSharedPostUser()}>
    //           <Thumbnail
    //             square
    //             source={{
    //               uri: item?.shared_info?.publisher?.avatar
    //                 ? '' + item?.shared_info?.publisher?.avatar
    //                 : null,
    //             }}
    //             style={{ backgroundColor: '#F2F2F2' }}
    //           />
    //         </TouchableOpacity>

    //         <View style={{ marginLeft: RFValue(10) }}>
    //           <View style={styles.rowCenter}>
    //             <Text
    //               style={{ fontSize: RFValue(16), fontFamily: THEME_FONT }}
    //               onPress={() => goToSharedPostUser()}>
    //               {item?.shared_info?.publisher?.name}
    //             </Text>
    //             {item.postFeeling ? (
    //               <>
    //                 <Text
    //                   style={styles.feelings}>
    //                   {originalFeeling} {item.postFeeling}
    //                 </Text>
    //                 <Emoji
    //                   name={getFeelingIcon(item.postFeeling)}
    //                   style={styles.emojiStyle}
    //                 />
    //               </>
    //             ) : null}
    //           </View>
    //           <View style={styles.rowCenter}>
    //             <Text style={styles.timeText}>{originalTime}</Text>
    //           </View>
    //         </View>
    //       </View>

    //       {item?.postLink ?
    //         <PostLink item={item} />
    //         : item.postText ? (
    //           <View style={{ marginHorizontal: wp(4), }}>

    //             <MentionHashtagTextView
    //               mentionHashtagPress={handleTrends}
    //               mentionHashtagColor={PINK}
    //             >
    //               {item.postText}
    //             </MentionHashtagTextView>
    //           </View>
    //         ) : null}

    //       {!item.postText && item?.event ? (
    //         <View style={{ marginBottom: wp(8) }}>
    //           <TouchableOpacity
    //             onPress={() => props.navigation.navigate('EventDetails', { item: item?.event, btnShow: true, goingShow: true, interestShow: true })}
    //             style={styles.imgContainer(screenWidth, imageHeight)}
    //           >
    //             <Image
    //               source={{ uri: item?.event?.cover }}
    //               style={styles.imgStyle}
    //             />
    //             <View style={{ marginHorizontal: wp(4) }}>
    //               <Text style={{ marginVertical: wp(2) }}>{item?.event?.name}</Text>
    //               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //                 <Icon type="FontAwesome5" name="calendar" style={{ fontSize: 20, marginLeft: 2, marginRight: 5, marginVertical: 5 }} />
    //                 <Text>{formatedDate({ date: item?.event?.start_date, time: item?.event?.start_time })} {'-'} {formatedDate({ date: item?.event?.end_date, time: item?.event?.end_time })}</Text>
    //               </View>
    //             </View>
    //           </TouchableOpacity>
    //         </View>
    //       ) : null}



    //       <View style={{ borderRadius: 5, marginTop: 10 }}>

    //         <View style={{ width: '100%' }}>
    //           {photoList?.length > 0 ? (
    //             <View style={styles.imgContainer(screenWidth, imageHeight)}>
    //               <Pages
    //                 key={index}
    //                 indicatorColor={PINK}
    //                 indicatorOpacity={0.2}
    //                 indicatorPosition={photoList?.length > 1 ? 'bottom' : 'none'}
    //               >
    //                 {photoList?.map((obj, ind) => {
    //                   let extension = obj?.image?.split('.').pop().toLowerCase()
    //                   let firtst = obj?.image.replace('/video', '/photo')
    //                   let second = firtst.replace('_video', '_photo_small')

    //                   extension != 'jpeg' ||
    //                     extension != 'jpg' ||
    //                     extension != 'gif' ||
    //                     extension != 'png' ?

    //                     videoToImg = second.replace(extension, 'jpg')
    //                     :
    //                     null

    //                   return (
    //                     <TouchableOpacity
    //                       key={index}
    //                       activeOpacity={1}
    //                       onPress={() => modalVisible(photoList, item)}
    //                       style={{ flex: 1, }}>
    //                       {extension == 'jpeg' ||
    //                         extension == 'jpg' ||
    //                         extension == 'gif' ||
    //                         extension == 'png' ?
    //                         <Image
    //                           style={styles.imgStyle}
    //                           source={{ uri: obj.image }}
    //                         />
    //                         :
    //                           <Image source={{ uri: obj.image }} />
    //                       }
    //                     </TouchableOpacity>
    //                   )
    //                 })
    //                 }
    //               </Pages>
    //             </View>
    //           ) : null}

    //           {item?.postFile_full?.includes('.mp4') ||
    //             item?.postFile_full?.includes('.mp3') ? (

    //             <VideoPlayer
    //               disableFullscreen={true}
    //               disableBack={true}
    //               disableVolume
    //               seekBar={HEADER}
    //               resizeMode={'cover'}
    //               tapAnywhereToPause={true}
    //               source={{ uri: '' + item.postFile_full }}
    //               style={styles.video}
    //             />

    //           ) : item?.postYoutube ?
    //             <View style={styles.video}>
    //               <YoutubePlayer
    //                 height={250}
    //                 width={'100%'}
    //                 videoId={item?.postYoutube}
    //               />
    //             </View>

    //             : null

    //           }
    //           {!_.isNull(item.postSticker) && !_.isEmpty(item.postSticker)
    //             ? displayPostSticker()
    //             : null}
    //           {item.postFile != '' &&
    //             item.postFile?.includes('pdf') &&
    //             displayPdf()}
    //           {item.postMap != '' &&
    //             // item.postMap.includes('https') &&
    //             displayMap()
    //           }


    //           {item.reactionVisible ? reactions(item, index) : null}
    //         </View>
    //       </View>
    //       <View style={{ marginHorizontal: wp(4) }}>
    //         <View style={styles.rowCenter}>
    //           <View style={styles.rowCenterInnerView}>
    //             <View style={styles.btnOuterView}>
    //               <Button
    //                 onPress={() => onLongPress(index)}
    //                 onPressOut={() => onPressOut()}
    //                 transparent>
    //                 {item?.reaction?.is_reacted ? (
    //                   <FastImage
    //                     style={styles.imgIcon1}
    //                     source={{
    //                       uri: reaction[(item?.reaction?.type)]
    //                         ? '' + reaction[item.reaction.type]
    //                         : null,
    //                     }}
    //                   />
    //                 ) : (
    //                   <IonicIcon name="heart-outline" color="#424242" size={20} />
    //                 )}

    //                 <Text
    //                   adjustsFontSizeToFit
    //                   minimumFontScale={0.5}
    //                   style={{
    //                     fontSize: RFValue(12),
    //                     fontFamily: THEME_FONT,
    //                     textAlign: 'center',
    //                   }}>
    //                   {'' + item?.reaction?.count}
    //                 </Text>
    //               </Button>

    //               <View
    //                 style={{
    //                   borderRadius: 12,
    //                   overflow: 'hidden',
    //                   height: hp(4),
    //                   justifyContent: 'center',
    //                 }}>
    //                 <Button
    //                   style={{
    //                     alignSelf: 'center',
    //                     backgroundColor: '#FDEDEE',
    //                     paddingHorizontal: 15,
    //                   }}
    //                   onPress={() => focusOnInput()}
    //                   transparent>
    //                   <MIcon name="comment-outline" color="#F596A0" size={20} />
    //                   <Text
    //                     adjustsFontSizeToFit
    //                     minimumFontScale={0.5}
    //                     style={{
    //                       fontSize: RFValue(12),
    //                       color: '#F596A0',
    //                       fontFamily: THEME_FONT,
    //                     }}>
    //                     {' ' + item?.post_comments}
    //                   </Text>
    //                 </Button>
    //               </View>
    //             </View>
    //             <Button transparent onPress={() => shareModalVisible()}>
    //               <IonicIcon
    //                 name="md-share-social-outline"
    //                 color="#424242"
    //                 size={20}
    //               />
    //               <Text
    //                 adjustsFontSizeToFit
    //                 minimumFontScale={0.5}
    //                 style={{
    //                   fontSize: RFValue(12),
    //                   fontFamily: THEME_FONT,
    //                   textAlign: 'center',
    //                 }}>
    //                 {' ' + item?.shared_info?.post_share}
    //               </Text>
    //             </Button>
    //           </View>
    //         </View>
    //       </View>
    //     </View>
    //   </View>
    // ) :




    (
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
                <Thumbnail source={sponsored_Icon} small
                  style={{ width: 15, height: 15, right: 5 }}
                />
                <Text style={styles.sponsoredText}>Sponsored Woof!</Text>
              </View>
            </View>
            : null
        }

        <View>

          {/* Post Header */}
          <View style={
            item.postType == 'custom_post' ||
              item.postType == 'advertisement' ?
              [styles.rowCenter, { marginTop: 10 }] :
              [styles.rowCenter]
          }>

            <TouchableOpacity
              style={[styles.btnStyle]}
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

            {/* header content after Avatar */}
            {/* Publisher name and image */}

            <View style={[styles.headerView]}>
              <View style={
                 item.postType == 'custom_post' ||
                 item.postType == 'advertisement' ?
                [styles.rowSpaceBetween,{marginTop:15}]:
                [styles.rowSpaceBetween]                
                }>
                <View style={[styles.rowCenter,]}>
                  <Text
                    onPress={() => { goToShareScreen() }}
                    style={styles.publisherName}>
                    {item?.publisher?.name}
                  </Text>
                  {item.recipient_id == '0' && item?.event && item?.postText ?
                    <View style={styles.recipientView}>
                      <Icon
                        name={'arrowright'}
                        type={'AntDesign'}
                        style={styles.rightArrow}
                      />
                      <Text
                        onPress={() => goToScreen()}
                        style={[styles.publisherName,{marginTop:2}]}>{item?.event?.name?.length > 10 ? item?.event?.name.toString().substring(0,10) + '...' : item?.event?.name}</Text>
                    </View>
                    : null}
                  {item.recipient_id != '0' ? (
                    <View style={styles.recipientView}>
                      <Icon
                        name={'arrowright'}
                        type={'AntDesign'}
                        style={styles.rightArrow}
                      />
                      <Text
                        onPress={() => goToScreen()}
                        style={styles.publisherName}>{`${item?.recipient?.full_name}`}</Text>
                    </View>
                  ) :
                    null
                  }


                  {
                    (item?.group_id != 0 && item?.user_id != 0) ||
                      (item?.page_id != 0 && item?.user_id != 0) ?

                      <TouchableOpacity
                      style={{marginTop:12}}
                        onPress={() => {
                          goToScreen();
                        }}>
                        <IonicIcon
                          name="arrow-forward-outline"
                          color="#424242"
                          size={20}
                          style={{ marginBottom: wp(-6) }}
                        />
                        <Text style={styles.groupName}>
                          {item?.group_recipient?.group_title.length > 10 ? item?.group_recipient?.group_title?.substring(0,10) + '...' : ''}
                        </Text>
                      </TouchableOpacity>
                      : null
                  }
                  {
                    item?.page_event_id != '0' ?
                      <Text style={styles.feelings}>  Created new event</Text>
                      : null
                  }
                </View>

                {/* <TouchableOpacity
                  onPress={() => showMenu()}
                  style={styles.menuContainer}>
                  <Icon name={'more-vertical'} type={'Feather'} />
                </TouchableOpacity> */}
              </View>


              {/* <View style={styles.menuView}>
                <Menu ref={(ref) => { _menu = ref }}>
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
              </View> */}

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


          {/* Text on Post  */}
          <View>
            <View style={{ marginHorizontal: wp(4) }}>
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
            </View>
            {!item.postText && item?.event ? (
              <View style={{ marginBottom: wp(16) }}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('EventDetails', { item: item?.event, btnShow: true, goingShow: true, interestShow: true })}
                  style={styles.imgContainer(screenWidth, imageHeight)}>
                  <Image source={{ uri: item?.event?.cover }} style={styles.imgStyle} />
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




          {/* Content of Post */}
          <View style={styles.rowCenter}>
            <View style={{ width: '100%' }}>
              {photoList?.length > 0 ? (
                <View style={styles.imgContainer(screenWidth, imageHeight)}>
                  <Pages
                    key={index}
                    indicatorColor={PINK}
                    indicatorOpacity={0.2}
                    indicatorPosition={photoList?.length > 1 ? 'bottom' : 'none'}>

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
                          onPress={() => modalVisible(photoList, item)}>

                          {extension == 'jpeg' ||
                            extension == 'jpg' ||
                            extension == 'gif' ||
                            extension == 'png' ?

                            <Image source={{ uri: obj.image }} style={styles.imgStyle} />
                            :
                            <View>
                              <Image source={{ uri: videoToImg }} style={styles.imgStyle} />
                              <View style={styles.playbtnView}>
                                <Image source={playBtn} resizeMode={'contain'} />
                              </View>
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
                  }}>

                  <View>
                    <Image
                      source={{ uri: videoToImg }}
                      resizeMode={'cover'}
                      style={{ width: '100%', height: 300 }}
                    />
                    <View style={styles.playbtnView}>
                      <Image source={playBtn} resizeMode={'contain'} />
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
                displayMap()}
              {
                item?.color_id != '' &&
                displayArt()
              }

              {
                item?.postFile != '' &&
                item.postFile?.includes('pdf') &&
                displayPdf()
              }

              {item?.reactionVisible ? reactions(item, index) : null}
            </View>
          </View>




          {/* Reaction on Post */}
          <View style={{ marginHorizontal: wp(4) }}>
            <View style={styles.rowCenter}>
              <View style={styles.middleView}>
                <View style={styles.btnContainer}>
                  <Button
                    // onPress={() => is_reacted(item)}
                    onPress={() => onLongPress(index)}
                    onPressOut={() => onPressOut()}
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
                      onPress={() => focusOnInput()}
                      // onPress={() => openComments(item, index)}
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

                <Button transparent onPress={() => shareModalVisible()}>
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


            <Modal animationType="slide"
              transparent={true}
              visible={videomodal}
              onRequestClose={() => { setvideomodal(false) }}>
              <View style={{ flex: 1, backgroundColor: '#000', height: hp(60), }}>
                <TouchableOpacity
                  onPress={() => { setvideomodal(false) }}
                  style={styles.openModalView}
                >

                  <MIcon
                    name='close-thick'
                    color='#fff'
                    size={30}
                  />
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


        </View>
      </View>
    )
  )
}
);

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
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    fontWeight: 'bold',
    marginTop:10,
  },

  recipientView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:2,
  },
  rightArrow: {
    fontSize: 20,
    color: grey,
    top: 6,
    paddingHorizontal: 3,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    // backgroundColor:'red'
  },
  feelings: {
    fontSize: RFValue(12),
    fontFamily: THEME_FONT,
    color: grey,
    marginTop: 2,
  },
  baseFontStyle: {
    fontSize: 14,
    flex: 8,
    flexWrap: 'wrap',
    fontWeight: 'normal',
    color: '#465575',
  },
  outerView: {
    backgroundColor: White,
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
    marginBottom: wp(2),
    top:-10,
  },
  groupName: {
    fontSize: RFValue(16),
    fontFamily: THEME_FONT,
    fontWeight: 'bold',
    width: 'auto',
    marginLeft: wp(5),
  },
  Sticker: {
    height: imgHeight,
    width: '100%',
    overflow: 'hidden',
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

  imgContainer: (width, height) => ({
    width: width,
    height: height
  }),
  imgStyle: {
    width: '100%',
    height: '100%'
  },

  gradientStyle: {
    width: 'auto',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: wp(77),
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },



});

