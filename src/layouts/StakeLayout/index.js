import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Hidden, IconButton, makeStyles, SvgIcon } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { ToastContainer } from 'react-toastify';
import SideBar from './SideBar';
import { useQuery } from '@apollo/client';
import { GET_REWARD_WITHDRAW_TX_BY_ADDRESS } from '../../graphql/Queries';
import { useDispatch } from '../../store';
import { useWeb3React } from '@web3-react/core';
import { useStakingContract } from '../../context/StakingContract';
import { SupportedNetworks } from '../../config/constants';
import { login, logout } from '../../slices/account';
import { Menu as MenuIcon } from 'react-feather';
import WalletSelector from '../../components/WalletSelector/WalletSelector';
import Header from '../../views/reports/DashboardStakingStatsView/Header';
import Logo from '../../components/Logo';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { MiniKit } from '@worldcoin/minikit-js';
import { Link } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: "Comic Neue",
    backgroundColor: theme.palette.background.dark,
    minHeight: '100vh',
    width: '100%',
    backgroundImage: "radial-gradient(#d1d5db 1px,transparent 1px)",
    backgroundSize: "16px 16px",
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    paddingTop: 5,
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    marginLeft: "3%",
    marginRight: "3%",
  },
  content: {
    flex: '1 1 auto',
    minHeight: '100%',
    width: '100%',
    position: 'relative'
  },
  header: {
    margin: "auto",
    maxWidth: "1440px",
    padding: "0px 0px 12px 0px", // Default padding for mobile
    [theme.breakpoints.up(800)]: {
      padding: "0px 12px 12px", // Padding applies only above 800px
    }
  },
  scroll: {
    display: 'flex',
    overflowX: 'auto',

    padding: '15px 10px',
    gap: '16px',
    whiteSpace: 'nowrap',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  scrollButton: {
    borderRadius: '50px',
    backgroundColor: '#ffffff',
    color: '#8B4513',
    padding: '8px 24px',
    border: "2px solid #000000",
    cursor: 'pointer',
    textTransform: 'none',
    minWidth: 'fit-content',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
    borderColor: "rgb(1, 0, 0)", boxShadow: " 0 0 #0000, 0 0 #0000, 5px 5px 0 0 #00000026"
  }
}));

