import { ethers } from 'ethers';
import contractData from '../contract-builds/StakingContract';
import tokenData from '../contract-builds/IERC20';
import sjTokenMaticData from '../contract-builds/ChainTokenMatic';
import {
  MaticRpcURL,
  SjTokenMaticAddress,
  RewardAccount,
  SupportedNetworks,
} from '../../config/constants';

const NETWORK_TESTNET = 'testnet';
const NETWORK_MAINNET = 'mainnet';

export default class StakingContract {
  provider;
  stakingContract;
  tokenContract;
  currentNetwork;

  constructor(web3Provider, network) {
    this.initializeProvider(web3Provider);
    this.intitalizeContractInstance(network);
  }

  initializeProvider(web3Provider) {
    let canInitialize = false;
    canInitialize = this.setLocalProvider(web3Provider?.provider);

    if (!canInitialize) {
      this.setDummyProvider();
    }
  }

  intitalizeContractInstance(network) {
    if (network === SupportedNetworks.ethereum) {
      try {
        this.stakingContract = new ethers.Contract(
          SupportedNetworks.ethereum.StakingAddress,
          contractData.abi,
          this.provider
        );
      } catch (e) {
        console.warn(
          'could not initialize stakingContract: ',
          SupportedNetworks.ethereum.StakingAddress
        );
        throw e;
      }

      try {
        this.tokenContract = new ethers.Contract(
          SupportedNetworks.ethereum.SjTokenAddress,
          tokenData.abi,
          this.provider
        );
      } catch (e) {
        console.warn(
          'could not initialize tokenContract: ',
          SupportedNetworks.ethereum.SjTokenAddress
        );
        throw e;
      }
    } else if (network === SupportedNetworks.matic) {
      try {
        this.stakingContract = new ethers.Contract(
          SupportedNetworks.matic.StakingAddress,
          contractData.abi,
          this.provider
        );
      } catch (e) {
        console.warn(
          'could not initialize layer 2 stakingContract: ',
          SupportedNetworks.matic.StakingAddress
        );
      }

      try {
        this.tokenContract = new ethers.Contract(
          SupportedNetworks.matic.SjTokenAddress,
          tokenData.abi,
          this.provider
        );
      } catch (e) {
        console.warn(
          'could not initialize layer 2 tokenContract: ',
          SupportedNetworks.matic.SjTokenAddress
        );
        throw e;
      }
    } else if (network === SupportedNetworks.optimism) {
      try {
        this.stakingContract = new ethers.Contract(
          SupportedNetworks.optimism.StakingAddress,
          contractData.abi,
          this.provider
        );
      } catch (e) {
        console.warn(
          'could not initialize stakingContract: ',
          SupportedNetworks.optimism.StakingAddress
        );
        throw e;
      }

      try {
        this.tokenContract = new ethers.Contract(
          SupportedNetworks.optimism.SjTokenAddress,
          tokenData.abi,
          this.provider
        );
      } catch (e) {
        console.warn(
          'could not initialize tokenContract: ',
          SupportedNetworks.optimism.SjTokenAddress
        );
        throw e;
      }
    }

    this.currentNetwork = network;
  }

  static hasMetamask() {
    return typeof window.web3 !== 'undefined';
  }

  getCurrentNetwork() {
    return this.currentNetwork;
  }

  async metamaskEnabled() {
    try {
      await this.provider.getSigner().getAddress();
      return true;
    } catch (e) {
      return false;
    }
  }

  static enableMetamask() {
    return window.ethereum.enable();
  }

  ethBalance() {
    this.setDefaultSigners();
    return this.provider.getSigner().getBalance();
  }

  sjBalance(address) {
    return this.tokenContract.balanceOf(address).then(bigNumVal => {
      return ethers.utils.formatEther(bigNumVal);
    });
  }

  getAllowance(address) {
    this.setDefaultSigners();
    return this.tokenContract
      .allowance(address, this.currentNetwork.StakingAddress)
      .then(bigNumVal => {
        return ethers.utils.formatEther(bigNumVal);
      });
  }

  getStakeDeposit(address) {
    if (address) {
      return this.stakingContract
        .getStakeDetails(address)
        .then(res => res)
        .catch(e => {
          return false;
        });
    }
  }

  async getReward() {
    return this.stakingContract.getReward()
  }

  async getStakeDeposits(address){
    let [intialDeposit,  rewards, wethRewards] =
      await Promise.all([
        this.stakingContract.balanceOf(address),
        this.stakingContract.earned(address,this.currentNetwork.SjTokenAddress),
        this.stakingContract.earned(address,this.currentNetwork.WethAddress),
      ]);
      return {
        "initialDeposit": intialDeposit,
        "startDate":0,
        "endDate":0,
        "rewards" : rewards,
        "wethRewards" : wethRewards
      }
  }

  getStakedAmount(address) {
    if (address) {
      return this.stakingContract
        .balanceOf(address)
        .then(res => res)
        .catch(e => {
          return false;
        });
    }
  }

  getWethRewardsPending(address) {
    if (address) {
   
      return this.stakingContract
      .earned(address,this.currentNetwork.WethAddress)
      .then(res => {
        return res
      })
      .catch(e => {
        return 0;
      });
    }
  }
 
