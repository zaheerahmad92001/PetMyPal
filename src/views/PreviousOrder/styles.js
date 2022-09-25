import { StyleSheet } from "react-native";
import { grey } from "../../constants/colors";
import { labelFont } from "../../constants/fontSize";
const styles = StyleSheet.create({
    wraper:{
        flex:1
    },
    content:{
      marginHorizontal:22
    },
    no_P_order:{
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
    noOrderText:{
      color:grey,
      fontSize:labelFont,
      fontWeight:'500'
    }
})
export default styles;