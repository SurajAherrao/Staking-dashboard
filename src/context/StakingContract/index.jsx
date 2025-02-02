import React, { useEffect, useState } from 'react';
import { useReducer } from 'reinspect';
import StakingContract from './StakingContract';
import initialState from './state';
import stakeReducer from './reducer';
import { useWeb3React } from '@web3-react/core';
import { SupportedNetworks, SJ_NETWORK } from '../../config/constants';
import { SET_SJ_INFO } from './actions';

const StakingContractContext = React.createContext();
const StakingContractDispatch = React.createContext();

function StakingContractProvider({ children }) {
  const [prodState, prodDispatch] = React.useReducer(stakeReducer, initialState);
  const [devState, devDispatch] = useReducer(stakeReducer, initialState);
  const { chainId, provider } = useWeb3React();
  const [stakingContract, setStakingContract] = useState(null);

  const state = process.env.NODE_ENV === 'development' ? devState : prodState;
  const dispatch = process.env.NODE_ENV === 'development' ? devDispatch : prodDispatch;

  useEffect(() => {
    if (SupportedNetworks.matic.chainID === chainId) {
      setStakingContract(new StakingContract(provider, SupportedNetworks.matic));
    } else if (SupportedNetworks.ethereum.chainID === chainId) {
      setStakingContract(new StakingContract(provider, SupportedNetworks.ethereum));
    } else if (SupportedNetworks.optimism.chainID === chainId) {
      setStakingContract(new StakingContract(provider, SupportedNetworks.optimism));
    }

    let networkName = '';

    if (SJ_NETWORK[chainId]) {
      networkName = SJ_NETWORK[chainId]?.NETWORK;
    } else {
      networkName = 'wrong network';
    }

    dispatch({
      type: SET_SJ_INFO,
      payload: {
        tokenSymbol: SJ_NETWORK[chainId]?.TOKEN,
        explorerName: SJ_NETWORK[chainId]?.EXPLORER,
        networkName: networkName,
      },
    });
  }, [chainId]);

  return (
    <StakingContractContext.Provider value={{ stakingContract, state }}>
      <StakingContractDispatch.Provider value={dispatch}>
        {children}
      </StakingContractDispatch.Provider>
    </StakingContractContext.Provider>
  );
}

function useStakingContract() {
  const context = React.useContext(StakingContractContext);
  if (context === undefined) {
    throw new Error('useStakingContract must be used within a StakingContractProvider');
  }
  return context;
}

function useStakingDispatch() {
  const context = React.useContext(StakingContractDispatch);
  if (context === undefined) {
    throw new Error('useStakingDispatch must be used within a StakingContractProvider');
  }
  return context;
}

export { StakingContractProvider, useStakingContract, useStakingDispatch };
