import React, { useEffect, useState } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from '../../../components/Page';
import Header from './Header';
import LatestTransactions from './LatestTransactions';
import Rewards from './Rewards';
import AccumulatedRewards from './AccumulatedRewards';
import Staked from './Staked';
import Holdings from './Holdings';
import { useSelector } from '../../../store';
import StakingContract from '../../../context/StakingContract/StakingContract';
import { ethers } from 'ethers';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    height:"100%"    
  },
}));

const DashboardSjStatsView = () => {
  const classes = useStyles();
  const account = useSelector(state => state.account);
  const [maticRewards, setMaticRewards] = useState(0);
  const [ethereumRewards, setEthereumRewards] = useState(0);
  const { stakingContractEthereum, stakingContractMatic } = StakingContract;

  const getMaticRewards = async () => {
    let rewards
    try{
      rewards = await stakingContractMatic()
      .getStakeDetails(account?.address)
      .then(stakeDetails => ethers.utils.formatEther(stakeDetails?.rewards).toString());
    }catch(e){
      console.log("🚀 ~ file: index.js:37 ~ getMaticRewards ~ e:", e)
    }
    setMaticRewards(rewards);
  };

  const getEthereumRewards = async () => {
    let rewards
    try {

      rewards = await stakingContractEthereum()
      .getStakeDetails(account?.address)
      .then(stakeDetails => ethers.utils.formatEther(stakeDetails?.rewards).toString());
    }catch(e){
    console.log("🚀 ~ file: index.js:45 ~ getEthereumRewards ~ e:", e)
    }
    setEthereumRewards(rewards);
  };

  useEffect(() => {
    if (account?.address) {
      getMaticRewards();
      getEthereumRewards();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address]);

  return (
    <Page className={classes.root} title="Personal Stats">
      <Container style={{ backgroundColor: "white",height:"100%",overflow:"auto",paddingTop:"12px", borderRadius:"16px" }} maxWidth={false}>
        <Header />
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xs={12}>
            <Staked stake={account.stake} />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <Rewards rewards={ethereumRewards ? ethereumRewards : '0'} matic={false} />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <AccumulatedRewards accumulatedRewards={account.accumulatedRewards} />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <Rewards rewards={maticRewards ? maticRewards : '0'} matic={true} />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <Holdings account={account} />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <LatestTransactions account={account} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default DashboardSjStatsView;
