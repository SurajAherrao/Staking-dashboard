/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useLocation, matchPath } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Toolbar,
  Hidden,
  IconButton,
  SvgIcon,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Menu,
} from '@material-ui/core';
import { Activity, ChevronDown, ChevronsDown, Menu as MenuIcon } from 'react-feather';
import Logo from '../../../components/Logo';
import { THEMES } from '../../../constants';
// import Settings from './Settings';
import { useDispatch } from '../../../store';
import { login, logout } from '../../../slices/account';
import { useWeb3React } from '@web3-react/core';
import WalletSelector from '../../../components/WalletSelector/WalletSelector';
import { DNA_NETWORK } from '../../../config/constants';
import { useStakingContract } from '../../../context/StakingContract/index';
import { useQuery } from '@apollo/client';
import { GET_REWARD_WITHDRAW_TX_BY_ADDRESS } from '../../../graphql/Queries';
import { SupportedNetworks } from '../../../config/constants';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

  root: {
    fontFamily:"Comic Neue",
    zIndex: theme.zIndex.drawer + 100,
    ...(theme.name === THEMES.LIGHT
      ? {
        boxShadow: 'none',
        backgroundColor: "#fff",
        backgroundImage: "radial-gradient(#d1d5db 1px,transparent 1px)",
        backgroundSize: "16px 16px",

      }
      : {}),
    ...(theme.name === THEMES.DARK
      ? {
        backgroundColor: theme.palette.background.default,
      }
      : {}),
    // borderBottom:"1px solid #0000001f"
  },
  toolbar: {

    minHeight: 64,
  },
  logo: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  link: {
    fontWeight: theme.typography.fontWeightMedium,
    '& + &': {
      marginLeft: theme.spacing(2),
    },
  },
  divider: {
    width: 1,
    height: 32,
    marginLeft: theme.spacing(2),
    ...(theme.name === THEMES.LIGHT
      ? {
        backgroundColor: theme.palette.background.paper,
      }
      : {}),
  },
  button: {
    marginLeft: theme.spacing(2),
  },

}));

const fetchTotalWithdrawnAmount = withdrawDetails => {
  let totalWithdrawedAmount;
  if (withdrawDetails?.length > 0) {
    totalWithdrawedAmount = withdrawDetails?.reduce((totalWithdrawAmount, withdraw) => {
      return totalWithdrawAmount + withdraw.reward;
    }, 0);
  } else {
    totalWithdrawedAmount = 0;
  }

  return totalWithdrawedAmount;
};

