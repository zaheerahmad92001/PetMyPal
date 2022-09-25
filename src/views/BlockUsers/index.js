import React from 'react';
import { Container, Icon as Iconn, Fab } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, SafeAreaView, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { darkGrey, darkSky } from '../../constants/colors';
import UserProfile from '../../components/common/userProfile';
import { DARK_THEME } from 'react-native-country-picker-modal';
import { ScrollView } from 'react-native-gesture-handler';
import PMPHeader from '../../components/common/PMPHeader'



class BlockUsers extends React.Component {
  state = {
    token: null,
    blockUsersList: [],
    blockUsers: false
  }
  componentDidMount() {
    this.callBlockUsers();

  }
  callBlockUsers = async () => {
    const access_token = await AsyncStorage.getItem('access_token');

    let token = JSON.parse(access_token).access_token;
    this.setState({ token });
    const formData = new FormData();
    formData.append("s", token);
    formData.append('user_id', this.props.user?.user_id);
    formData.append("type", "get_blocked_users")
    const data = await petMyPalApiService.getBlockedusers(formData);
    this.setState({ blockUsersList: data?.data?.blocked_users ?? [], blockUsers: true })
  }
  async unBlockUser(user_id) {
    const formData = new FormData();
    formData.append("s", this.state.token);
    formData.append('user_id', this.props.user?.user_id);
    formData.append("block_type", "un-block");
    formData.append("recipient_id", user_id)
    const data = await petMyPalApiService.unBlockUser(formData);
    let filterArray = this.state.blockUsersList;
    filterArray = filterArray.filter(item => item.user_id != user_id);
    this.setState({ blockUsersList: filterArray })

  }
  render() {

    return (
      <Container>
        <SafeAreaView />

        {/* <View style={{ paddingHorizontal: wp(5), width: '100%', alignItems: 'center', flexDirection: 'row' }}>
          <Iconn
            onPress={() => this.props.navigation.goBack()}
            name={'ios-chevron-back'}
            type={'Ionicons'}
            style={{ color: darkSky }}
          />
          <Text style={styles.headerText}> Block Users List</Text>
        </View> */}
         <PMPHeader
            ImageLeftIcon={true}
            LeftPress={() => this.props.navigation.goBack()}
            centerText={'Block Users List'}
            longWidth={true}
         />

        <UserProfile user={this.props?.user} top={80} />
        <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%', paddingHorizontal: wp(5), marginVertical: wp(0) }}>
          {(this.state.blockUsersList.length > 0 && this.state.blockUsers) ? this.state?.blockUsersList.map((item, i) => {
            return (
              <View key={i} style={{ flexDirection: 'row', marginTop: wp(5), height: wp(13), alignItems: 'center', borderRadius: 10, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FastImage source={{ uri: item.profile_picture }} style={{ width: 60, height: 60, borderRadius: 10 }} resizeMode="contain" />
                  <Text style={styles.nameText}>{item.name}</Text>
                </View>
                <TouchableOpacity onPress={() => this.unBlockUser(item.user_id)} style={styles.blockContainer}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Unblock</Text>
                </TouchableOpacity>


              </View>

            )
          }) : this.state.blockUsersList.length == 0 && this.state.blockUsers ? <View style={{ width: '100%', marginVertical: wp(20), justifyContent: 'center', alignItems: 'center' }} >
            <Text style={{ color: DARK_THEME, fontSize: wp(5) }}>No block user is found</Text></View> : null}

        </ScrollView>

      </Container>
    )
  }
}
const styles = StyleSheet.create({
  headerText: {
    color: darkSky,
    fontSize: 20,
    fontWeight: 'bold',
    flexGrow: 1,
    textAlign: 'center',
    paddingRight: wp(8)

  },
  nameText: {
    color: 'black',
    fontSize: wp(4),
    fontWeight: 'bold',
    marginLeft: wp(3)


  },
  optionBtn: {
    backgroundColor: darkSky,
    height: '100%',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10

  },
  blockContainer: {
    backgroundColor: darkSky,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(25),
    height: wp(13),
    borderRadius: 10,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },

})
const mapStateToProps = (state) => {
  return {
    user: state.user?.user?.user_data
  }
}
export default connect(mapStateToProps, {})(BlockUsers);