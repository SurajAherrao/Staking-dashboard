import { combineReducers } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import { reducer as accountReducer } from '../slices/account';
import { reducer as priceReducer } from '../slices/price';
import { reducer as stakingInfoReducer } from '../slices/stakingInfo';
import { reducer as latestTransactionsReducer } from '../slices/latestTransactions';

const rootReducer = combineReducers({
  form: formReducer,
  account: accountReducer,
  price: priceReducer,
  stakingInfo: stakingInfoReducer,
  latestTransactions: latestTransactionsReducer,
});

export default rootReducer;
