import React from 'react';
import {Dimensions ,View , StyleSheet} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { darkSky } from '../../constants/colors';
const barWidth = Dimensions.get('screen').width * 0.6;

const ProgressBar =(props)=> {
  console.log('value', props.value);
  const {keys,activeIndex} = props
  return(
    <ProgressBarAnimated
    // {...progressCustomStyles}
    width={props.barWidth}
    height={7}
    borderColor={'#999'}
    value={activeIndex > keys ? 100: keys==activeIndex? props.value : 0}
    backgroundColorOnComplete={darkSky}
    backgroundColor={darkSky}
  />
  
  )
}

const progressCustomStyles = {
  backgroundColor: 'red', 
  borderRadius: 0,
  borderColor: 'orange',
  marginHorizontal:3,
};


export default ProgressBar;
  
  
