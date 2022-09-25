import React ,{Component} from 'react'
import PMPHeader from '../../components/common/PMPHeader'
import {View, Text ,FlatList , }from 'react-native'
import OrderList from '../../components/common/orderList'
import styles from './styles'
import { Container } from 'native-base'
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { SERVER, server_key } from '../../constants/server';
import AsyncStorage from '@react-native-community/async-storage';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { is_Tag_Gifted ,cartData ,products , } from '../../redux/actions/PetTags'
import { connect } from 'react-redux'
import { darkSky } from '../../constants/colors'
import CustomLoader from '../../components/common/CustomLoader'



let data =[
    {id:1,name:'a'},
    {id:2,name:'ab'},
    {id:3,name:'ac'},
    {id:4,name:'ad'},
    {id:5,name:'ae'},
]
class PreviousOrder extends Component{
    constructor(props){
        super(props)
        this.state={
            user: this?.props?.user?.user_data,
            p_orderList:[],
            isLoading:false,
            token:'',
            isInvoiceVisible:false,
        }
    }
    componentDidMount(){
        this.getAccessToken().then(async (TOKEN) => {
            this.setState({
                token: JSON.parse(TOKEN).access_token,
            });
            this.LoadPreviousOrder(JSON.parse(TOKEN).access_token)
            
        });
    }

    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        return access_token;
    }

    goBack = () => {this.props.navigation.pop()}

    LoadPreviousOrder = async (token)=>{
        console.log('token' , token)
        this.setState({isLoading:true})
        const {user} = this.state
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('user_id', user.user_id);
        const response = await petMyPalApiService.orderHistory(token, formData).catch((err) => {
            console.log('error while getting order History', err)
        })
        const { data } = response
        if(data.api_status==200){        
          this.setState({
              isLoading:false,
              p_orderList:data.data
            })
        }else{
          this.setState({isLoading:false})
          console.log('error previous order', data)
        }

    }
    

    renderOrder =({item , index})=>{
        const {isInvoiceVisible} =this.state 
        //   console.log('item order Line' ,item.line_items)

        return(
        <OrderList
         item={item}
         showInvoice={()=>this.showInvoice()}
         isInvoiceVisible={isInvoiceVisible}
         handleReOrder={()=>this.handOrder(item)}
        />
        )
    }

    handOrder=(item)=>{
        alert(item.id)
    }

    showInvoice =()=>{
    let visible = this.state.isInvoiceVisible
     this.setState({isInvoiceVisible:!visible})
    }
    render(){
        const {isLoading ,p_orderList} = this.state
        return(
            <Container>
                  <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.goBack()}
                    centerText={'Previous Orders'}
                />
                {/* <View style ={styles.content}> */}
        {/* <OrderList/> */}

            {isLoading ?
             <View style={styles.no_P_order}>
               <CustomLoader/>
             </View>
             :p_orderList.length>0?
                    <FlatList
                        data={p_orderList}
                        keyExtractor={(item)=>item.id}
                        renderItem={this.renderOrder}
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    />
                    :
                    <View style={styles.no_P_order}>
                      <Text style={styles.noOrderText}>No Order Placed yet!</Text>
                    </View>
            }
                {/* </View> */}
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
    // saveGiftStatus: g => dispatch(is_Tag_Gifted(g)),
    // saveCardDate:(cd)=>dispatch(cartData(cd)),
    // saveProduct:(p)=>dispatch(products(p)),
    // saveOrderNature: (order) => dispatch(orderNature(order)),
    // saveFreeOrder: (fo) => dispatch(isFreeOrder(fo)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PreviousOrder)
