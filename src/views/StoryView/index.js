import React from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import styles from './styles';
import { Thumbnail, Container, Icon, } from 'native-base';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { userEdit, userSave, saveWorkSpace } from '../../redux/actions/user';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-snap-carousel';
import VideoPlayer from 'react-native-video-controls';
import { DANGER, darkSky, HEADER, PINK, White } from '../../constants/colors';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import ConfirmModal from '../../components/common/ConfirmModal';
import { SERVER, server_key } from '../../constants/server';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
const { petOwnerStories } = petMyPalApiService;
import { LongAboutParseHtml, ShortAboutParseHtml } from '../../components/helpers';
import ProgressBar from '../../components/common/progressBar';
const barWidth = Dimensions.get('screen').width;





class StoryView extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor() {
    super();
    this.state = {
      stories: [],
      activeIndex: 0,
      isVideo: false,
      isPause: false,
      videoURL: '',
      interval: 15000,
      isConfirm_Modal_visible: false,
      selectedStory: '',
      InProcess: false,
      token: '',

      progress: 0,
    };
  }

  windowWidth = Dimensions.get('window').width;
  windowHeight = Dimensions.get('window').height;

  componentDidMount() {
    let __stories = this.props.navigation.getParam('stories')

    this.runInterval()
    let VideoContent = __stories[0]?.videos.length > 0 ? true : false
    if (VideoContent) {
      this.setState({
        videoURL: __stories[0]?.videos[0].filename,
        interval: 15000
      })
    }

    this.setState({
      stories: this.props.navigation.getParam('stories'),
      token: this.props.navigation.getParam('token'),
      isVideo: VideoContent
    });


  }

  runInterval = () => {
    const { interval } = this.state
    const _interval = (interval / 1000) - 1

    let tempProgress = Math.floor(100 / _interval)
    let value = 0
    this.removeInterval = setInterval(() => {
      value = value + 1
      tempProgress = tempProgress + Math.floor(100 / _interval)

      this.setState({ progress: tempProgress }, () => {
        if (value == 15) {
          this.stopInterval()
        }
      })

    }, 1000);
  }


  handleSetTimeOut = () => {
    this.removeTimeOut_ref = setTimeout(() => {
      this.goBack();
    }, this.state.interval);
  }

  stopInterval = () => { clearInterval(this.removeInterval); }
  resetProgress = () => { this.setState({ progress: 0 }) }
  stopSetTimeOut = () => { clearTimeout(this.removeTimeOut_ref); }

  goBack = () => {
    this.stopInterval()
    this.stopSetTimeOut()
    this.props.navigation.pop()
  };

  closeConfirmModal = () => { this.setState({ isConfirm_Modal_visible: false }) }

  deleteStory = (item) => {
    this.setState({
      selectedStory: item,
      isConfirm_Modal_visible: true,

    })
  }

  handle_DeleteStory = async () => {
    this.setState({ InProcess: true, })
    const { selectedStory, token } = this.state
    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('story_id', selectedStory.id)
    const response = await petMyPalApiService.deleteStory(token, formData).catch((err) => {
      console.warn('error while deleting story', err)
    })
    if (response) {
      this.props.petOwnerStories(token);
      const { data } = response
      this.setState({ InProcess: false, isConfirm_Modal_visible: false }, () => this.goBack())
    }
  }
  componentWillUnmount() {
    this.removeInterval;
    this.goBackInterval;
  }

  renderStory = ({ item, index }) => {
    const { isVideo, activeIndex } = this.state
    return (
      <View style={{ flex: 1, justifyContent: 'center' , marginTop:20 }}>
        <View style={styles.rowView}>
          <Thumbnail source={{ uri: "" + item.user_data?.avatar }} />
          <View style={styles.textView}>
            <Text style={styles.userNameText}>{item.user_data.full_name}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.is_owner ?
              <TouchableOpacity
                onPress={() => this.deleteStory(item)}>
                <Icon
                  name={'delete'}
                  type={'MaterialCommunityIcons'}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
              : null
            }

            <TouchableOpacity
              // style={styles.closeIcon} 
              onPress={this.goBack}>
              <IonicIcon color="white" name="close" size={30} />
            </TouchableOpacity>

          </View>

        </View>

        <View style={styles.titleView}>
          {item.title ?
            <Text
              numberOfLines={2}
              style={styles.titleStyle}>
              {ShortAboutParseHtml(item?.title)}
              {/* {item.title.length < 50
                ? `${item.title}`
                : `${item.title.substring(0,50)}...`} */}
            </Text>
            :
            <Text
              numberOfLines={2}
              style={styles.titleStyle}>
              {ShortAboutParseHtml(item?.description)}
              {/* {item?.description?.length < 50
                ? `${item?.description}`
                : `${item?.description.substring(0,50)}...`} */}
            </Text>
          }

        </View>


        {item?.videos?.length > 0 ?
          <View style={styles.videoView}>
            <VideoPlayer
              showOnStart={false}
              disablePlayPause={true}
              disableFullscreen={true}
              disableBack={true}
              seekColor={HEADER}
              disableSeekbar={true}
              tapAnywhereToPause={true}
              disableTimer={true}
              disableVolume={true}
              paused={isVideo && activeIndex === index ? false : true}
              style={{ flex: 1 }}
              source={{ uri: item?.videos[0]?.filename }}
              style={styles.videoStyle}
              resizeMode="cover"
              ref={ref => { this.player = ref; }}
            />
          </View>
          :
          <Image
            resizeMode="cover"
            source={{ uri: item?.thumb?.filename }}
            style={[styles.videoView, { alignSelf: "center" }]}
          />
        }
      </View>

    );
  };

  setIndex = i => {
    const { stories } = this.state

    if (stories[i]?.videos?.length > 0) {
      this.setState({
        isVideo: true,
        activeIndex: i,
      })
    } else {
      this.setState({
        isVideo: false,
        activeIndex: i,
      })
    }

    this.stopInterval()
    this.resetProgress()
    this.runInterval()

    if (i === stories.length - 1) {
      this.handleSetTimeOut()
    }
  };

  onEnd = () => {
    const { activeIndex, stories, interval } = this.state

    if (activeIndex === stories.length - 1) {
      this.handleSetTimeOut()
    }

  }


  singleStoryPop = () => {
    if (this.state.stories.length === 1) {
      this.handleSetTimeOut()
    }
  };


  _carousel = '';

  render() {
    this.singleStoryPop();
    const {
      stories,
      activeIndex,
      isConfirm_Modal_visible,
      InProcess,
      progress
    } = this.state;
    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />

        <View
          style={styles.progressBar}>
          {stories.map((s, i) => {
            let len = stories.length;
            // let width = 100 / len - 2 + '%';
            let width = barWidth / len;
            return (
              <ProgressBar
                barWidth={width}
                value={progress}
                totalStories={len}
                keys={i}
                activeIndex={activeIndex}
              />
              // <View
              //   key={i}
              //   style={
              //     i === activeIndex
              //       ? {
              //           height: 5,
              //           width,
              //           borderRadius: 2,
              //           marginHorizontal: 3,
              //           backgroundColor:darkSky,
              //         }
              //       : {
              //           height: 5,
              //           width,
              //           borderRadius: 2,
              //           marginHorizontal: 3,
              //           backgroundColor: '#FFFFFF',
              //         }
              //   }

              // />

            );
          })}

        </View>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          autoplay
          autoplayDelay={100}
          autoplayInterval={this.state.interval}
          data={stories}
          onEnd={() => this.onEnd()}
          enableMomentum={false}
          lockScrollWhileSnapping={true}
          renderItem={this.renderStory}
          sliderWidth={this.windowWidth}
          // itemWidth={this.windowWidth * 0.95}
          itemWidth={this.windowWidth * 1}
          itemHeight={this.windowHeight}
          layout={'default'}
          onSnapToItem={index => this.setIndex(index)}
        />

        <ConfirmModal
          isVisible={isConfirm_Modal_visible}
          onPress={this.closeConfirmModal}
          info={`Do you want to delete the current slide?`}
          DoneTitle={'Delete'}
          onDoneBtnPress={this.handle_DeleteStory}
          CancelTitle={'Cancel'}
          onCancelBtnPress={this.closeConfirmModal}
          processing={InProcess}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});


export default connect(
  mapStateToProps,
  { petOwnerStories, saveWorkSpace },
)(StoryView);
