import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { useSelector, useDispatch } from '../../../store';
import { setLatestTransactions, clearTransactions } from '../../../slices/latestTransactions';
import SimpleDateTime from 'react-simple-timestamp-to-date';
import { useWeb3React } from '@web3-react/core';
import { useStakingContract } from '../../../context/StakingContract';
import {
  GET_REWARD_WITHDRAW_TX_BY_ADDRESS_DESC,
  GET_STAKER_DEPOSIT_TX_BY_ADDRESS_DESC_TIMESTAMP,
  GET_WITHDRAW_EXECUTED_TX_BY_ADDRESS_DESC_TIMESTAMP,
} from '../../../graphql/Queries';
import { useQuery } from '@apollo/client';
import { SupportedNetworks } from '../../../config/constants';

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: "10px",
    marginTop: '15px',
    overflow:"auto",
   
  },
}));

const TXN_TYPE = {
  REWARD_WITHDRAWN: 'Reward Withdraw',
  STAKE_DEPOSIT: 'Stake',
  WITHDRAW_EXECUTED: 'Withdraw',
};

const getLatestTx = (
  rewardWithdrawTx,
  stakerDepositTx,
  withdrawExecutedTx
) => {
  let rewardWithTx = rewardWithdrawTx.map(tx => ({
    txn_type: TXN_TYPE.REWARD_WITHDRAWN,
    ...tx,
  }));

  let stakerDepTx = stakerDepositTx.map(tx => ({
    txn_type: TXN_TYPE.STAKE_DEPOSIT,
    ...tx,
  }));


  let withExeTx = withdrawExecutedTx.map(tx => ({
    txn_type: TXN_TYPE.WITHDRAW_EXECUTED,
    ...tx,
  }));

  const latestTx = [...rewardWithTx, ...stakerDepTx, ...withExeTx];

  latestTx.sort((a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp));

  return latestTx;
};

const currentNetwork = {
  eth : "ethereum",
  matic : "matic",
  op : "optimism"
}

const LatestTransactions = ({ className, account, ...rest }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const dispatch = useDispatch();
  const { account: address, chainId } = useWeb3React();
  const [network, setNetwork] = React.useState('');
  const { stakingContract } = useStakingContract();
  const transactions = useSelector(state => state.latestTransactions);


  useEffect(() => {
    if (chainId === SupportedNetworks.matic.chainID) {
      setNetwork("matic")
    }
    if (chainId === SupportedNetworks.ethereum.chainID) {
      setNetwork("eth")
    }
    if (chainId === SupportedNetworks.optimism.chainID) {
      setNetwork("op")
    }
  }, [chainId])

  // need to implement subscription
  const { data: REWARD_WITHDRAW_TX, error: REWARD_WITHDRAW_TX_ERROR } = useQuery(
    GET_REWARD_WITHDRAW_TX_BY_ADDRESS_DESC,
    {
      variables: {
        address: address,
        noOfTx: 40,
      },
      fetchPolicy: 'no-cache',
    }
  );

  const { data: STAKER_DEPOSIT_TX, error: STAKER_DEPOSIT_TX_ERROR } = useQuery(
    GET_STAKER_DEPOSIT_TX_BY_ADDRESS_DESC_TIMESTAMP,
    {
      variables: {
        address: address,
        noOfTx: 40,
      },
      fetchPolicy: 'no-cache',
    }
  );


  const { data: WITHDRAW_EXECUTED_TX, error: WITHDRAW_EXECUTED_TX_ERROR } = useQuery(
    GET_WITHDRAW_EXECUTED_TX_BY_ADDRESS_DESC_TIMESTAMP,
    {
      variables: {
        address: address,
        noOfTx: 40,
      },
      fetchPolicy: 'no-cache',
    }
  );

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = event => {
    setLimit(parseInt(event.target.value));
  };

  useEffect(() => {
    if (account.loggedIn) {
      const txs = getLatestTx(
        REWARD_WITHDRAW_TX ? REWARD_WITHDRAW_TX?.rewardPaids : [],
        STAKER_DEPOSIT_TX ? STAKER_DEPOSIT_TX?.stakeds : [],
        WITHDRAW_EXECUTED_TX ? WITHDRAW_EXECUTED_TX?.withdrawns : []
      );
      dispatch(setLatestTransactions(txs));
    } else {
      dispatch(clearTransactions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [REWARD_WITHDRAW_TX, STAKER_DEPOSIT_TX, WITHDRAW_EXECUTED_TX, account]);

  useEffect(() => {
    if (REWARD_WITHDRAW_TX_ERROR) {
      console.error(
        'encountered error during fetching reward withdraw tx at LatestTransaction: ',
        REWARD_WITHDRAW_TX_ERROR
      );
    }
    if (STAKER_DEPOSIT_TX_ERROR) {
      console.error(
        'encountered error during fetching staker deposit tx LatestTransaction: ',
        STAKER_DEPOSIT_TX_ERROR
      );
    }

    if (WITHDRAW_EXECUTED_TX_ERROR) {
      console.error(
        'encountered error during fetching withdraw executed tx LatestTransaction: ',
        WITHDRAW_EXECUTED_TX_ERROR
      );
    }
  }, [
    REWARD_WITHDRAW_TX_ERROR,
    STAKER_DEPOSIT_TX_ERROR,
    WITHDRAW_EXECUTED_TX_ERROR,
  ]);

  const applyPagination = (transactionList, page, limit) => {
    return transactionList.slice(page * limit, page * limit + limit);
  };

  const giveNotation = (rewardToken) => {
    if (!rewardToken) {
      return "SJ";
    }
  
    const wethAddress = network 
      ? SupportedNetworks[currentNetwork[network]].WethAddress 
      : SupportedNetworks.ethereum.WethAddress;
  
    return rewardToken.toLowerCase() === wethAddress.toLowerCase() ? "WETH" : "SJ";
  };
  
  const paginatedTransactions = applyPagination(transactions, page, limit);

  if (account.loggedIn) {
    return (
      <Card
        className={clsx(classes.root, className)}
        visible={account.loggedIn.toString()}
        {...rest}
      >
        <CardHeader style={{ background: "#D4A674", color: "#fff", borderRadius: "10px", }} title="Latest Transactions" />
        <PerfectScrollbar >
          <Box overflow={"auto"}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Txn Type</TableCell>
                  <TableCell>Txn Hash</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{overflow:"scroll"}} >
                {account.loggedIn &&
                  paginatedTransactions.map(transaction => (
                    <TableRow hover style={{overflow:"auto"}} >
                      <TableCell> {transaction.txn_type} </TableCell>
                      <TableCell>
                        <Link
                          variant="subtitle1"
                          color="secondary"
                          href={stakingContract.getCurrentNetwork().explorer + transaction.txHash}
                          target="blank"
                        >
                          <Typography className={classes.wrap}>
                            {`${transaction.txHash?.substr(0, 24)}...`}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <SimpleDateTime dateSeparator="-" format="MYD" showTime="0">
                          {Number(transaction.timeStamp)}
                        </SimpleDateTime>
                      </TableCell>
                      <TableCell>
                        {!!transaction.value
                          ? (transaction.value / 1000000000000000000).toFixed(5)
                          : (transaction.value / 1000000000000000000).toFixed(5)} {transaction.rewardsToken ? giveNotation(transaction.rewardsToken) : "SJ"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={transactions.length}
              labelRowsPerPage={'Rows per page'}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </PerfectScrollbar>
      </Card>
    );
  } else {
    return null;
  }
};

LatestTransactions.propTypes = {
  className: PropTypes.string,
};

export default LatestTransactions;
