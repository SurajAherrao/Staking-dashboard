import { gql } from '@apollo/client';

export const GET_STAKERS_DEPOSIT_TX = gql`
  query StakeDepositedsTx {
    stakeds(orderBy: amount, orderDirection: desc, first: 1000) {
      amount
      id
      user
      transactionHash
      blockTimestamp
      blockNumber
    }
  }
`;

export const GET_REWARD_WITHDRAW_TX_BY_ADDRESS = gql`
  query RewardsWithdrawnsTxByAddress($address: Bytes!) {
    rewardPaids(where: { user: $address }) {
      reward
      rewardsToken
      id
      user
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_REWARD_WITHDRAW_TX_BY_ADDRESS_DESC = gql`
  query RewardsWithdrawnsByAddDesc($noOfTx: Int!, $address: Bytes!) {
    rewardPaids(
      orderBy: blockTimestamp
      orderDirection: desc
      first: $noOfTx
      where: { user: $address }
    ) {
      reward
      rewardsToken
      id
      user
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_STAKER_DEPOSIT_TX_BY_ADDRESS_DESC_TIMESTAMP = gql`
  query StakeDepositedsTxByDescTimestamp($noOfTx: Int!, $address: String!) {
    stakeds(
      orderBy: blockTimestamp,
      orderDirection: desc,
      first : $noOfTx,
      where: { user: $address }
    ) {
      amount
      id
      user
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;


export const GET_WITHDRAW_EXECUTED_TX_BY_ADDRESS_DESC_TIMESTAMP = gql`
  query WithdrawExecutedsTxByAddDescTimestamp($noOfTx: Int!, $address: Bytes!) {
    withdrawns(
      first: $noOfTx,
      orderBy: blockTimestamp,
      orderDirection: desc,
      where: { user: $address }
    ) {
      amount
      id
      user
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;


export const GET_WITHDRAW_EXECUTED_AMOUNT = gql`
  query getLatestRewardDistributedBlockInfo {
    withdrawns {
      user
      amount
    }
  }
`;

export const GET_REWARDS_DISTRIBUTED = gql`
query MyQuery {
  rewardAddeds {
    _rewardsToken
    blockNumber
    blockTimestamp
    id
    reward
    transactionHash
  }
}
`
