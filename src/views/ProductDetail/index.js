import React, { Component } from 'react'
import { View, Text, Image, FlatList } from 'react-native'
import { Container, Content } from 'native-base'
import PMPHeader from '../../components/common/PMPHeader'
import { Rating, AirbnbRating } from 'react-native-ratings';
import Swiper from 'react-native-swiper'
import { star, mediumDog } from '../../constants/ConstantValues'
import { CheckBox } from 'react-native-elements';
import styles from './styles'
import { darkSky, TEXT_INPUT_LABEL, White } from '../../constants/colors';
import { labelFont } from '../../constants/fontSize';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import { connect } from 'react-redux'
import { is_Tag_Gifted, cartData, products ,orderNature ,isFreeOrder } from '../../redux/actions/PetTags'
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { SERVER, server_key } from '../../constants/server';
import AsyncStorage from '@react-native-community/async-storage';
import ErrorModal from '../../components/common/ErrorModal';
import CustomLoader from '../../components/common/CustomLoader';



class FreeQRTag extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tagsImg: [],
            p_detail: [],
            __p_datail: [],
            selectedIndex: '',
            selectedPet: '',
            isGifted: false,
            user: '',
            token: '',
            tag_Pets: [],
            p_loading: true,
            petLoading: true,
            isErrorModal_Visible: false,
            // is_order_free:false,
            errorMessage: 'Please Select Pet',

        }
    }

    async componentDidMount() {
// console.log('prop are' , this.props.navigation.state.params.item.p_id)
        this.getAccessToken().then(async (TOKEN) => {
            this.setState({
                user: this.props.user,
                token: JSON.parse(TOKEN).access_token,
            });
            // this.checkUserFreeOrder(JSON.parse(TOKEN).access_token)
            this.getProducts(JSON.parse(TOKEN).access_token)
            this.getTag_Pets(JSON.parse(TOKEN).access_token)
        });


    }

    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        return access_token;
    }

    // checkUserFreeOrder = async(token)=>{
    //     const formData = new FormData();
    //     formData.append('server_key', server_key);
    //     formData.append('user_id', this.props.user.user_data.user_id);
    //     const response = await petMyPalApiService.checkFreeOrder(token, formData).catch((err) => {
    //         console.log('error while checking Free Order', err)
    //     })
    //     const { data } = response
    //     if (data.api_status === 200) {
    //         console.log('is free' , data.data)
    //         let __status =''
    //          if(data.data){
    //              __status ='Free'
    //          }else{
    //             __status ='Paid'
    //          }
    //         this.props.saveFreeOrder(__status)
    //         this.setState({is_order_free:data.data})
    //     }else{
    //         console.log('error in Free order ',data)
    //     }
   
    // }

    getProducts = async (token) => {
     let p_id = this.props.navigation.state.params.item.p_id
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('product_id',p_id)
        // formData.append('user_id', this.props.user.user_data.user_id);
        // formData.append('pet_type_text', 'dog');

        const response = await petMyPalApiService.getProduct(token, formData).catch((err) => {
            console.log('error while getting product', err)
        })
        const { data } = response
        if (data.api_status === 200) {
            // console.log('__product', data.data)
            let __product = []
            __product.push({ ...data.data, key: 0 })

            this.setState({
                tagsImg: data.data.images,
                __p_datail: __product, /// make an array for swipeivew  'key' is important
                p_detail: data.data, /// to show in this screen 
                p_loading: false,
            })
        }else{
            console.log('error in getProduct ',data)
        }
    }

    getTag_Pets = async (token) => {

        const formData = new FormData();
        formData.append('server_key', server_key);
        const response = await petMyPalApiService.getTagPets(token, formData).catch((err) => {
            console.log('error while getting product', err)
        })
        const { data } = response
        if (data.api_status === 200) {

            let __pets = []

     if(data?.pets.length===1){
        data?.pets.map((item, index) => {
            __pets.push({ ...item, selected: true })
        })
     }else if(data?.pets.length > 1){

            data?.pets.map((item, index) => {
                __pets.push({ ...item, selected: false })
            })
        }
        this.setState({
            tag_Pets: __pets,
            petLoading: false,
        })

        } else {
            this.setState({ petLoading: false })
            console.log('error while getting Pet Tags', data)
        }

    }


    goBack = () => { this.props.navigation.pop()}
    
    showShopingCart=()=>{ this.props.navigation.navigate('CartView')}


    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
    }

    closeErrorModal = () => {
        const scope = this
        this.setState({ isErrorModal_Visible: false })
    }

    // onIndexChanged = (v) => {

    // }


    renderPet = ({ item, index }) => {
        // console.log('item' , item)
        return (
            <View style={styles.checkBoxView}>
                <View style={styles.smallImgView}>
                    <Image
                        source={{ uri: item?.avatar }}
                        resizeMode={'contain'}
                        style={styles.imgStyle}
                    />
                </View>
                <CheckBox
                    title={item.name}
                    containerStyle={{
                        backgroundColor: 'null',
                        borderWidth: 0,
                        left: -10,
                        marginTop: 10
                    }}
                    checkedColor={darkSky}
                    onPress={() => this.selectPet(item, index)}
                    textStyle={{
                        color: TEXT_INPUT_LABEL,
                        fontSize: labelFont,
                        fontWeight: '500',
                        left: -5
                    }}
                    checked={item.selected}
                />
            </View>
        )
    }

    selectPet = (item, index) => {

        const { tag_Pets , is_order_free } = this.state
        let __Copy = tag_Pets.slice()

//    if(!is_order_free){

        for (let i = 0; i < __Copy.length; i++) {
            if (index == i) {
                if (__Copy[i].selected == false) {
                    __Copy[i].selected = true
                } else {
                    __Copy[i].selected = false
                }
            }
        }

    // }else{
        // for (let i = 0; i < __Copy.length; i++) {
        //     if (index == i) {
        //         __Copy[i].selected = true
        //     }else{
        //         __Copy[i].selected = false
        //     }
        // }

    // }

        this.setState({ tag_Pets: __Copy })
    }



    handleGiftTagPress = () => {
        let gift = this.state.isGifted
        this.setState({ isGifted: !gift })
    }

    moveToCart = () => {

        const { 
            tag_Pets,
             __p_datail,
              p_detail ,
            //    is_order_free 
            } = this.state


        let gift = this.state.isGifted
        let cart_arr = []
        let cart_obj = {}
        var pet_id_arr = "";
        var pet_name_arr = "";
        var product_quantity = "";
        var order_nature = "Perosnal";


        if(gift){
            cart_obj.product_id = p_detail.p_id
            cart_obj.product_name = p_detail.p_name
            cart_obj.pet_id = pet_id_arr
            cart_obj.pet_name = pet_name_arr
            cart_obj.sale_price = p_detail.p_sale_price
            // cart_obj.sale_price =is_order_free ? 0.00 : p_detail.p_sale_price
            cart_obj.quantity = 1
            order_nature ='Gift'
        }
    else{

        tag_Pets.map((item, index) => {
            if (item.selected) {

                pet_id_arr += item.user_id + ","
                pet_name_arr += item.name + ","
                product_quantity++
                
            }
        })

        if (!pet_id_arr ) {
            //   alert("Please select pet.");
            this.setState({ isErrorModal_Visible: true })
            return false;
        }
        if (pet_id_arr.length > 0) {
            pet_id_arr = pet_id_arr.replace(/,\s*$/, "");
            pet_name_arr = pet_name_arr.replace(/,\s*$/, "");
        }
        cart_obj.product_id = p_detail.p_id
        cart_obj.product_name = p_detail.p_name
        cart_obj.pet_id = pet_id_arr
        cart_obj.pet_name = pet_name_arr
        cart_obj.sale_price = p_detail.p_sale_price
        // cart_obj.sale_price =is_order_free ? 0.00 : p_detail.p_sale_price
        cart_obj.quantity = product_quantity
        cart_obj.key=0    // for SwipListView 
    }

    cart_arr.push(cart_obj)
    this.props.saveGiftStatus(gift)
    this.props.saveCardData(cart_arr)
    this.props.saveProduct(__p_datail)
    this.props.saveOrderNature(order_nature)

    console.log('cartObject',cart_arr)

        if (cart_arr.length > 0) {
            this.props.navigation.navigate('CartView')
        } else if (gift) {
            this.props.navigation.navigate('CartView')
        } else {
            // this.setState({ isErrorModal_Visible: true })
        }

    }


    render() {
        const {
            data,
            isGifted,
            p_detail,
            tagsImg,
            p_loading,
            tag_Pets,
            petLoading,
            isErrorModal_Visible,
            errorMessage,
            // is_order_free,
        } = this.state

        console.log('pdetail is' , p_detail)
        let total_review = p_detail?.reviews?.length
      let va = 1
        
        return (
            <Container style={{
                // backgroundColor:'transparent'
            }}>
                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.goBack()}
                    ImageRightIcon={'shopping-cart'}
                    rghtIconType={'MaterialIcons'}
                    cartValue={va}
                    RightPress={()=>this.showShopingCart()}

                />
                <Content
                    style={styles.container}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                >
                    {p_loading ?
                        <View style={[styles.slide1, { justifyContent: 'center', alignItems: 'center' }]}>
                            <CustomLoader/>
                        </View>
                        :
                        <Swiper
                            style={styles.sliderholder}
                            index={0}
                            loadMinimal={true}
                            loadMinimalSize={1}
                            showsButtons={true}
                            showsPagination={false}
                            nextButton={<Text style={styles.buttonText}>›</Text>}
                            prevButton={<Text style={styles.buttonText}>‹</Text>}
                            autoplay={true}
                            horizontal={true}
                            autoplayTimeout={2.5}
                        // onIndexChanged={(index) => this.onIndexChanged(index)}
                        >

                            {tagsImg?.map((item, index) => {
                                // console.log('redner swiper', item.i_path_full)
                                return (
                                    <View style={styles.slide1}>
                                        <View style={styles.imgContainer}>
                                            <Image
                                                source={{ uri: item.i_path_full }}
                                                // source={{uri: item.img}}
                                                resizeMode={'contain'}
                                                style={styles.imgStyle}
                                            />
                                        </View>

                                    </View>
                                )
                            })
                            }
                        </Swiper>
                    }




                    <View style={styles.headingView}>
                        <Text style={styles.heading}>{p_detail.p_name}</Text>

                    {/* { is_order_free ?
                        <Text style={styles.price}>{'$ 0.00'}</Text>
                        : */}
                        <Text style={styles.price}>{
                            p_loading ?
                                '$ 0.00' :
                                `$ ${p_detail.p_sale_price}`
                        }
                        </Text>
               {/* } */}

                    </View>

                    <View style={styles.ratingView}>
                        <Rating
                            type='custom'
                            ratingCount={5}
                            imageSize={20}
                            startingValue={0}
                            // readonly={true}
                            ratingImage={star}
                            imageSize={18}
                            onFinishRating={this.ratingCompleted}
                        />
                        <Text style={styles.rating}>{
                            p_loading ? '0.0' :
                                `${total_review}.0`
                        }</Text>

                        <Text style={styles.totalRating}>{
                            p_loading ? '(0)' :
                                `(${total_review})`
                        }</Text>
                    </View>

                    <View style={styles.desView}>
                        <Text style={styles.description}>
                            {`${p_detail.p_desc}`}
                        </Text>
                    </View>
                    <View style={styles.border}></View>

                    <CheckBox
                        title="Gift the tag to petowner"
                        containerStyle={{
                            backgroundColor: 'null',
                            borderWidth: 0,
                            left: -10,
                            marginTop: 10
                        }}
                        checkedColor={darkSky}
                        onPress={() => this.handleGiftTagPress()}
                        textStyle={{ color: TEXT_INPUT_LABEL, fontSize: labelFont, fontWeight: '500' }}
                        checked={isGifted}
                    />
                    {!isGifted ?
                        <View>

                            <Text style={[styles.heading, { marginBottom: 20 }]}>Select Pet</Text>
                            {petLoading ?
                                <CustomLoader/> :
                                <FlatList
                                    data={tag_Pets}
                                    keyExtractor={(item) => item.id}
                                    renderItem={this.renderPet}
                                />
                            }
                        </View>
                        :
                        null}
                    <SkyBlueBtn
                        onPress={() => this.moveToCart()}
                        title={'Add To Cart'}
                        btnContainerStyle={styles.btnContainerStyle}
                    />
                </Content>
                <ErrorModal
                    isVisible={isErrorModal_Visible}
                    onBackButtonPress={() => this.closeErrorModal()}
                    heading={"Hoot!"}
                    info={errorMessage}
                    onPress={() => this.closeErrorModal()}
                />
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    isTagGifted: state.petTags.is_T_Gifted,
});
const mapDispatchToProps = dispatch => ({
    saveGiftStatus: g => dispatch(is_Tag_Gifted(g)),
    saveCardData: (cd) => dispatch(cartData(cd)),
    saveProduct: (p) => dispatch(products(p)),
    saveOrderNature: (order) => dispatch(orderNature(order)),
    saveFreeOrder: (fo) => dispatch(isFreeOrder(fo)),
    
});
export default connect(mapStateToProps, mapDispatchToProps)(FreeQRTag)