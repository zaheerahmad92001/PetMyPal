import React, { Component } from 'react'
import { Platform } from 'react-native'
import { View, Text, StyleSheet, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { black, darkSky, TEXT_INPUT_LABEL, White ,borderColor } from '../../constants/colors'
import { mediumDog } from '../../constants/ConstantValues'
import { labelFont } from '../../constants/fontSize'
import moment from 'moment'
import Invoice from './Invoice'

import SkyBlueBtn from './SkyblueBtn'

const OrderList = (props) => {
    const {isInvoiceVisible ,item} = props
    let o_price = 0
    let p_qty = 0 
    let _date = '' 

         for(const product of item?.line_items){
             o_price += product.l_price
             p_qty += product.l_quantity 
         }
_date = moment(item.o_created).format('MMM Do YY')



    return (
        <View style={styles.cardVeiw}>
            <View style={styles.content}>
                <View style={styles.imgView}>
                    <Image
                        source={mediumDog}
                        resizeMode={'contain'}
                        style={{ width: null, height: null, flex: 1 }}
                    />
                </View>
                <View style={styles.infoView}>
                    <Text style={styles.heading}>{item.o_id}</Text>
                    <View style={styles.datePriceQtyView}>
                        {/* <Text style={[styles.qty,{marginTop:3}]}>fiffy</Text> */}
                        <Text style={[styles.qtyText]}>{_date}</Text>
                        <SkyBlueBtn
                            title={'Invoice'}
                            onPress={props.showInvoice}
                            btnContainerStyle={styles.InvoiceBtnStyle}
                            titleStyle={styles.InvoiceTitle}
                        />
                    </View>

                      <View style={styles.priceQty}>
                           <View style={styles.qtyView}>
                             <Text style={styles.qtyText}>{'Qty'}</Text>
                             <Text style={styles.price}>{p_qty}</Text>
                          </View>
                          <View style={[styles.qtyView,{marginLeft:20}]}>
                             <Text style={styles.qtyText}>{'Price'}</Text>
                             <Text style={styles.price}>$ {o_price}</Text>
                          </View>
                    </View>
                    
                    {/* <View style={styles.priceQty}> */}
                    <View style={styles.btnView}>
                        {/* <SkyBlueBtn
                            title={'Invoice'}
                            onPress={props.showInvoice}
                            btnContainerStyle={styles.InvoiceBtnStyle}
                            titleStyle={styles.InvoiceTitle}
                        /> */}
                        {/* <SkyBlueBtn
                            title={'Re-order'}
                            onPress={props.handleReOrder}
                            btnContainerStyle={styles.ReOrderBtnStyle}
                        /> */}
                    </View>
                </View>
            </View>
            <Invoice
              visible={isInvoiceVisible?true:false}
              closeInvoice={props.showInvoice}
              print={props.Print}
            />
        </View>
    )
}
export default OrderList
const styles = StyleSheet.create({
    cardVeiw: {
        backgroundColor:White,
        shadowColor: '#000',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 0,
        elevation: 1,
        // paddingVertical: 15,
        paddingHorizontal: 10,
        // borderRadius:10,
        marginBottom:5,
        borderBottomColor:TEXT_INPUT_LABEL,
        borderBottomWidth:StyleSheet.hairlineWidth,
        // borderColor:TEXT_INPUT_LABEL,
        // borderWidth:StyleSheet.hairlineWidth,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imgView: {
        width: 40,
        height: 40,
        overflow: 'hidden',
        alignSelf:'flex-start',
    },
    infoView: {
        flex: 1,
        marginLeft: 20,
        marginTop:5,
    },
    priceQty: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginTop: 10,
        // justifyContent:'space-between'
    },
    btnView:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent:'flex-end',
    },
    datePriceQtyView:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        flex:1,
        marginRight:Platform.OS=='ios'? 10:5,
    },
    qtyView:{
        flexDirection:'row',
        alignItems:"center",
        justifyContent:'center'
    },
    qtyText:{
        color: TEXT_INPUT_LABEL,
        fontSize: labelFont,
    },
    
    price: {
        color: darkSky,
        fontSize: labelFont,
        marginLeft: 10,
    },
    heading: {
        color: black,
        fontSize: labelFont,
        fontWeight: 'bold'
    },
    InvoiceBtnStyle: {
        width: wp(25),
        paddingVertical:Platform.OS=='ios'? 8:4,
        borderRadius:6,
        backgroundColor:White,
    },
    ReOrderBtnStyle: {
        width: wp(25),
        marginLeft:15,
        paddingVertical:Platform.OS=='ios'? 8:4,
        borderRadius:6,
    },
    InvoiceTitle:{
        color:darkSky
    }

})