const currentNetwork = {
  eth: {
    src : "/static/images/coins/eth.png",
    name : "Ethereum"
  },
  matic : {
    src : "/static/images/coins/matic.png",
    name : "Polygon"
  },
  op : {
    src : "/static/images/coins/optimism.svg",
    name : "Optimism"
  }

}

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {

  const [stakeOpen, setStakeOpen] = React.useState(null);
  const [chainOpen, setChainOpen] = React.useState(null);
  const [withdrawOpen, setWithdrawOpen] = React.useState(null);
  const [network, setNetwork] = React.useState('');

  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();
  const { account, connector, chainId } = useWeb3React();
  const { stakingContract } = useStakingContract();

  const openStake = Boolean(stakeOpen);
  const openWithdraw = Boolean(withdrawOpen);
  const openChain = Boolean(chainOpen);

  const { data, error } = useQuery(GET_REWARD_WITHDRAW_TX_BY_ADDRESS, {
    variables: {
      address: account,
    },
  }); 

  if (error) {
    console.error('error encountered during fetching rewardWithdrawTx data Topbar:', error);
  }

  const handleStakeClick = (event) => {
    setStakeOpen(event.currentTarget);
  };

  const handleStakeClose = () => {
    setStakeOpen(null);
  };

  const handleChainClick = (event) => {
    setChainOpen(event.currentTarget);
  };

  const handleChainClose = () => {
    setChainOpen(null);
  };

  const handleWithdrawClick = (event) => {
    setWithdrawOpen(event.currentTarget);
  };

  const handleWithdrawClose = () => {
    setWithdrawOpen(null);
  };

  const changeNetwork = (networkChanged) => {
    if (networkChanged === "matic") {
      // handleNetworkChange(SupportedNetworks.matic.chainID)
      connector.activate(SupportedNetworks.matic.chainID).then(() => { setNetwork(networkChanged) }).catch(error => {
        console.log('error occured during network change: ', error);
      });
    }
    if (networkChanged === "eth") {
      // handleNetworkChange(SupportedNetworks.ethereum.chainID)
      connector.activate(SupportedNetworks.ethereum.chainID).then(() => { setNetwork(networkChanged) }).catch(error => {
        console.log('error occured during network change: ', error);
      });
    }
    if (networkChanged === "op") {
      // handleNetworkChange(SupportedNetworks.ethereum.chainID)
      connector.activate(SupportedNetworks.optimism.chainID).then(() => { setNetwork(networkChanged) }).catch(error => {
        console.log('error occured during network change: ', error);
      });
    }
    handleChainClose()
  };

  function aggregateRewards(transactions) {
    return transactions.reduce((acc, transaction) => {
      const token = transaction.rewardsToken;
      const reward = BigInt(transaction.reward); // Using BigInt for large numbers

      if (!acc[token]) {
        acc[token] = BigInt(0);
      }
      acc[token] += reward;
      return acc;
    }, {});
  }

  function convertObject(obj) {
    if (network === "eth") {

      return {
        weth: obj[SupportedNetworks.ethereum.WethAddress.toLowerCase()] || 0,
        dna: obj[SupportedNetworks.ethereum.DnaTokenAddress.toLowerCase()] || 0
      };
    } else if(network === "op"){
      return {
        weth: obj[SupportedNetworks.optimism.WethAddress.toLowerCase()] || 0,
        dna: obj[SupportedNetworks.optimism.DnaTokenAddress.toLowerCase()] || 0
      };
    } else {
      return {
        weth: obj[SupportedNetworks.matic.WethAddress.toLowerCase()] || 0,
        dna: obj[SupportedNetworks.matic.DnaTokenAddress.toLowerCase()] || 0
      };
    }
  }

  useEffect(() => {
    if (account && stakingContract && data) {
      let s = data?.rewardPaids && aggregateRewards(data?.rewardPaids)
      let withdrawedAmount = s && convertObject(s)
      stakingContract.getStakeDeposits(account).then(stakeDetails => {
        const { initialDeposit, rewards, wethRewards } = stakeDetails;
        const accumulatedRewards = parseFloat(Number(BigInt(withdrawedAmount?.dna)) / (10 ** 18));
        const wethAccumulatedRewards = parseFloat(Number(BigInt(withdrawedAmount?.weth) ) / (10 ** 18));
        if (account) {
          dispatch(
            login(account, initialDeposit / 10 ** 18, rewards / 10 ** 18, accumulatedRewards, wethAccumulatedRewards)
          );
        } else {
          dispatch(logout());
        }
      });

    } else {
      dispatch(logout());
    }
  }, [account, chainId, dispatch, stakingContract, data]);

  useEffect(() => {
    if (chainId === SupportedNetworks.matic.chainID) {
      setNetwork("matic")
    }
    else if (chainId === SupportedNetworks.ethereum.chainID) {
      setNetwork("eth")
    }
    else if (chainId === SupportedNetworks.optimism.chainID) {
      setNetwork("op")
    }
    else {
      setNetwork("WN")
    }
    
  }, [chainId])

  return (
    <AppBar className={clsx(classes.root, className)} color="default" {...rest}>
      <Toolbar style={{ display: 'flex', justifyContent: "space-between" }} className={classes.toolbar}>
        <Hidden lgUp>
          <IconButton id="logo" onClick={onMobileNavOpen}>
            <SvgIcon className={classes.icon} color='black' fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
        </Hidden>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Hidden mdDown>
            <RouterLink to="/">
              <div>Stakers</div>
            </RouterLink>
          </Hidden>
          <Hidden mdDown>
            <div style={{ display: "flex", fontFamily:"Comic Neue", padding: "10px 13px", borderRadius: "20px", marginLeft: "10px" }} >
              <Button component={RouterLink}
                to="/app/staking-stats"
                style={location.pathname === "/" || location.pathname === "/app/staking-stats" ? { textTransform: "none", margin: "0px 20px", background: "#D4A674", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "16px" } : { textTransform: "none", margin: "0px 20px", fontSize: "16px" }}
              >
                Home
              </Button>
              <div>
                <Button
                  component={RouterLink}
                  to="/app/stake"
                  // onClick={handleStakeClick}
                  style={location.pathname === "/app/stake" || location.pathname === "/app/stakeRewards" ? { textTransform: "none", margin: "0px 20px", background: "#D4A674", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "16px" } : { textTransform: "none", margin: "0px 20px", fontSize: "16px" }}>
                  Stake
                </Button>
                <Menu
                  style={{ marginTop: "40px" }}
                  id="basic-menu"
                  anchorEl={stakeOpen}
                  open={openStake}
                  onClose={handleStakeClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}

                >
                  <MenuItem component={RouterLink}
                    to="/app/stake" onClick={handleStakeClose}>
                    Stake Dna
                  </MenuItem>

                </Menu>
              </div>
              <div>
                <Button
                  onClick={handleWithdrawClick}
                  style={location.pathname === "/app/withdrawStake" || location.pathname === "/app/withdrawRewards" ? { textTransform: "none", margin: "0px 20px", fontSize: "16px", background: "#D4A674", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } : { textTransform: "none", fontSize: "16px", margin: "0px 20px" }}>
                  Withdraw
                </Button>
                <Menu
                  style={{ marginTop: "40px" }}
                  id="basic-menu"
                  anchorEl={withdrawOpen}
                  open={openWithdraw}
                  onClose={handleWithdrawClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}

                >
                  <MenuItem component={RouterLink} to="/app/withdrawStake" onClick={handleWithdrawClose}>
                    Withdraw Stake
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/app/withdrawRewards" onClick={handleWithdrawClose}>
                    Withdraw Rewards
                  </MenuItem>
                </Menu>
              </div>
              <Button component={RouterLink}
                to="/app/leaderboard"
                style={location.pathname === "/app/leaderboard" ? { textTransform: "none", margin: "0px 20px", background: "#D4A674", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "16px" } : { textTransform: "none", margin: "0px 20px", fontSize: "16px" }}>
                Leaderboard
              </Button>
            </div>
          </Hidden>
        </div>
        <div style={{ display: 'flex', alignItems: "center" }}>
          <div>
            <div onClick={handleChainClick} style={{ display: 'flex', alignItems: "center", backgroundColor: "white", padding: "5px 20px ", borderRadius: "24px", boxShadow: "0 0 0 1px rgba(63,63,68,0.05), 0 1px 2px 0 rgba(63,63,68,0.15)" }}>
              <Box style={{ marginRight: "10px" }} >
                {network  ?
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {
                      (network !== "WN" )&&
                      <Avatar style={{
                        width: '24px',
                        height: '24px',
                        marginRight: "10px"
                      }} src={currentNetwork[network].src} />
                    }
                    <div style={{ fontSize: "16px", fontFamily:"Comic Neue" }}>{network === "WN" ? "Wrong Network": currentNetwork[network].name}</div>
                  </div>
                  :
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ fontSize: "16px", fontFamily:"Comic Neue" }}>{"Connect Wallet"}</div>
                  </div>
                }
              </Box>
              <Box>
                <div style={{ display: 'flex', alignItems: "center", background: "white", width: "24px", height: "24px" }}>
                  <ChevronDown width={18} height={18} />
                </div>
              </Box>
            </div>
            <Menu
              style={{ marginTop: "40px", marginLeft: "5px" }}
              id="basic-menu"
              anchorEl={chainOpen}
              open={openChain}
              onClose={handleChainClose}
            >
              <MenuItem style={{ width: "160px" }} onClick={() => { changeNetwork('matic') }} value={"matic"} >
                <div style={{ display: "flex" }}>
                  <Avatar style={{
                    width: '20px',
                    height: '20px',
                    marginRight: "10px"
                  }} src={'/static/images/coins/matic.png'} />
                  Polygon

                </div>
              </MenuItem>
              <MenuItem onClick={() => {
                changeNetwork('eth')

              }} value={"eth"}>
                <div style={{ display: "flex" }}>
                  <Avatar style={{
                    width: '20px',
                    height: '20px',
                    marginRight: "10px"
                  }} src={'/static/images/coins/eth.png'} />
                  Ethereum
                </div>
              </MenuItem>
              <MenuItem onClick={() => {
                changeNetwork('op')

              }} value={"op"}>
                <div style={{ display: "flex" }}>
                  <Avatar style={{
                    width: '20px',
                    height: '20px',
                    marginRight: "10px"
                  }} src={'/static/images/coins/optimism.svg'} />
                  Optimism
                </div>
              </MenuItem>
            </Menu>
          </div>
          <Hidden mdDown>

          <Box ml={2}>
            <WalletSelector />
          </Box>
          </Hidden>
        </div>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

TopBar.defaultProps = {
  onMobileNavOpen: () => { },
};

export default TopBar;
