import { StyleSheet, Platform, Dimensions } from 'react-native';
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { HEADER, TEXT_LIGHT, TEXT_DARK, TEXT_INPUT_LABEL, PLACE_HOLDER, BLUE_NEW, White, darkSky, PINK, grey } from '../../constants/colors';
import { textInputFont } from '../../constants/fontSize';

const window = Dimensions.get('window');

const imgHeight = 80
const imgWidth = 80

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    coverImg: {
        width: '100%',
        height: hp(37)
    },
    header: {
        position: 'absolute',
        // marginTop: hp(5),
        marginTop: hp(2),
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',

    },
    iconStyle: {
        color: White,
        fontSize: 30,
    },
    headerText: {
        color: darkSky,
        fontSize: textInputFont,
        fontWeight: 'bold',
        marginLeft: wp(28)
    },

    cardView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cardStyle: {
        borderColor: '#0000',
        borderWidth: 1,
        marginTop: hp(-12),
        backgroundColor: 'white',
        borderRadius: 20,
        width: wp(88),
        paddingBottom: hp(3),
        marginBottom: wp(6),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
    },

    imgView: {
        width: imgWidth,
        height: imgHeight,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'grey',
        marginTop: -40
    },
    imgStyle: {
        // width: 90,
        // height: 95,
        width: null,
        height: null,
        flex: 1
    },
    nameStyle: {
        color: TEXT_DARK,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    joiningDate: {
        color: BLUE_NEW,
        textAlign: 'center'
    },

    btnContainerStyle: {
        width: wp(45),
        alignSelf: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1.2
    },
    heading: {
        color: TEXT_DARK,
        fontSize: 16,
        fontWeight: 'bold'
    },
    changePassword: {
        marginTop: 10,
        width: wp(60),
        paddingVertical: 10,
        alignSelf: 'center',


    },



    profileImg: {
        marginLeft: RFValue(25),
        marginTop: -30,
        marginBottom: RFValue(15),
    },
    darkbtn: {
        height: 30,
        width: window.width * 0.3,
    },
    passwordBtn: {
        height: 40,
        width: window.width * 0.6,
    },
    box: {
        borderWidth: 1,
        borderColor: 'rgba(52, 52, 52, 0.3)',
        borderRadius: 5,
        marginHorizontal: RFValue(15),
        paddingVertical: RFValue(20),
        marginBottom: RFValue(15),
    },
    NameText: {
        fontSize: RFValue(12),
        fontFamily: THEME_FONT,
        color: TEXT_DARK,
        //fontWeight: 'bold',
        marginLeft: wp(2),
        marginBottom: RFValue(5),

    },
    profileAvatar: {
        backgroundColor: '#DADADA',
        borderRadius: RFValue(5),
        width: window.width * 0.3,
        height: RFValue(130),
        justifyContent: 'center',
    },
    inputLabel: {
        color: '#000'
    },
    coverAvatar: {
        backgroundColor: '#DADADA',
        borderRadius: RFValue(5),
        width: '100%',
        height: RFValue(100),
        overflow: 'hidden',
        justifyContent: 'center',
    },
    viewForInput: {
        paddingHorizontal: wp(7),
        paddingVertical: wp(4),
        backgroundColor: 'white',
        borderColor: '#0000',
        borderWidth: 1,
        marginBottom: wp(6),


    },
    tileContainer: {
        paddingHorizontal: wp(7),
        backgroundColor: 'white',
        paddingVertical: wp(5),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
        marginBottom: 25,
        borderRadius: 10

    },
    tile: {
        flexDirection: 'row',
        paddingHorizontal: wp(6),
        alignItems: 'center',



    },
    imageIcon: {
        height: "100%",
        width: "100%",
        alignSelf: 'center',
    },

    greyText: {
        fontSize: RFValue(16),
        fontFamily: THEME_FONT,
        color: 'grey',
        marginVertical: RFValue(8),
    },
    bottomText: {
        fontSize: RFValue(16),
        fontFamily: THEME_FONT,
        color: 'grey',
        marginBottom: RFValue(10),
        marginTop: wp(3)
    },
    aboutText: {
        fontSize: RFValue(16),
        fontFamily: THEME_FONT,
        color: 'grey',
        marginVertical: RFValue(10),
        marginHorizontal: RFValue(17),
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
        marginBottom: RFValue(20),
    },
    formControl: {
        height: 35,
        borderColor: '#707070',
        borderWidth: 1,
        paddingVertical: 0,
        paddingHorizontal: RFValue(6),
        fontSize: RFValue(14),
    },
    formControlError: {
        height: 35,
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 0,
        paddingHorizontal: RFValue(6),
        fontSize: RFValue(14),
    },
    editFormControl: {
        height: 35,
        marginLeft: -4,
        // color: '#B3B2B2',
        fontSize: 18
    },
    editFormControlError: {
        height: 42,
        fontSize: 18,
        marginLeft: -4,
        borderBottomColor: '#FF0000',
        borderTopColor: '#fff',
        borderLeftColor: '#ffff',
        borderRightColor: '#ffff',

        borderWidth: 1,

    },
    textView: {
        marginLeft: RFValue(10),
        marginRight: RFValue(30),
        flex: 1,
    },
    closeIcon: {
        position: 'absolute',
        right: 0,
        top: 5,
    },
    aboutmeStyle: {
        width: '100%',
        borderBottomColor: 'grey',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingBottom: 7,
    },
    bdyText: {
        marginTop: 2,
        fontSize: 12,
        color: darkSky
    },
    pronounView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor:'red',
        // height:20,
        // zIndex:-1
        // borderBottomColor: grey,
        // borderBottomWidth:1,
        // marginTop: 3
    },
    iconColor: {
        fontSize: 20,
        color: TEXT_INPUT_LABEL,
    },
    pronounStyle: {
        marginLeft: -1,
        color: grey,
        fontSize: RFValue(13),
        marginTop:0,
    },
    dropdownOuterView: {
        flexDirection: "row",
        alignItems: 'center',
        borderBottomColor: grey,
        borderBottomWidth: 1,
    }
});
