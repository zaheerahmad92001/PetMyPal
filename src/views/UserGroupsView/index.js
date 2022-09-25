import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  ScrollView
} from 'react-native';

import {
  Container,
  Icon,
  Left,
  Right,
  Body,
  ListItem,
} from 'native-base';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SvgUri } from 'react-native-svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import { INCORRECT_PASSWORD, LongAboutParseHtml, ShortAboutParseHtml } from '../../components/helpers/index'

import { saveWorkSpace } from '../../redux/actions/user';
import { deleteGroupAction } from '../../redux/actions/groups';
import PMPHeader from '../../components/common/PMPHeader';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import CustomLoader from '../../components/common/CustomLoader';
import PagesView from './../common/pageView/PagesView';
import styles from './styles';
import customStyle from '../EditGroup/styles';
import { darkSky,} from '../../constants/colors';
import { petMyPalGroupApiService } from '../../services/PetMyPalGroupApiService';
import InfoModal from '../../components/common/InfoModal';
const { getPetOwnerGroups, getOwnerJoinedGroups, getPetOwnerRecommendGroups, deleteOwnerGroup } = petMyPalGroupApiService;

class UserGroupsView extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      fetchingRecommended: true,
      groups: [],
      showMenu: false,
      menuIndex: '',
      token: '',
      showDelete: false,
      passwordError: false,
      password: '',
      group_id: '',
      delete_in_Process: false,
      incorrectPass: '',
      infoText: '',
      isModal_Visible: false,
    };
  }

  componentDidMount() {
    this.getAccessToken();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.ownerGroupsApiCall();


    });
  }
  getAccessToken = async () => {
    let TOKEN = await AsyncStorage.getItem(ACCESS_TOKEN);
    this.setState({ token: JSON.parse(TOKEN).access_token }, () => {
      this.recommendGroupsTojoin();
    });

  }
  recommendGroupsTojoin = () => {
    this.props.getPetOwnerRecommendGroups(this.state.token, this.props.user?.user?.user_data?.user_id, 'groups');
  }
  ownerGroupsApiCall() {
    this.props.getPetOwnerGroups(this.state.token, this.props.user?.user?.user_data?.user_id, 'my_groups');
    this.props.getOwnerJoinedGroups(this.state.token, this.props.user?.user?.user_data?.user_id, 'joined_groups');

  }

  componentWillUnmount() {

    this.focusListener.remove();

  }



  goBack = () => {
    this.props.navigation.pop();
  };
  callback = (id) => {
    //this.props.filterPage(id);
  }
  renderGroups(item, index, ownGroups) {
    return (
      <ListItem
        noBorder
        avatar
        onPress={() => {

          this.props.navigation.navigate({
            routeName: 'Group',
            key: 'Group',
            params: { group: item, joinStatus: true },

          });
          this.setState({ menuIndex: undefined }) // *take care of this setState later
        }}
      >
        <Left style={{ justifyContent: 'center' }}>
          {item?.avatar?.includes('.svg') ?
            <SvgUri
              width={RFValue(45)}
              height={RFValue(45)}
              uri={item?.avatar}
            /> :
            <FastImage
              style={{
                alignSelf: 'center',
                backgroundColor: 'black',
                width: RFValue(45),
                height: RFValue(45),
                borderRadius: 12,
              }}
              source={{ uri: item?.avatar?.replace(/\s/g, '') }}
            />}
        </Left>
        <Body>
          <Text style={styles.eNameText} numberOfLines={1} note>
            {item.group_title}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {typeof item === 'object' && item.petsitter !== undefined
              ? item.petsitter.services.map((item, i) => {
                return (
                  <Text key={i} style={styles.eContentText}>{item.name} | </Text>
                );
              })
              : null}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(2) }}>
            {/* <SvgMemberIcon width={16} height={16} /> */}
            <Text style={styles.eContentTextSmall} note>
              Members:{' '}<Text style={{ color: darkSky }}>{item?.members ?? '1'}</Text>
            </Text>
            <View style={{ borderColor: '#929AAE', height: 13, borderRightWidth: 2, marginHorizontal: wp(2) }} />
            { !_.isEmpty(item?.category) && <Text style={styles.eContentTextSmall} note>
              {'Created On:'}{' '}
              <Text style={{ color: darkSky }}>{item.registered}</Text>
            </Text>}
          </View>

          <Text numberOfLines={2} style={[styles.eContentText, { color: 'black', marginTop: wp(1) }]} note>
            {/* {item.about ? item.about.split("<br>").join("") : 'No About'} */}
            {item.about ? ShortAboutParseHtml(item.about): 'No About'}
          </Text>
          <Text style={[styles.eContentTextSmall, { marginVertical: wp(1) }]} note>
            {'Category: '}{' '}
            <Text style={{ color: darkSky }}>{item?.category}</Text>
          </Text>
          <View style={{ width: wp(40), height: wp(8), justifyContent: 'center', alignItems: 'center',
           backgroundColor: this.colorFunction(item.privacy) ? '#FFF4E3' : '#FDEDEE', borderRadius: 10, marginTop: wp(this.state.showMenu == true && this.state.menuIndex == index?7:1) }}>
            <Text style={[styles.eContentTextSmall, { color: this.colorFunction(item.privacy) ? '#FFAF3E' : '#F596A0' }]} note>
              {item.privacy == '1' ? 'Public Community' : 'Private Community'}
            </Text>
          </View>
        </Body>
        {ownGroups &&
          <Right>
            <TouchableOpacity
              onPress={() => {
                this.setState({ showMenu: this.state.menuIndex === index && this.state.menuIndex != '' ?
                 false : true, menuIndex: this.state.menuIndex === index ? '' : index });
              }}>
              <Icon
                type="AntDesign"
                name="ellipsis1"
                style={{ color: this.state.showMenu === true && this.state.menuIndex === index ? 'white' : '#2a2a2a' }}
              />
            </TouchableOpacity>
            {this.state.showMenu === true && this.state.menuIndex === index ? (
              <View
                style={{
                  position: 'relative',
                  zIndex: 1,
                  backgroundColor: 'white',
                  width: wp(42),
                  height: wp(23),
                  borderRadius: 12,
                  marginVertical: wp(2),
                  paddingVertical: wp(2),
                  alignItems: 'center',
                  justifyContent: 'center',
                  top:-7
                }}>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'center',
                    marginBottom: wp(1),

                  }}
                  onPress={() => {
                    this.props.navigation.navigate({
                      routeName: 'EditGroup',
                      key: 'EditGroup',
                      params: { group: item, newGroup: false },
                    });
                    this.setState({ menuIndex: undefined }) // *take care of this setState later
                  }}>
                  <Text style={{ color: '#888' }}> Edit Community</Text>
                </TouchableOpacity>
                <View style={{ borderWidth: 1, borderColor: '#dedede', alignItems: 'center', width: '80%', marginVertical: wp(1) }} />
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}
                 onPress={() => this.setState({ showDelete: true, group_id: item.group_id })}>
                   <Text style={{ color: '#E42222', marginTop: wp(1) }}> Delete Community</Text></TouchableOpacity>
              </View>
            ) : null}
          </Right>}
      </ListItem>

    )
  }

  handlePassword = (text) => {
    this.setState({
      password: text,
      passwordError: false,
    })
  }
  cancelButtonPress = () => {
    this.setState({
      showDelete: false,
      passwordError: false,
      incorrectPass: '',
      password: '',
    })
  }

  navigateTo = () => {
    this.setState({
      isModal_Visible: false,
      menuIndex: '',
      showMenu: false,
      infoText:''
    }, () => {
      this.props.deleteGroupAction(this.state.group_id)
    })
  }

  async handleDelete() {
    const { password } = this.state
    if (_.isEmpty(password)) {
      this.setState({
        passwordError: true,
      });
    } else {
      try {
        this.setState({ delete_in_Process: true, })
        const responseJson = await this.props.deleteOwnerGroup(this.state.token, this.state.group_id, this.state.password);
        const { data } = responseJson
        if (data?.api_status === 200) {
          this.setState({
            delete_in_Process: false,
            incorrectPass: '',
            showDelete: false,
            infoText: 'Community Has Been Deleted',
          }, () => {
            this.communityTimer = setTimeout(() => {
              this.setState({ isModal_Visible: true })
            }, 2000)
          });
        } else {
          this.setState({
            delete_in_Process: false,
            incorrectPass: INCORRECT_PASSWORD,
          });
        }
      } catch (e) {
        this.setState({
          delete_in_Process: false,
          incorrectPass: INCORRECT_PASSWORD
        });
      }
    }
  };

  renderOwnerGroups = ({ item, index }) => {
    const { showDelete,
      incorrectPass,
      delete_in_Process,
      isModal_Visible,
      infoText
    } = this.state
    return (
      <View
        key={item.group_id}
        style={{
          backgroundColor: this.state.showMenu === true && this.state.menuIndex === index ? '#A4A4A4' : '#FFFFFF',
          marginVertical: RFValue(2),
        }}>
        {this.renderGroups(item, index, true)}
        {this.state.group_id === item.group_id ?
          <InfoModal
            // useNativeDriver
            // animationInTiming={700}
            // animationOutTiming={1000}
            isVisible={isModal_Visible ? isModal_Visible : showDelete}
            info={infoText}
            showDelete={showDelete}
            processing={delete_in_Process}
            userPassword={this.handlePassword}
            DoneTitle={'Confirm'}
            CancelTitle={'Cancel'}
            passError={incorrectPass}
            onDoneBtnPress={() => this.handleDelete()}
            onCancelBtnPress={this.cancelButtonPress}
            onPress={() => this.navigateTo()}>
          </InfoModal> :
          null
        }

        {/* {(this.state.group_id === item.group_id) ? (

          <Modal useNativeDriver animationInTiming={700} animationOutTiming={1500} isVisible={this.state.showDelete} 
          style={customStyle.modal}>
            <View>
              <Image
                source={popUpImg}
                style={{ width: 90, height: 90, borderRadius: 50, marginTop: -45 }}
              />
            </View>
            <Text style={customStyle.greyText}>Please Enter Your Password</Text>
            <TextInput
              secureTextEntry
              onChangeText={(text) => this.setState({ password: text, passwordError: false })}
              value={this.state.password}
              style={
                this.state.passwordError
                  ? {
                    ...customStyle.formControlError,
                  }
                  : { ...customStyle.formControl }
              }
            />
            {this.state.infoText == 'Incorrect Password' && <Text style={{ color: 'red', fontWeight: 'bold',
            marginBottom: wp(1) }}>Incorrect Password!</Text>}
            {this.state.loading ?
              <CustomLoader />
              :
              <View style={customStyle.btnRow}>
                <TouchableOpacity style={{ backgroundColor: darkSky, justifyContent: 'center', alignItems: 'center', 
                height: 45, width: '50%', borderBottomLeftRadius: 20 }} onPress={() => this.handleDelete()}>
                  <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14 }}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: PINK, height: 45, color: TEXT_DARK, 
                  justifyContent: 'center', alignItems: 'center', width: '50%', borderBottomRightRadius: 20 }}
                   onPress={() => this.setState({ showDelete: false })}>
                  <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'white' }}>Cancel</Text>
                </TouchableOpacity>

              </View>}

          </Modal>
          
        ) : null} */}

      </View>
    );
  };

  renderJoinedGroups = ({ item, index }) => {
    if (this.props.user?.user?.user_data?.user_id == item.user_id) {
      return null;
    } else {
      return (
        <View
          key={item.group_id}
          style={{
            backgroundColor: '#FFFFFF',
            marginVertical: RFValue(2),
          }}>
          {this.renderGroups(item, index, false)}
        </View>
      );
    }
  };

  renderRecommendedGroups = ({ item, index }) => {
    return (
      <PagesView callBack={this.callback} item={item} index={index} goPage={() => {
        this.props.navigation.navigate({
          routeName: 'Group',
          key: 'Group',
          params: { group:item,joinStatus: false },
        });
      }} />
    )
  };
  callback = (id) => {}

  colorFunction = (privacy) => {
    if (privacy == 1) return true;
    else return false;

  }

  loaderFunction = () => {
    return this.props.groups.groupsLoader &&
      this.props?.groups?.recommendGroups?.length == 0 &&
      this.props?.groups?.ownerGroups?.length == 0 &&
      this.props?.groups?.joinedGroups?.length == 0;
  }

  render() {

    return (
      <Container style={styles.container}>

        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        <PMPHeader
          centerText={'My Communities'}
          ImageLeftIcon={'arrow-back'}
          LeftPress={() => this.goBack()}
          RightPress={() => {
            this.props.navigation.navigate({
              routeName: 'EditGroup',
              key: 'EditGroup',
              params: { newGroup: true },
            });
          }}
          rightBtnText={'Add Community'}
        />

        {this.loaderFunction() ? (

          <View style={{ position: 'absolute', top: wp(30), width: '100%', justifyContent: 'center', zIndex: 1 }}><CustomLoader /></View>

        ) : (
          <ScrollView>
            {this.props?.groups?.recommendGroups?.length > 0 ? (
              <>
                <View
                  style={{
                    backgroundColor: '#FFFF',
                    paddingVertical: RFValue(10),
                    paddingHorizontal: RFValue(20),
                  }}>
                  <Text style={{ fontSize: RFValue(16), fontWeight: 'bold' }}>
                    Communities You May Join
                  </Text>
                </View>
                <View style={{ backgroundColor: '#FFFF', height: 'auto' }}>
                  <FlatList
                    disableVirtualization={true}
                    horizontal={true}
                    data={this.props?.groups?.recommendGroups}
                    renderItem={this.renderRecommendedGroups}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </>
            ) : null}
            {this.props?.groups?.ownerGroups?.map((group, index) => {
              return this.renderOwnerGroups({ item: group, index });
            })}
            {(this.props?.groups?.joinedGroups.length == 0 && this.props?.groups?.ownerGroups.length == 0) && <Image
              style={{ width: '100%' }}
              resizeMode={'contain'}

              source={require("./../../assets/notFound/group.png")}
            />
            }
            {this.props?.groups?.joinedGroups?.map((group, index) => {
              return this.renderJoinedGroups({ item: group, index });
            })}
          </ScrollView>
        )}
      </Container>
    );


  }
}

const mapStateToProps = state => ({
  user: state.user,
  groups: state.groups
});

export default connect(
  mapStateToProps,
  { saveWorkSpace, getPetOwnerGroups, getOwnerJoinedGroups, getPetOwnerRecommendGroups, deleteOwnerGroup, deleteGroupAction }
)(UserGroupsView);
