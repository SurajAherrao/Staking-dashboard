import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
  usd_24h_change: 0,
};

const slice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    setPrice(state, action) {
      let usd = action.payload?.usd;
      let usd_24h_change = action.payload?.usd_24h_change;

      state.value = usd || 0;
      state.usd_24h_change = usd_24h_change || 0;
    },
  },
});

export const reducer = slice.reducer;

export const setPrice = price => async dispatch => {
  dispatch(slice.actions.setPrice(price));
};
