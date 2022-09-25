import React, { Fragment } from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import styles from './styles';
import { TEXT_DARK, TEXT_INPUT_LABEL, PLACE_HOLDER, HEADER, darkSky } from '../../constants/colors';
import { commonState } from '../../components/common/CommomState';
import Modal from 'react-native-modal';
import PMPHeader from '../../components/common/PMPHeader';
import Camera_Icon from '../../assets/images/camera-icon.png';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import DarkButton from '../../components/commonComponents/darkButton';
import { saveWorkSpace } from '../../redux/actions/user';
import { RFValue } from 'react-native-responsive-fontsize';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-date-picker';
import { BLUE_NEW } from '../../constants/colors';
import { Item, Input, Label } from 'native-base';
import CustomLoader from '../../components/common/CustomLoader';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { deletePageAction } from '../../redux/actions/pages';
import { petMyPalPagesApiService } from '../../services/PetMyPalPagesApiService';
const { deleteOwnerPage, petOwnerCreatePage, updateOwnerPageData, getPetOwnerPages } = petMyPalPagesApiService;

class EditPage extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: this.props.navigation.getParam('page') ?? {},
      page_id: this.props.navigation.getParam('page')?.page_id ?? '',
      name: this.props.navigation.getParam('page')?.name ?? '',
      URL: this.props.navigation.getParam('page')?.url ?? '',
      website: this.props.navigation.getParam('page')?.website ?? '',
      about: this.props.navigation.getParam('page')?.about ?? '',
      avatarImage: { name: 'avatar', type: '', uri: this.props.navigation.getParam('page')?.avatar } ?? '',
      coverImage: { name: 'cover', type: '', uri: this.props.navigation.getParam('page')?.cover } ?? '',
      URLEdit: true,
      showDelete: false,
      password: '',
      passwordError: false,
      token: '',
      show: false,
      nameError: false,
      last_nameError: false,
      genderError: false,
      dobError: false,
      URLError: false,
      aboutError: false,
      submit: false,
      loading: false,
      errorText: '',
      newPage: this.props.navigation.getParam('newPage'),
      newdate: new Date(new Date().getTime() - 410240376000),
      date: new Date(new Date().getTime() - 410240376000),
      PetList: commonState.PetList,
      open: false,
      selectPet: this.props.navigation.getParam('page')?.page_category == "0" ? '' : this.props.navigation.getParam('page')?.page_category,
      petError: false

    };
  }
  windowWidth = Dimensions.get('window').width;
  windowHeight = Dimensions.get('window').height;

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  componentDidMount() {
    console.log(this.props.navigation.getParam('page'));
    this.checkPageStatus();
  }
  async checkPageStatus() {
    var TOKEN = await AsyncStorage.getItem(ACCESS_TOKEN);
    this.setState({ token: JSON.parse(TOKEN).access_token });
  }

  goBack = () => {
    this.props.navigation.pop();
  };

  setBirthDate = () => {
    this.setState({
      show: false,
      submit: true,
      dob: `${this.state.newdate.getDate()}-${this.state.newdate.getMonth() +
        1}-${this.state.newdate.getFullYear()}`,
    });
  };

  handleGender = gender => {
    this.setState({
      gender,
      submit: true,
    });
  };

  handleImageChange = i => {
    const options = {
      title: 'Select ' + i,
      storageOptions: {
        skipBackup: true,
        path: 'image',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: 'data:image/jpeg;base64,' + response.data };

        const image = {
          name: response.fileName,
          type: response.type,
          uri: response.uri,
        };
        switch (i) {
          case 'Avatar':
            this.setState({
              avatarImage: image,
              submit: true,
            });
            break;
          case 'Cover':
            this.setState({
              coverImage: image,
              submit: true,
            });
            break;
          default:
            break;
        }
      }
    });
  };

  handleSubmit = async type => {

    const {
      name,
      URL,
      website,
      about,
      avatarImage,
      coverImage,
      token,
      submit,
      page_id,
      selectPet
    } = this.state;
    let nameError, aboutError, URLError, errorText, petError;

    if (name == '') {
      nameError = true;
    } else {
      nameError = false;
    }
    if (selectPet == '') {
      petError = true;
    }
    else {
      petError = false;

    }
    if (about == '') {
      aboutError = true;
    } else {
      aboutError = false;
    }
    if (name.length > 4 && name.length < 32) {

      URLError = false;
      errorText = '';

    } else {
      URLError = true;
      errorText = 'Page url must be between 5 / 32';

    }

    this.setState({
      nameError,
      aboutError,
      URLError,
      errorText,
      petError
    });

    if (submit && nameError == false && URLError == false && petError == false) {
      this.setState({
        loading: true,
      });
      try {
        const data = new FormData();
        data.append('server_key', server_key);
        data.append('page_id', page_id);
        {
          name ? data.append('page_name', name) : null;
        }
        data.append('page_category', this.state.selectPet)
        {
          URL ? data.append('page_title', URL) : null;
        }
        {
          website ? data.append('website', website) : null;
        }
        {
          about ? data.append('page_description', about) : null;
        }
        {
          avatarImage.uri ? data.append('avatar', avatarImage) : null;
        }
        {
          coverImage.uri ? data.append('cover', coverImage) : null;
        }
        const response = await this.props.updateOwnerPageData(token, data)
        const responseJson = await response;

        let pageDetail = !this.props.navigation.getParam('newPage') && this.props.navigation.getParam('page');
        if (pageDetail) {
          pageDetail.name = name ? name : pageDetail.name;
          pageDetail.page_name = name ? name : pageDetail.name;
          pageDetail.page_title = name ? name : pageDetail.name;
          pageDetail.avatar = avatarImage.uri ? avatarImage.uri : pageDetail.avatar,
          pageDetail.cover = coverImage.uri ? coverImage.uri : pageDetail.cover;
          pageDetail.url = URL ? URL : pageDetail.url;
          pageDetail.website = website ? website : pageDetail.website;
          pageDetail.youtube = website ? website : pageDetail.youtube;
          pageDetail.about = about ? about : pageDetail.about

        }
        if (responseJson?.data?.api_status === 200) {
          this.setState({
            loading: false,
          });
          Alert.alert(
            '',
            'Page info has been updated',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.navigation.pop(2);
                  this.props.getPetOwnerPages(token, this.props?.user?.user_data?.user_id, 'my_pages');

                },
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
            `${responseJson?.data?.errors?.error_text}`,
            [{ text: 'OK', onPress: () => this.goBack() }],
            { cancelable: false },
          );
        }
      } catch (e) {
        this.setState({
          loading: false,
        });
        Alert.alert(
          '',
          'Fail To Update Data !',
          [{ text: 'OK', onPress: () => this.goBack() }],
          { cancelable: false },
        );
        console.log(e);
      }
    }
  };

  async handleDelete() {

    if (this.state.password === '') {
      this.setState({
        passwordError: true,
      });
    }
    else {
      try {
        this.setState({ loading: true })
        const responseJson = await this.props.deleteOwnerPage(this.state.token, this.state.page_id, this.state.password);
        const response = await responseJson;
        if (response?.data?.api_status === 200) {
          this.setState({ loading: false })

          this.setState({
            loading: false,
          });
          Alert.alert(
            '',
            'Page has been deleted',
            [
              {
                text: 'OK',
                onPress: () => { this.setState({ showDelete: false }); this.props.navigation.pop(2); this.props.deletePageAction(this.state.page_id) }


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
            [{ text: 'OK', onPress: () => console.log('Something went wrong') }],
            { cancelable: false },
          );
        }
      } catch (e) {
        this.setState({ loading: false })
        alert(e)
      }
    }

  };

  setURL = name => {
    let URLL = name.replace(/[^A-Z0-9_]/gi, '');
    let URL = URLL.toLowerCase();
    this.setState({
      name,
      URL,
    });
  };
  setOpen(open) {

    this.setState({
      open: open
    });
  }
  setValue(callback) {
    this.setState({
      selectPet: callback(),
      petError: false,
      submit: true,
    });
  }

  setItems(callback) {
    this.setState({
      PetList: callback(state.PetList)
    });
  }
  handleCreate = async type => {
    const { name, about, URL, selectPet } = this.state;
    let nameError, aboutError, URLError, errorText, petError;

    if (name == '') {
      nameError = true;
    } else {
      nameError = false;
    }
    if (selectPet == '') {
      petError = true;
    }
    else {
      petError = false;

    }
    if (about == '') {
      aboutError = true;
    } else {
      aboutError = false;
    }
    if (name.length > 4 && name.length < 32) {
      URLError = false;
      errorText = '';

    } else {
      URLError = true;
      errorText = 'Page url must be between 5 / 32';

    }
    this.setState({
      nameError,
      aboutError,
      URLError,
      errorText,
      petError
    });
    if (!nameError && !aboutError && !URLError && !petError && errorText === '') {

      this.props.petOwnerCreatePage(name, URL, about, selectPet, this.state.token, this.props.navigation);

    }
  };

  render() {
    const {
      page,
      show,
      avatarImage,
      coverImage,
      nameError,
      URLError,
      aboutError,
      showDelete,
      password,
      passwordError,
      newPage,
      petError
    } = this.state;
    return (
      <Fragment>
       {/* {newPage&&<SafeAreaView style={{backgroundColor:'white'}} />} */}
        {showDelete ? (
          <Modal animationIn="fadeInDown" useNativeDriver animationInTiming={700} animationOutTiming={1500} isVisible={showDelete} style={styles.modal}>
            <Text style={styles.greyText}>Please Enter Your Password</Text>
            <TextInput
              secureTextEntry
              onChangeText={t => {
                this.setState({
                  password: t,
                  passwordError: false,
                });
              }}
              defaultValue={password}
              style={
                passwordError
                  ? {
                    ...styles.formControlError,
                  }
                  : { ...styles.formControl }
              }
            />
{this.state.loading?<CustomLoader/>:
            <View style={styles.btnRow}>

                <TouchableOpacity style={{ backgroundColor: '#E3EDF0', height: 40, color: TEXT_DARK, borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: '47.5%', marginRight: '2.5%', marginTop: -5 }} onPress={() => this.setState({ showDelete: false })}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>


                <TouchableOpacity style={{ backgroundColor: '#51BCE5', justifyContent: 'center', alignItems: 'center', height: 40, borderRadius: 10, width: '47.5%', marginLeft: '2.5%', marginTop: -5 }} onPress={() => this.handleDelete()}>
                  <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 16 }}>Confirm</Text>
                </TouchableOpacity>

              </View>}

          </Modal>
        ) : null}
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>


          {!newPage ? (
            <View style={{marginTop:wp(-16)}}>
              <SafeAreaView />
              <ImageBackground source={{ uri: page.cover }} style={styles.coverImg} >
             <View style={{marginTop:wp(15)}}>                        
          <PMPHeader
            centerText={newPage ? 'Create New Page' : 'Edit Page'}
            ImageLeftIcon={'arrow-back'}
            LeftPress={() => this.goBack()}
          />
          </View>
              </ImageBackground>
            </View>
          ) : <View style={{marginTop:wp(-2),zIndex:999,marginBottom:wp(15)}}><PMPHeader
          HeadingText={newPage ? 'Create New Page' : 'Edit Page'}
          ImageLeftIcon={'arrow-back'}
          LeftPress={() => this.goBack()}
        /></View>}

          {!newPage ? (


            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{
                borderColor: '#0000', // if you need 
                borderWidth: 1,
                elevation: 5,
                shadowColor: '#0000',
                shadowOpacity: 12,
                backgroundColor: '#fff',
                height: hp(30),
                borderRadius: 20,
                width: wp(88),
                marginTop:wp(0)
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                  <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity
                      style={{
                        width: RFValue(35),
                        height: RFValue(35),
                      }}>
                    </TouchableOpacity>

                  </View>
                  <View style={{ marginTop: hp(-5) }}>

                    <View style={{
                      width: 90,
                      height: 95,
                      borderRadius: 10,
                      backgroundColor: 'grey',
                    }}>
                      <Image
                        style={styles.profileImg}
                        source={{
                          uri: page.avatar
                            ? page.avatar
                            : 'https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600134.jpg',
                        }}
                      />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: hp(-2) }} >
                    <View style={{
                      marginRight: 20, width: RFValue(35),
                      height: RFValue(35),
                    }}>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ marginVertical: wp(3) }}>

                    <Text style={{ color: '#182A53', fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>
                      {page.name}
                    </Text>
                    <Text style={{ color: '#8B94A9', textAlign: 'center' }}>
                      {page.likes} Members
                    </Text>
                    <Text style={{ color: '#8B94A9', textAlign: 'center' }}>
                      Created On: {page.registered}
                    </Text>
                  </View>
                </View>
                <View style={{ marginHorizontal: 6 }}>
                  {this.state.loading ? <CustomLoader/> : <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <View style={{ flexDirection: 'column', flex: 7, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                          <TouchableOpacity onPress={() => {
                            newPage
                              ? this.handleCreate('create-page')
                              : this.handleSubmit('update-page-data');
                          }} style={{ flexDirection: 'row', width: wp(35), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: hp(4), borderWidth: 1, borderRadius: 8, borderColor: BLUE_NEW }}>
                            <Text style={{ fontWeight: 'bold', color: BLUE_NEW }}>
                              {newPage ? (
                                'Create'
                              ) : (
                                'Save'
                              )}
                            </Text>
                          </TouchableOpacity>

                        </View>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <View style={{ flexDirection: 'column', flex: 7, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                          <TouchableOpacity
                            onPress={() => this.setState({ showDelete: true })}
                            style={{ backgroundColor: '#E42222', flexDirection: 'row', width: wp(35), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: wp(4), borderWidth: 1, borderRadius: 8, borderColor: 'red' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>Delete Page</Text>
                          </TouchableOpacity>

                        </View>
                      </View>
                    </View>
                  </View>}
                </View>
              </View>

            </View>
          ) : null}
          <View style={{
            paddingHorizontal: wp(7),
            borderColor: '#0000', // if you need 
            borderWidth: 1,
            elevation: 5,
            shadowColor: '#0000',
            shadowOpacity: 12,
            backgroundColor: '#fff',
            marginBottom: RFValue(15),
            //marginTop:wp(-10)
          }}>
            {!newPage ? (<Text style={styles.NameText}>General Setting</Text>) : null}
            <Item stackedLabel>
              <Label style={{ color: nameError ? "red" : TEXT_INPUT_LABEL }}>Page Name</Label>
              <Input
                placeholder='Page Name'
                placeholderTextColor={PLACE_HOLDER}
                style={{ marginLeft: wp(-1) }}

                value={this.state.name}
                onChangeText={t => {
                  if (t === '') {
                    this.setURL(t);
                    this.setState({
                      nameError: true,
                      name: t

                    });

                  } else {
                    this.setURL(t);
                    this.setState({
                      submit: true,
                      nameError: false,
                      name: t,
                    });
                  }
                }}
              />


            </Item>
            <Label style={{ color: "red" }}>{this.state.errorText}</Label>

            <Item stackedLabel>
              <Label style={{ color: nameError ? "red" : TEXT_INPUT_LABEL }}>Page URL</Label>
              <Input
                placeholder='Page URL'
                placeholderTextColor={PLACE_HOLDER}
                style={{ marginLeft: wp(-1) }}
                value={(this.state.URL.includes('https') || this.state.URL.includes('http') ? this.state.URL : `${SERVER}/p/${this.state.URL}`)}
                // value={(this.state.URL.includes('https') || this.state.URL.includes('http') ? this.state.URL : `https://ladoo.petmypal.com/p/${this.state.URL}`)}
              />
            </Item>
            <Item stackedLabel>
              <Label style={{ color: petError ? "red" : TEXT_INPUT_LABEL, marginTop: wp(4) }}>Pet Category</Label>
              <DropDownPicker
                containerStyle={{ height: this.state.open ? this.state.PetList.length * 20 : 90, marginTop: wp(-5) }}
                textStyle={{ color: darkSky }}
                selectedItemContainerStyle={{ backgroundColor: darkSky }}
                selectedItemLabelStyle={{ color: 'red' }}
                dropDownContainerStyle={{ borderWidth: 0 }}


                open={this.state.open}
                value={this.state.selectPet}
                items={this.state.PetList}
                setOpen={(data) => this.setOpen(data)}
                setValue={(data) => this.setValue(data)}
                setItems={(data) => this.setItems(data)}
                style={{ marginVertical: wp(7), borderWidth: 0 }}


              />
            </Item>
            {newPage && <Item stackedLabel>
              <Label style={{ color: aboutError ? "red" : TEXT_INPUT_LABEL,marginTop:wp(3) }}>Page Description</Label>
              <Input
                placeholder='Page Description'
                placeholderTextColor={PLACE_HOLDER}
                style={{ marginLeft: wp(-1) }}
                value={this.state.about}
                maxLength={200}
                onChangeText={t =>
                  this.setState({
                    submit: true,
                    about: t,
                  })
                }
                multiline={true}
              />
            </Item>}
            {newPage ? (<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              {this.props?.page?.createPageLoader ? <CustomLoader/> : <View style={styles.darkbtn}>
                <DarkButton
                  onPress={() => {
                    newPage
                      ? this.handleCreate('create-page')
                      : this.handleSubmit('update-page-data');
                  }}>

                  Create

                </DarkButton>
              </View>}
            </View>) : null}
          </View>
          {!newPage ? (
            <Fragment>
              <View style={{
                paddingHorizontal: wp(7),
                borderColor: '#0000', // if you need 
                borderWidth: 1,
                elevation: 5,
                shadowColor: '#0000',
                shadowOpacity: 12,
                backgroundColor: '#fff',
                marginBottom: RFValue(15),
              }}>
                <Text style={styles.NameText}>Page Information</Text>

                <Item stackedLabel>
                  <Label style={{ TEXT_INPUT_LABEL }}>Website</Label>
                  <Input
                    placeholder='https://petmypal'
                    placeholderTextColor={PLACE_HOLDER}
                    style={{ marginLeft: wp(-1) }}
                    value={this.state.website}
                    onChangeText={t => {
                      this.setState({
                        submit: true,
                        website: t,
                      });
                    }}
                  />


                </Item>

                <Item stackedLabel>
                  <Label style={{ color: TEXT_INPUT_LABEL }}>About</Label>
                  <Input
                    placeholder='About'
                    placeholderTextColor={PLACE_HOLDER}
                    style={{ marginLeft: wp(-1) }}
                    value={this.state.about}
                    onChangeText={t =>
                      this.setState({
                        submit: true,
                        about: t,
                      })
                    }
                    multiline={true}
                  />
                </Item>
              </View>
              <View style={{
                paddingHorizontal: wp(7),
                paddingVertical: wp(4),
                borderColor: '#0000', // if you need 
                borderWidth: 1,
                elevation: 5,
                shadowColor: '#0000',
                shadowOpacity: 12,
                backgroundColor: '#fff',
                marginBottom: RFValue(15),
              }}>
                <Text style={styles.NameText}>Avatar & Cover Photo</Text>
                <View >
                  <View
                    style={{
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <View>
                        <Text style={styles.bottomText}>Cover</Text>
                        {coverImage.uri ? (
                          <View style={{ width: '100%' }}>
                            <Image
                              style={styles.coverAvatar}
                              source={{ uri: coverImage.uri }}
                            />
                            <FontAwesome5
                              name="window-close"
                              onPress={() => this.setState({ coverImage: {} })}
                              color="white"
                              style={{ position: 'absolute', right: 5 }}
                              size={25}
                            />
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => this.handleImageChange('Cover')}
                            style={styles.coverAvatar}>
                            <Image style={styles.imageIcon} source={Camera_Icon} />
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text style={styles.bottomText}>Avatar</Text>
                      {avatarImage.uri ? (
                        <View>
                          <Image
                            style={styles.profileAvatar}
                            source={{ uri: avatarImage.uri }}
                          />
                          <FontAwesome5
                            name="window-close"
                            onPress={() => this.setState({ avatarImage: {} })}
                            color="white"
                            style={{ position: 'absolute', left: '28%' }}
                            size={25}
                          />
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.handleImageChange('Avatar')}
                          style={styles.profileAvatar}>
                          <Image style={styles.imageIcon} source={Camera_Icon} />
                        </TouchableOpacity>
                      )}
                    </View>


                  </View>
                </View>

              </View>

            </Fragment>
          ) : null}
          {show ? (
            <View
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 400,
              }}
            />
          ) : null}
        </ScrollView>
        {show ? (
          <View
            style={{
              backgroundColor: 'white',
              position: 'absolute',
              zIndex: 500,
              width: 310,
              borderRadius: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 5,
              top: 25,
              left: this.windowWidth - this.windowWidth / 2 - 310 / 2,
            }}>
            <DatePicker
              date={this.state.newdate}
              onDateChange={date => this.setState({ newdate: date })}
              mode="date"
              style={{ position: 'relative', marginVertical: 20 }}
              maximumDate={new Date(new Date().getTime() - 410240376000)}
            />

            <View
              style={{
                height: 42,
                width: 100,
                alignSelf: 'center',
                marginBottom: RFValue(10),
              }}>
              <DarkButton onPress={this.setBirthDate}>OK</DarkButton>
            </View>
          </View>
        ) : null}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  page: state.pages
});
export default connect(
  mapStateToProps,
  { saveWorkSpace, deleteOwnerPage, petOwnerCreatePage, deletePageAction, updateOwnerPageData, getPetOwnerPages },
)(EditPage);
