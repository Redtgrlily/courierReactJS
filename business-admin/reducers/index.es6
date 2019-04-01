import { combineReducers } from 'redux';
import { orderReducer } from './orderReducer';

const rootReducer = combineReducers({
    orders: orderReducer
});

module.exports = rootReducer;