  getSjRewardsPending(address) {
    if (address) {
      
      return this.stakingContract
      .earned(address,this.currentNetwork.SjTokenAddress)
      .then(res => {
        return res
      })
      .catch(e => {
        return 0;
      });
    }
  }

  sjNetworkBalance(account) {
    let provider = new ethers.providers.JsonRpcProvider(MaticRpcURL);
    let sjTokenMaticContract = new ethers.Contract(
      SjTokenMaticAddress,
      sjTokenMaticData,
      provider
    );
    return sjTokenMaticContract.balanceOf(account).then(bigNumVal => {
      return bigNumVal;
    });
  }

  alreadyStaked() {
    this.setDefaultSigners();
    return this.provider
      .getSigner()
      .getAddress()
      .then(address => {
        return this.stakingContract
          .balanceOf(address)
          .then(res => {
            return true;
          })
          .catch(e => {
            console.log('err: ', e);
            return false;
          });
      });
  }

  contractTotalStakeLimit() {
    return this.stakingContract.maxStakingAmount().then(bigNumVal => {
      return bigNumVal.toString();
    });
  }

  currentTotalStake() {
    return this.stakingContract.totalSupply().then(bigNumVal => {
      return bigNumVal.toString();
    });
  }

  stakingTotalSupply() {
    return this.stakingContract.totalSupply().then(bigNumVal => {
      return bigNumVal.toString();
    });
  }

  async getRewardPending(tokenAddress) {
    let totalSupply = await this.stakingContract.totalSupply();
    let totalRewards = await this.stakingContract.getRewardForDuration(tokenAddress);
    let rewardPerToken = await this.stakingContract.rewardPerToken(tokenAddress)

    let pendingRewards = totalRewards - (Number(totalSupply * rewardPerToken) / 10 ** 18)
    return parseFloat(pendingRewards/10**18).toFixed(2)
  }

  async totalRewardsDistributed() {
    let totalRewards = await this.stakingContract.totalRewardsDistributed();

    return parseInt(ethers.utils.formatEther(totalRewards.toString()), 10);
  }

  async totalSupply() {
    let totalSupply = await this.tokenContract.totalSupply();

    return parseInt(ethers.utils.formatEther(totalSupply.toString()), 10);
  }

  async getRewardForDuration(address) {
    let res =  await this.stakingContract.getRewardForDuration(address);
    return ethers.utils.formatEther(res.toString());
  }
  
  async getRewardsAccumulated() {
    const rewardsAddress = await this.stakingContract.rewardsAddress();
    let [rewardsWithdrawn, rewardsDistributed, rewardsBalance, maticChainBalance] =
      await Promise.all([
        this.stakingContract.rewardsWithdrawn(),
        this.stakingContract.rewardsDistributed(),
        this.tokenContract.balanceOf(rewardsAddress),
        await this.sjNetworkBalance(RewardAccount),
      ]);
    const result = rewardsBalance
      .add(rewardsWithdrawn)
      .sub(rewardsDistributed)
      .add(maticChainBalance);
    return Math.max(parseInt(ethers.utils.formatEther(result.toString()), 10), 0);
  }

  async getLatestBlock() {
    const topicTransfer = ethers.utils.id('RewardsDistributed(uint256)'); //This is the interface for your event
    let latest = await this.provider.getBlockNumber();

    let fromBlock = latest - 90000;
    let flag = true;
    while (flag) {
      const logs = await this.provider.getLogs({
        fromBlock: fromBlock,
        address: this.currentNetwork.StakingAddress, // Address of contract
        toBlock: latest,
        topics: [topicTransfer],
      });

      if (logs && logs.length) {
        const lastBlock = await this.provider.getBlock(logs[logs.length - 1].blockNumber);

        flag = false;
        return lastBlock?.timestamp;
      }
      latest = fromBlock;

      fromBlock = fromBlock - 5000;
    }
    return null;
  }

  approveContract(value) {
    this.setDefaultSigners();
    return this.tokenContract.approve(
      this.currentNetwork.StakingAddress,
      ethers.utils.parseEther(value)    );
  }

  stakeSJ(value) {
    this.setDefaultSigners();
    return this.stakingContract
      .stake(ethers.utils.parseEther(value))
      .catch(e => console.error('stake err', e));
  }

  setLocalProvider(web3Provider) {
    if (!web3Provider) {
      console.warn('provider is not found');
      return false;
    }
    this.provider = new ethers.providers.Web3Provider(web3Provider);
    this.provider.ready.catch(e => console.error('Could not create Web3Provider: ', e));
    return true;
  }

  setDummyProvider() {
    switch (process.env.REACT_APP_ETH_PROVIDER) {
      case NETWORK_MAINNET:
        this.provider = new ethers.providers.InfuraProvider('homestead');
        this.provider.ready.catch(e =>
          console.error('Could not create read-only InfuraProvider: ', e)
        );
        break;
      case NETWORK_TESTNET:
        this.provider = new ethers.providers.InfuraProvider('sepolia');
        this.provider.ready.catch(e =>
          console.error('Could not create read-only InfuraProvider: ', e)
        );
        break;
      default:
        this.provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
        this.provider.ready.catch(e =>
          console.error('Could not create read-only JsonRpcProvider for development mode: ', e)
        );
    }
  }

