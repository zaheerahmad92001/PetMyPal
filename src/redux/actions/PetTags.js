import types from './types';

export const is_Tag_Gifted = (data) => ({
  type: types.GIFT_TAG,
  payload:data,
});

export const products = (data) => ({
  type: types.PRODUCT,
  payload:data,
});

export const cartData = (data) => ({
  type: types.CART_DATA,
  payload:data,
});

export const orderNature = (data) => ({
  type: types.ORDER_NATURE,
  payload:data,
});
export const isFreeOrder = (data) => ({
  type: types.IS_FREE_ORDER,
  payload:data,
});

