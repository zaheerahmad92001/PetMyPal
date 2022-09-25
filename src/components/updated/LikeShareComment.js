import React from 'react';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';

import { getComments } from '../../services/index';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME_FONT } from '../../constants/fontFamily';
import ShareModal from '../../views/shareModal/index';
import CommentsModal from '../../views/CommentsModal/index';
import { Button } from 'native-base';
import { Platform, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import requestRoutes from '../../utils/requestRoutes';
import FastImage from 'react-native-fast-image';
import { server_key, SERVER } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import Reactions from '../../components/common/Reactions'
import { commonState } from '../../components/common/CommomState'
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import {Icon} from 'native-base'

const timeOut = 5000
class LikeShareComment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shareModalVisible: false,
      CommentsModalVisible: false,
      token: undefined,
      newsFeed: this.props.viewerContent,
      commentCount: this.props.viewerContent?.get_post_comments?.length,
      disabled: false,
      reaction: commonState.reaction,
    };
  }

  componentDidMount() {
    getComments(this.props.viewerContent.post_id, (item) => {
      this.setState({ commentCount: item?.length })
      this.getAccessToken().then((token) => { this.setState({ token: JSON.parse(token).access_token }) })

    })
  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  updateState = state => { this.setState(state) };

  async requestHandlerPostReaction(reaction, item) {
    const { token } = this.state
    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('post_id', item.post_id);
    formData.append('action', 'reaction');
    formData.append('reaction', reaction);

    const response = await petMyPalApiService._postReaction(token, formData).catch((err) => {
      console.log('err in Post reaction', err)
    })
    const { data } = response
  }


  reactions = (item, index) => {
    const { newsFeed } = this.state;
    const scope = this;
    setTimeout(function () {
      newsFeed.reactionVisible = false,
        scope.setState({ newsFeed });
    }, timeOut);

    return (
      <Reactions
        item={item}
        index={index}
        ReactOnComment={(index, item, reaction) => this.ReactOnPost(index, item, reaction)}
      />
    )
  }


  ReactOnPost = (index, item, reaction) => {
    item.reaction.is_reacted
      ? (item.reaction.count =
        item.reaction.count)
      : (item.reaction.count =
        item.reaction.count + 1);
    item.reactionVisible = false;
    item.reaction.type = reaction;
    item.reaction.is_reacted = true;
    this.setState({ newsFeed: item });
    this.requestHandlerPostReaction(reaction, item)
  }


  updateComment = (value) => { this.setState({ commentCount: value }) }

  updateCount = () => {
    if (this.props?.viewerContent?.shared_info) {
      this.props.viewerContent.shared_info.post_share = Number(this.props?.viewerContent?.shared_info?.post_share) + 1;
      this.props.updateShareCount(this.props?.viewerContent.post_id);
    } else {
      this.props.viewerContent.post_share = Number(this.props?.viewerContent?.post_share) + 1;
      this.props.updateShareCount(this.props?.viewerContent.post_id);

    }

  }
  render() {
    const {
      shareModalVisible,
      CommentsModalVisible,
      reaction,
      newsFeed
    } = this.state;
    const {
      viewerContent,
      containerStyle,
      countStyle,
      iconColor,
    } = this.props;
    return (
      <View>
       
        <View style={[styles.modalView,containerStyle]}>
          <View style={styles.reactionView}>
            {newsFeed.reactionVisible && <View style={{ zIndex: 999999999, width: '100%' }}>
              {this.reactions(newsFeed)}
            </View>
            }
          </View>

          <View
            style={styles.reactionView}>
            {/* {newsFeed.reactionVisible && <View style={{ zIndex: 999999999, width: '100%' }}>
              {this.reactions(newsFeed)}
            </View>
            } */}
            <Button transparent
              onPress={
                viewerContent.reaction.is_reacted
                  ? () => {
                    viewerContent.reaction.is_reacted = false;
                    viewerContent.reaction.count = viewerContent.reaction.count - 1;
                    viewerContent.reaction.type = '';
                    this.setState(
                      { newsFeed },
                      () => this.requestHandlerPostReaction('', viewerContent)
                    );
                  }
                  : () => {
                    viewerContent.reaction.count = viewerContent.reaction.count + 1;
                    viewerContent.reaction.type = 'Like';
                    viewerContent.reaction.is_reacted = true;
                    this.setState({ newsFeed }, () =>
                      this.requestHandlerPostReaction(
                        'Like',
                        viewerContent,
                      ),
                    );
                  }
              }
              onLongPress={() => {
                newsFeed.reactionVisible = true;
                this.setState({ newsFeed });
              }}
              onPressOut={() => {
                newsFeed.reactionVisible = false;
              }}>
              {viewerContent.reaction.is_reacted ?
                <FastImage
                  style={styles.reactionStyle}
                  source={{ uri: reaction[viewerContent.reaction.type] }}
                />
                :
                <Icon 
                name="heart-outline" 
                type='IonicIcon'
                style={{ 
                color:iconColor?iconColor:"#424242" ,
                size:20
               }}
                />
              }
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={[styles.count,countStyle]}>
                {viewerContent.reaction.count}
              </Text>
            </Button>
            <Button
              style={{ alignSelf: 'center' }}
              transparent
              // onPress={() => this.setState({ CommentsModalVisible: !CommentsModalVisible })}  // zaheer ahmad skip this
              onPress={this.props.handleComments} // parent function call from ImageViewer Component
              >
              <Icon 
               name="comment-outline"
               type='MaterialCommunityIcons'
               style={{
                 color:iconColor?iconColor: "#424242",
                  size:20}}
                />
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={[styles.count,countStyle]}>
                {this.state.commentCount}
              </Text>
            </Button>
            <Button transparent onPress={() => this.setState({ shareModalVisible: !shareModalVisible })}>
              <Icon
                name="md-share-social-outline"
                type='Ionicons'
                style={{
                  color:iconColor?iconColor: "#424242",
                  size:20
                }}
                
              />
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={[styles.count,countStyle]}>
                {viewerContent?.shared_info?.post_share ? Number(viewerContent?.shared_info?.post_share) : Number(viewerContent.post_share) > 0 ? viewerContent.post_share : viewerContent.post_shares}
              </Text>
            </Button>
          </View>


        </View>

        <ShareModal
          imageIndex={this.props.imageIndex}
          viewerContent={viewerContent}
          modalVisible={shareModalVisible}
          updateState={this.updateState}
          petData={this.props?.petData}
          pixxyData={this.props?.pixxyData}
          updateShareCount={this.props?.petData ? this.updateCount : this.props?.updateShareCount}
          navigation={this.props.navigation}

        />
        <CommentsModal
          viewerContent={viewerContent}
          modalVisible={CommentsModalVisible}
          updateState={this.updateState}
          updateComment={this.updateComment}
        />

      </View>
    );
  }
};

const styles = StyleSheet.create({

  modalView: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: RFValue(40)
  },
  reactionView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: screenWidth - 60,
  },
  reactionStyle: {
    width: RFValue(20),
    height: RFValue(20)
  },
  count: {
    fontSize: RFValue(12),
    fontFamily: THEME_FONT,
    textAlign: 'center',
  }

});

export default LikeShareComment;
