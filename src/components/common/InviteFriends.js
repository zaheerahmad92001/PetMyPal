import React, {useEffect, useLayoutEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  Image,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Container, Icon, Left, Right, Body, ListItem, Input} from 'native-base';
import {RFValue} from 'react-native-responsive-fontsize';
import {THEME_FONT} from '../../constants/fontFamily';
import {BGCOLOR, BLUE, darkSky} from '../../constants/colors';
import {ShortAboutParseHtml} from '../../components/helpers'

export default function InviteFriendsModal({
  showModal,
  navigation,
  following,
  closeModal,
  addFriend,
  ...rest
}) {
  const renderFollowing = ({item, index}) => {
    return (
      <View key={index}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
          }}
        />
        <View
          style={{
            width: Dimensions.get('window').width,
            backgroundColor: index % 2 == 0 ? '#FFFFFF' : '#E8F6FC',
            marginVertical: wp(1),
          }}>
          <ListItem
            noBorder
            style={{marginBottom: wp(2)}}
            avatar
            onPress={() => {
              closeModal(false);
              if (item.parent_id !== '0') {
                navigation.navigate({
                  routeName: 'PetProfile',
                  key: 'PetProfile',
                  params: {item},
                });
              } else {
                navigation.navigate({
                  routeName: 'Profile',
                  key: Math.random()
                    .toString(36)
                    .substring(7),
                  params: {
                    user_id: item.user_id,
                    isUserFollowed: item.following,
                    item,
                  },
                });
              }
            }}>
            <Left style={{justifyContent: 'center'}}>
              <Image style={styles.imgStyle} source={{uri: item?.avatar}} />
            </Left>
            <Body>
              <Text style={styles.eNameText} numberOfLines={1} note>
                {item?.full_name}
              </Text>
              <Text numberOfLines={2} style={styles.eContentText} note>
                {item.about ? ShortAboutParseHtml(item.about ).replace(/<br>/g,'\n'): null}
              </Text>
            </Body>
            <Right style={{justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => addFriend(item.user_id, item.full_name)}
                style={styles.addBtn}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Add</Text>
              </TouchableOpacity>
            </Right>
          </ListItem>
        </View>
      </View>
    );
  };

  return (
    <Modal
      animationIn="fadeInDown"
      useNativeDriver
      animationInTiming={700}
      animationOutTiming={1500}
      isVisible={showModal}
      style={styles.modal}>
      <Text
        style={styles.heading}>
        Invite Friends
      </Text>
      
      <TouchableOpacity
        onPress={() => closeModal(false)}
        style={{
          paddingHorizontal: wp(2),
          position: 'absolute',
          top: 0,
          right: 5,
        }}>
        <Icon name={'cross'} type="Entypo" style={styles.tagIcon} />
      </TouchableOpacity>
      {following.length > 0 ? (
        <View style={{marginTop: wp(6)}}>
          <FlatList
            disableVirtualization={true}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
            scrollEnabled={true}
            horizontal={false}
            data={following}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderFollowing}
            style={{marginVertical: RFValue(5), backgroundColor: BGCOLOR}}
          />
        </View>
      ) : (
        <Text
          style={{
            marginTop: 20,
            width: '100%',
            textAlign: 'center',
            fontSize: RFValue(16),
            color: darkSky,
            fontWeight: 'bold',
          }}>
          No Followings to invite.
        </Text>
      )}
    </Modal>
  );
}
const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'center',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    top: '10%',
    paddingBottom: wp(Platform.OS == 'ios' ? 20 : 10),
  },
  imgStyle: {
    alignSelf: 'center',
    backgroundColor: 'black',
    width: RFValue(45),
    height: RFValue(45),
    borderRadius: 10,
  },
  eNameText: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: 'black',
    fontFamily: THEME_FONT,
  },
  eContentText: {
    fontSize: RFValue(14),
    fontFamily: THEME_FONT,
    color: 'black',
    fontWeight: '500',
  },
  heading:{
    position: 'absolute',
    top: 6,
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: BLUE,
  },
  tagIcon: {
    fontSize: RFValue(22),
    color: '#222326',
    marginTop: wp(1),
    color: BLUE,
  },
  addBtn: {
    width: wp(23),
    height: wp(8),
    backgroundColor: darkSky,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
