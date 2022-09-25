import React from 'react';
import CustomLoader from '../../components/common/CustomLoader';

const PlaceholderLoader = ({change, down}) => {
  
  if (down) {
    return(
      <CustomLoader/>
    )
  }else if (change) {
    return(
      <CustomLoader/>
    )
  } else {
    return (
      <CustomLoader/>
    );
  }
};
export default PlaceholderLoader;
