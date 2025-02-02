import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const slice = createSlice({
  name: 'latestTransactions',
  initialState,
  reducers: {
    setLatestTransactions(state, action) {
      state.splice(0, state.length);
      let i = 0;
      action.payload.forEach(element => {
        const { txn_type, transactionHash, amount, blockTimestamp, status, reward, rewardsToken } = element;
        var transaction = {
          txHash: transactionHash,
          value: !!amount ? amount : reward,
          timeStamp: blockTimestamp,
          status: status,
          txn_type: txn_type,
          rewardsToken: rewardsToken
        };
        state[i] = transaction;
        i++;
      });
    },
    clearTransactions(state, action) {
      state = initialState;
    },
  },
});

export const reducer = slice.reducer;

export const setLatestTransactions = txs => async dispatch => {
  // handle success
  dispatch(slice.actions.setLatestTransactions(txs));
};

export const clearTransactions = () => async dispatch => {
  dispatch(slice.actions.clearTransactions);
};
