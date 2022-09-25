import React, { Component, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from 'native-base'
import { View, Text, StyleSheet,useWindowDimensions } from 'react-native'
import { black, darkSky, lightSky, TEXT_INPUT_LABEL } from '../../constants/colors'
import { Divider } from 'react-native-elements'
import HTML , {TChildrenRenderer}  from 'react-native-render-html';
import { labelFont, textInputFont } from '../../constants/fontSize'
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';


const FAQComponent = (props) => {
    const { item , link, } = props

   
    return (
        <View style={styles.btnWraper}>

            <View style={item.isSelected ? [styles.ViewSelect] : [styles.OuterView]}>
                <TouchableOpacity 
                 onPress={props.onPress}
                 style={[styles.btnView]}>
                    <Text style={
                       item.isSelected ?
                            [styles.selectedLinkStyle]
                            :
                            [styles.linkStyle]}>
                        {item.f_question}
                    </Text>
                    <Icon
                            name={item.isSelected ? 'chevron-small-up' : 'chevron-small-down'}
                            type={'Entypo'}
                            style={styles.iconStyle}
                        />
                    {/* {item.isSelected ?
                        <Icon
                            name={'chevron-small-up'}
                            type={'Entypo'}
                            style={styles.iconStyle}
                        />
                        :
                        <Icon
                            name={'chevron-small-down'}
                            type={'Entypo'}
                            style={styles.iconStyle}
                        />
                    } */}

                </TouchableOpacity>


                {item.isSelected &&
                    // <View>
                        <HTML html={JSON.parse(item.f_answer)} 
                        // contentWidth={width}
                        contentHeight={30}
                        containerStyle={{top:5}}
                        
                        //    tagsStyles={{
                              
                        //        p:{textAlign: 'justify', top:8},
                        //    i:{textAlign: 'justify',color:'blue' },
                        //    li:{color:'green'},
                        //    ul:{textAlign:'justify' ,top:20, color:'red'},
                        // }}
                        ignoredTags={[ ...IGNORED_TAGS, '\n' , '\r' ,'&nbsp']}
                        //   imagesMaxWidth={{height:50,width:50}}
                        />
                    //  </View>
                }
            </View>

            {!item.isSelected ?
                <Divider style={styles.borderStyle} /> :
                null
            }





        </View>
    )
}
export default FAQComponent

const styles = StyleSheet.create({

    btnWraper: {
        marginBottom: 10,
       
    },

    btnView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'

    },

    btnViewSelect: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: lightSky,
      

    },


    linkStyle: {
        flex: 1,
        color: black,
        fontSize: labelFont,
        fontWeight: '600'
    },
    selectedLinkStyle: {
        flex: 1,
        color: darkSky,
        fontSize: labelFont,
        fontWeight: '700',
        top:5
    },
    iconStyle: {
        fontSize: 30,
        color: TEXT_INPUT_LABEL,
        alignSelf:'flex-start'
    },
    borderStyle: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: TEXT_INPUT_LABEL,
        marginHorizontal: 25,
    },
    content: {
        // marginTop: 5, 
    },

    ViewSelect: {
        backgroundColor: lightSky,
        paddingHorizontal: 25,
        paddingTop: 5,
        paddingBottom: 15,
        flexGrow:0
    },
    OuterView: {
        paddingHorizontal: 25,
        paddingTop: 5,
        paddingBottom: 15,

    },
    infoText: {
        color: TEXT_INPUT_LABEL,
        fontWeight: '500',
        fontSize: labelFont
    }
})