/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Container, Grid, Hidden, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from '../../../store';
import { useWeb3React } from '@web3-react/core';
import { useQuery } from '@apollo/client';
import { useStakingContract } from '../../../context/StakingContract';
import { GET_STAKERS_DEPOSIT_TX, GET_WITHDRAW_EXECUTED_AMOUNT } from '../../../graphql/Queries';
import { filteredStakersList } from '../../../utils/helpers';
import { POOL_MAX_CAP } from '../../../config/constants';

// Components
import Page from '../../../components/Page';
import NumberOfStakers from './NumberOfStakers';
import StakedSj from './StakedSj';
import SjPrice from './SjPrice';
import ContractInfo from './ContractInfo';
import MyWallet from './MyWallet';
import LatestTransactions from '../DashboardSjStatsView/LatestTransactions';
import { setStakingInfo } from '../../../slices/stakingInfo';
import { MiniKit } from '@worldcoin/minikit-js';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    maxWidth: '1440px',
    // paddingBottom: theme.spacing(3),
    overflow: 'hidden'
  },
  responsiveContainer: {
    borderRadius: '16px',
    paddingRight: '10px',
    paddingLeft: '16px',
    [`@media (max-width: 800px)`]: {
      paddingLeft: 0,
      paddingRight: 0
    }
  }
}));

const execludeWithdrawInitiatedAccount = (totalStakerList, withdrawExecutedMap) => {
  return totalStakerList
    .map((staker) => {
      let isWithdrawExecuted = withdrawExecutedMap.get(staker.account);
      if (isWithdrawExecuted) {
        let isWithdraw = parseInt(isWithdrawExecuted / BigInt(10 ** 18));
        staker.amount = isWithdraw > staker.amount ? 0 : staker.amount - isWithdraw;
      }
      return staker;
    })
    .sort((a, b) => b.amount - a.amount);
};

const totalStakersList = (data, withdrawData) => {
  let withdrawExecutedMap = new Map();
  withdrawData?.forEach((data) => {
    let isStakers = withdrawExecutedMap.get(data.user);
    if (isStakers) {
      let totalAmount = isStakers + BigInt(data.amount);
      withdrawExecutedMap.set(data.user, totalAmount);
    } else {
      let totalAmount = BigInt(data.amount);
      withdrawExecutedMap.set(data.user, totalAmount);
    }
  });
  return withdrawExecutedMap;
};

const DashboardStakingStatsView = () => {
  const classes = useStyles();
  const { chainId } = useWeb3React();
  const [stakers, setStakers] = useState(0);
  const dispatch = useDispatch();
  const stakingInfo = useSelector((state) => state.stakingInfo);
  const account = useSelector((state) => state.account);
  const { stakingContract } = useStakingContract();

  console.log(MiniKit.isInstalled())
  
  const { data: stakerDepositData, error } = useQuery(GET_STAKERS_DEPOSIT_TX);
  const { data: withdrawExecuteds, error: withdrawError } = useQuery(GET_WITHDRAW_EXECUTED_AMOUNT);
  if (withdrawError) {
    console.error(
      'error encountered during fetching withdraw execution',
      error
    );
  }
  useEffect(() => {
    if (withdrawExecuteds && stakerDepositData) {
      const totalStakerList = filteredStakersList(stakerDepositData);
      const totalWithdrawExecutedMap = totalStakersList(totalStakerList, withdrawExecuteds.withdrawns);
      const stakerList = execludeWithdrawInitiatedAccount(totalStakerList, totalWithdrawExecutedMap);
      const filteredData = stakerList.filter((item) => item.amount > 0);
      setStakers(filteredData.length);
    }
  }, [withdrawExecuteds, stakerDepositData]);

  if (error) {
    console.error(
      'error encountered during staker deposit tx at DashboardStakingStatsView: ',
      error
    );
  }

  useEffect(() => {
    const setStakingInfoFunc = async () => {
      try {
        const result = await stakingContract.currentTotalStake();
        const stakingInfo = {
          stakers: 0,
          stakedAmount: 0,
          poolFilled: 0,
          totalBurned: 3189
        };
        const stakedAmount = Math.round(result / 10 ** 18);
        stakingInfo.stakedAmount = stakedAmount;
        stakingInfo.poolFilled = Math.round((stakedAmount / POOL_MAX_CAP) * 100);
        stakingInfo.stakers = filteredStakersList(stakerDepositData);
        dispatch(setStakingInfo(stakingInfo));
      } catch (err) {
        console.log('Error Initiated During Setting Stake Information: ', err);
      }
    };

    if (stakingContract && chainId) {
      setStakingInfoFunc();
    }
  }, [chainId, stakingContract]);

  return (
    <Page className={classes.root} title="SJ Staking">
      <Container className={classes.responsiveContainer} maxWidth={false}>
        <Grid container spacing={6}>
          <Grid item lg={8} md={12} sm={12}>
            <Grid container spacing={3}>
              <Grid item lg={6} sm={12} xs={12}>
                <SjPrice />
              </Grid>
              <Grid item lg={6} sm={12} xs={12}>
                <NumberOfStakers stakers={stakers} />
              </Grid>
              <Grid item lg={12} md={12} xs={12}>
                <MyWallet />
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item lg={4} md={12} xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={12} sm={12} xs={12}>
                <StakedSj prop={parseInt(stakingInfo.stakedAmount)} />
              </Grid>
              <Grid item lg={12} sm={12} xs={12}>
                <ContractInfo />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Hidden mdDown>

            <LatestTransactions account={account} />
            </Hidden>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default DashboardStakingStatsView;
