import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import {  HEADER, TEXT_LIGHT, TEXT_DARK } from './../../../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { postTimeAndReaction } from './../../../utils/DateFuncs';
import CommentsView from './../../../views/ComponentsNew/commentsView'

import styles from './styles';

import {
  Thumbnail,
  Button,
} from 'native-base';
import { THEME_BOLD_FONT, THEME_FONT } from './../../../constants/fontFamily';
import VideoPlayer from 'react-native-video-controls';
import FastImage from 'react-native-fast-image';
import Emoji from 'react-native-emoji';
import HTML from 'react-native-render-html';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SliderBox } from 'react-native-image-slider-box';
import {
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native-gesture-handler';
import {connect} from 'react-redux';

class PostView extends React.Component {

  render() {
    const { item, index, StatusView ,newsFeed,postShares, navigation,reaction, openProfile, openImage, isReacted,isReactedonPressOut, openComment,isReactedonLongPress} = this.props
    let { time, feeling } = postTimeAndReaction(item.time);
    let { time: originalTime, feeling: originalFeeling } = postTimeAndReaction(
      item.shared_info && item.shared_info.time,
    );
    let photoList = [];
    if (item.photo_multi) {
      item.photo_multi.forEach(i => {
        photoList.push(i.image);

      });
    } else {
      if (item.postFile_full) {
        photoList.push(item.postFile_full);
      }
    }
    return (
      <View
      style={{
        backgroundColor: 'white',
        marginBottom: 20,
        borderTopColor: '#ffff',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
      }}>
      <View
        style={{
          paddingVertical: RFValue(10),
          paddingHorizontal: wp(8),
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              marginRight: RFValue(8),
              overflow: 'hidden',
              borderRadius: wp(3),
            }}
            onPress={openProfile}>
            <Thumbnail
              // small
              square
              source={{ uri: item.publisher?.avatar }}
              style={{ backgroundColor: '#F2F2F2', }}
            />
          </TouchableOpacity>
          <View style={{}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: RFValue(16), fontFamily: THEME_FONT, fontWeight: 'bold' }}>
                {item.publisher.name}
              </Text>
              {item.postFeeling ? (
                <>
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      fontFamily: THEME_FONT,
                      color: 'grey',
                      marginLeft: RFValue(5),
                    }}>
                    {feeling} {item.postFeeling}
                  </Text>
                  <Emoji
                    name={this.getFeelingIcon(item.postFeeling)}
                    style={{
                      fontSize: 16,
                      marginLeft: 5,
                    }}
                  />
                </>
              ) : null}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: RFValue(10), fontFamily: THEME_FONT }}>
                {time}
            </Text>
            </View>
          </View>

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          {item.postText ? <HTML baseFontStyle={{ fontSize: 14, flex: 8, flexWrap: 'wrap', fontWeight: 'normal', color: '#465575' }} html={item.postText} /> : null}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          <View style={{ width: '100%', borderRadius: 13, overflow: 'hidden' }}>
            {photoList.length > 0 ? (
              <TouchableWithoutFeedback
                onPress={openImage}>
                <View>
                  <SliderBox images={photoList} />
                </View>
              </TouchableWithoutFeedback>
            ) : null}
            {item.postFileName === 'photo.jpg' ? (
              <TouchableWithoutFeedback
                onPress={openImage}>
                <Image
                  source={{ uri: item.postFile }}
                  style={{
                    height: 200,
                    width: null,
                    flex: 1,
                    backgroundColor: '#F2F2F2',
                  }}
                />
              </TouchableWithoutFeedback>
            ) : item.postFileName.includes('.mp4') ? (
              <VideoPlayer
                disableFullscreen={true}
                disableBack={true}
                seekColor={HEADER}
                paused={true}
                tapAnywhereToPause={true}
                source={{ uri: item.postFile }}
                style={{
                  flex: 1,
                  height: 250,
                  alignSelf: 'center',
                  backgroundColor: 'black',
                }}
                ref={ref => {
                  this.player = ref;
                }}
              />
            ) : null}
            {item.reactionVisible ? this.reactions(item, index) : null}
          </View>

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp(35), alignContent: 'center', alignItems: 'center' }}>
              <Button
                onPress={isReacted}
                onLongPress={isReactedonLongPress}
                onPressOut={isReactedonPressOut}
                transparent>
                {item.reaction.is_reacted ? (
                  <FastImage
                    style={styles.imgIcon1}
                    source={{
                      uri: reaction[item.reaction.type],
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
                  {' ' + item.reaction.count}
                </Text>
              </Button>
              <View style={{ borderRadius: 12, overflow: 'hidden', height: hp(4), justifyContent: 'center' }}>
                <Button
                  style={{ alignSelf: 'center', backgroundColor: '#FDEDEE', paddingHorizontal: 15 }}
                  onPress={openComment}
                  transparent>
                  <MIcon name="comment-outline" color="#F596A0" size={20} />
                  <Text
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                    style={{ fontSize: RFValue(12), color: '#F596A0', fontFamily: THEME_FONT }}>
                    {' ' + item.post_comments}
                  </Text>
                </Button>
              </View>
            </View>
            <Button
              transparent
              onPress={postShares}>
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
                {' ' + item.post_shares}
              </Text>
            </Button>
          </View>

        </View>
        <CommentsView
          openComments={openComment}
          item={item}
          user={this.props.user}
          navigation={navigation}
          postTimeAndReaction={postTimeAndReaction}
        />
      </View>
      
    </View>
   );
  }
}
const mapStateToProps = state => ({
  user: state.user.user,
});
export default connect(
  mapStateToProps,null
)(PostView);
