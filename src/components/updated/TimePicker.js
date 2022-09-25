import { Icon } from 'native-base';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';

import { darkSky, White } from '../../constants/colors';
import { textInputFont } from '../../constants/fontSize';

export const TimePicker = (props) => {

    return (
        <Modal
            isVisible={props.isVisible}
            useNativeDriver={true}
        >
            <View style={styles.wraper}>
                <View style={styles.header}>
                    <Text style={styles.textStyle}>{props.header}</Text>
                    <Icon
                        onPress={props.onClose}
                        name={props.iconName ? props.iconName : 'close'}
                        type={props.iconType ? props.iconType : 'Fontisto'}
                        style={styles.iconStyle}
                    />
                </View>

                <DatePicker
                    date={props?.time ?? new Date()}
                    onDateChange={props.onTimeChange}
                    locale="en_GB"
                    is24Hour={true}
                    is24hourSource="locale"
                    mode={props.mode}
                    // value={'testing'}
                    minuteInterval={10}
                    style={{ position: 'relative', marginVertical: 0 }}
                />

                <TouchableOpacity
                    onPress={props.onSelect}
                    style={styles.btnView}
                >
                    <Text style={styles.okBtnStyle}>OK</Text>
                </TouchableOpacity>

            </View>

        </Modal>
    )
}
export default TimePicker;

const styles = StyleSheet.create({
    wraper: {
        backgroundColor: White,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginHorizontal: 25,
    },
    header: {
        backgroundColor: darkSky,
        height: RFValue(40),
        width: 'auto',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    textStyle: {
        color: White,
        fontSize: textInputFont,
        marginLeft: 10,
        // fontWeight: 'bold'
    },
    titleStyle: {
        fontSize: 15,
        color: White
    },
    iconStyle: {
        marginRight: 10,
        color: White,
        fontSize: 18,
        marginTop: 0

    },
    btnView: {
        paddingVertical: 15,
        backgroundColor: darkSky,
        borderBottomEndRadius: 20,
        borderBottomLeftRadius: 20,
    },
    okBtnStyle: {
        fontSize: textInputFont,
        marginLeft: 5,
        fontWeight: '600',
        color: White,
        textAlign: 'center'
    },
})




// import React, { useState } from 'react';
// import { View } from 'react-native';
// import { RFValue } from 'react-native-responsive-fontsize';
// import DarkButton from './../commonComponents/darkButton';
// import DatePicker from 'react-native-date-picker'
// import { Overlay } from 'react-native-elements';

// export default TimePicker = ({ select }) => {
//   const [date] = useState(new Date(new Date().getTime()));
//   const[selectedDate,setSelectedDate]=React.useState(new Date(new Date().getTime()));

//   return (


//     <View>
//      <DatePicker
//           date={selectedDate}
//           mode={'time'}
//           is24Hour={true}
//           //display="default"
//           onDateChange={(selectedDate,date) =>setSelectedDate(selectedDate)}
//           is24hourSource={"device"}
//         />
//          <View
//         style={{
//           height: 42,
//           width: 100,
//           alignSelf: 'center',
//           marginBottom: RFValue(10),
//         }}>
//         <DarkButton onPress={() =>select(selectedDate,date)}>OK</DarkButton>
//       </View>
//     </View>

//   );
// };
