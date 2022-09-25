import React, { Component } from "react";
import { View, Text, Image, ImageBackground, ScrollView } from 'react-native'
import { Content, Container } from "native-base";
import PMPHeader from '../../components/common/PMPHeader'
import { aboutUs, aboutUsText } from '../../constants/ConstantValues'
import YouTube from 'react-native-youtube';
import ViewMoreText from 'react-native-view-more-text';
import styles from './styles'
import { youtube_key } from "../../constants/server";
class AboutUs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isReady: false,
            fullScreen: false,
            quality: false,
            isPlay: false,
            vHeight: 250,
        }

        this.youtubeRef = React.createRef()

    }
    componentDidMount() {

    }

    goBack = () => { this.props.navigation.pop() }

    onYoutubeError = (e) => {
        console.log('on youtube error', e.error)
    }
    onVideoStateChange = (e) => {
        console.log('on video state chanage', e.state)
    }
    handleOnReady = (e) => {
        console.log('handle on ready state',)
        this.setState({ isReady: true, vHeight: 250 })
    }

    renderViewMore=(onPress)=>{
        return(
          <Text onPress={onPress}
           style={styles.ViewBtnStyle}>View more</Text>
        )
      }

     renderViewLess =(onPress)=>{
        return(
          <Text onPress={onPress}
          style={styles.HideBtnStyle}>Hide</Text>
        )
      }

    render() {
        const { fullScreen, quality, isReady, isPlay, vHeight } = this.state
        return (
            <Container>
                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.goBack()}
                    centerText={'About Us'}
                />

                <View style={{ flex: 1}}>
                    <ScrollView>
                        <View style={styles.video}>

                            <YouTube
                                videoId='LwUApDsoPLs'
                                ref={this.youtubeRef}
                                play={true}
                                fullscreen={false}
                                controls={1}
                                loop={false} // control whether the video should loop when ended
                                showinfo={false}
                                apiKey={youtube_key}
                                onReady={this.handleOnReady}
                                onChangeState={this.onVideoStateChange}
                                onChangeQuality={e => this.setState({ quality: e.quality })}
                                onError={this.onYoutubeError}
                                style={{ alignSelf: "stretch", height: vHeight }}
                            />
                        </View>
                        <View style={styles.aboutUsView}>
                 <ViewMoreText
                          numberOfLines={5}
                          renderViewMore={this.renderViewMore}
                          renderViewLess={this.renderViewLess}
                         >
                    <Text style={styles.messageText}>{aboutUsText}</Text>
                 </ViewMoreText>
                        </View>
                    </ScrollView>

                    <View style={styles.imgView}>
                        <Image
                            source={aboutUs}
                            // resizeMode={'contain'}
                            style={styles.imgStyle}
                        />
                    </View>
                    {/* <Text style={{position:'absolute', bottom:0 , color:'yellow', zIndex:-1}}>zaher</Text> */}
                </View>
                {/* <View style={{flex:0.5,zIndex:-1 ,}}>
                        <View style={styles.imgView}>
                            <Image
                                source={aboutUs}
                                // resizeMode={'contain'}
                                style={styles.imgStyle}
                            />
                        </View>
                    </View> */}




            </Container>
        )
    }
}

export default AboutUs
