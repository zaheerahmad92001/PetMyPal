import React from 'react';
import {Dimensions, Platform} from 'react-native';

export const THEME_FONT =  Platform.OS === "ios" ? 'Zocial' : 'Roboto-Regular';
// export const THEME_BOLD_FONT =Platform.OS === "ios"?"Roboto-Bold":"Roboto-Medium";
export const THEME_BOLD_FONT =  Platform.OS === "ios" ? 'Zocial' : 'Roboto-Bold';
