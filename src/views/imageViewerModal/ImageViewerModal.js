import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ImageView from 'react-native-image-view';
import { SliderBox } from 'react-native-image-slider-box';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFValue } from 'react-native-responsive-fontsize';
import LikeShareComment from '../../components/updated/LikeShareComment';
import { black, HEADER, PINK, TEXT_INPUT_LABEL, White } from '../../constants/colors';
import { labelFont, textInputFont } from '../../constants/fontSize';
import CustomLoader from '../../components/common/CustomLoader';
import { Pages } from 'react-native-pages';
import VideoPlayer from 'react-native-video-controls';
import Cross from '../../assets/Event-Icons-svg/cross.svg'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Icon } from 'native-base';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
};

const ImageViewerModal = props => {
  const [imageIndex, seIndex] = useState(1);
  const [isImageViewVisible, SetIsImageViewVisible] = useState(false);
  const [imageList, setImageList] = React.useState([]);

  useEffect(() => {
    let array = [];
    seIndex(1)
    props.viewerContent?.photos?.map((item, i) => {
      let index = item?.image?.lastIndexOf('.') ?? item?.lastIndexOf('.');
      let extension = item?.image?.substr(index + 1, 3).toLowerCase() ?? item?.substr(index + 1, 3).toLowerCase();
      // console.log('extension', extension);
      if (extension == 'jpe' || extension == 'jpg' || extension == 'gif' || extension == 'png') {
        array.push({ source: { uri: item?.image } })

      }

    })

    setImageList(array);

  }, [props.modalVisible]);


  const onScrollEnd = (index) => {
    if (DeviceInfo.getBrand() != 'samsung') {
      seIndex(index + 1)
    }
  }
  const onScrollHalfWay = (index) => {
    if (DeviceInfo.getBrand() == 'samsung') {
      seIndex(index + 1)
    }
  }

function onSwipeDown(dir) {
  props.updateState({ modalVisible: !props.modalVisible });
}


  return (
    <GestureRecognizer
        onSwipeDown={(state)=>onSwipeDown(state)}
        config={config}
        >
    <Modal
          transparent={true}
          visible={props.modalVisible}
          onRequestClose={() => {
            props.updateState({ modalVisible: !props.modalVisible });
          }}>
      <View style={styles.centeredView}>

        <TouchableOpacity
            onPress={() => { props.updateState({ modalVisible: !props.modalVisible })}}
            style={styles.headerView}
           >
            <Icon
              name={'arrowleft'}
              type={'AntDesign'}
              style={styles.iconStyle}
            />
        </TouchableOpacity>

        <View style={styles.modalView}>
      <View style={styles.countView}>

          <Text style={styles.countStyle}>
            {props.viewerContent.photos ?
              (props.viewerContent.photos.length > 0 && (imageIndex + "/" + props.viewerContent.photos.length))
              : ''}
          </Text>
          {/* <Icon
           name='more-vertical'
           type='Feather'
          /> */}
    </View>



          {/* <View style={styles.countHolderView}>
            <Text>
              {props.viewerContent.photos ?
                (props.viewerContent.photos.length > 1 && (imageIndex + "/" + props.viewerContent.photos.length))
                : ''}
            </Text>
          </View> */}
          {/* <TouchableOpacity
            style={styles.openButton}
            onPress={() => {
              props.updateState({ modalVisible: !props.modalVisible });
            }}>
            <Cross
              width={15}
              height={15}
              alignSelf={'center'}
              top={5}
            />
          </TouchableOpacity> */}

          <View style={styles.sliderBoxHolder}>
            <View style={{
              position: 'absolute',
              zIndex: 1,
              left: 10
            }}>

              <View style={styles.petNameHolder}>
                {props.viewerContent.fetching ?
                  <CustomLoader
                    loaderContainer={{ top: -8 }}
                  />
                  :
                  props.viewerContent.userInfo ?
                    <TouchableOpacity
                      onPress={props.onPress}
                      style={styles.navigateText}
                    >
                      <Text style={styles.nameStyle}>{props.viewerContent.userInfo.full_name}</Text>
                      <Text style={styles.P_nameStyle}>{`@${props.viewerContent.userInfo.parent_name}`}</Text>
                    </TouchableOpacity> : null

                }
              </View>

            </View>

            <Pages
              indicatorColor={PINK}
              indicatorOpacity={0.2}
              onHalfway={onScrollHalfWay}
              onScrollEnd={onScrollEnd}
              indicatorPosition={props?.viewerContent?.photos?.length > 1 ? 'bottom' : 'none'}
            >
              {props.viewerContent?.photos?.map((item, i) => {
                let index = item?.image?.lastIndexOf('.') ?? item?.lastIndexOf('.');
                let extension = item?.image?.substr(index + 1, 3).toLowerCase() ?? item?.substr(index + 1, 3).toLowerCase();

                return (
                  <View key={i} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {extension == 'jpe' ||
                      extension == 'jpg' ||
                      extension == 'gif' ||
                      extension == 'png' ?
                      <TouchableOpacity onPress={() => SetIsImageViewVisible(true)} style={{ width: '100%', height: 300 }}>
                        <Image

                          source={{ uri: item?.image ?? item }}
                          style={{ 
                          width: '100%', height: 300, 
                          // resizeMode:"contain" 
                        }}
                        />
                      </TouchableOpacity>
                      :

                      <VideoPlayer
                        disableFullscreen={true}
                        disableBack={true}
                        disableVolume
                        seekColor={HEADER}
                        paused={true}
                        tapAnywhereToPause={true}
                        source={{ uri: item.image }}
                        style={{
                          flex: 1,
                          width: '100%',
                          height: 250,
                          alignSelf: 'center',
                          backgroundColor: 'black',
                        }}
                      />

                    }
                  </View>
                )
              })

              }
            </Pages>

            {/* <SliderBox
              onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
              currentImageEmitter={index => {
                seIndex(index + 1)
              }}
              parentWidth={screenWidth - 70}
              sliderBoxHeight={300}
              dotColor={PINK}
              inactiveDotColor={'#90A4AE'}
              
              images={props.viewerContent.photos}
            /> */}

          </View>


          {props.viewerContent.isPost ? (
            <LikeShareComment
              pixxyData={props?.pixxyData ? true : false}
              petData={props?.petData ? true : false}
              updateShareCount={props?.updateShareCount}
              imageIndex={imageIndex - 1}
              viewerContent={props.viewerContent}
              containerStyle={{backgroundColor:black}}
              countStyle={{color:White}}
              iconColor={White}
              handleComments={props.handleComments}   /// parent fun call from all screen where ImgView Component is used
            />

          ) : null}
        </View>

      </View>
      {/* {imageList.length > 0 ?
        <ImageView
          glideAlways
          isPinchZoomEnabled={false}
          isTapZoomEnabled={false}
          animationType="slide"
          images={Platform.OS == 'android' ? Array(imageList[imageIndex - 1]) : imageList}
          isVisible={isImageViewVisible}
          onClose={() => SetIsImageViewVisible(false)}
        //   renderFooter={() => (
        //   <LikeShareComment 
        //    pixxyData={props?.pixxyData ? true : false} 
        //    petData={props?.petData ? true : false} 
        //    updateShareCount={props?.updateShareCount} 
        //    imageIndex={imageIndex - 1} 
        //    viewerContent={props.viewerContent}
        //  />)}

        /> : null} */}
    </Modal>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
  },
  modalView: {
    // backgroundColor: '#fff',
    backgroundColor:'rgb(5,5,6)',
    // opacity:0.9,
    // alignItems: 'center',
    width: '100%',
    height: hp(100),
    justifyContent:'center',
    alignItems:'center',
    paddingTop: getStatusBarHeight()
    // borderRadius: 20,
    // overflow: 'hidden',
  },
  iconStyle: {
    color: White,
    fontSize: 20,
  },
  // modalView: {
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   width: '100%',
  //   paddingTop: RFValue(30),
  //   borderRadius: 20,
  //   overflow: 'hidden',
  // },
  openButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 1,
    height: 25,
    width: 25,
  },
  countHolderView: {
    position: 'absolute',
    top: 10,
  },
  countStyle: {
    color: White,
    fontSize: textInputFont,
    fontWeight: '500',
    // marginHorizontal: wp(3),
    // marginTop: hp(2)
  },
  countView:{
    marginHorizontal: wp(3),
    marginTop: hp(2),
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },



  sliderBoxHolder: {
    height: 320,
    width: wp(100),
    // borderRadius: 20,
    overflow: 'hidden'
  },

  petNameHolder: {
    top: 10,
    left: 15,
  },
  nameStyle: {
    color: White,
    fontWeight: 'bold',
    fontSize: labelFont
  },
  P_nameStyle: {
    color: White,
    fontWeight: '500',
    fontSize: labelFont
  },
  navigateText: {
    ...Platform.select({
      android: {
        height: 50,
      }
    })
  },
  headerView:{
      marginTop: getStatusBarHeight() +20,
      marginLeft:wp(3),
      position:'absolute',
      // backgroundColor:'red',
      zIndex:1,
  },

});

export default ImageViewerModal;
