import React, { useState } from 'react';
import {
  Platform,
  Dimensions,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';

import styles from './styles';
import {
  Thumbnail,
  Container,
  Header,
  Content,
  Left,
  Button,
  Body,
  Right,
  Card,
  Form,
  Input,
  Item,
  CardItem,
  Icon,
} from 'native-base';
import { connect } from 'react-redux';
import PropTypes, { element } from 'prop-types';
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import { savePets } from '../../redux/actions/pets';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily';
import FastImage from 'react-native-fast-image';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { watchPosition } from 'react-native-geolocation-service';

const THRESHOLD = 100;

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

class PetOwnerView extends React.Component {

  render() {
    const {item} = this.props
    return (
      <>
       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{ marginRight: RFValue(2) }}>
              <Thumbnail
                small
                // source={{ uri: item.publisher.avatar }}
                style={{ backgroundColor: '#fff', }}
              />
            </View>
            <View style={{ marginLeft: RFValue(10) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              </View>
              <View style={{
                flex: 1,
                width: '82%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Button
                  onPress={
                    item.reaction.is_reacted
                      ? () => {
                        item.reaction.is_reacted = false;
                        item.reaction.count = item.reaction.count - 1;
                        item.reaction.type = '';
                        this.setState(
                          { newsFeed },
                          // () => this.requestHandlerPostReaction("post-actions", '', item)
                        );
                      }
                      : () => {
                        item.reaction.count = item.reaction.count + 1;
                        item.reaction.type = 'Like';
                        item.reaction.is_reacted = true;
                        this.setState({ newsFeed }, () =>
                          this.requestHandlerPostReaction(
                            'post-actions',
                            'Like',
                            item,
                          ),
                        );
                      }
                  }
                  onLongPress={() => {
                    newsFeed[index].reactionVisible = true;
                    this.setState({ newsFeed });
                  }}
                  onPressOut={() => {
                    newsFeed[index].reactionVisible = false;
                  }}
                  transparent>
                  {item.reaction.is_reacted ? (
                    <FastImage
                      style={styles.imgIcon1}
                      source={{
                        uri: reaction[item.reaction.type],
                      }}
                    />
                  ) : (
                      <IonicIcon name="heart-outline" color="#424242" size={20}  />
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
                <Button
                  style={{ alignSelf: 'center' }}
                  onPress={() => {
                    this.setState(
                      { postIndex: index },
                      this.props.onCommentDataChange(item.get_post_comments, item),
                      this.props.commentOpen(),
                    );
                  }}
                  //onPress={() => { this.onOpen()}}
                  transparent>
                  <MIcon name="comment-outline" color="#424242" size={20} />
                  <Text
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                    style={{ fontSize: RFValue(12), fontFamily: THEME_FONT }}>
                    {' ' + item.post_comments}
                  </Text>
                </Button>
                <Button
                  transparent
                  onPress={() =>
                    this.setState({
                      shareModalVisible: true,
                      viewerContent: {
                        index,
                        ...item,
                      },
                    })
                  }>
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
          </View>

      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  workspace: state.user.workspace,
});

const mapDispatchToProps = dispatch => ({
  saveLoginUser: user => dispatch(userEdit(user)),
  saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
  savePets: pets => dispatch(savePets(pets)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PetOwnerView);
