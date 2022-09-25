import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput
} from 'react-native'
import { Container, Content } from 'native-base'
import PMPHeader from '../../components/common/PMPHeader'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { creditCard, cardList, dis_err_msg } from '../../constants/ConstantValues'
import { CheckBox } from 'react-native-elements';
import styles from './styles'
import { BGCOLOR, DANGER, darkSky, grey, PINK, TEXT_INPUT_LABEL, White } from '../../constants/colors';
import { labelFont } from '../../constants/fontSize';
import TextField from '../../components/common/TextField';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import BreedPicker from '../../components/common/BreedPicker'
import IntlPhoneInput from 'react-native-intl-phone-input';
import { Icon } from 'native-base'
import Label from '../../components/common/Label';
import ConfirmModal from '../../components/common/ConfirmModal';
import { connect } from 'react-redux'
import { is_Tag_Gifted } from '../../redux/actions/PetTags'
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import ErrorModal from '../../components/common/ErrorModal';
import CustomLoader from '../../components/common/CustomLoader';

import { CreditCardInput } from 'react-native-credit-card-input';
import WhiteBtn from '../../components/common/WhiteBtn';
import { Overlay } from 'react-native-elements'
const STRIPE_ERROR = 'Payment service error. Try again later.';
const SERVER_ERROR = 'Server error. Try again later.';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_ODBtT5Wn7EOWsxiqym3wTIu000ZIt3uY2I';

