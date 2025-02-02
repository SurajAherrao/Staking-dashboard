const prerequisites = {
  metamask: false,
  sjBalance: false,
  ethBalance: false,
  addressNotStaked: false,
  connectedAddress: '',
};

const staking = {
  contractTotalStakeLimit: 0,
  contractTotalStake: 0,
  sjBalance: 0,
  stakingValue: 0,
  showStake: false,
  stakeTxHash: '',
};

const allowance = {
  existing: 0,
  toApprove: 0,
  approveTxHash: '',
};

const error = {
  isError: false,
  errorMessage: 'Ooops, something happened',
};

const ui = {
  preAuth: {
    loading: false,
  },
};

const initialState = {
  prerequisites,
  staking,
  allowance,
  error,
  ui,
};

export default initialState;
