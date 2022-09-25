import React, { Fragment } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import moment  from 'moment';
import styles from './styles';
import PMPHeader from '../../components/common/PMPHeader';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import DarkButton from '../../components/commonComponents/darkButton';
import { editEvent, deleteEvent, allEvents } from '../../services/index';
import { RFValue } from 'react-native-responsive-fontsize';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import DatePicker from '../../components/updated/DatePicker';
import TimePicker from '../../components/updated/TimePicker';
import RNGooglePlaces from 'react-native-google-places';
import { connect } from 'react-redux';
import { addEvents } from '../../redux/actions/events';
import { TEXT_DARK } from '../../constants/colors';
import { Item, Input, Label } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import { LongAboutParseHtml } from '../../components/helpers';
// import DatePicker from 'react-native-date-picker';

export class EditEvent extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { item } = this.props.navigation.state.params
    this.state = {
      name: item.name,
      location: item.location,
      description: LongAboutParseHtml(item.description),
      showStartDateModel: false,
      showEndDateModel: false,
      showEndTimeModel: false,
      showStartTimeModel: false,
      start_date: item.start_date,
      end_date: item.end_date,
      start_time: item.start_time,
      end_time: item.end_time,
      avatarImage: { uri: item.cover },
      id: item.id,
      user: "",
      first_name: "",
      last_name: "",
      email: "",
      dob: "",
      gender: "",
      about: "",
      token: '',
      coverImage: {},
      show: false,
      first_nameError: false,
      last_nameError: false,
      genderError: false,
      dobError: false,
      emailError: false,
      aboutError: false,
      submit: false,
      loading: false,
      newdate: new Date(new Date().getTime() - 410240376000),
      date: new Date(new Date().getTime() - 410240376000),
    };
  }

  goBack = () => {
    this.props.navigation.pop();
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
        // You can also display the image using data:
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
            });
            break;
          case 'Cover':
            this.setState({
              coverImage: image,
            });
            break;
          default:
            break;
        }
      }
    });
  };
  getLocation = async () => {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        this.setState({location: place.address,locationError:false});
      })
      .catch(error => console.log(error.message));
  };
  componentWillUnmount() {
    this.setState({ loading: false })
  }
  deleteEvent=()=>{
    deleteEvent(this.state.id, (status) => {
      if (status) {
        allEvents((data) => {
          let obj = {
            allEvents: data.events,
            myEvents: data.my_events,
            pastEvents: data.past_events,
            InterestedEvents: data.interested_events,
            InvitedEvents: data.invited_events,
            GoingEvents: data.going_events
          }
          this.props.addEvents(obj)
          this.setState({ loading: false })
          this.props.navigation.navigate('EventsView')
        })
      } else {
        this.setState({ loading: false })

      }
    })
  }
  handleStartTime = () => {
    const { selectedStartTime } = this.state
    let __time = ''
    let Time = ''

    if (selectedStartTime) {
      let dateTime = moment.utc(selectedStartTime).local().format('YYYY-MM-DD HH:mm:ss')
      let [date, _time] = dateTime.split(' ')
      let [h, m, s] = _time.split(':')
      Time = `${h}:${m}`
    }
    this.setState({
      start_time: Time,
      startTimeError:false,
      showStartTimeModel: false,
    })
  }
  render() {
    const {
      avatarImage,
      showStartDateModel,
      name,
      showStartTimeModel,
      showEndTimeModel,
      location,
      showEndDateModel,
      description,
      start_date,
      end_date,
      start_time,
      end_time,
    } = this.state;

    return (
      <Fragment>
        <ScrollView style={styles.container}>
          {this.state.loading &&
            <PlaceholderLoader change={true} />}
          <PMPHeader
            ImageLeftIcon={'arrow-back'}
            LeftPress={() => this.goBack()}
            centerText={'Create Event'}
          />




          <View style={styles.viewForInput}>

            <View style={{}}>
              <Item stackedLabel >
                <Label style={styles.bottomText}>Name</Label>
                <Input onChangeText={t => {
                  this.setState({
                    name: t,
                  });
                }}
                  value={this.state.name}

                  style={[{ padding: 4 }, styles.editFormControl]
                  }
                  placeholder="Enter Name"
                  placeholderTextColor="#B3B2B2"
                />
              </Item>

              <Item stackedLabel >
                <Label style={styles.bottomText}>Location</Label>
                <TouchableOpacity onPress={this.getLocation} style={{alignItems:'flex-start',width:'100%'}}
                ><Text style={[styles.editFormControl,{fontSize:location==''?18:15}]}>{location!=''?location:'Enter Location'}</Text></TouchableOpacity>
              </Item>


              {showStartDateModel ? (
                <DatePicker select={(date) => {
                  this.setState({ start_date: date, showStartDateModel: false })
                }} />
              ) : null}
              {showEndDateModel ? (
                <DatePicker select={(date) => {
                  this.setState({ end_date: date, showEndDateModel: false })
                }} />
              ) : null}
                  <TimePicker
                    isVisible={showStartTimeModel}
                    time={selectedStartTime}
                    header={'Start Time'}
                    onTimeChange={this.onStartTimeChange}
                    onSelect={this.handleStartTime}
                    onClose={this.closeStartTimePicker}
                    mode="time"
            />
              {showEndTimeModel ? (
                <TimePicker select={(selectedDate, date) => {
                  this.setState({ end_time: new Date(date).getHours() + ":" + new Date(date).getMinutes() + ":" + new Date(date).getSeconds(), showEndTimeModel: false })
                }} />
              ) : null}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Item stackedLabel style={{ width: wp(40) }}>
                  <Label style={styles.bottomText}>Start Date</Label>
                  <TouchableOpacity style={{ width: '97%' }}
                    onPress={() => this.setState({ showStartDateModel: true })}>
                    <Text style={{ height: 35, fontSize: 18, marginLeft: -1 }}>
                      {start_date ? moment.utc(start_date).local().format('MM/DD/YYYY') : 'Enter Date'}
                    </Text>
                  </TouchableOpacity>

                </Item>

                <Item stackedLabel style={{ width: wp(45) }}>
                  <Label style={styles.bottomText}></Label>
                  <TouchableOpacity style={{ width: '97%' }}
                    onPress={() => this.setState({ showStartTimeModel: true })}>
                    <Text style={{ height: 35, fontSize: 18, marginLeft: -1 }}>
                      {start_time ? start_time : 'Enter Time'}
                    </Text>
                  </TouchableOpacity>
                </Item>

              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Item stackedLabel style={{ width: wp(40) }}>
                  <Label style={styles.bottomText}>End Date</Label>
                  <TouchableOpacity style={{ width: '97%' }}
                    onPress={() => this.setState({ showEndDateModel: true })}>
                    <Text style={{ height: 35, fontSize: 18, marginLeft: -1 }}>
                      {end_date ? moment.utc(end_date).local().format('MM/DD/YYYY') : 'Enter Date'}
                    </Text>
                  </TouchableOpacity>
                </Item>

                <Item stackedLabel style={{ width: wp(45) }}>
                  <Label style={styles.bottomText}></Label>
                  <TouchableOpacity style={{ width: '97%' }}
                    onPress={() => this.setState({ showEndTimeModel: true })}>
                    <Text style={{ height: 35, fontSize: 18, marginLeft: -1 }}>
                      {end_time ? end_time : 'Enter Time'}
                    </Text>
                  </TouchableOpacity>
                </Item>

              </View>
              <Item stackedLabel >
                <Label style={styles.bottomText}>Description</Label>
                <Input
                  value={this.state.description}
                  onChangeText={t =>
                    this.setState({
                      description: t,
                    })
                  }
                  style={[{ padding: 4 }, styles.editFormControl]
                  }
                  placeholderTextColor="#B3B2B2"
                  placeholder="Enter Description"
                  multiline
                />
              </Item>



              <View>
                <Text style={styles.bottomText}>Cover</Text>

                <View style={{ marginTop: 4 }}>
                  <TouchableOpacity
                    onPress={() => this.handleImageChange('Avatar')}
                    style={[styles.profileAvatar, { overflow: 'hidden' }]}>
                    <Image style={avatarImage.uri ? styles.profileAvatar : styles.imageIcon} source={avatarImage.uri ? { uri: avatarImage.uri } : require('../../assets/images/updated/camraIcon.png')} />

                  </TouchableOpacity>
                </View>

              </View>


            </View>
            <View
              style={{
                height: 42,
                marginVertical: wp(7),
                width: '100%',
                alignSelf: 'center',
                marginBottom: RFValue(10),
              }}>
              <DarkButton onPress={() => {
                this.setState({ loading: true })
                editEvent(this.state.id, name, location,
                  description, start_date, end_date, start_time,
                  end_time, avatarImage, (status) => {
                    if (status) {
                      allEvents((data) => {
                        let obj = {
                          allEvents: data.events,
                          myEvents: data.my_events,
                          pastEvents: data.past_events,
                          InterestedEvents: data.interested_events,
                          InvitedEvents: data.invited_events,
                          GoingEvents: data.going_events
                        }
                        this.props.addEvents(obj)
                        this.goBack()
                      })
                    } else {
                      this.setState({ loading: status })
                    }
                  })
              }
              }>Save Event</DarkButton>
            </View>

            <View
              style={{
                height: 42,
                width: '100%',
                alignSelf: 'center',
                marginBottom: RFValue(10),
              }}>
              <DarkButton onPress={() => {
                Alert.alert(
                  "Deleting Event!",
                 
                  'Are you sure you want to delete event!',
                  [
                    {
                      text: 'OK',
                      onPress: () => { this.deleteEvent() }
                    },
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                  ],
                  { cancelable: true },
                );
                
              }
              }>Delete Event</DarkButton>
            </View>



          </View>



        </ScrollView>

      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events.events,
});

const mapDispatchToProps = dispatch => ({
  addEvents: event => dispatch(addEvents(event))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditEvent);