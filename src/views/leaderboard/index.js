/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Box, Container, Divider, Tab, Tabs, makeStyles } from '@material-ui/core';
import {  useQuery } from '@apollo/client';

import Page from '../../components/Page';
import Header from './Header';
import ResultsStakers from './ResultsStakers';
import {
  GET_STAKERS_DEPOSIT_TX,
  GET_WITHDRAW_EXECUTED_AMOUNT,
} from '../../graphql/Queries';
import { filteredStakersList } from '../../utils/helpers';

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    marginTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    height:"100%" 

  },
}));

const execludeWithdrawInitiatedAccount = (
  totalStakerList,
  withdrawExecutedMap
) => {
    return totalStakerList
      .map(staker => {
          let isWithdrawExecuted = withdrawExecutedMap.get(staker.account);
          if (isWithdrawExecuted) {
            let isWithdraw = parseInt(isWithdrawExecuted / BigInt(10 ** 18));
            staker.amount = isWithdraw > staker.amount? 0:  staker.amount - isWithdraw;
          }
          return staker;
      })
      .sort((a, b) => b.amount - a.amount)
 
};

const totalStakersList = (data, withdrawData) => {
  let withdrawExecutedMap = new Map();
  withdrawData?.forEach(data => {
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

const ProductListView = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('stakers');
  const { data, error } = useQuery(GET_STAKERS_DEPOSIT_TX);
  const [stakerList, setStakerList] = useState([]);

  const {
    data:  withdrawExecuteds 
  } = useQuery(GET_WITHDRAW_EXECUTED_AMOUNT); 
  
  if (error) {
    console.error('error encountered during staker deposit tx at leaderboard: ', error);
  }

  const tabs = [{ value: 'stakers', label: 'Stakers' }];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  useEffect(() => {
    if (withdrawExecuteds  && data) {
      const totalStakerList = filteredStakersList(data);
      const totalWithdrawExecutedMap = totalStakersList(totalStakerList, withdrawExecuteds.withdrawns);
      const stakerList = execludeWithdrawInitiatedAccount(
        totalStakerList,
        totalWithdrawExecutedMap
      );
      const filteredData = stakerList.filter(item => item.amount > 0);
      setStakerList(filteredData);
    }
  }, [withdrawExecuteds, data]);

  return (
    <Page className={classes.root} title="Leaderboard">
      <Container maxWidth="sm">
        {/* <Header  /> */}
        {/* <Box mt={3}>
          <Tabs
            onChange={handleTabsChange}
            scrollButtons="auto"
            textColor="secondary"
            value={currentTab}
            variant="scrollable"
          >
            {tabs.map(tab => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        <Divider /> */}
        <Box style={{borderRadius:"18px",}} mt={3}><ResultsStakers stakersList={stakerList} /></Box>
      </Container>
    </Page>
  );
};

export default ProductListView;
