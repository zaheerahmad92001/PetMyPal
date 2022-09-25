import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import styles from './styles';
class StepsUp extends React.Component {
  render() {
    const { steps } = this.props
    // source={steps == 3 ? 2 : steps == 4 ? 3 : steps == 5 ? 3 : steps == 6 ? 4 : 1 />

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {steps &&
          <TouchableOpacity style={{ paddingTop: 20, paddingRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={styles.steps}
              source={require('./../../assets/images/updated/steps/stepCheck.png')} />

            <Image
             style={steps >= 2 ? styles.steps : styles.stepsNo}
             source={steps >= 2  ? require('./../../assets/images/updated/steps/stepCheck.png') : require('./../../assets/images/updated/steps/stepUncheck.png')} />

            <Image
              style={steps >= 3 ? styles.steps : styles.stepsNo}
              source={steps >= 3  ? require('./../../assets/images/updated/steps/stepCheck.png') : require('./../../assets/images/updated/steps/stepUncheck.png')} />

            <Image
              style={steps >= 4 ? styles.steps : styles.stepsNo}
              source={steps >= 4 ? require('./../../assets/images/updated/steps/stepCheck.png') : require('./../../assets/images/updated/steps/stepUncheck.png')} />

           <Image
              style={ steps >= 5 ? styles.steps : styles.stepsNo}
              source={ steps >= 5 ? require('./../../assets/images/updated/steps/stepCheck.png') : require('./../../assets/images/updated/steps/stepUncheck.png')} />

            {/* <Image
              style={ steps >= 6 ? styles.steps : styles.stepsNo}
              source={ steps >= 6 ? require('./../../assets/images/updated/steps/stepCheck.png') : require('./../../assets/images/updated/steps/stepUncheck.png')} /> */}

          </TouchableOpacity>
        }
      </View>

    );
  }
}

const styles = StyleSheet.create({
  steps: {
    width: wp(6),
    // height: wp(6),
    marginRight: wp(-1),
    resizeMode: 'contain'
  },
  stepsNo: {
    width: wp(1.5),
    height: wp(1.5),
    marginHorizontal: 2,
    // marginLeft: 4,
    resizeMode: 'contain'
  }
});

export default StepsUp;
