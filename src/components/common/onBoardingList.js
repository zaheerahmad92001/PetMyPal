import React from 'react';
import {
    AppRegistry,
    View,
    FlatList
} from 'react-native';
import styles from './styles';
import { Title, Text, Button } from 'native-base';
import { StackActions } from 'react-navigation';
import Onboarding from '../../views/Onboarding'
export default class onBoardingList extends React.Component {
    const
    ItemData =
        [
            { image: require('../../assets/images/onBoardingImg/img1.png'), heading: 'Add Locations', description: 'Create as many locations as you want to and manage all your businesses/branches under one app ' },

            { image: require('../../assets/images/onBoardingImg/img2.png'), heading: 'Invite Member', description: 'Invite members who work at your organization so your tasks are only shared with the ones who you want them to be shared with ' },

            { image: require('../../assets/images/onBoardingImg/img3.png'), heading: 'Squads', description: 'Squad Creation in Squadly allows you to place employees in different departments and list them down very easily' },

            { image: require('../../assets/images/onBoardingImg/img4.png'), heading: 'Schedule', description: 'Squadly has a powerful Shifts Management Module. It eliminates the need for drafting manual roasters, shifts and holidays ' },

            { image: require('../../assets/images/onBoardingImg/img5.png'), heading: 'Overviews', description: 'Squadly presents you a number of complex reports to help you get a quicker idea about your organizations performance ' },
        ]
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            item: itemData


        }
    }
    renderData = ({ item }) => {

        return (

            <Onboarding
                item={item}
            />
        )

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.mainContent}>
                    <FlatList
                        data={item}
                        renderItem={this.renderData}
                    />
                </View>
            </View>
        )
    }
}