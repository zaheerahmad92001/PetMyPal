import React, { Component } from 'react'
import { View, Text, StyleSheet , ScrollView } from 'react-native'
import { Overlay } from 'react-native-elements'
import Modal from 'react-native-modal'
import { widthPercentageToDP as wp  , heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { Content, Icon } from 'native-base'
import { BLACK, black, darkSky, greenish, lightSky, TEXT_INPUT_LABEL, White } from '../../constants/colors'
import { labelFont, mediumText } from '../../constants/fontSize'
import DashedLine from 'react-native-dashed-line';
import SkyBlueBtn from './SkyblueBtn'


const Invoice = (props) => {
    const { visible } = props
    return (
        <Overlay
            isVisible={visible ? visible : false}
            onBackdropPress={props.closeInvoice}
            useNativeDriver={true}
            animationIn={props.animationIn}
            animationOut={props.animationOut}
            animationOutTiming={props.animationOutTiming}
            overlayStyle={styles.overlayStyle}
            // fullScreen={true}
            
        >
            <View style={styles.conainer}>
            {/* <Content style={styles.conainer}> */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>Invoice</Text>
                    <Icon
                        onPress={props.closeInvoice}
                        name={'close'}
                        type={'AntDesign'}
                        style={styles.crossIcon}
                    />
                </View>
                <View style={[styles.innverView,
                ]}>
                    <View style={styles.innerContent}>
                        <Text style={styles.pName}>Booking Number:</Text>
                        <Text style={styles.pDetail}>BCLno1793Lkmc</Text>
                    </View>
                    <View style={styles.innerContent}>
                        <Text style={styles.pName}>Customer Name:</Text>
                        <Text style={styles.pDetail}>Baho balli</Text>
                    </View>
                    <View style={styles.innerContent}>
                        <Text style={styles.pName}>Booking Date:</Text>
                        <Text style={styles.pDetail}>23 December 2021</Text>
                    </View>
                    <View style={styles.innerContent}>
                        <Text style={styles.pName}>Payment Status:</Text>
                        <Text style={[styles.pDetail, { color: greenish }]}>Completed</Text>
                    </View>
                    <DashedLine
                    dashLength={5}
                    dashGap={8}
                    dashColor={TEXT_INPUT_LABEL}
                    style={{ marginHorizontal:10, marginTop:15, }}
                />
                <View style={styles.secondView}>
                    <View style={styles.productView}>
                       <Text style={styles.svHeading}>Product</Text>
                   </View>
                   <View style={styles.qtyPriceView}>
                       <Text style={styles.svHeading}>Price</Text>
                       <Text style={styles.svHeading}>Qty</Text>
                       <Text style={styles.svHeading}>Subtotal</Text>
                   </View>
                  </View>


                  {/* Loop / FlatList */}
                  <View style={styles.produceDetail}>
                    <View style={styles.productView}>
                       <Text style={styles.invoiceHeading}>Premium Lether Tag</Text>
                   </View>
                   <View style={styles.qtyPriceView}>
                       <Text style={styles.priceStyle}>$12.00</Text>
                       <Text style={styles.priceStyle}>1</Text>
                       <Text style={styles.priceStyle}>$12.00</Text>
                   </View>
                  </View>

                 
                  <DashedLine
                    dashLength={5}
                    dashGap={8}
                    dashColor={TEXT_INPUT_LABEL}
                    style={{ 
                        marginHorizontal:10,
                        marginTop:15,
                        marginBottom:15,
                     }}/>

                <View style={styles.totalPriceView}>
                  <View style={styles.emptyView}></View>
                  <View style={styles.orderDetail}>
                      <View style={styles.orderDetailHolder}>
                        <Text style={styles.invoiceHeading}>Subtotal</Text>
                        <Text style={styles.priceStyle}>$12.00</Text>
                      </View>
                      <View style={styles.orderDetailHolder}>
                        <Text style={styles.invoiceHeading}>Shipping</Text>
                        <Text style={styles.priceStyle}>$12.00</Text>
                      </View>
                      <View style={styles.orderDetailHolder}>
                        <Text style={styles.invoiceHeading}>Discount</Text>
                        <Text style={styles.priceStyle}>$12.00</Text>
                      </View>
                      <View style={styles.orderDetailHolder}>
                        <Text style={styles.invoiceHeading}>Tax</Text>
                        <Text style={styles.priceStyle}>$12.00</Text>
                      </View>
                      <View style={styles.orderDetailHolder}>
                        <Text style={styles.priceStyle}>Total</Text>
                        <Text style={styles.totalPriceStyle}>$12.00</Text>
                      </View>
                  </View>
                  </View>

                  <Text style={styles.generatedText}>Generated by PetMyPal Inc.</Text>
                </View>
                <SkyBlueBtn
                 title={'Print'}
                 onPress={props.print}
                 btnContainerStyle={{
                     width:wp(35),
                     alignSelf:'center',
                     marginTop:15,
                     marginBottom:10,
                    }}
                />
            {/* </Content> */}
            </View>
        </Overlay>
    )
}
export default Invoice
const styles = StyleSheet.create({
    conainer: {
        backgroundColor: '#f5f5f5',
        width: wp(96),
        // height:hp(90),
        alignSelf: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },
    overlayStyle: {
        backgroundColor: 'transparent',
        borderTopRightRadius: 22,
        borderTopLeftRadius: 22,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        // width:wp(80),
        paddingLeft: 0,
        paddingBottom: 0,
        paddingTop: 0,
        paddingRight: 0
    },
    innverView: {
        backgroundColor: White,
        width: wp(88),
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal:10,
        marginTop: 15,
        borderRadius:15,
        // shadowColor:'black',
        // shadowOffset:{height:0,width:0,},
        // shadowOpacity:0.5,
        // shadowRadius:0.2,
        // elevation:2,
        // borderTopRightRadius:10,
        // borderTopLeftRadius:10,
        // borderBottomLeftRadius: 15,
        // borderBottomRightRadius: 15
    

    },
    innverViewSecond: {
        backgroundColor: White,
        width: wp(91),
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    headerText: {
        color: darkSky,
        fontSize: mediumText,
        fontWeight: 'bold',
    },
    crossIcon: {
        fontSize: 23,
        color: TEXT_INPUT_LABEL,
        position: 'absolute',
        right: 15,
    },
    pName: {
        color: TEXT_INPUT_LABEL,
        fontSize:12,
        fontWeight: '400',
    },
    pDetail: {
        color: TEXT_INPUT_LABEL,
        fontSize:12,
        fontWeight: '500',
    },
    innerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    secondView:{
        backgroundColor:lightSky,
        paddingVertical:10,
        marginTop:15,
        marginBottom:10,
        borderRadius:10,
        paddingHorizontal:8,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    productView:{
        flex:4.5,
    },
    qtyPriceView:{
        flex:5.5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    produceDetail:{
        paddingVertical:10,
        borderRadius:10,
        paddingHorizontal:8,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    totalPriceView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:10,
    },
    emptyView:{
        flex:4,
    },
    orderDetail:{
        flex:6,
    },
    orderDetailHolder:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:5,
    },
    invoiceHeading:{
        color:TEXT_INPUT_LABEL,
        fontWeight:'500',
        fontSize:12,
    },
   
    priceStyle:{
        color:TEXT_INPUT_LABEL,
        fontSize:12,
        fontWeight:'500',
    },
    totalPriceStyle:{
        color:darkSky,
        fontSize:12,
        // fontWeight:'bold',
    },
    svHeading:{
        color:black,
        // fontWeight:'bold',
        fontSize:12,
    },
    generatedText:{
        textAlign:'center',
        marginTop:9,
        marginBottom:6,
        color:TEXT_INPUT_LABEL
    }
})
