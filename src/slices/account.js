import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: '',
  loggedIn: false,
  hasAdminRole: false,
  stake: 0,
  rewards: 0,
  accumulatedRewards: 0,
  wethAccumulatedRewards:0
};

const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    login(state, action) {
      const {
        address = '',
        stake = 0,
        rewards = 0,
        hasAdminRole = false,
        accumulatedRewards = 0,
        wethAccumulatedRewards = 0 
      } = action.payload;
      state.loggedIn = true;
      state.hasAdminRole = hasAdminRole;
      state.address = address;
      state.stake = stake;
      state.rewards = rewards;
      state.accumulatedRewards = accumulatedRewards;
      state.wethAccumulatedRewards = wethAccumulatedRewards;
    },
    logout(state, action) {
      state.loggedIn = false;
      state.hasAdminRole = false;
      state.address = '';
      state.stake = 0;
      state.rewards = 0;
      state.accumulatedRewards = 0;
      state.wethAccumulatedRewards = 0;
    },
    setStake(state, action) {
      const { stake = 0 } = action.payload;
      state.stake = stake;
    },
    setRewards(state, action) {
      const { rewards = 0 } = action.payload;
      state.rewards = rewards;
    },
    setAccumulatedRewards(state, action) {
      const { accumulatedRewards = 0 } = action.payload;
      state.accumulatedRewards = accumulatedRewards;
    },
  },
});

export const reducer = slice.reducer;

export const logout = () => dispatch => {
  dispatch(slice.actions.logout());
};

export const login = (address, initialDeposit, rewards, accumulatedRewards, wethAccumulatedRewards ) => dispatch => {
  dispatch(
    slice.actions.login({ address, stake: initialDeposit, rewards: rewards, accumulatedRewards, wethAccumulatedRewards })
  );
};

export const setStake = stake => dispatch => {
  dispatch(slice.actions.setStake({ stake }));
};

export const setRewards = rewards => dispatch => {
  dispatch(slice.actions.setRewards({ rewards }));
};

export const setAccumulatedRewards = accumulatedRewards => dispatch => {
  dispatch(slice.actions.setAccumulatedRewards({ accumulatedRewards }));
};
