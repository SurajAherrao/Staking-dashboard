import { NetworkURL, SupportedNetworks } from '../../config/constants';
import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';

const NETWORK_URL = NetworkURL;

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`);
}

const rpcMap = {
  [SupportedNetworks.ethereum.chainID]: SupportedNetworks.ethereum.rpcURL,
  [SupportedNetworks.matic.chainID]: SupportedNetworks.matic.rpcURL,
  [SupportedNetworks.optimism.chainID]: SupportedNetworks.optimism.rpcURL,
};

export const [metamask, metamaskHooks] = initializeConnector(
  actions =>
    new MetaMask({
      actions,
      onError: error => {
        console.error('Metamask Error:', error);
      },
    })
);

export const [coinbaseWallet, coinbaseWalletHooks] = initializeConnector(
  actions =>
    new CoinbaseWallet({
      actions,
      options: {
        url: NetworkURL,
        appName: 'Staking',
        appLogoUrl: 'https://staking.SJ.io/static/Llogo.png',
        darkMode: true,
        reloadOnDisconnect: false,
      },
      onError: error => {
        console.error('CoinbaseWallet Error:', error);
      },
    })
);
