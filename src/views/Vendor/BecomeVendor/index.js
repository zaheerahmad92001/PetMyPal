import React, { Component } from 'react'
import {View , Text, ImageBackground, Image, ScrollView} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BlurView } from "@react-native-community/blur";


import PMPHeader from '../../../components/common/PMPHeader'
import { darkSky } from '../../../constants/colors'
import styles from './styles'
import VendorModal from '../../../components/common/VendorModal';
import {commonBG, artBoard1} from '../../../constants/ConstantValues'


export default class BecomeVendor extends Component{
    constructor(props){
        super(props)
        this.state={
            isVisible:false,
            // closeModal:false,
        }
    }

    handleVendorModal=()=>{
        const {isVisible}=this.state
        this.setState({isVisible:!isVisible})
    }

    getStarted=()=>{
        this.handleVendorModal()
        setTimeout(()=>{
            this.props.navigation.navigate('VendorProfile')
        },200)
    }

    render(){
        const {isVisible}=this.state
        return(
            <ScrollView style={styles.container} >
            <View>
                <ImageBackground source={commonBG} style={{width:'100%'}} >
                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.props.navigation.goBack()}
                    centerText={'Create your Platform'}
                    longWidth={true}
                />
                <View style={styles.containerBox} >
                    <View style={styles.Box} >
                        <Text style={styles.text1} >Build Your Online</Text>
                        <Text style={styles.text2} >Market Place</Text>
                        <Text style={styles.text3} >Build Your Online</Text>
                        <TouchableOpacity onPress={()=>{this.setState({isVisible:true})}} >
                        <Text style={styles.text4} >Become a Vendor</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Image source={artBoard1} style={styles.img} />
                    </View>
                </View>
                </ImageBackground>
            </View>
            <View>
            <Text style={styles.vendor} >Vendors near me</Text>
            </View>
            <View style={styles.vendorCard} >
            <View>
                <Image source={artBoard1} style={styles.vCardImage} />
            </View>
            <View style={styles.vCardText} >
                <Text style={styles.vText} >Hello</Text>
                <Text style={styles.vText1} >World</Text>
            </View>
            <TouchableOpacity style={styles.vCardBtn} >
                <Text style={{color:darkSky}} >
                    View Services
                </Text>
            </TouchableOpacity>
            </View>
            <VendorModal
            isVisible={isVisible}
            onPress={this.handleVendorModal}
            getStarted={this.getStarted}
            />
            {isVisible ?
            <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="black"
        />: null }
            </ScrollView>
        )
    }
}