import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Thumbnail } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import HTML from 'react-native-render-html';
import FastImage from 'react-native-fast-image';
import { Button } from 'native-base'
import IonicIcon from 'react-native-vector-icons/Ionicons';

import Reactions from './Reactions';
import { postTimeAndReaction } from '../../utils/DateFuncs';
import { commonState } from '../../components/common/CommomState'
import { THEME_FONT } from '../../constants/fontFamily';
import Toast from 'react-native-simple-toast'


function AllCommentsView({
  obj,
  index,
  user,
  navigation,
  ReactOnComment,
  OpenReaction,
  hideReaction,
}) {

  let item = obj
  const { reaction } = commonState

  function reactions(item, index) {
    return (
      <Reactions
        item={item}
        index={index}
        ReactOnComment={(index, item, reaction) => ReactOnComment(index, item, reaction)}
      />
    );
  };
  const showToast = msg => {
    Toast.show(msg, Toast.SHORT);
  };


  let { time, feeling } = postTimeAndReaction(item.time);
 

  return (
  
    <View key={item.id}>
      <View style={{ flexDirection: 'row', marginTop: 12, }}>
        <TouchableOpacity
          style={styles.senderProfileView}
          onPress={() => {
            if (item.user_id == user?.user_data?.user_id) {
              navigation.navigate('UserProfile');
            } else {
              navigation.navigate({
                routeName: 'Profile',
                key: 'Profile',
                params: { user_id: item?.user_id },
              });
            }
          }}>
          <Thumbnail
            square
            source={{ uri: "" + item?.publisher?.avatar }}
            style={styles.senderProfile}
          />
        </TouchableOpacity>

        <View style={styles.msgView}>
          <View style={styles.row}>
            <Text style={{ fontWeight: 'bold' }}>
              {item?.publisher?.first_name}
            </Text>
            <Text style={{ color: '#8B94A9' }}>{time}</Text>
          </View>
          {item.text ?
                // <Text>{item.text.replace(/<br>/g,'\n')}</Text>
                <Text>{item.Orginaltext}</Text>
                // <Text>{item.text}</Text>
            // <HTML
            //   baseFontStyle={styles.baseFontStyle}
            //   html={item.text}
            // /> 
            : null}
        </View>
      </View>

      <View >
        {item.reactionVisible ?
          <View style={[styles.reactionView,{marginLeft:RFValue(30)}]}>  
          {/* RFV(10) in ReactionView and RFV(30) are give here */}
          {reactions(item, index)}
        </View>
          :
          <TouchableOpacity
            onPress={() => { OpenReaction(index) }}
            onPressOut={() => { hideReaction(index) }}
            style={[styles.reactionView,{marginTop:10}]}
            >
            <View style={styles.countView}>
              {item?.reaction?.is_reacted ?
                <FastImage
                  style={styles.imgIcon}
                  source={{
                    uri: reaction[item?.reaction?.type]
                  }}
                />
                :
                <IonicIcon name="heart-outline" color="#424242" size={20} />
              }
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={styles.countText}>
                {item?.reaction?.count}
              </Text>
            </View>
          </TouchableOpacity>
        }
      </View>

    </View>
  

  );
};

export default AllCommentsView;


const styles = StyleSheet.create({
  senderProfileView: {
    marginRight: RFValue(8),
    overflow: 'hidden',
    borderRadius: wp(3),
    alignItems: 'center',
  },
  senderProfile: {
    backgroundColor: '#F2F2F2',
    borderRadius: wp(3),
    width: wp(10),
    height: wp(10),
    top: 1
  },
  msgView: {
    backgroundColor: '#F0F1F4',
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,

    // height: 58,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  baseFontStyle: {
    marginHorizontal: 2,
    color: '#465575',
    fontSize: 13,
  },
  imgIcon: {
    width: RFValue(20),
    height: RFValue(20),
  },
  reactionView: {
    marginLeft: RFValue(40),
    // marginTop: 10,
  },
  countView:{
    flexDirection:'row',
    alignItems:'center'
  },
 countText:{
    fontSize: RFValue(12),
    fontFamily: THEME_FONT,
    textAlign: 'center',
    marginLeft:6
  }

})
