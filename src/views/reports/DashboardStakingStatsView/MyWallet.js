import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useStakingContract } from '../../../context/StakingContract';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import Staked from '../DashboardSjStatsView/Staked';
import Rewards from '../DashboardSjStatsView/Rewards';
import AccumulatedRewards from '../DashboardSjStatsView/AccumulatedRewards';
import Holdings from '../DashboardSjStatsView/Holdings';


const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: "7px",
    display: 'flex',
    flexDirection: 'column',
    height: "100%",
    border: "2px solid #000000",
    borderColor: "rgb(1, 0, 0)",
    boxShadow:" 0 0 #0000, 0 0 #0000, 5px 5px 0 0 #00000026"
  },
  avatar: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.common.white,
  },
  card: { fontSize:"22px",  color: "#000" }
}));

const MyWallet = ({ className, ...rest }) => {

  const classes = useStyles();
  const account = useSelector(state => state.account);
  const { stakingContract } = useStakingContract();
  const [wethRewards, setWethRewards] = useState(0);
  const [sjRewards, setSjRewards] = useState(0);


  useEffect(() => {
    if (stakingContract && account?.address) {
      try {
        stakingContract
          .getStakeDeposits(account?.address)
          .then(stakeDetails => {
            setSjRewards(ethers.utils.formatEther(stakeDetails.rewards || 0).toString())
            setWethRewards(ethers.utils.formatEther(stakeDetails.wethRewards || 0).toString())
          })
      } catch (e) {
        console.log("🚀 ~ file: index.js:45 ~ getEthereumRewards ~ e:", e)
      }
    }
  }, [stakingContract, account?.address, account])


  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      {/* <CardHeader className={classes.card} style={{fontSize:"22px"}} title="My Staking Stats" /> */}
      {/* <div  style={{fontFamily:"Torney_Comic", fontWeight:"normal", fontSize:"18px",padding:"16px"}}>{"My Staking Stats"}</div> */}
      <Typography color="textPrimary" style={{padding:"16px"}} component="h1" gutterBottom variant='h3' >
      My Staking Stats
      </Typography>
      <div style={{paddingLeft:"16px", paddingRight:"16px"}}>

      <hr style={{borderBottomWidth: "1px",borderColor: "#000000", width:"100%"}} />
      </div>
      <Box>
        <Grid container style={{ padding: "20px" }} spacing={3}>
          <Grid item lg={6} sm={6} xs={12}>
            <Staked stake={account.stake} login={account.loggedIn} />
          </Grid>
          <Grid item lg={6} sm={6} xs={12}>
            <Rewards rewards={sjRewards ? sjRewards : '0'} login={account.loggedIn} matic={false} weth={false} />
          </Grid>
          <Grid item lg={6} sm={6} xs={12}>
            <AccumulatedRewards accumulatedRewards={account.accumulatedRewards} login={account.loggedIn} weth={false} />
          </Grid>
          <Grid item lg={6} sm={6} xs={12}>
            <Rewards rewards={wethRewards ? wethRewards : '0'} login={account.loggedIn} matic={false} weth={true} />
          </Grid>
          <Grid item lg={6} sm={6} xs={12}>
            <AccumulatedRewards accumulatedRewards={account.wethAccumulatedRewards} login={account.loggedIn} weth={true} />
          </Grid>
          <Grid item lg={6} sm={6} xs={12}>
            <Holdings account={account} />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

MyWallet.propTypes = {
  className: PropTypes.string,
};

export default MyWallet;
