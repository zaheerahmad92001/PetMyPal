import React, { Component } from "react";
import { View, Text, Image, ScrollView, FlatList, } from 'react-native'
import { Content, Container, Icon, Thumbnail } from "native-base";
import PMPHeader from '../../components/common/PMPHeader'
import { aboutUs, aboutUsText } from '../../constants/ConstantValues'
import { Divider } from "react-native-elements";
import styles from './styles'
import { TouchableOpacity } from "react-native";
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';

import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { connect } from 'react-redux';
import CustomLoader from "../../components/common/CustomLoader";
import MentionHashtagTextView from "react-native-mention-hashtag-text";
import { darkSky } from "../../constants/colors";




class Trends extends Component {
  modal = React.createRef();

  constructor(props) {
    super(props)
    this.onEndReachedCalledDuringMomentum = true;

    this.state = {
      more: false,
      token: '',
      loading: false,
      list_of_trends: [],
    }
  }

  componentDidMount() {
    // const _itme = this.props.navigation.state.params.item

    this.getAccessToken().then(async (TOKEN) => {
      this.setState({
        token: JSON.parse(TOKEN).access_token,
      });
      this.requestTrendsList(JSON.parse(TOKEN).access_token)
    });

  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  goBack = () => { this.props.navigation.pop() }


  requestTrendsList = async (token) => {

    const { list_of_trends, more } = this.state
    // const _itme = this.props.navigation.state.params.item

    {
      more ? null :
        this.setState({ loading: true })
    }

    const formData = new FormData()
    formData.append('server_key', server_key);
    // formData.append('limit', 2)
    // more ? formData.append(
    //     'after_post_id',
    //     list_of_trends[list_of_trends.length - 1].post_id,
    // )
    //     : null;

    const response = await petMyPalApiService.getTrends(token, formData).catch((err) => {
      console.log('error while getting hash tags', err)
    })
    const { data } = response
    let tagList = []

    if (data?.api_status === 200) {
      if (data?.trends.length > 0) {
        tagList = data?.trends
      }
    }

    let tempArr = list_of_trends
    tempArr = tempArr.concat(tagList)


    this.setState({
      list_of_trends: tempArr,
      loading: false,
      more: false,
    })
  }



  rederTrends = ({ item }) => {
    return (
      // <View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('TrendingStory', {
            item,
          })}
        >
          <View style={styles.trendsView}>
            <Text style={styles.trends}>{`#${item.tag}`}</Text>
            {/* <Icon
                        name={'dots-horizontal'}
                        type={'MaterialCommunityIcons'}
                        style={styles.iconStyle}
                    /> */}
          </View>
        <Text style={styles.smallText}>{`${item.trend_use_num} oinks`}</Text>
        <Divider
          orientation="horizontal"
          style={styles.dividerStyle}
        />
        </TouchableOpacity>

      /* </View> */
    )
  }




  onEndReached = ({ distanceFromEnd }) => {
    const { more, token } = this.state

    if (!this.onEndReachedCalledDuringMomentum) {
      this.setState({ more: true }, () =>
        this.requestTrendsList(token)
      )
      this.onEndReachedCalledDuringMomentum = true;
    }
  }

//    mentionHashtagClick = (text) => {
//     console.log("Clicked to + " + text);
// };

  render() {
    const { list_of_trends, loading, more, } = this.state
    return (
      <Container>
        <PMPHeader
          ImageLeftIcon={true}
          LeftPress={() => this.goBack()}
          centerText={'#Trending Now'}
        />

        <View style={{ flex: 1 }}>
          {/* <MentionHashtagTextView
            mentionHashtagPress={this.mentionHashtagClick}
            mentionHashtagColor={darkSky}
          >
            This is a text with a @mention and #hashtag. You can add more @mentions like @john @foe or #hashtags like #ReactNative
        </MentionHashtagTextView> */}
          {loading ?
            <View style={styles.loadingView}>
              <CustomLoader />
            </View>
            :list_of_trends?.length > 0 ?

              <FlatList
                data={list_of_trends}
                keyExtractor={(item) => { item.id }}
                renderItem={this.rederTrends}
                showsVerticalScrollIndicator={false}
                style={{ marginHorizontal: 25, marginBottom: 20 }}
                onEndReached={this.onEndReached.bind(this)}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}

              /> :
              <View style={styles.loadingView}>
                <Text style={styles.noTrend}>No Trend found</Text>
              </View>
          }
          {more ?
            <CustomLoader /> : null
          }

        </View>


      </Container>
    )
  }
}

const mapStateToProps = state => {
  return { user: state.user }
};
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Trends);
