import initialState from './state';
import {
  SET_SJ_BALANCE_BOOL,
  SET_METAMASK,
  SET_ETH_BALANCE_BOOL,
  SET_ADDEES_NOT_STAKED,
  SET_SJ_BALANCE,
  SET_STAKING_VALUE,
  SET_EXISTING_ALLOWANCE,
  SET_TOAPPROVE_ALLOWANCE,
  SET_ERROR,
  SET_ERROR_WITH_MESSAGE,
  SET_CONNECTED_ADDRESS,
  SET_TOTAL_STAKE_LIMIT,
  SET_TOTAL_STAKE,
  SHOW_STAKE,
  STAKE_TX_HASH,
  SET_APPROVE_TX_HASH,
  SET_PREAUTH_LOADING,
  SET_WITHDRAW_VALUE,
  SET_IS_WITHDRAW_INITIATED,
  SET_STAKED_AMOUNT,
  SET_REWARD_VALUE,
  SET_WITHDRAW_INITIATED_DATE,
  SET_SJ_INFO,
  STAKE_TX_HASH_RECEIPT,
} from './actions';

const stakeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_METAMASK:
      return {
        ...state,
        prerequisites: {
          ...state.prerequisites,
          metamask: action.payload,
        },
      };
    case SET_SJ_BALANCE_BOOL:
      return {
        ...state,
        prerequisites: {
          ...state.prerequisites,
          sjBalance: action.payload,
        },
      };
    case SET_ETH_BALANCE_BOOL:
      return {
        ...state,
        prerequisites: {
          ...state.prerequisites,
          ethBalance: action.payload,
        },
      };
    case SET_ADDEES_NOT_STAKED:
      return {
        ...state,
        prerequisites: {
          ...state.prerequisites,
          addressNotStaked: action.payload,
        },
      };
    case SET_CONNECTED_ADDRESS:
      return {
        ...state,
        prerequisites: {
          ...state.prerequisites,
          connectedAddress: action.payload,
        },
      };
    case SET_WITHDRAW_VALUE:
      return {
        ...state,
        staking: {
          ...state.staking,
          withdrawValue: action.payload,
        },
      };
    case SET_IS_WITHDRAW_INITIATED:
      return {
        ...state,
        prerequisites: {
          ...state.prerequisites,
          isWithDrawInitiated: action.payload,
        },
      };
    case SET_WITHDRAW_INITIATED_DATE:
      return {
        ...state,
        prerequisites: {
          ...state.prerequisites,
          endDate: action.payload,
        },
      };
    case SET_STAKED_AMOUNT:
      return {
        ...state,
        prerequisites: {
          ...state.prerequisites,
          stakedAmount: action.payload,
        },
      };
    case SET_REWARD_VALUE:
      return {
        ...state,
        prerequisites: {
          ...state.prerequisites,
          rewardAmount: action.payload,
        },
      };
    case SET_SJ_BALANCE:
      return {
        ...state,
        staking: {
          ...state.staking,
          sjBalance: action.payload,
        },
      };
    case SET_STAKING_VALUE:
      return {
        ...state,
        staking: {
          ...state.staking,
          stakingValue: action.payload,
        },
      };
    case SET_TOTAL_STAKE_LIMIT:
      return {
        ...state,
        staking: {
          ...state.staking,
          contractTotalStakeLimit: action.payload,
        },
      };
    case SET_TOTAL_STAKE:
      return {
        ...state,
        staking: {
          ...state.staking,
          contractTotalStake: action.payload,
        },
      };
    case SHOW_STAKE:
      return {
        ...state,
        staking: {
          ...state.staking,
          showStake: action.payload,
        },
      };
    case STAKE_TX_HASH:
      return {
        ...state,
        staking: {
          ...state.staking,
          stakeTxHash: action.payload,
        },
      };
    case STAKE_TX_HASH_RECEIPT:
      return {
        ...state,
        staking: {
          ...state.staking,
          stakeTxHashReceipt: action.payload,
        },
      };
    case SET_EXISTING_ALLOWANCE:
      return {
        ...state,
        allowance: {
          ...state.allowance,
          existing: action.payload,
        },
      };
    case SET_TOAPPROVE_ALLOWANCE:
      return {
        ...state,
        allowance: {
          ...state.allowance,
          toApprove: action.payload,
        },
      };
    case SET_APPROVE_TX_HASH:
      return {
        ...state,
        allowance: {
          ...state.allowance,
          approveTxHash: action.payload,
        },
      };
    case SET_ERROR:
      return {
        ...state,
        error: {
          isError: action.payload,
          errorMessage: 'Ooops, something happened',
        },
      };
    case SET_ERROR_WITH_MESSAGE:
      return {
        ...state,
        error: {
          isError: true,
          errorMessage: action.payload,
        },
      };
    case SET_PREAUTH_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          preAuth: {
            ...state.ui.preAuth,
            loading: action.payload,
          },
        },
      };
    case SET_SJ_INFO:
      return {
        ...state,
        sjInfo: {
          ...state.sjInfo,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default stakeReducer;
