import React, { Component } from 'react';
import {View,FlatList} from 'react-native';
import { Icon, Container, Content } from 'native-base'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PMPHeader from '../../components/common/PMPHeader'
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import Moment from 'moment';
import {darkSky, } from '../../constants/colors';
import styles from './styles'
import FAQComponent from '../../components/common/FAQComponent';
import CustomLoader from '../../components/common/CustomLoader';

class FAQ extends Component {
    
    static navigationOptions = {
        header: null,
    };
    static propTypes = {
        user: PropTypes.object,
    };

    constructor(props) {
        super(props)
        this.state = {
            token: '',
            faqList: [],
            isLoading: false
        }
    }

    componentDidMount() {

        this.getAccessToken().then(async (TOKEN) => {
            this.setState({ token: JSON.parse(TOKEN).access_token });
            this.loadFAQ(JSON.parse(TOKEN).access_token)
        });
    }

    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        return access_token;
    }

    goBack = () => { this.props.navigation.pop() }

    loadFAQ = async (token) => {

        this.setState({ isLoading: true })

        let formData = new FormData()
        formData.append('server_key', server_key);
        const response = await petMyPalApiService.LoadFAQ(token, formData).catch((err) => {
            console.log('error while getting states', err)
        })
        const { data } = response
        if (data.api_status === 200) {
            let list = []
            data?.faq?.map((item, index) => {
                list.push({ ...data.faq[index], isSelected: false })
            })

            this.setState({ faqList: list, isLoading: false })
        } else {
            console.log('error while getting FAQ', data)
        }

    }

    renderFAQ = ({ item, index }) => {
        return (
            <FAQComponent
                item={item}
                onPress={() => this.selectFAQ(item, index)}
            />
        )
    }

    selectFAQ = (val, index) => {

        const { faqList } = this.state
        let list = faqList.slice()
        list.map((item, i) => {
            if (i == index  ) {
                list[index].isSelected = !val.isSelected
            }else{
                list[i].isSelected = false
            }
        })

        this.setState({ faqList: list })
    }


    render() {
        const { faqList, isLoading } = this.state
        return (
            <Container>
                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.goBack()}
                    centerText={'FAQ'}
                />


                {isLoading ?
                    <View style={styles.loadinView}>
                        <CustomLoader/>
                    </View> :

                    <FlatList
                    style={{flexGrow:0}}
                        data={faqList}
                        keyExtractor={(item) => item.f_id}
                        renderItem={this.renderFAQ}
                    />
                }

            </Container>
        )
    }

}
export default FAQ

