import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = {
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingHorizontal: 50,
        backgroundColor: 'white',
        marginBottom: 20,
        height: height / 1.5

    },
    imageStyle: {
        width: wp(90),
        // height:(width-100)/2,
        borderRadius: 10
    },
    textStyle: {
        fontWeight: 'bold',
        fontSize: wp(5),
        color: 'black',
        opacity: 0.4,
        marginTop: 10

    },
    createButton: {
        flexDirection: 'row',
        width: width - 120,
        height: 40,
        borderWidth: 2,
        borderColor: '#20ACE2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 50

    },
    createButtonText: {
        color: '#20ACE2',
        marginLeft: 10,
        fontWeight: 'bold'


    },
    plusText: {
        color: '#20ACE2',
        fontSize: 25,

    }
}

export default function Events({ create, goToCreate }) {
    return (
        <View style={styles.container}>
            <Image source={require('./../../assets/images/updated/events.png')} style={styles.imageStyle} resizeMode="contain" />
            <Text style={styles.textStyle}>No event found</Text>
            {create == true &&
                <TouchableOpacity 
                style={styles.createButton}
                onPress={() =>goToCreate()}>
                <Text style={styles.plusText}>+</Text><Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
            }

        </View>
    )

}