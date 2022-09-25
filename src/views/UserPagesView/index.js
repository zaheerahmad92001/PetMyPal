import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';

import styles from './styles';
import customStyle from '../EditPage/styles';
import { TEXT_DARK } from '../../constants/colors';
import {
  Container,
  Icon,
  Left,
  Right,
  Body,
  ListItem
} from 'native-base';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import PMPHeader from '../../components/common/PMPHeader';
import { RFValue } from 'react-native-responsive-fontsize';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView,} from 'react-native-gesture-handler';
import PagesView from './../common/pageView/PagesView';
import { deletePageAction } from '../../redux/actions/pages';
import CustomLoader from '../../components/common/CustomLoader';
import { petMyPalPagesApiService } from '../../services/PetMyPalPagesApiService';
const { getPetOwnerPages, getOwnerLikedPages, getPetOwnerRecommendPages, deleteOwnerPage } = petMyPalPagesApiService;

class UserPagesView extends React.Component {
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
      likedPages: [],
      ownPages: [],
      recommndedPages: [],
      showMenu: false,
      menuIndex: '',
      token: '',
      showDelete: false,
      passwordError: false,
      password: '',
      page_id: '',
      loading: false
    };
  }

  componentDidMount() {
    this.ownerPagesApiCall();
  }
  async ownerPagesApiCall() {

    const TOKEN = await AsyncStorage.getItem(ACCESS_TOKEN);
    this.props.getPetOwnerPages(JSON.parse(TOKEN).access_token, this.props.user?.user_data?.user_id, 'my_pages');
    this.props.getOwnerLikedPages(JSON.parse(TOKEN).access_token, this.props.user?.user_data?.user_id, 'liked_pages');
    this.props.getPetOwnerRecommendPages(JSON.parse(TOKEN).access_token, this.props.user?.user_data?.user_id, 'pages');
    this.setState({ token: JSON.parse(TOKEN).access_token });

  }

  goBack = () => { this.props.navigation.pop()};

  callback = (id) => {
    //this.props.filterPage(id)
  }
  async handleDelete() {

    if (this.state.password === '') {
      this.setState({
        passwordError: true,
      });
    } else {
      try {
        this.setState({ loading: true })
        const responseJson = await this.props.deleteOwnerPage(this.state.token, this.state.page_id, this.state.password);

        if (responseJson?.data?.api_status === 200) {
          this.setState({
            loading: false,
          });
          Alert.alert(
            '',
            'Page has been deleted',
            [
              {
                text: 'OK',
                onPress: () => { this.setState({ menuIndex: '', showMenu: false, password: '',showDelete:false }); this.props.deletePageAction(this.state.page_id) }
              },
            ],
            { cancelable: false },
          );
        } else {
          this.setState({
            loading: false,
          });
          Alert.alert(
            '',
            `${response?.data?.errors?.error_text}`,
            [{ text: 'OK', onPress: () => console.log('ok') }],
            { cancelable: false },
          );
        }
      }
      catch (e) {
        this.setState({
          loading: false,
        });
        Alert.alert(
          '',
          'Something went wrong!',
          [{ text: 'OK', onPress: () => console.log('ok') }],
          { cancelable: false },
        );


      }
    }
  };
  renderOwnPages = ({ item, index }) => {
    return (
      <View
        key={item.id}
        style={{
          // flex: 1,
          backgroundColor: this.state.showMenu === true && this.state.menuIndex === index ? 'rgba(52, 52, 52, 0.7)' : '#FFFFFF',
          marginVertical: RFValue(2),
          // backgroundColor: '#E3EDF0',
        


        }}>
        <ListItem
          noBorder
          avatar
          onPress={() => {
            this.props.navigation.navigate({
              routeName: 'Page',
              key: 'Page',
              params: { page: item,joinStatus:false },
            });
          }}
        >
          <Left style={{ justifyContent: 'center' }}>
            <FastImage
              style={{
                alignSelf: 'center',
                backgroundColor: 'black',
                width: RFValue(45),
                height: RFValue(45),
                borderRadius: 12,
              }}
              source={{ uri: item?.avatar?.replace(/\s/g, '') }}
            />
          </Left>
          <Body>
            <Text style={styles.eNameText} numberOfLines={1} note>
              {item.page_title}
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

            <Text style={styles.eContentTextSmall} note>
              {item.likes}
              {item.likes > ! '1' ? ' Members' : ' Member'}
            </Text>
            <Text style={styles.eContentTextSmall} note>
              {'Created On: '}
              {item.registered}
            </Text>
            <Text numberOfLines={2} style={styles.eContentText} note>
              {item.about ? item.about.split("<br>").join("") : 'No About'}
            </Text>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => {
              this.setState({ showMenu: this.state.menuIndex === index && this.state.menuIndex != '' ? false : true, menuIndex: this.state.menuIndex === index ? '' : index });
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
                  position: 'absolute',
                  zIndex: 900,
                  backgroundColor: 'white',
                  width: wp(36),
                  height: hp(8),
                  right: 40,
                  borderRadius: 12,
                  top: 0,
                  marginVertical: wp(2),
                  paddingVertical: wp(2),
                  alignItems: 'center',
                  justifyContent: 'center',



                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 10


                  }} onPress={() => {
                    this.props.navigation.navigate({
                      routeName: 'EditPage',
                      key: 'EditPage',
                      params: { page: item },
                    });
                  }}>
                  <Text style={{ color: '#888' }}> Edit Page</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '888', alignItems: 'center', paddingTop: 10 }}>
                  <TouchableOpacity onPress={() => this.setState({ showDelete: true, page_id: item.page_id })}><Text style={{ color: '#E42222' }}> Delete Page</Text></TouchableOpacity>
                </View>
              </View>
            ) : null}
          </Right>
        </ListItem>


        { this.state.page_id == item.page_id ? (
        <Modal animationIn="fadeInDown" useNativeDriver animationInTiming={700} animationOutTiming={1500} isVisible={this.state.showDelete} style={customStyle.modal}>
        <Text style={customStyle.greyText}>Please Enter Your Password</Text>
           
            <TextInput
              secureTextEntry
              onChangeText={t => {
                this.setState({
                  password: t,
                  passwordError: false,
                });
              }}
              defaultValue={this.state.password}
              style={
                this.state.passwordError
                  ? {
                    ...customStyle.formControlError,
                  }
                  : { ...customStyle.formControl }
              }
            />
            {this.state.loading ?
               <CustomLoader/> 
               :
              <View style={customStyle.btnRow}>

<TouchableOpacity style={{ backgroundColor: '#E3EDF0', height: 40, color: TEXT_DARK, borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: '42.5%', marginRight: '2.5%', }} onPress={() => this.setState({ showDelete: false })}>
                  <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Cancel</Text>
                </TouchableOpacity>


                <TouchableOpacity style={{ backgroundColor: '#51BCE5', justifyContent: 'center', alignItems: 'center', height: 40, borderRadius: 10, width: '42.5%', marginLeft: '2.5%', }} onPress={() => this.handleDelete()}>
                  <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14 }}>Confirm</Text>
                </TouchableOpacity>

              </View>}

          </Modal>
        ) : null}



      </View>
    );
  };

  renderLikedPages = ({ item, index }) => {
    return (
      <View
        key={item.id}
        style={{
          backgroundColor: '#FFFFFF',
          marginVertical: RFValue(2),
        }}>
        <ListItem
          noBorder
          avatar
          onPress={() => {
            this.props.navigation.navigate({
              routeName: 'Page',
              key: 'Page',
              params: { page: item,joinStatus:true },
            });
          }}>
          <Left style={{ justifyContent: 'center' }}>
            <FastImage
              style={{
                alignSelf: 'center',
                backgroundColor: 'black',
                width: RFValue(45),
                height: RFValue(45),
                borderRadius: 12,
              }}
              source={{ uri: item?.avatar?.replace(/\s/g, '') }}
            />
          </Left>
          <Body>
            <Text style={styles.eNameText} numberOfLines={1} note>
              {item.page_title}
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
            <Text style={styles.eContentTextSmall} note>
              {item.likes}
              {item.likes !== '1' ? ' Likes' : ' Like'}
            </Text>
            <Text style={styles.eContentTextSmall} note>
              {'Created On: '}
              {item.registered}
            </Text>
            <Text numberOfLines={2} style={styles.eContentText} note>
              {item.about ? item.about.split("<br>").join("") : 'No About'}
            </Text>
          </Body>
        </ListItem>
      </View>
    );
  };

  renderRecommendedPages = ({ item, index }) => {
    return (
      <PagesView item={item} callBack={this.callback} index={index} goPage={() => {
        this.props.navigation.navigate({
          routeName: 'Page',
          key: 'Page',
          params: { page: item,joinStatus:false },
        });
      }} />
    )
  };

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        <PMPHeader
          centerText={'My Pages'}
          ImageLeftIcon={'arrow-back'}
          LeftPress={() => this.goBack()}
          RightPress={() => {
            this.props.navigation.navigate({
              routeName: 'EditPage',
              key: 'EditPage',
              params: { newPage: true },
            });
          }}
          rightBtnText={'Add Page'}
        />

        {(this.props.pages.pagesLoader && this.props.pages?.recommendPages?.length == 0&&this.props.pages?.ownerPages?.length==0&&this.props.pages?.likedPages.length==0) ? (
          <View style={styles.searchResultContainer}>
            <CustomLoader/>
          </View>
        ) : (
          <ScrollView>
            {this.renderRecommendedPages.length > 0 ? (
              <>
                <View
                  style={{
                    backgroundColor: '#FFFF',
                    paddingVertical: RFValue(10),
                    paddingHorizontal: RFValue(20),
                  }}>
                  <Text style={{ fontSize: RFValue(16), fontWeight: 'bold' }}>
                    Pages You May Like
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  style={{
                  }}>
                  <View style={{ backgroundColor: '#FFFF' }}>
                    <FlatList
                      disableVirtualization={true}
                      horizontal={true}
                      data={this.props.pages?.recommendPages}
                      renderItem={this.renderRecommendedPages}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        paddingVertical: RFValue(10),
                        paddingHorizontal: RFValue(10),
                      }}
                    />
                  </View>
                </ScrollView>
              </>
            ) : null}
            {this.props?.pages?.ownerPages?.map((page, index) => {
              return this.renderOwnPages({ item: page, index });
            })}
            {this.props?.pages?.likedPages?.map((page, index) => {
              return this.renderLikedPages({ item: page, index });
            })}
          </ScrollView>
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  pages: state.pages
});

export default connect(
  mapStateToProps,
  { getPetOwnerPages, getOwnerLikedPages, getPetOwnerRecommendPages, deleteOwnerPage, deletePageAction }
)(UserPagesView);
