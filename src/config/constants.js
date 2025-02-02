let projectID = process.env.REACT_APP_INFURA_PROJECT_ID
let apiKey = process.env.REACT_APP_DRPC_API_KEY,
  sjTokenMaticAddress = '',
  rewardAddress = '',
  unstakingPeriod = 60 * 60 * 24,
  deepLink = { COINBASE: '' },
  sjNetwork = {
    11155111: {
      NETWORK: 'ETHEREUM TESTNET',
      TOKEN: 'ETH',
      EXPLORER: 'Etherscan',
      STAKING_ACC_EXP_URL:
        'https://sepolia.etherscan.io/address/0x8847c178A29C41E4d3eEFB602C394127632e46f7',
    },
    80002: {
      NETWORK: 'POLYGON TESTNET',
      TOKEN: 'MATIC',
      EXPLORER: 'Polygonscan',
      STAKING_ACC_EXP_URL:
        'https://amoy.polygonscan.com/address/0x8c0C0588a6CfD85b3e4d1356172Dd84b76ef7106',
    },
  },
  graphQLAPI = {
    11155111: 'https://api.studio.thegraph.com/query/77710/testingoneday/version/latest',
    80002: 'https://api.studio.thegraph.com/query/77710/amoystaking/version/latest',
  },
  supportedNetworks = {
    ethereum: {
      name: 'Sepolia Ethereum',
      chainID: 11155111,
      rpcURL: `https://lb.drpc.org/ogrpc?network=sepolia&dkey=${apiKey}`,
      explorer: 'https://sepolia.etherscan.io/tx/',
      SjTokenAddress: '0x3F5FbE69b5ABAFEca59Ce76dd478d8C6E0D255cc',
      StakingAddress: '0x8847c178A29C41E4d3eEFB602C394127632e46f7',
      WethAddress: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"
    },
    matic: {
      name: 'Amoy Matic',
      chainID: 80002,
      rpcURL: `https://lb.drpc.org/ogrpc?network=polygon-amoy&dkey=${apiKey}`,
      explorer: 'https://amoy.polygonscan.com/tx/',
      SjTokenAddress: '0x3F5FbE69b5ABAFEca59Ce76dd478d8C6E0D255cc',
      StakingAddress: '0x8c0C0588a6CfD85b3e4d1356172Dd84b76ef7106',
      WethAddress: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"
    },
    optimism: {
      name: 'optimism Ethereum',
      chainID: 11155420,
      rpcURL: `https://lb.drpc.org/ogrpc?network=optimism-sepolia&dkey=${apiKey}`,
      explorer: 'https://sepolia-optimism.etherscan.io/',
      SjTokenAddress: '0xE4A6C401CA8Fc4b0b7768e33a05e6481e486c110',
      StakingAddress: '0xdDe6186D1Ffe4DD7a0033521C93829192d1e0094',
      WethAddress: "0x5EB3556e02a70F94258b6b5D299ED77b19B8e2E3"
    },
  };

