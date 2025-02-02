import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stakedAmount: 0,
  poolFilled: 0,
};

const slice = createSlice({
  name: 'stakingInfo',
  initialState,
  reducers: {
    setStakingInfo(state, action) {
      const { stakedAmount = 0, poolFilled = 0 } = action.payload;
      state.stakedAmount = stakedAmount;
      state.poolFilled = poolFilled;
    },
  },
});

export const reducer = slice.reducer;

export const setStakingInfo = stakingInfo => async dispatch => {
  dispatch(slice.actions.setStakingInfo(stakingInfo));
};
