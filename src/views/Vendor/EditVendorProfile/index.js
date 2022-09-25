import { Icon } from 'native-base'
import React, { Component } from 'react'
import { View, Image, Text, FlatList} from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import {
    welcomePMP, report,
    services, servicesActive, gallery, galleryActive,
    aboutImg, aboutImgActive, more_horiz, aboutUsText
} from '../../../constants/ConstantValues'
import ViewMoreText from 'react-native-view-more-text';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Modal from "react-native-modal";

import { FOOTER_ICON_ACTIVE_Border_NEW, HEADER, lightYellow, White } from '../../../constants/colors'
import styles from './styles'


class EditVendorProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tabSelect: false,
            gal_active: false,
            service_active: false,
            about_active: false,
            services : [
                { id: 1, name: 'Pet Clothing Accessories',description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet, consectetur adipiscing elit' ,
                         img:require('../../../assets/images/pet-icons/fish.png')},
                { id: 1, name: 'Pet Clothing Accessories',description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' , 
                         img:require('../../../assets/images/pet-icons/snake.png')},
                { id: 1, name: 'Pet Clothing Accessories',description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' , 
                         img:require('../../../assets/images/pet-icons/parrot.png')},
                { id: 1, name: 'Pet Clothing Accessories',description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet, consectetur adipiscing elit' , 
                         img:require('../../../assets/images/pet-icons/cat.png')},
              ],
              about : [
                { id: 1, description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' ,
                         img:require('../../../assets/images/updated/welcome.png')},
                { id: 1, description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' ,
                         img:require('../../../assets/images/updated/logo.png')},
              ]
        }

        this._menu = React.createRef()

    }


    renderViewMore = (onPress) => {
        return (
            <Text onPress={onPress}
                style={styles.ViewBtnStyle}>see more</Text>
        )
    }

    renderViewLess = (onPress) => {
        return (
            <Text onPress={onPress}
                style={styles.HideBtnStyle}>Hide</Text>
        )
    }

    handleGallery = () => {
        this.setState({
            tabSelect: true,
            gal_active: true,
            service_active: false,
            about_active: false,
        })
    }

    handleService = () => {
        this.setState({
            tabSelect: true,
            gal_active: false,
            service_active: true,
            about_active: false,
        })
    }

    handleAbout = () => {
        this.setState({
            tabSelect: true,
            gal_active: false,
            service_active: false,
            about_active: true,
        })
    }

    goBack = () => {
        const { tabSelect } = this.state
        if (tabSelect) {
            this.setState({
                tabSelect: false,
                gal_active: false,
                service_active: false,
                about_active: false
            })
        } else {
            this.props.navigation.goBack()
        }
    }

    render() {
        const {
            tabSelect,
            gal_active,
            service_active,
            about_active,
            services,
            about,
        } = this.state
        return (
            <View style={styles.wraper}>
                <View style={styles.headerView}>
                    <Image
                        source={welcomePMP}
                        style={styles.headerImg}
                    />

                </View>
                <View style={styles.headerOverlay}>
                    <Icon
                        onPress={() => this.goBack()}
                        name='chevron-back'
                        type='Ionicons'
                        style={styles.backarrow}
                    />
                    <Text style={styles.textStyle}>Home</Text>
                    <View style={styles.settingBG}>
                        <Icon
                            name='settings'
                            type='Feather'
                            style={styles.settingIcon}
                        />
                    </View>
                </View>
                <ScrollView>
                    <View style={{
                        // height: heightPercentageToDP(100),
                        // flex:1,
                        backgroundColor: White,
                        marginTop: hp(30)
                    }}>
                        <View style={styles.bigImg}>
                            <View style={styles.smallImg}></View>
                            <Text style={styles.nameStyle}>Eco DOG Care</Text>
                            <View style={styles.ratingView}>
                                <Icon
                                    name='user-friends'
                                    type='FontAwesome5'
                                    style={{ fontSize: 15, color: lightYellow }}
                                />
                                <Text style={styles.likeText}>20K</Text>
                                <View style={styles.verticalLine}></View>
                                <Icon
                                    name='star'
                                    type='Entypo'
                                    style={{ fontSize: 20, color: lightYellow, marginLeft: 5 }}
                                />
                                <Text style={styles.likeText}>4.5 Rating</Text>
                            </View>
                            <View style={styles.content}>
                                <Text style={[styles.likeText,
                                { color: FOOTER_ICON_ACTIVE_Border_NEW }]}>
                                    Leom test Text in the stance jakdf  ljaksdf  lkloitiweuri xvn jadksfj
                                </Text>

                                <View style={styles.btnView}>
                                    <TouchableOpacity>
                                        <View style={styles.btnContent}>
                                            <Icon
                                                name='like'
                                                type='EvilIcons'
                                                style={{ fontSize: 25, color: White }}
                                            />
                                            <Text style={{ ...styles.likeText, color: White }}>Like</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <View style={{
                                            ...styles.btnContent,
                                            backgroundColor: White,
                                            borderColor: HEADER,
                                            borderWidth: 0.53
                                        }}>
                                            <Image
                                                source={report}
                                                style={styles.userIcon}
                                            />
                                            <Text style={{ ...styles.likeText, color: HEADER }}>Report</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={
                            tabSelect ?
                                [styles.settingView_select] :
                                [styles.settingView]
                        }>

                            <TouchableOpacity
                                onPress={() => this.handleGallery()}
                                style={
                                    gal_active ?
                                        [styles.g_selected] :
                                        [styles.tabsView]
                                }>
                                <Image source={gal_active ? galleryActive : gallery} style={styles.mediumImg} />
                                <Text style={
                                    gal_active ?
                                        [styles.tabText, { color: White }] :
                                        [styles.tabText]
                                }>Gallery</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => this.handleService()}
                                style={
                                    service_active ?
                                        [styles.s_selected] :
                                        [styles.tabsView]
                                }>
                                <Image source={service_active ? servicesActive : services} style={styles.serviceImg} />
                                <Text style={
                                    service_active ?
                                        [styles.tabText, { color: White }] :
                                        [styles.tabText]
                                }>Services</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => this.handleAbout()}
                                style={
                                    about_active ?
                                        [styles.s_selected] :
                                        [styles.tabsView]
                                }>
                                <Image source={about_active ? aboutImgActive : aboutImg} style={styles.aboutImg} />
                                <Text style={
                                    about_active ?
                                        [styles.tabText, { color: White }] :
                                        [styles.tabText]
                                }>About</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => this._menu.show()}
                                style={styles.tabsView}>
                                <Image source={more_horiz} style={styles.mediumImg} />
                            </TouchableOpacity>

                            <Menu ref={(ref) => { this._menu = ref }}>
                                <MenuItem
                                    // style={styles.menuItemStyle}
                                    onPress={() =>{}}>Reviews</MenuItem>
                                <MenuDivider />
                                <MenuItem
                                    // style={styles.menuItemStyle}
                                    onPress={() => {} }>Contact</MenuItem>
                                <MenuDivider />
                            </Menu>
                        </View>


                        <View style={{
                            ...styles.content,
                            marginTop: hp(3),
                            marginBottom: hp(2)
                        }}>
                            <View style={styles.row}>
                                <View style={styles.imgContainer}>
                                    <Image source={aboutImg} style={styles.img} />
                                </View>
                                <View style={styles.nameView}>
                                    <Text style={styles.mediumText}>Eco Do Care</Text>
                                    <Text style={styles.time}>26 min ago</Text>
                                </View>
                                <Icon
                                    name='more-horizontal'
                                    type='Feather'
                                    style={styles.iconStyle}
                                />
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <ViewMoreText
                                    numberOfLines={3}
                                    renderViewMore={this.renderViewMore}
                                    renderViewLess={this.renderViewLess}>
                                    <Text style={styles.messageText}>{aboutUsText}</Text>
                                </ViewMoreText>
                            </View>
                            <View style={styles.imageView}>
                                <Image
                                    source={gallery}
                                    style={styles.img}
                                />
                            </View>
                        </View>



                    </View>
                </ScrollView>

                
            <Modal isVisible={service_active}>
                <View style={styles.modalView} >
                <View style={styles.headerOverlay1}>
                    <Icon
                        onPress={() => this.goBack()}
                        name='chevron-back'
                        type='Ionicons'
                        style={styles.backarrow1}
                    />
                    <Text style={styles.textStyle1}>Services</Text>
                </View>

                <FlatList
                    data={services}
                    keyExtractor={items => {
                    items.id;
                    }}
                    // numColumns={}
                    renderItem={({item,index})=>{
                        return(
                         <View style={styles.itemCards}>
                             <View style={styles.itemCardsImgView}>
                             <Image source={item.img} style={styles.itemCardsImg} />
                             <Text style={styles.itemCardsHeading} > {item.name} </Text>
                             <Text style={styles.itemCardsDescription} > {item.description} </Text>
                             </View>
                         </View>   
                        )
                    }}
                    style={{ marginTop: 10 }}
                />

                </View>
            </Modal>

            <Modal isVisible={about_active}>
                <View style={styles.modalView} >
                <View style={styles.headerOverlay1}>
                    <Icon
                        onPress={() => this.goBack()}
                        name='chevron-back'
                        type='Ionicons'
                        style={styles.backarrow1}
                    />
                    <Text style={styles.textStyle1}>About</Text>
                </View>

                <FlatList
                    data={about}
                    keyExtractor={items => {
                    items.id;
                    }}
                    // numColumns={}
                    renderItem={({item,index})=>{
                        return(
                         <View style={styles.itemCardsServices}>
                             <View style={styles.itemCardsImgView}>
                             <Text style={styles.itemCardsDescription} > {item.description} </Text>
                             <View style={styles.imageView}>
                                <Image
                                    source={item.img}
                                    style={styles.img}
                                />
                            </View>
                             </View>
                         </View>   
                        )
                    }}
                    style={{ paddingTop: 10, }}
                />

                </View>
            </Modal>
        </View>
        )
    }
}
export default EditVendorProfile