const ENV = "testnet"// process.env.REACT_APP_ETH_PROVIDER;
switch (ENV) {
  case 'mainnet':
    unstakingPeriod = 60 * 60 * 24 * 7;
    supportedNetworks = {
      ethereum: {
        name: 'Ethereum Mainnet',
        chainID: 1,
        rpcURL: `https://mainnet.infura.io/v3/${projectID}`,
        explorer: 'https://etherscan.io/tx/',
        SjTokenAddress: '0xC4C2614E694cF534D407Ee49F8E44D125E4681c4',
        StakingAddress: '0x9b7fcaebe9a69eceeab72142ed35a238775d179a',
      },
      matic: {
        name: 'Polygon Mainnet',
        chainID: 137,
        rpcURL: `https://lb.drpc.org/ogrpc?network=polygon&dkey=${apiKey}`,
        explorer: 'https://polygonscan.com/tx/',
        SjTokenAddress: '0xd55fCe7CDaB84d84f2EF3F99816D765a2a94a509',
        StakingAddress: '0x1B52A94bB0A05a03Fc38ab4565B1F3A176833074',
      },
      optimism: { // pls change these are testnet address
        name: 'optimism Ethereum',
        chainID: 10,
        rpcURL: `https://lb.drpc.org/ogrpc?network=optimism&dkey=${apiKey}`,
        explorer: 'https://optimistic.etherscan.io//',
        SjTokenAddress: '0xE4A6C401CA8Fc4b0b7768e33a05e6481e486c110',
        StakingAddress: '0x44D577dd3c8847d33832a113E3c919ddC6D7D01f',
        WethAddress: "0x5EB3556e02a70F94258b6b5D299ED77b19B8e2E3"
      },
    };
    rewardAddress = '0x8AdFDB7641157392e42dA50E9c2d4Ee5928c586B';
    deepLink = { COINBASE: 'https://go.cb-w.com/dapp?cb_url=https://staking-testnet.SJ.io' };
    graphQLAPI = {
      1: 'https://api.studio.thegraph.com/query/50377/chaingamestaking/version/latest',
      137: 'https://api.studio.thegraph.com/query/50377/polygon-chaingamestaking/version/latest',
    };
    sjNetwork = {
      1: {
        NETWORK: 'ETHEREUM MAINNET',
        TOKEN: 'ETH',
        EXPLORER: 'Etherscan',
        STAKING_ACC_EXP_URL:
          'https://etherscan.io/address/0x9b7fcaebe9a69eceeab72142ed35a238775d179a',
      },
      137: {
        NETWORK: 'POLYGON MAINNET',
        TOKEN: 'MATIC',
        EXPLORER: 'Polygonscan',
        STAKING_ACC_EXP_URL:
          'https://polygonscan.com/address/d3a4eF9c7Ec0b30150f8D9d614104F2745aABB3e',
      },
    };
    break;
  case 'testnet':
    supportedNetworks = {
      ethereum: {
        name: 'sepolia Ethereum',
        chainID: 11155111,
      rpcURL: `https://lb.drpc.org/ogrpc?network=sepolia&dkey=${apiKey}`,
        explorer: 'https://sepolia.etherscan.io/tx/',
        SjTokenAddress: '0x3F5FbE69b5ABAFEca59Ce76dd478d8C6E0D255cc',
        StakingAddress: '0x8847c178A29C41E4d3eEFB602C394127632e46f7',
        WethAddress: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"
      },
      matic: {
        name: 'Amoy Matic',
      chainID: 80002,
      rpcURL: `https://lb.drpc.org/ogrpc?network=polygon-amoy&dkey=${apiKey}`,
      explorer: 'https://amoy.polygonscan.com/tx/',
      SjTokenAddress: '0x3F5FbE69b5ABAFEca59Ce76dd478d8C6E0D255cc',
      StakingAddress: '0x8c0C0588a6CfD85b3e4d1356172Dd84b76ef7106',
      WethAddress: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"
      },
      optimism: {
        name: 'optimism Ethereum',
        chainID: 11155420,
        rpcURL: `https://lb.drpc.org/ogrpc?network=optimism-sepolia&dkey=${apiKey}`,
        explorer: 'https://sepolia-optimism.etherscan.io/',
        SjTokenAddress: '0xE2208C421888580e2597505fA5627A1340e5ACe2',
        StakingAddress: '0x44D577dd3c8847d33832a113E3c919ddC6D7D01f',
        WethAddress: "0x5EB3556e02a70F94258b6b5D299ED77b19B8e2E3"
      },
    };
    rewardAddress = '0x8AdFDB7641157392e42dA50E9c2d4Ee5928c586B';
    deepLink = {
      COINBASE: 'https://go.cb-w.com/dapp?cb_url=https://staking-testnet.SJ.io/',
    };
    sjNetwork = {
      11155111: {
        NETWORK: 'ETHEREUM TESTNET',
        TOKEN: 'ETH',
        EXPLORER: 'Etherscan',
        STAKING_ACC_EXP_URL:
          'https://sepolia.etherscan.io/address/0x8847c178A29C41E4d3eEFB602C394127632e46f7',
      },
      80002: {
        NETWORK: 'POLYGON TESTNET',
        TOKEN: 'MATIC',
        EXPLORER: 'Polygonscan',
        STAKING_ACC_EXP_URL:
          'https://amoy.polygonscan.com/address/0x8c0C0588a6CfD85b3e4d1356172Dd84b76ef7106',
      },
      11155420: {
        NETWORK: 'OPTIMISM TESTNET',
        TOKEN: 'ETH',
        EXPLORER: 'Etherscan',
        STAKING_ACC_EXP_URL:
          'https://sepolia-optimism.etherscan.io/address/0xdDe6186D1Ffe4DD7a0033521C93829192d1e0094',
      }
    };
    graphQLAPI = {
      11155111: 'https://api.studio.thegraph.com/query/77710/testingoneday/version/latest',
      80002: 'https://api.studio.thegraph.com/query/77710/amoystaking/version/latest',
      11155420: 'https://api.studio.thegraph.com/query/77710/sjcoin/0.0.2',
    };
    break;
  default:
    throw new Error(`REACT_APP_ETH_PROVIDER must be a defined environment variable`);
}

export const SupportedNetworks = supportedNetworks;
export const MaticRpcURL = supportedNetworks.matic.rpcURL;
export const SjTokenMaticAddress = sjTokenMaticAddress;
export const RewardAccount = rewardAddress;
export const NetworkURL = supportedNetworks.ethereum.rpcURL;
export const UnstakingPeriod = unstakingPeriod;
export const DEEPLINK = deepLink;
export const SJ_NETWORK = sjNetwork;
export const GraphQLAPI = graphQLAPI;
export const POOL_MAX_CAP = 150000000;