import Modal from 'react-native-modal'
import Invoice from '../../components/common/Invoice';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const getCreditCardToken = (creditCardData) => {
    const card = {
        'card[number]': creditCardData.values.number.replace(/ /g, ''),
        'card[exp_month]': creditCardData.values.expiry.split('/')[0],
        'card[exp_year]': creditCardData.values.expiry.split('/')[1],
        'card[cvc]': creditCardData.values.cvc
    };

    return fetch('https://api.stripe.com/v1/tokens', {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`
        },
        method: 'post',
        body: Object.keys(card)
            .map(key => key + '=' + card[key])
            .join('&')
    }).then(response => response.json());
};

const subscribeUser = (creditCardToken) => {
    return new Promise((resolve) => {
        console.log('Credit card token\n', creditCardToken);
        setTimeout(() => {
            resolve({ status: true });
        }, 1000)
    });
};


let rec_filteredState = ''
let sender_filteredState = ''
let b_filteredState=''


class ShippingAddress extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this?.props?.user?.user_data,
            token: '',
            s_email: this?.props?.user?.user_data.email,
            s_fullName: this?.props?.user?.user_data.full_name,

            // becouse it was not picking value if i set its value on this page
            s_cca2: this?.props?.navigation?.state?.params?.s_cca2,
            s_callingCode: this?.props?.navigation?.state?.params?.s_callingCode,
            s_setDefaultValue: true,
            s_phone: this?.props?.navigation?.state?.params?.s_defaultValue,

            s_address1: '',
            s_address2: '',
            s_state: '',
            s_state_id: '',
            s_city: '',

            s_cityError: false,
            s_stateError: false,
            s_add_1_Error: false,
            s_zip_error: false,

            s_zipcode: '',
            isVisible: false,
            searchValue: '',

            loading: false,
            submitted: false,
            error: null,
            CC_data: '',
            isConfirm_Modal_visible: false,
            InProcess: false,
            infoMsg: 'Are You Sure You Want To Cancel Your Order',

            rec_isVisible: false,
            rec_cca2: 'US',
            rec_callingCode: '1',
            rec_phone: '',

            rec_phoneError: false,
            rec_nameError: false,
            rec_emailError: false,
            rec_add_1_err: false,
            rec_cityError: false,
            rec_stateError: false,
            rec_zipcodeError: false,

            rec_name: '',
            rec_email: '',
            rec_setDefaultValue: true,
            rec_address1: '',
            rec_address2: '',
            rec_searchValue: '',
            rec_city: '',
            rec_state: '',
            rec_state_id: '',
            res_serchValue: '',
            rec_zipcode: '',
            _position: 1,
            isInvoiceVisible: false,

            listOfStates: [],
            states_dd: [],
            stripeToken: '',

            b_address1: '',
            b_add_1_err: '',
            b_address2: '',
            b_city: '',
            b_cityError: '',
            b_stateError: '',
            b_state: '',
            bc_state_id: '',
            b_serchValue: '',
            b_zipcode: '',
            b_z_code_Error: '',
            isChecked: true,
            b_isVisible:false,
            b_searchValue: '',


            p_inProcess: false,
            dis_code: '',
            isErrorModal_Visible: false,


        }
    }
    componentDidMount() {
        console.log('user data', this.state.user.email)

        this.getStates()

        this.getAccessToken().then(async (TOKEN) => {
            this.setState({ token: JSON.parse(TOKEN).access_token });
        });
    }


    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        return access_token;
    }


    goBack = () => { this.props.navigation.pop() }

    getStates = async () => {
        let formData = new FormData()
        formData.append('server_key', server_key);
        formData.append('country_id', 233)
        const response = await petMyPalApiService.getStates(formData).catch((err) => {
            console.log('error while getting states', err)
        })
        const { data } = response
        console.log('here are states', data)

        if (data.api_status == 200) {
            let temp = []
            data.states.map((value, index) => {
                temp.push(value.name)
            })
            this.setState({ listOfStates: temp, states_dd: data.states })
        }
    }

    rec_hideShow_Dropdown = () => {
        const { rec_isVisible } = this.state
        this.setState({
            rec_isVisible: !rec_isVisible
        })
    }

    rec_onValueChange = (value) => {
        this.setState({
            rec_state: value,
            rec_stateError: false,
            res_serchValue: value // will do empity once user select its value
        })
    }

    rec_handleStateSelection = (item) => {
        const { states_dd } = this.state
        var FOUND = states_dd.find(function (post, index) {
            if (post.name == item)
                return post;
        });

        this.setState({
            rec_state: item,
            rec_state_id: FOUND.id,
            rec_searchValue: '', // if user again open modal will see all breed again
            rec_stateError: false,
            rec_isVisible: false
        })
    }

    sender_handleStateSelection = (item) => {
        const { states_dd } = this.state
        var FOUND = states_dd.find(function (post, index) {
            if (post.name == item)
                return post;
        });

        this.setState({
            s_state: item,
            s_state_id: FOUND.id,
            searchValue: '', // if user again open modal will see all breed again
            s_stateError: false,
            isVisible: false
        })
    }

    sender_onValueChange = (value) => {
        this.setState({
            s_state: value,
            s_stateError: false,
            searchValue: value // will do empity once user select its value
        })
    }

    hideShow_Dropdown = () => {
        const { isVisible } = this.state
        this.setState({
            isVisible: !isVisible
        })
    }

    

    b_hideShow_Dropdown = () => {
        const { b_isVisible } = this.state
        this.setState({
            b_isVisible: !b_isVisible
        })
    }

    b_handleStateSelection = (item) => {
        const { states_dd } = this.state
        var FOUND = states_dd.find(function (post, index) {
            if (post.name == item)
                return post;
        });

        this.setState({
            b_state: item,
            b_state_id: FOUND.id,
            b_searchValue: '', // if user again open modal will see all breed again
            b_stateError: false,
            b_isVisible: false
        })
    }

    b_onValueChange = (value) => {
        this.setState({
            b_state: value,
            b_stateError: false,
            b_serchValue: value // will do empity once user select its value
        })
    }

    
    closeConfirmModal = () => {
        let close = this.state.isConfirm_Modal_visible
        this.setState({ isConfirm_Modal_visible: !close })
    }

    CancelOrder = () => {
        this.setState({ isConfirm_Modal_visible: false })
    }

    closeErrorModal = () => {
        this.setState({ isErrorModal_Visible: false })
    }






    /*********************** custom dd *************************/
    s_filterData = (query) => {
        const { listOfStates } = this.state
        if (query.search(/[\[\]?*+|{}\\()@.\n\r]/) == -1) {
            if (query === '') {
                // return []
                return listOfStates
            }
            const regex = new RegExp([query.trim()], 'i')
            return listOfStates.filter((c) => c.search(regex) >= 0)
        } else {
            console.log('Inalid query', query)
        }
    }


    /*********************** custom dd *************************/
    rec_filterData = (query) => {
        const { listOfStates } = this.state
        if (query.search(/[\[\]?*+|{}\\()@.\n\r]/) == -1) {
            if (query === '') {
                // return []
                return listOfStates
            }
            const regex = new RegExp([query.trim()], 'i')
            return listOfStates.filter((c) => c.search(regex) >= 0)
        } else {
            console.log('Inalid query', query)
        }
    }
/*********************** custom dd *************************/
    b_filterData = (query) => {
        const { listOfStates } = this.state
        if (query.search(/[\[\]?*+|{}\\()@.\n\r]/) == -1) {
            if (query === '') {
                // return []
                return listOfStates
            }
            const regex = new RegExp([query.trim()], 'i')
            return listOfStates.filter((c) => c.search(regex) >= 0)
        } else {
            console.log('Inalid query', query)
        }
    }


    // Handles submitting the payment request
    onSubmit = async (creditCardInput) => {

        this.setState({ submitted: true, p_inProcess: true });
        let creditCardToken;
        try {
            creditCardToken = await getCreditCardToken(creditCardInput);
            if (creditCardToken.error) {
                this.setState({ submitted: false, error: STRIPE_ERROR });
                return;
            }
        } catch (e) {
            this.setState({ submitted: false, error: STRIPE_ERROR });
            return;
        }
        const { error } = await subscribeUser(creditCardToken);
        if (error) {
            this.setState({ submitted: false, error: SERVER_ERROR });
        } else {
            this.setState({ submitted: false, error: null, stripeToken: creditCardToken });
            // console.log('card toke is' , creditCardToken.id)
            // return true
            this._readyForShiping()
        }
    };

    onchangeData = (cd) => {
        this.setState({ CC_data: cd })
    }

    handle_Rec_Name = (n) => { this.setState({ rec_name: n }) }
    handle_Rec_email = (v) => { this.setState({ rec_email: v }) }
    handle_Rec_Phone = (value) => {
        let tempVal = ''
        tempVal = `${value.selectedCountry.code},${value.selectedCountry.dialCode}`
        this.setState({
            rec_phone: value.unmaskedPhoneNumber,
            maskedNumber: value.phoneNumber,
            rec_phoneError: !value.isVerified,
            error: false,
            setDefaultValue: false,  //importan 
            rec_cca2: value.selectedCountry.code,
            rec_callingCode: value.selectedCountry.dialCode,
            // countryCode:tempVal

        })
    }




    _readyForShiping = async () => {
        this.setState({ p_inProcess: true })
        const {
            user,
            token,
            s_fullName,
            s_email,
            s_phone,     // phone num static
            s_callingCode,
            s_cca2,
            s_address1,
            s_address2,
            s_state_id,
            s_city,
            s_state,
            s_zipcode,

            rec_name,
            rec_email,
            rec_phone,
            rec_callingCode,
            rec_cca2,
            rec_address1,
            rec_address2,
            rec_city,
            rec_state,
            rec_state_id,
            rec_zipcode,
            stripeToken

        } = this.state
        // console.log('cca2 ' ,rec_cca2 ,'rec phone' , rec_phone ,'calling' , rec_callingCode)
        const { isTagGifted, __cartData, __isFreeOrder, __orderNature } = this.props


        // console.log('order Nature payment', this.props.__orderNature)
        // console.log('order type payment', this.props.__isFreeOrder)

        let st_price = 0
        let t_price = 0
        let discount = `0.00`
        let tax = `0.00`
        let shipping = `0.00`

        if (__cartData) {
            __cartData?.map((item, index) => {
                let u_price = item.sale_price
                let qty = item.quantity
                st_price = st_price + (u_price * qty)
            })
        }

        t_price = `${st_price}.00`
        st_price = `${st_price}.00`



        let stripe_token = __isFreeOrder == 'Free' ? 'freeTagString' : stripeToken.id

        console.log('stripe toke ', stripe_token)

        let __cartdata = __cartData
        let cartData = JSON.stringify(__cartdata).toString()

        // console.log('card data' ,cartData )


        // return true

        let formData = new FormData()

        formData.append('server_key', server_key)
        formData.append('user_id', user.user_id)
        formData.append('userCartData', cartData)
        formData.append('order_type', __isFreeOrder)
        formData.append('total_amount_of_orders', t_price)
        formData.append('stripeToken', stripe_token)
        formData.append('order_nature', __orderNature)
        formData.append('subtotal', st_price)
        formData.append('discount', discount)
        formData.append('tax', tax)
        formData.append('shipping', shipping)


        if (isTagGifted) {

            formData.append('email', rec_email)
            formData.append('full_name', rec_name)
            formData.append('city', rec_city)
            formData.append('phone', rec_callingCode + rec_phone)
            formData.append('state', rec_state_id)
            formData.append('address_1', rec_address1)
            formData.append('address_2', rec_address2)
            formData.append('zip_code', rec_zipcode)

        } else {
            formData.append('email', s_email)
            formData.append('full_name', s_fullName)
            formData.append('city', s_city)
            formData.append('phone', s_callingCode + s_phone)
            formData.append('state', s_state_id)
            formData.append('address_1', s_address1)
            formData.append('address_2', s_address2)
            formData.append('zip_code', s_zipcode)
        }

        const response = await petMyPalApiService.orderConfirm(token, formData).catch((err) => {
            console.log('error in payment', err)
        })
        const { data } = response
        this.setState({ p_inProcess: false })
        console.log('success', data)

    }




    saveShippingAddress = () => {
        const { isTagGifted } = this.props
        const { s_address1, s_city, s_state, s_zipcode } = this.state
        let err = false
        if (!s_address1) {
            this.setState({ s_add_1_Error: true })
            err = true
        }
        if (!s_city) {
            this.setState({ s_cityError: true })
            err = true
        }
        if (!s_state) {
            this.setState({ s_stateError: true })
            err = true
        }
        if (!s_zipcode) {
            this.setState({ s_zip_error: true })
            err = true
        }
        if (!err) {
            this.setState({ _position: 2 })
        }
        if (isTagGifted) {
            this.setState({ _position: 2 })
        }

    }

    save_Recipient_Shipping_Address = () => {
        const { isTagGifted } = this.props
        const { rec_name,
            rec_zipcode,
            rec_email,
            rec_phone,
            rec_address1,
            rec_city,
            rec_state,
        } = this.state

        let err = false
        if (!rec_name) {
            this.setState({ rec_nameError: true })
            err = true
        }
        if (!rec_email) {
            this.setState({ rec_emailError: true })
            err = true
        }
        if (!rec_phone) {
            this.setState({ rec_phoneError: true })
            err = true
        }
        if (!rec_address1) {
            this.setState({ rec_add_1_err: true })
            err = true
        }
        if (!rec_city) {
            this.setState({ rec_cityError: true })
            err = true
        }
        if (!rec_state) {
            this.setState({ rec_stateError: true })
            err = true
        }
        if (!rec_zipcode) {
            this.setState({ rec_zipcodeError: true })
            err = true
        }
        if (!err) {
            // this.setState({ _position: 3 })
            this.setState({ _position: 2 })
        }
    }



    showInvoice = () => {
        let invoice = this.state.isInvoiceVisible
        this.setState({ isInvoiceVisible: !invoice })
    }


    Print = async () => {
        console.log('Print text to pdf ')

    }

    handleDiscount = (v) => {
        this.setState({ dis_code: v })
    }

    applyDiscountCode() {
        this.setState({ isErrorModal_Visible: true })
    }



    buyForMySelf() {
        const {
            s_fullName,
            s_email,
            s_cca2,
            s_callingCode,
            s_phone,
            s_setDefaultValue,
            s_address1,
            s_address2,
            s_state,
            s_zipcode,
            s_city,
            s_add_1_Error,
            s_cityError,
            s_stateError,
            s_zip_error,
            isChecked,
        } = this.state

        const { isTagGifted } = this.props

        return (
            <View>
                <Text style={styles.heading}>Recipient Shipping Address</Text>
                <TextField
                    label={"Full Name"}
                    placeholder={'Enter Full Name'}
                    value={s_fullName}
                    editable={false}
                    containerStyle={{ marginTop: 20 }} />

                <TextField
                    label={"Email"}
                    placeholder={'Enter Email'}
                    value={s_email}
                    editable={false} />

                <Label
                    text={`Phone Number`}
                    style={{ marginBottom: 3 }} />

                <IntlPhoneInput
                    defaultCountry={s_cca2}
                    flagStyle={{ fontSize: 15 }}
                    // onChangeText={props.changeContact}
                    //    setDefaultValue={s_setDefaultValue}
                    defaultVlaue={s_phone}
                    containerStyle={styles.intlPhoneInputStyle}
                    editable={false}
                />
                {/* {!isTagGifted ? */}
                <View>
                    <TextField
                        label={"Address 1"}
                        placeholder={'Address 1'}
                        value={s_address1}
                        onChangeText={(v) => this.setState({
                            s_address1: v,
                            s_add_1_Error: false
                        })}
                        containerStyle={{ marginTop: 10 }}
                        error={s_add_1_Error} />

                    <TextField
                        label={"Address 2"}
                        placeholder={'Address 2'}
                        value={s_address2}
                        onChangeText={(v) => this.setState({ s_address2: v })}
                    // containerStyle={{ marginTop: 10 }}
                    />

                    <TextField
                        label={"City"}
                        placeholder={'City'}
                        value={s_city}
                        onChangeText={(v) => this.setState({
                            s_city: v,
                            s_cityError: false
                        })}
                        // containerStyle={{ marginTop: 10 }}
                        error={s_cityError}
                    />

                    <Label
                        text={`State`}
                        style={{
                            // marginTop: 10
                        }}
                        error={s_stateError}
                    />
                    <TouchableOpacity
                        onPress={() => this.hideShow_Dropdown()}
                        activeOpacity={1}
                        style={s_stateError ? [styles.breedViewError] : [styles.breedView]}
                    >
                        <View style={styles.breadInnerView}>
                            {s_state ?
                                <Text style={styles.breedText} >{s_state}</Text> :
                                <Text style={[styles.breedText, { color: TEXT_INPUT_LABEL }]} >State</Text>
                            }
                            <Icon
                                name={'caretdown'}
                                type={'AntDesign'}
                                style={styles.iconStyle}
                            />
                        </View>
                    </TouchableOpacity>

                    <TextField
                        label={"Zip Code"}
                        placeholder={'Zip Code'}
                        value={s_zipcode}
                        onChangeText={(v) => this.setState({
                            s_zipcode: v,
                            s_zip_error: false
                        })}
                        containerStyle={{ marginTop: 10 }}
                        error={s_zip_error}
                    />

                </View>

                <Text style={[styles.heading, { marginTop: 15 }]}>Billing Address</Text>

                <CheckBox
                    title={'Use Same as above'}
                    containerStyle={[styles.checkBox_container, { backgroundColor: 'null' }]}
                    checkedColor={darkSky}
                    onPress={() => this.setState({ isChecked: !isChecked })}
                    textStyle={{
                        color: TEXT_INPUT_LABEL,
                        fontSize: labelFont,
                        fontWeight: '500',
                        left: -5
                    }}
                    checked={isChecked}
                />

                {!isChecked ?
                    this.billingAddress()
                    :
                    null
                }


                <SkyBlueBtn
                    title={'Next'}
                    onPress={() => this.saveShippingAddress()}
                    btnContainerStyle={styles.btnContainerStyle}
                />
            </View>
        )

    }


    GiftRecipientInfo() {
        const {
            rec_cca2,
            rec_callingCode,
            rec_phone,
            rec_phoneError,
            rec_name,
            rec_nameError,
            rec_email,
            rec_emailError,
            rec_setDefaultValue,
            rec_address1,
            rec_add_1_err,
            rec_address2,
            rec_city,
            rec_cityError,
            rec_stateError,
            rec_state,
            rec_zipcode,
            rec_zipcodeError,
            isChecked,
        } = this.state
        return (
            <View>
                <Text style={[styles.heading, { marginTop: 15, marginBottom: 15 }]}>Recipient Shipping Address</Text>
                <TextField
                    label={"Name"}
                    placeholder={'Enter Name'}
                    value={rec_name}
                    editable={true}
                    onChangeText={(n) => this.handle_Rec_Name(n)}
                    containerStyle={{ marginTop: 20 }}
                    error={rec_nameError}
                />
                <TextField
                    label={"Email"}
                    placeholder={'Enter Email'}
                    value={rec_email}
                    editable={true}
                    onChangeText={(e) => this.handle_Rec_email(e)}
                    error={rec_emailError}
                // containerStyle={{ marginTop:0 }}
                />
                <Label
                    text={`Phone Number`}
                    style={{ marginBottom: 3}}
                    error={rec_phoneError}
                />

                <IntlPhoneInput
                    defaultCountry={rec_cca2}
                    flagStyle={{ fontSize: 15 }}
                    onChangeText={(v) => this.handle_Rec_Phone(v)}
                    setDefaultValue={false}
                    editable={true}
                    containerStyle={
                        rec_phoneError ?
                            styles.intlPhoneError :
                            styles.intlPhoneInputStyle
                    }
                />

                <TextField
                    label={"Address 1"}
                    placeholder={'Address 1'}
                    value={rec_address1}
                    onChangeText={(v) => this.setState({ rec_address1: v })}
                    containerStyle={{ marginTop: 10 }}
                    error={rec_add_1_err}
                />
                <TextField
                    label={"Address 2"}
                    placeholder={'Address 2'}
                    value={rec_address2}
                    onChangeText={(v) => this.setState({ rec_address2: v })}
                />
                <TextField
                    label={"City"}
                    placeholder={'City'}
                    value={rec_city}
                    onChangeText={(v) => this.setState({ rec_city: v })}
                    error={rec_cityError}
                />

                <Label
                    text={`State`}
                    error={rec_stateError}
                />
                <TouchableOpacity
                    onPress={() => this.rec_hideShow_Dropdown()}
                    activeOpacity={1}
                    style={rec_stateError ? [styles.breedViewError] : [styles.breedView]}
                >
                    <View style={styles.breadInnerView}>
                        {rec_state ?
                            <Text style={styles.breedText} >{rec_state}</Text> :
                            <Text style={[styles.breedText, { color: TEXT_INPUT_LABEL }]} >State</Text>
                        }
                        <Icon
                            name={'caretdown'}
                            type={'AntDesign'}
                            style={styles.iconStyle}
                        />
                    </View>
                </TouchableOpacity>

                <TextField
                    label={"Zip Code"}
                    placeholder={'Zip Code'}
                    value={rec_zipcode}
                    onChangeText={(v) => this.setState({ rec_zipcode: v })}
                    containerStyle={{ marginTop: 10 }}
                    error={rec_zipcodeError}
                />


                <Text style={[styles.heading, { marginTop: 15 }]}>Billing Address</Text>

                <CheckBox
                    title={'Use Same as above'}
                    containerStyle={[styles.checkBox_container, { backgroundColor: 'null' }]}
                    checkedColor={darkSky}
                    onPress={() => this.setState({ isChecked: !isChecked })}
                    textStyle={{
                        color: TEXT_INPUT_LABEL,
                        fontSize: labelFont,
                        fontWeight: '500',
                        left: -5
                    }}
                    checked={isChecked}
                />

                {!isChecked ?
                    this.billingAddress()
                    :
                    null
                }

                <SkyBlueBtn
                    title={'Next'}
                    onPress={() => this.save_Recipient_Shipping_Address()}
                    btnContainerStyle={styles.btnContainerStyle}
                />
            </View>
        )
    }

    Payment() {
        const {
            submitted,
            error,
            CC_data,
            p_inProcess,
            dis_code,
        } = this.state

        const { product, __cartData, __isFreeOrder, isGifted } = this.props

        let st_price = 0

        if (__cartData) {
            __cartData?.map((item, index) => {
                let u_price = item.sale_price
                let qty = item.quantity
                st_price = st_price + (u_price * qty)
            })
        }


        return (
            <View>
                <Text style={[styles.heading, { marginTop: 20 }]}>Accepted Cards</Text>
                <Image
                    source={cardList}
                    style={{ width: '100%', height: 80, marginTop: 10 }}
                    resizeMode={'contain'}
                />


                {__isFreeOrder == 'Free' ?

                    <View style={styles.freeTagView}>
                        <Text style={styles.h1}>Free Tags do not require credit card details.</Text>
                        <Text style={styles.h2}>Click on checkout to complete your order.</Text>
                        <Text style={styles.h2}>Let's keep our pets closer.</Text>
                    </View>
                    :
                    <ScrollView
                        //   style={styles.container} 
                        style={{ marginHorizontal: 10 }}
                        ref={ref => (this.scrollViewRef = ref)}>
                        <View style={styles.cardFormWrapper}>
                            <CreditCardInput
                                requiresName
                                onChange={(c) => this.onchangeData(c)}
                                cardScale={1}
                                cardImageFront={creditCard}
                                cardImageBack={creditCard}
                            />
                            {error && (
                                <View style={styles.alertWrapper}>
                                    <View style={styles.alertIconWrapper}>
                                        <Icon
                                            name="exclamation-circle"
                                            size={20}
                                            style={{ color: '#c22' }}
                                        />
                                    </View>
                                    <View style={styles.alertTextWrapper}>
                                        <Text style={styles.alertText}>{error}</Text>
                                    </View>
                                </View>
                            )}

                        </View>
                    </ScrollView>
                }

                {__isFreeOrder == 'Free' ? null :

                    <View style={styles.disView}>
                        <TextInput
                            style={{ flex: 1, paddingVertical: 10 }}
                            placeholder={'Discount'}
                            onChangeText={(v) => this.handleDiscount(v)}
                            value={dis_code}
                        />
                        <TouchableOpacity
                            disabled={dis_code?.trim().length > 0 ? false : true}
                            onPress={() => this.applyDiscountCode()}
                        >
                            <Text style={
                                dis_code?.trim().length > 0 ?
                                    [styles.applyText_active]
                                    :
                                    [styles.applyText_Inactive]}>
                                Apply
                            </Text>
                        </TouchableOpacity>
                    </View>
                }


                <View style={styles.invoiceOuterView}>
                    <View style={styles.invoiceView}>
                        <Text style={styles.invoiceHeading}>Subtotal</Text>
                        <Text style={styles.priceStyle}>{`$ ${st_price}.00`}</Text>
                    </View>
                    <View style={styles.invoiceView}>
                        <Text style={styles.invoiceHeading}>Shipping</Text>
                        <Text style={styles.priceStyle}>$ 0.00</Text>
                    </View>
                    <View style={styles.invoiceView}>
                        <Text style={styles.invoiceHeading}>Discount</Text>
                        <Text style={styles.priceStyle}>$ 0.00</Text>
                    </View>
                    <View style={styles.invoiceView}>
                        <Text style={styles.invoiceHeading}>Tax</Text>
                        <Text style={styles.priceStyle}>$ 0.00</Text>
                    </View>
                    <View style={styles.invoiceView}>
                        <Text style={styles.totalText}>Total</Text>
                        <Text style={styles.totalPriceStyle}>{`$ ${st_price}.00`}</Text>
                    </View>
                </View>

                {p_inProcess ?
                    <View style={styles.btnContainerStyle}>
                        <CustomLoader/>
                    </View>
                    :
                    __isFreeOrder === "Free" ?
                        <SkyBlueBtn
                            title={'Submit Order'}
                            // onPress={() => this.showInvoice()}
                            onPress={() => this._readyForShiping()}
                            // disabled={!this.state.CC_data.valid || submitted}
                            btnContainerStyle={styles.btnContainerStyle}

                        /> :

                        <SkyBlueBtn
                            title={'Submit Order'}
                            // onPress={() => this.showInvoice()}
                            onPress={() => this.onSubmit(this.state.CC_data)}
                            disabled={!this.state.CC_data.valid || submitted}
                            btnContainerStyle={styles.btnContainerStyle}

                        />
                     }

                <WhiteBtn
                    title={'Cancel Order'}
                    // onPress={() => this.closeConfirmModal()}
                    onPress={() => this.props.navigation.navigate('PreviousOrder')}
                    titleStyle={{ color: PINK }}
                    btnContainerStyle={styles.cancelBtn}
                />

            </View>
        )
    }

    billingAddress = () => {
        const {
            b_address1,
            b_add_1_err,
            b_address2,
            b_city,
            b_cityError,
            b_stateError,
            b_state,
            b_zipcode,
            b_z_code_Error,
        } = this.state
        return (
            <View>

                <TextField
                    label={"Address 1"}
                    placeholder={'Address 1'}
                    value={b_address1}
                    onChangeText={(v) => this.setState({ rec_address1: v })}
                    containerStyle={{ marginTop: 10 }}
                    error={b_add_1_err}
                />
                <TextField
                    label={"Address 2"}
                    placeholder={'Address 2'}
                    value={b_address2}
                    onChangeText={(v) => this.setState({ b_address2: v })}
                />
                <TextField
                    label={"City"}
                    placeholder={'City'}
                    value={b_city}
                    onChangeText={(v) => this.setState({ b_city: v })}
                    error={b_cityError}
                />

                <Label
                    text={`State`}
                    error={b_stateError}
                />
                <TouchableOpacity
                    onPress={() => this.b_hideShow_Dropdown()}
                    activeOpacity={1}
                    style={b_stateError ? [styles.breedViewError] : [styles.breedView]}
                >
                    <View style={styles.breadInnerView}>
                        {b_state ?
                            <Text style={styles.breedText} >{b_state}</Text> :
                            <Text style={[styles.breedText, { color: TEXT_INPUT_LABEL }]} >State</Text>
                        }
                        <Icon
                            name={'caretdown'}
                            type={'AntDesign'}
                            style={styles.iconStyle}
                        />
                    </View>
                </TouchableOpacity>

                <TextField
                    label={"Zip Code"}
                    placeholder={'Zip Code'}
                    value={b_zipcode}
                    onChangeText={(v) => this.setState({ rec_zipcode: v })}
                    containerStyle={{ marginTop: 10 }}
                    error={b_z_code_Error}
                />

            </View>
        )

    }





    render() {
        const {

            searchValue,
            loading,

            isConfirm_Modal_visible,
            InProcess,
            infoMsg,
            isVisible,
            isInvoiceVisible,
            s_state,
            rec_state,
            _position,
            rec_searchValue,
            rec_isVisible,
            isErrorModal_Visible,
            b_searchValue,
            b_isVisible,

        } = this.state
        const { isTagGifted, __isFreeOrder } = this.props


        // console.log('order Nature shipping' , this.props.__orderNature)
        // console.log('order type shipping' , this.props.__isFreeOrder)

        /********************** custom dropdown  ***********************/
        rec_filteredState = this.s_filterData(rec_searchValue)
        sender_filteredState = this.rec_filterData(searchValue)
        b_filteredState = this.rec_filterData(b_searchValue)

        return (
            <Container>
                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.goBack()}
                    centerText={'Checkout'}
                />


                <Content>
                    <View style={styles.container}>
                        {/* {_position === 1 ?
                            this.GiftSenderInfo()
                            : _position === 2 && isTagGifted ?
                                this.RecipientAddress()
                                : _position === 2 && !isTagGifted ?
                                    this.Payment()
                                    : _position === 3 ?
                                        this.Payment() : null
                        } */}
                        {_position === 1 ?
                            !isTagGifted ?
                                this.buyForMySelf() :
                                this.GiftRecipientInfo() : null

                        }

                        {_position === 2 ?
                            this.Payment() : null
                        }


                    </View>

                    <BreedPicker
                        isVisible={isVisible}
                        data={sender_filteredState}
                        onItemClick={this.sender_handleStateSelection}
                        onChangeText={(value) => this.sender_onValueChange(value)}
                        onBackdropPress={this.hideShow_Dropdown}
                        value={searchValue}
                        loading={loading}
                    />

                    <BreedPicker
                        isVisible={rec_isVisible}
                        data={rec_filteredState}
                        onItemClick={this.rec_handleStateSelection}
                        onChangeText={(value) => this.rec_onValueChange(value)}
                        onBackdropPress={this.rec_hideShow_Dropdown}
                        value={rec_searchValue}
                        loading={loading}
                    />
                    <BreedPicker
                        isVisible={b_isVisible}
                        data={b_filteredState}
                        onItemClick={this.b_handleStateSelection}
                        onChangeText={(value) => this.b_onValueChange(value)}
                        onBackdropPress={this.b_hideShow_Dropdown}
                        value={b_searchValue}
                        loading={loading}
                    />

                </Content>
                <ConfirmModal
                    isVisible={isConfirm_Modal_visible}
                    onPress={this.closeConfirmModal}
                    info={infoMsg}
                    DoneTitle={'Ok'}
                    onDoneBtnPress={this.CancelOrder}
                    CancelTitle={'Cancel'}
                    onCancelBtnPress={this.closeConfirmModal}
                    processing={InProcess}
                />
                <ErrorModal
                    isVisible={isErrorModal_Visible}
                    onBackButtonPress={() => this.closeErrorModal()}
                    info={dis_err_msg}
                    heading={'Hoot!'}
                    onPress={() => this.closeErrorModal()}
                />
                <Invoice
                    visible={isInvoiceVisible}
                    closeInvoice={() => this.showInvoice()}
                    print={() => this.Print()}
                />

            </Container>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    isTagGifted: state.petTags.is_T_Gifted,
    __cartData: state.petTags.cartData,
    product: state.petTags.product,
    __isFreeOrder: state.petTags.isFree_order,
    __orderNature: state.petTags.orderNature,

});
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ShippingAddress)