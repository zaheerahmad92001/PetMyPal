import React, { Component } from 'react'
import { View, Text,TouchableHighlight, Image, FlatList } from 'react-native'
import { Container, Content, Icon } from 'native-base'
import PMPHeader from '../../components/common/PMPHeader'
import { star, mediumDog ,deleteIcon } from '../../constants/ConstantValues'
import styles from './styles'
import { TouchableOpacity } from 'react-native';
import ConfirmModal from '../../components/common/ConfirmModal';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux'
import { is_Tag_Gifted ,cartData ,products , } from '../../redux/actions/PetTags'



class CartView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this?.props?.user?.user_data,
            data:[],
            isConfirm_Modal_visible:false,
            InProcess:false,
            infoMsg:'Do You Want To Remove This Item From Cart.',
            isCartEmpity:false,

            s_cca2:"",
            s_callingCode:"",
            s_defaultValue:"",
        }
    }

    componentDidMount() { 
    //   let listData =  Array(1)
    //     .fill('')
    //     .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
    //     console.log('list data' , listData)

    if (this.state.user.mbl_country_code) {
        let [country, code] = this.state.user.mbl_country_code.split(',')
        let _num = this.state.user.phone_number
        let codeLength = code.length
        let num = _num.slice(codeLength)

        this.setState({
            s_cca2:country,
            s_callingCode:code,
            s_defaultValue:num,
        })

    } else {
        /***********if user registered from website device ***********/
        this.setState({ s_defaultValue: this.state.user.phone_number })
        // this.setState({ oldPhoneNumber: this.state.user.phone_number })
    }

        // this.setState({data:this.props.product})
        this.setState({data:this.props.__cartData})

    }

    

    goBack = () => {
        this.props.navigation.pop()
    }

     closeRow = (rowMap, rowKey) => {
    //    console.log('rowmap', rowMap ,'rowkey' , rowKey)

        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

     deleteRow = (rowMap, rowKey) => {
         this.setState({isConfirm_Modal_visible:true})
        this.closeRow(rowMap, rowKey);

        // const newData = [...listData];
        // const prevIndex = listData.findIndex(item => item.key === rowKey);
        // newData.splice(prevIndex, 1);
        // setListData(newData);
    };

     onRowDidOpen = (rowKey) => {
        // console.log('This row opened', rowKey);
    };

     renderItem = (data) => {
         const {product , __cartData , isGifted} = this.props
         return(
        <View style={styles.rowFront}>
            <View style={styles.cardView}>
             <View style={styles.smallImgView}>
                    <Image
                        source={{uri:product[0].images[0].i_path_full}}
                        resizeMode={'contain'}
                        style={styles.imgStyle}
                    />
                </View>

                <View style={styles.innerView}>
                    <View style={{
                        flexDirection:'row',
                        alignItems:'center' , 
                        justifyContent:'space-between',
                        marginTop:5,
                        }}>
                    <Text style={styles.heading}>{`${__cartData[data?.index].product_name}`}</Text>
                    <View style={styles.innerRow}>
                       <Text style={styles.qty}>{`${__cartData[data?.index].quantity}`}</Text>
                    </View>
                    
                </View>
                <View style={{
                        flexDirection:'row',
                        alignItems:'center' , 
                        justifyContent:'space-between',
                        marginTop:5,
                        }}>
                    <Text style={styles.heading}></Text>
                    <View style={styles.innerRow}>
                       <Text style={styles.price}>{`$ ${__cartData[data?.index]?.sale_price}`}</Text>
                    </View>
                    
                </View>
                
                </View>
                
            </View>
        </View>
         )};

     renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => this.deleteRow(rowMap, data.item.key)}
             >
             <View style={styles.imgView}>
               <Image
                source={deleteIcon}
                resizeMode={'contain'}
                style={styles.imgStyle}
               />
             </View>
            </TouchableOpacity>
        </View>
     );
    

     closeConfirmModal = () => {
        this.setState({ isConfirm_Modal_visible: false })
    }
    clearCart=()=>{

        /****** Clear Cart *****/
        this.props.saveCardDate('')
        this.props.saveGiftStatus('')
        this.props.saveProduct('')
        this.setState({
            isCartEmpity:true,
            isConfirm_Modal_visible:false,
        })
    }
    



    render() {
        const { 
            data ,
            isConfirm_Modal_visible , 
            infoMsg, 
            InProcess,
            isCartEmpity, 
            s_callingCode,
            s_cca2,
            s_defaultValue
        } = this.state
        const {product , __cartData , isGifted} = this.props
        // console.log('order Nature' , this.props.__orderNature)
        // console.log('order type' , this.props.__isFreeOrder)
        
        let st_price=0

     if(__cartData){
        __cartData?.map((item,index)=>{
            let u_price = item.sale_price  
            let qty = item.quantity
            st_price = st_price +(u_price*qty) 
        })
     }

    //    let u_price = `${product[0]?.p_sale_price}`
    //    let qty = __cartData.length
    //    let t_price = `${qty*u_price}.00`

        return (
            <Container style={{
                // backgroundColor:'transparent'
                }}>
                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.goBack()}
                    centerText={'Cart'}
                />

{!isCartEmpity ?
            <Content>
                <SwipeListView
                    data={data}
                    renderItem={this.renderItem}
                    renderHiddenItem={this.renderHiddenItem}
                    // leftOpenValue={75}
                    rightOpenValue={-75}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onRowDidOpen={this.onRowDidOpen}
                    leftActionActivated={false}
                    />

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

            <SkyBlueBtn
             onPress={()=>this.props.navigation.navigate('ShippingAddress',{
                    s_cca2:s_cca2,
                    s_callingCode:s_callingCode,
                    s_defaultValue:s_defaultValue
             })}
             title={'Continue'}
             btnContainerStyle={styles.btnContainerStyle}
            />
         </Content>
         :
         <View style={styles.empityView}>
          <Text style={styles.noItemText}>No item added in cart yet.</Text>
         </View>
    }



         <ConfirmModal
                    isVisible={isConfirm_Modal_visible}
                    onPress={this.closeConfirmModal}
                    info={infoMsg}
                    DoneTitle={'Ok'}
                    onDoneBtnPress={this.clearCart}
                    CancelTitle={'Cancel'}
                    onCancelBtnPress={this.closeConfirmModal}
                    processing={InProcess}
                />
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    isTagGifted: state.petTags.is_T_Gifted,
    __cartData:state.petTags.cartData,
    product:state.petTags.product,
    __isFreeOrder:state.petTags.isFree_order,
    __orderNature:state.petTags.orderNature,
});
const mapDispatchToProps = dispatch => ({
    saveGiftStatus: g => dispatch(is_Tag_Gifted(g)),
    saveCardDate:(cd)=>dispatch(cartData(cd)),
    saveProduct:(p)=>dispatch(products(p)),
    // saveOrderNature: (order) => dispatch(orderNature(order)),
    // saveFreeOrder: (fo) => dispatch(isFreeOrder(fo)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CartView)