const StakeLayout = ({ children }) => {
  const location = useLocation();
  console.log("🚀 ~ file: index.js:166 ~ SideBar ~ location:", location)
  const currentSegment = location.pathname.split("/").pop();
  console.log("🚀 ~ file: index.js:64 ~ StakeLayout ~ currentSegment:", currentSegment)
  const classes = useStyles();
  const [network, setNetwork] = React.useState('');
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const dispatch = useDispatch();
  const { account, connector, chainId } = useWeb3React();
  console.log("🚀 ~ file: index.js:52 ~ StakeLayout ~ account:", account)
  const { stakingContract } = useStakingContract();

  const { data, error } = useQuery(GET_REWARD_WITHDRAW_TX_BY_ADDRESS, {
    variables: {
      address: account,
    },
  });
  if (error) {
    console.error('error encountered during fetching rewardWithdrawTx data Topbar:', error);
  }

  function convertObject(obj) {
    if (network === "eth") {

      return {
        weth: obj[SupportedNetworks.ethereum.WethAddress.toLowerCase()] || 0,
        sj: obj[SupportedNetworks.ethereum.SjTokenAddress.toLowerCase()] || 0
      };
    } else if (network === "op") {
      return {
        weth: obj[SupportedNetworks.optimism.WethAddress.toLowerCase()] || 0,
        sj: obj[SupportedNetworks.optimism.SjTokenAddress.toLowerCase()] || 0
      };
    } else {
      return {
        weth: obj[SupportedNetworks.matic.WethAddress.toLowerCase()] || 0,
        sj: obj[SupportedNetworks.matic.SjTokenAddress.toLowerCase()] || 0
      };
    }
  }

  function aggregateRewards(transactions) {
    return transactions.reduce((acc, transaction) => {
      const token = transaction.rewardsToken;
      // eslint-disable-next-line no-undef
      const reward = BigInt(transaction.reward); // Using BigInt for large numbers

      if (!acc[token]) {
        // eslint-disable-next-line no-undef
        acc[token] = BigInt(0);
      }
      acc[token] += reward;
      return acc;
    }, {});
  }


  useEffect(() => {
    if (account && stakingContract && data ) {
      let s = data?.rewardPaids && aggregateRewards(data?.rewardPaids)
      let withdrawedAmount = s && convertObject(s)
      stakingContract.getStakeDeposits(account).then(stakeDetails => {
        const { initialDeposit, rewards, wethRewards } = stakeDetails;
        // eslint-disable-next-line no-undef
        const accumulatedRewards =  parseFloat(Number(BigInt(withdrawedAmount?.sj)) / (10 ** 18));
        // eslint-disable-next-line no-undef
        const wethAccumulatedRewards = parseFloat(Number(BigInt(withdrawedAmount?.weth)) / (10 ** 18));
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
    <div className={classes.root}>
      <Hidden xsUp>

        <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      </Hidden>
      {
        !MiniKit.isInstalled() ? (
          <Hidden lgUp>
            <NavBar onMobileClose={() => setMobileNavOpen(false)} openMobile={isMobileNavOpen} />
          </Hidden>

        ) : (<></>)
      }
      {/* top mobile bar*/}
      <Hidden mdUp>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          height: "70px", border: "2px solid #000000", borderRadius: "7px", background: "#ffffff",
          borderColor: "rgb(1, 0, 0)", boxShadow: " 0 0 #0000, 0 0 #0000, 5px 5px 0 0 #00000026", marginLeft: "3%", marginRight: "3%", marginTop: "2%"
        }}>
          <h2>Stakers</h2>
          <div style={{
          }}>

            {
              !MiniKit.isInstalled() ? (
                <Hidden lgUp>
                  <IconButton id="logo" onClick={() => setMobileNavOpen(true)} >
                    <SvgIcon className={classes.icon} color='black' fontSize="small">
                      <MenuIcon />
                    </SvgIcon>
                  </IconButton>
                </Hidden>) : (<></>)
            }



          </div>
        </div>
      </Hidden>

      {
        !MiniKit.isInstalled() ? (

          <Hidden mdUp>

            <div className={classes.scroll}>
              <Button
                className={classes.scrollButton}
                style={(location.pathname === "/app/staking-stats" || location.pathname === "/") ? { background: "#D4A674", color: "#000000" } : {}}
                component={Link}
                to="/app/staking-stats"
              >
                Home
              </Button>
              <Button
                style={(location.pathname === "/app/stake") ? { background: "#D4A674", color: "#000000" } : {}}
                className={classes.scrollButton}
                component={Link}
                to="/app/stake"
              >
                Stake
              </Button>
              <Button
                style={(location.pathname === "/app/withdrawStake") ? { background: "#D4A674", color: "#000000" } : {}}
                className={classes.scrollButton}
                component={Link}
                to="/app/withdrawStake"
              >
                Withdraw Stake
              </Button>
              <Button
                style={(location.pathname === "/app/withdrawRewards") ? { background: "#D4A674", color: "#000000" } : {}}

                className={classes.scrollButton}
                component={Link}
                to="/app/withdrawRewards"
              >
                Withdraw Reward
              </Button>
            </div>
          </Hidden>) : (<></>)}

      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          {
            !MiniKit.isInstalled() ? (

              <Hidden smDown>
                <SideBar />

              </Hidden>
            )
              : (<></>)
          }
          <div className={classes.content} >
            <div className={classes.header} >
              <Header path={currentSegment} />

            </div>
            {children}</div>
        </div>
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

StakeLayout.propTypes = {
  children: PropTypes.node,
};

export default StakeLayout;
