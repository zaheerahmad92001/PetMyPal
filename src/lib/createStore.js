import { createStore as reduxCreateStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';

import rootReducer from '../redux/reducers';

import logger from 'redux-logger'
const createStore = reduxCreateStore;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['mypets', 'user'],
  setTimeout: null

}

const persistedReducer = persistReducer(persistConfig, rootReducer)
// const store = createStore(persistedReducer,applyMiddleware(thunk,logger));
const store = createStore(persistedReducer, applyMiddleware(thunk));
let persistor = persistStore(store)



export { store, persistor };
