import React, { Component } from 'react'
import { View,Text, FlatList } from 'react-native'
import PMPHeader from '../../components/common/PMPHeader'
import { Container, Icon } from 'native-base'
import { connect } from 'react-redux'
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import AsyncStorage from '@react-native-community/async-storage';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import styles from './styles'
import Products from '../../components/common/Products';
import CustomLoader from '../../components/common/CustomLoader';


class ProductList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            user: '',
            p_list: [],
            loading: false,

        }
    }
    componentDidMount() {

        this.getAccessToken().then(async (TOKEN) => {
            this.setState({
                user: this.props.user.user_data,
                token: JSON.parse(TOKEN).access_token,
            });
            this.loadProduct(JSON.parse(TOKEN).access_token)
        });
    }

    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        return access_token;
    }

    goBack = () => { this.props.navigation.pop() }

    loadProduct = async (token) => {
        this.setState({ loading: true })
        const formData = new FormData();
        formData.append('server_key', server_key);

        const response = await petMyPalApiService.getProduct_List(token, formData).catch((err) => {
            console.log('error while checking Free Order', err)
        })
        const { data } = response
        if (data.api_status === 200) {
            this.setState({
                p_list: data?.data,
                loading: false
            })
            console.log('p_list', data?.data)
        } else {
            this.setState({ loading: false })
            console.log('error while loading Product List', data)
        }
    }



    renderProduct = ({ item }) => {
        return (
            <Products
                item={item}
                onPress={() => this.navigateTo(item)}
            />
        )
    }

    navigateTo = (item) => {
        this.props.navigation.navigate('ProductDetail', {
            item
        })
    }

    showShopingCart=()=>{ this.props.navigation.navigate('CartView')}

    render() {
        const { p_list, loading } = this.state
   let va = 1
        return (
            <Container style={styles.wraper}>
                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.goBack()}
                    centerText={'Products'}
                    ImageRightIcon={'shopping-cart'}
                    rghtIconType={'MaterialIcons'}
                    cartValue={va}
                    RightPress={()=>this.showShopingCart()}
                />
                {loading ?
                    <View style={styles.loadingView}>
                        <CustomLoader/>
                    </View> : p_list.length > 0 ?
                        <FlatList
                            data={p_list}
                            style={styles.flatListStyle}
                            keyExtractor={(item) => item.id}
                            renderItem={this.renderProduct}
                        /> :
                        <View style={styles.loadingView}>
                            <Text style={styles.noproduct}>No Product Found</Text>
                        </View>
                }

            </Container>
        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
});
const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)
