import React from 'react';
import {
  Image,
  StatusBar,
  View,
  ToastAndroid,
  TouchableOpacity,
  Text,
  ScrollView,
  ImageBackground
} from 'react-native';

import {
  Container,
  Content
} from 'native-base';
import { Overlay } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


import { HEADER, FOOTER_ICON_NEW, BLUE_NEW } from '../../constants/colors';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import { TEXT_DARK } from '../../constants/colors';
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import PMPHeader from '../../components/common/PMPHeader';
import { updateUsercoverCamera, updatePetAvatar, Createpost, updateUseravatarCamera, getMyGroups, getMyPages, getUserPets, newCreatepost, newCreatepostGroup } from './../../services/index'
import ShareModal from '../shareModalForCamera/index';
import styles from './styles';
import { concat } from 'lodash';

class CameraView extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: undefined,
      moreManu: false,
      manu: false,
      userImage: false,
      loading: false,
      shareModalVisible: false,
      visibleModel: false,
      viewerContent: {},
      newPostData: {},
      myPages: [],
      myGroups: [],
      userPets: []
    }
    this.handlePetAvatar()
  }
  componentDidMount() {
    getMyPages((data) => {
      this.setState({ myPages: data })
    })
    getMyGroups((data) => {
      this.setState({ myGroups: data })
    })
    getUserPets((data) => {
      this.setState({ userPets: data })
    })
  }
  handlePetAvatar = () => {
    const options = {
      mediaTypes: 'Images',
      quality: 0.1,
      title: 'Select Pet Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'image',
      },
    
     
    };
  

    ImagePicker.launchCamera( options,response => {
     
      

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        
        // const source = { uri: response.uri };
// console.log('gvgvhvhvu', response);
let path = response.uri;
if (Platform.OS === "ios") {
   path = "~" + path.substring(path.indexOf("/Documents"));
}
if (!response.fileName) response.fileName = path.split("/").pop();
        // You can also display the image using data:
        const source = response.uri;
        const image = {
          name: response.fileName,
          type: response.type,
          uri: response.uri,
        };

        this.setState({
          avatarSource: source,
          petImage: image,
          userImage: image,
          viewerContent:image
        });
      }
    });
  };
  toggleOverlay = () => {
    this.setState({ visibleModel: !this.state.visibleModel });
  };
  updateState = state => {
    this.setState(state);
  };



  overlayFuncion() {
    <Overlay isVisible={visibleModel} overlayStyle={{ marginVertical: 30 }} onBackdropPress={() => this.toggleOverlay()}>
      <Content style={{ margin: 21 }}>
        {myPages.length > 0 && <View style={{ justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>My Pages</Text>
        </View>}
        {myPages.map((item, i) =>
          <TouchableOpacity key={i}
            onPress={() => {
              if (userImage != false) {
                this.setState({ loading: true })
                newCreatepost(this.props?.user?.user_id, userImage, item.id, (status) => {
                  this.setState({ loading: false, visibleModel: false })

                  alert(status)

                })
              } else {
                alert("please select image first")
              }
            }} style={styles.manuContaner}>
            <Text style={styles.manuText}>Upload to {item.page_title}</Text>
          </TouchableOpacity>)
        }
        {myGroups.length > 0 && <View style={{ justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>My Groups</Text>
        </View>}
        {myGroups.map((item, icon) =>
          <TouchableOpacity key={i}
            onPress={() => {
              if (userImage != false) {
                this.setState({ loading: true })
                newCreatepostGroup(this.props.user.user_id, userImage, item.id, (status) => {
                  this.setState({ loading: false, visibleModel: false })

                  alert(status)

                })
              } else {
                alert("please select image first")
              }
            }}
            style={styles.manuContaner}>
            <Text style={styles.manuText}>Upload to {item.group_title}</Text>
          </TouchableOpacity>)
        }
        {userPets.length > 0 && <View style={{ justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>My Pets</Text>
        </View>}
        {userPets.map((item, i) =>
          <TouchableOpacity key={i}
            onPress={() => {
              if (userImage != false) {
                this.setState({ loading: true })
                updatePetAvatar(userImage, item.id, (status) => {
                  this.setState({ loading: false, visibleModel: false })
                  if (status) {
                    ToastAndroid.show(
                      'Woof Woof',
                      ToastAndroid.SHORT,
                    );

                  } else {
                    alert("try again later")
                  }
                })
              } else {
                alert("please select image first")
              }
            }}
            style={styles.manuContaner}>
            <Text style={styles.manuText}>Upload to {item.name}</Text>
          </TouchableOpacity>)
        }
      </Content>
    </Overlay>

  }
  render() {

    const { avatarSource, userImage, myGroups, newPostData, myPages, userPets, visibleModel, petImage , viewerContent} = this.state

    console.log('user image ' , userImage)

    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        <PMPHeader LeftPress={this.props.drawerOpen} headerStyle={{backgroundColor:'white'}} centerText={'Camera'} />
        <ShareModal
          // viewerContent={obj}
          viewerContent={userImage}
          modalVisible={this.state.shareModalVisible}
          updateState={this.updateState}
          navigation={this.props.navigation}
        />
        {this.state.loading &&
          <PlaceholderLoader />}
        <ImageBackground
          resizeMode={'cover'}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 13,
          }}
          source={{ uri: avatarSource ? avatarSource : 'https://petmypal.com/upload/photos/d-cover.jpg?cache=0' }}
        >
          <View style={styles.outerView} >

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => {
                this.handlePetAvatar()}} 
                style={styles.btnRety}>
                <Text numberOfLines={1} style={styles.eContentText} note>Retry</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity 
                 onPress={() => this.setState({ manu: !this.state.manu, moreManu: false })} 
                 style={styles.btnStyle}>
                <Text numberOfLines={1} style={styles.eContentText} note>Upload</Text>
              </TouchableOpacity>

            </View>

          </View>
          {this.state.manu ? (
            <View style={styles.menuView}>
              <View style={styles.menuInnerView}>
                <ScrollView>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ manu: false })
                      if (userImage != false) {
                        this.setState({ loading: true, })
                        updateUseravatarCamera(userImage, (status) => {
                          this.setState({ loading: false })
                          if (status) {
                            ToastAndroid.show(
                              'Woof Woof',
                              ToastAndroid.SHORT,
                            );
                            this.props.ns
                          } else {
                            alert("try again later")
                          }
                        })
                      } else {
                        alert("please select image first")
                      }
                    }}
                    style={[styles.manuContaner, { borderTopWidth: 0 }]}>
                    <Text style={styles.manuText}>Make My Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ manu: false })
                      if (userImage != false) {
                        this.setState({ loading: true })
                        updateUsercoverCamera(userImage, (status) => {
                          this.setState({ loading: false })
                          if (status) {
                            ToastAndroid.show(
                              'Woof Woof',
                              ToastAndroid.SHORT,
                            );
                          } else {
                            alert("try again later")
                          }
                        })
                      } else {
                        alert("please select image first")
                      }
                    }}
                    style={styles.manuContaner}>
                    <Text style={styles.manuText}>Make My Cover</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ manu: false })
                      if (userImage != false) {
                        this.setState({
                          shareModalVisible: true,
                        })
                      } else {
                        alert("please select image first")
                      }
                    }}
                    style={styles.manuContaner}>
                    <Text style={styles.manuText}>More...</Text>
                  </TouchableOpacity>

                </ScrollView>
              </View>
            </View>
          ) : null}
        </ImageBackground>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user.user_data,
});

const mapDispatchToProps = dispatch => ({
  saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CameraView);