  initiateWithdrawal(value) {
    this.setDefaultSigners();
    return this.stakingContract.initiateWithdrawal(ethers.utils.parseEther(value));
  }

  executeWithdrawal() {
    this.setDefaultSigners();
    return this.stakingContract.executeWithdrawal();
  }

  withdrawRewards() {
    this.setDefaultSigners();
    console.log('in withdrawRewards function');
    try {
      return this.stakingContract.withdrawRewards();
    } catch (error) {
      console.log('error iin withdrawRewards->', error);
    }
  }

  withdraw(amount) {
    try {
    return this.stakingContract.withdraw(ethers.utils.parseEther(amount).toString());
    } catch (error) {
      console.log('error iin withdrawRewards->', error);
    }
  }

  // Owner functions
  toggleRewards(enabled) {
    this.setDefaultSigners();
    return this.stakingContract.toggleRewards(enabled);
  }

  togglePaused(enabled) {
    this.setDefaultSigners();
    if (enabled) {
      return this.stakingContract.unpause();
    }
    return this.stakingContract.pause();
  }

  setDefaultSigners() {
    this.stakingContract = this.stakingContract.connect(this.provider.getSigner());
    this.tokenContract = this.tokenContract.connect(this.provider.getSigner());
  }

  setWeb3ReactProvider(walletProvider) {
    if (!walletProvider) return;
    this.provider = walletProvider;
  }

  static getEnv(envVar) {
    const provider = process.env.REACT_APP_ETH_PROVIDER;

    return process.env[envVar + `_${provider.toUpperCase()}`];
  }

  static stakingContractEthereum() {
    const ethereumProvider = new ethers.providers.JsonRpcProvider(
      SupportedNetworks.ethereum.rpcURL,
      {
        name: 'Ethereum',
        chainId: SupportedNetworks.ethereum.chainID,
      }
    );
    return new ethers.Contract(
      SupportedNetworks.ethereum.StakingAddress,
      contractData.abi,
      ethereumProvider
    );
  }

  static stakingContractMatic() {
    const maticProvider = new ethers.providers.JsonRpcProvider(SupportedNetworks.matic.rpcURL, {
      name: 'Matic',
      chainId: SupportedNetworks.matic.chainID,
    });

    return new ethers.Contract(
      SupportedNetworks.matic.StakingAddress,
      contractData.abi,
      maticProvider
    );
  }

  static tokenContractEthereum() {
    const ethereumProvider = new ethers.providers.JsonRpcProvider(
      SupportedNetworks.ethereum.rpcURL,
      {
        name: 'Ethereum',
        chainId: SupportedNetworks.ethereum.chainID,
      }
    );
    return new ethers.Contract(
      SupportedNetworks.ethereum.SjTokenAddress,
      tokenData.abi,
      ethereumProvider
    );
  }

  static tokenContractMatic() {
    const maticProvider = new ethers.providers.JsonRpcProvider(SupportedNetworks.matic.rpcURL, {
      name: 'Matic',
      chainId: SupportedNetworks.matic.chainID,
    });

    return new ethers.Contract(
      SupportedNetworks.matic.SjTokenAddress,
      tokenData.abi,
      maticProvider
    );
  }

  // pending rewards calculation for polygon and ethereum
  static async getPendingRewards() {
    const { stakingContractEthereum, stakingContractMatic, tokenContractMatic } = StakingContract;

    const maticContractInstance = stakingContractMatic();
    const ethereumContractInstance = stakingContractEthereum();
    const maticTknContractInstance = tokenContractMatic();

    const rewardsAddress = await maticContractInstance.rewardsAddress();

    let [rewardsWithdrawn, rewardsDistributed, rewardsBalance] = await Promise.all([
      maticContractInstance.rewardsWithdrawn(),
      maticContractInstance.rewardsDistributed(),
      maticTknContractInstance.balanceOf(rewardsAddress),
    ]);

    const totalPendingRewards = rewardsBalance.add(rewardsWithdrawn).sub(rewardsDistributed);

    const ethereumStakedAmount = await ethereumContractInstance
      .currentTotalStake()
      .then(stakeAmount => {
        return parseFloat(ethers.utils.formatEther(stakeAmount));
      });

    const maticStakedAmount = await maticContractInstance.currentTotalStake().then(stakeAmount => {
      return parseFloat(ethers.utils.formatEther(stakeAmount));
    });

    const ethereumShare = (ethereumStakedAmount / (ethereumStakedAmount + maticStakedAmount)) * 100;
    const ethereumDistribution = (ethereumShare * totalPendingRewards) / 100;
    const maticDistribution = totalPendingRewards - ethereumDistribution;

    return {
      [SupportedNetworks.ethereum.chainID]: ethereumDistribution / 10 ** 18,
      [SupportedNetworks.matic.chainID]: maticDistribution / 10 ** 18,
    };
  }
}
