import React from 'react'
import { View,Image, StyleSheet } from 'react-native'
import {gifLoader}from '../../constants/ConstantValues'
const CustomLoader = (props) => {
    return (
        <View style={[styles.container, props.loaderContainer]}>
            <Image
                resizeMode={'contain'}
                style={{ height: null, width: null, flex: 1 }}
                source={gifLoader}
            />
        </View>
    )
}
export default CustomLoader

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        overflow: 'hidden',
        alignSelf: 'center',
    }
})