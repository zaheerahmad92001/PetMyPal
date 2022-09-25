import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Container, Content, ScrollableTab, Tab, Tabs } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MasonryList from "react-native-masonry-list";
import styles from './styles';
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Badge } from 'react-native-elements';
import OneSignal from 'react-native-onesignal';


import { BGCOLOR, } from '../../constants/colors';
import PMPHeader from '../../components/common/PMPHeader';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import CustomLoader from '../../components/common/CustomLoader';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import NoPixxy from '../../assets/Pixxy/noPixxy.svg';



class PixxyWorldView extends React.Component {

  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.distanceFromEnd = 0;
    OneSignal.init('433c25e1-b94d-4f09-8602-bbe908a3761e', {
      kOSSettingsKeyAutoPrompt: true,
    });
    this.state = {
      loading: false,
      allListPixxy: [],
      more: false,
      token: '',
      headingText: 'World Pixxy',

      viewerContent: {
        photos: []
      },
      modalVisible: false,
      breedsList: [],
      breed_id: '',
      showLostPets: false,
      showDeceasedPets: false,

    };
this.refM=React.createRef();
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.inFocusDisplaying(2);
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
    OneSignal.inFocusDisplaying(2);
  }

  onReceived(notification) {
  }

  onOpened(openResult) {
  }

  onIds(device) {
  }

  componentDidMount() {
    this.getAccessToken()
      .then(TOKEN => {
        this.setState({ token: JSON.parse(TOKEN).access_token, loading: true });
        this.requestPMPPixxy(JSON.parse(TOKEN).access_token)
        this.requestHandlerPixxyWorld(JSON.parse(TOKEN).access_token)
      })

  }



  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }



  requestHandlerPixxyWorld = async (token) => {

    const { breed_id, showLostPets, showDeceasedPets, more, allListPixxy } = this.state
    {
      more ? null :
        this.setState({ loading: true })
    }

    let breedQuery = ''
    let lostPetsQuery = ''
    let deceasedPetsQuery = ''

    if (breed_id) {
      breedQuery = `&breed=${breed_id}`
    }

    if (showLostPets) {
      lostPetsQuery = `&lost=${showLostPets}`
    }

    if (showDeceasedPets) {
      deceasedPetsQuery = `&deceased=${showDeceasedPets}`
    }

    let userId = this.props.user?.user_data?.user_id
    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('user_id', userId);
    more ? formData.append(
      'after_post_id',
      allListPixxy[allListPixxy.length - 1].post_id,
    )
      : null;

console.log('data sending to server' ,formData );


    const response = await petMyPalApiService.getWorldPixxy(token, formData, breedQuery, lostPetsQuery, deceasedPetsQuery).catch((err) => {
      console.log('error while getting world pixxy')
    })

    const { data } = response

console.log('here is reponse' , data);

    var ListOfImages = []
    var imageIndex = 0

    if (data.api_status === 200) {
      let changeDimensions = 0
      data.pixxys.forEach(post => {
        const photoArrayItem = [];
        let obj = {}
        if (changeDimensions == 0) {
          changeDimensions = changeDimensions + 1
          obj = {
            dimensions: { width: wp(43.8), height: wp(60) },
            uri: post.first_image,
            url: post.first_image,
            imageIndex: imageIndex,
            item: post,
          }
          imageIndex = imageIndex + 1
        } else if (changeDimensions == 1) {
          changeDimensions = changeDimensions + 1
          obj = {
            dimensions: { width: wp(43.8), height: wp(30) },
            uri: post.first_image,
            url: post.first_image,
            imageIndex: imageIndex,
            item: post,
          }
          imageIndex = imageIndex + 1
        } else if (changeDimensions == 2) {
          changeDimensions = changeDimensions + 1
          obj = {
            dimensions: { width: wp(43.8), height: wp(30) },
            uri: post.first_image,
            url: post.first_image,
            imageIndex: imageIndex,
            item: post,
          }
          imageIndex = imageIndex + 1
        } else if (changeDimensions == 3) {
          changeDimensions = 1
          obj = {
            dimensions: { width: wp(43.8), height: wp(60) },
            uri: post.first_image,
            url: post.first_image,
            imageIndex: imageIndex,
            item: post,
          }
          imageIndex = imageIndex + 1
        }
        ListOfImages.push(obj)
      });

      let allPixxy = allListPixxy;
      allPixxy = allPixxy.concat(ListOfImages);

      this.setState({
        allListPixxy: allPixxy,
        more: false,
        loading: false,
      });
    } else {
      this.setState({ pixxy: [] });
      console.log('error while getting world Pixxy', data)
    }


  }


  loadBreed = (item) => {
    // console.log('here is item ' , item)
    const { token } = this.state
    this.distanceFromEnd = 0
    this.setState({
      initialPage: 0,
      headingText: item.name,
      breed_id: item?.pet_subtype,
      showLostPets: false,
      showDeceasedPets: false,
      allListPixxy: [], // to clear the past pixyworld data
    }, () => this.requestHandlerPixxyWorld(token))
  }

  loadPixxyWorld = () => {
    const { token } = this.state
    this.setState({
      initialPage: 0,
      breed_id: '',
      headingText: 'World Pixxy',
      showLostPets: false,
      showDeceasedPets: false,
      allListPixxy: [], // to clear the past pixyworld data
    }, () => this.requestHandlerPixxyWorld(token))
  }

  loadLostPets = () => {
    const { token } = this.state
    this.setState({
      initialPage: 0,
      headingText:'Lost Pets',
      breed_id: '',
      showLostPets: true,
      showDeceasedPets: false,
      allListPixxy: [], // to clear the past pixyworld data
    }, () => this.requestHandlerPixxyWorld(token))

  }

  loadDeceasedPets = () => {
    const { token } = this.state
    this.setState({
      initialPage: 0,
      headingText:'Deceased Pets',
      breed_id: '',
      showLostPets: false,
      showDeceasedPets: true,
      allListPixxy: [], // to clear the past pixyworld data
    }, () => this.requestHandlerPixxyWorld(token))

  }


  requestPMPPixxy = async (token) => {

    let formData = new FormData()
    formData.append('server_key', server_key)

    const response = await petMyPalApiService.getPmpPixxy(token, formData).catch((err) => {
      console.log('error while accessing PMP pixxy ', err)
    })
    const { data } = response
    if (data.api_status === 200) {
      this.setState({ breedsList: data.breads })
    } else {
      console.log('error while accessing PMP breeds', data)
    }

  }


  goBack = () => { this.props.navigation.pop() };

  loadUserData = async (obj) => {
    const { token } = this.state
    let user_id = obj.item.user_id
    const formData = new FormData()
    formData.append('server_key', server_key);
    formData.append('user_id', user_id);
    formData.append('fetch', 'user_data,family,liked_pages,joined_groups,followers,following');

    this.setState({
      modalVisible: true,
      viewerIndex: obj.imageIndex,
      viewerContent: {
        fetching: true,
        // photos: obj.item.pixxy_photos,
        photos: obj.item.photo_pixxy,
        isPost: true,
        ...obj.item,
      }
    })
    const response = await petMyPalApiService.getUserData(token, formData).catch((err) => {
      console.log('err while getting User Data', err)
    })

    const { data } = response
    if (data.api_status == 200) {
      this.setState({
        modalVisible: true,
        viewerIndex: obj.imageIndex,
        viewerContent: {
          // photos: obj.item.pixxy_photos,
          photos: obj.item.photo_pixxy,
          fetching: false,
          isPost: true,
          userInfo: data.user_data,
          ...obj.item,
        }
      })
    }
  }


  updateState = state => {
    this.setState(state);
  };



  pixxyShow = () => {
    const { allListPixxy, token, more } = this.state;
    return (
      <Content style={{ margin: wp(3), flex: 1 }}

        scrollEventThrottle={300}
        onScrollEndDrag={event => {
          let itemHeight = 302;
          let currentOffset = Math.floor(
            event.nativeEvent.contentOffset.y,
          );
          let currentItemIndex = Math.ceil(currentOffset / itemHeight);
          if (this.distanceFromEnd) {
            // console.log('distance', this.distanceFromEnd)
            // console.log('distance two',currentItemIndex)

            if (currentItemIndex >= this.distanceFromEnd) {
              if (!this.state.more) {
                this.distanceFromEnd = currentItemIndex + 3
                this.setState({ more: true }, () => {
                  this.requestHandlerPixxyWorld(token)
                });
              }
            }
          } else {
            this.distanceFromEnd = 4
          }
        }}
        nestedScrollEnabled={true}
      >

        {allListPixxy?.length > 0 ?
          <MasonryList
          rerender={true}
          sorted={true}
         
          
         
            sorted={true}
            renderIndividualFooter={(item) => {
              if (item?.item?.pixxy_photos?.length > 1) {
                return (
                  <Badge
                    containerStyle={styles.badgeContainer}
                    value={item.item.pixxy_photos.length}
                    badgeStyle={{ backgroundColor: 'black' }}
                    textStyle={styles.badgeTextStyle}
                  />

                )
              }
            }}
            onPressImage={(obj, index) => {
              this.loadUserData(obj)
            }}

            imageContainerStyle={styles.imageContainerStyle}
            images={allListPixxy}

          /> :
          <View style={styles.empityPixxy}>
            <NoPixxy width={wp(70)} height={wp(70)} />
          </View>
        }
        {more ?
          <CustomLoader /> : null}

      </Content>
    )
  }


  PMPPixxy = () => {
    const { breedsList } = this.state
    return (
      <Content style={{
        flex: 1,
        backgroundColor: BGCOLOR,
      }}>

        <TouchableOpacity
          onPress={() => this.loadPixxyWorld()}
        >
          <View style={styles.btnVeiw}>
            <Text style={styles.btnText}>World Pixxy</Text>
          </View>
        </TouchableOpacity>

        <View>
          <FlatList
            data={breedsList}
            keyExtractor={(item) => item.pet_subtype}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.loadBreed(item)}
                >
                  <View style={styles.btnVeiw}>
                    <Text style={styles.btnText}>{item.name}</Text>
                    <Text style={styles.countText}>{` (${item.pixxy_count})`}</Text>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => this.loadLostPets()}
          style={styles.otherBtn}>
          <View style={styles.btnVeiw}>
            <Text style={styles.lostPet}>Lost Pets</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.loadDeceasedPets()}
          style={styles.otherBtn}
        >
          <View style={styles.btnVeiw}>
            <Text style={styles.deceasedPet}>Deceased Pets</Text>
          </View>
        </TouchableOpacity>

      </Content>
    )
  }

  navigateTo = () => {
  
    const item = this.state.viewerContent?.userInfo
    this.setState({ modalVisible: false })
    this.props.navigation.navigate({
      routeName: 'PetProfile',
      key: 'PetProfile',
      params: { item },
    });
  }

  handleComments = ()=>{ 
    const {viewerContent} = this.state  /// when open imageveiw get Selected item
    this.setState({modalVisible:false},
     function(){
      this.props.navigation.navigate({
        routeName: 'PostDetail',
        key: 'PostDetail',
        params:viewerContent,
      });
    })
  } 

  render() {
    const {
      loading,
      headingText,
    } = this.state;
    return (
      <Container style={styles.container}>
        <PMPHeader
          centerText={headingText}
          ImageLeftIcon={'arrow-back'}
          LeftPress={() => this.goBack()}
        />
        <Tabs
          renderTabBar={() => (<ScrollableTab style={{ backgroundColor: 'white', borderWidth: 1, }} />)}
          initialPage={this.state.initialPage} page={this.state.initialPage}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          tabBarBackgroundColor='transparent'
          tabContainerStyle={{ backgroundColor: 'transparent' }}>
          <Tab
            textStyle={styles.textStyle}
            tabStyle={styles.tabStyle}
            activeTextStyle={styles.activeTextStyle}
            activeTabStyle={styles.activeTabStyle}
            heading={'World Pixxy'}
          >
            {loading ?
              <View style={styles.loadingView}>
                <CustomLoader />
              </View> :
              this.pixxyShow()
            }
          </Tab>

          <Tab
            textStyle={styles.textStyle}
            tabStyle={styles.tabStyle}
            activeTextStyle={styles.activeTextStyle}
            activeTabStyle={styles.activeTabStyle}
            heading={'PMP Pixxy'}>
            {this.PMPPixxy()}
          </Tab>

        </Tabs>

        <ImageViewerModal
          viewerContent={this.state.viewerContent}
          modalVisible={this.state.modalVisible}
          updateState={this.updateState}
          navigation={this.props.navigation}
          onPress={() => this.navigateTo()}
          handleComments={this.handleComments}
        />
      </Container>
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
});
export default connect(mapStateToProps, mapDispatchToProps,)(PixxyWorldView);

