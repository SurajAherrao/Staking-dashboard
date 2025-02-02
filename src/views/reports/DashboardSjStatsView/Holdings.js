import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, Typography, makeStyles } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

import { useWeb3React } from '@web3-react/core';
import { useStakingContract } from '../../../context/StakingContract';

const useStyles = makeStyles(theme => ({
  root: {
    padding:"20px 16px",
    alignItems: 'center',
    justifyContent: 'space-between',
    background:"#f8f8f8",
    borderRadius: "10px",
  },
  label: {
    marginLeft: theme.spacing(1),
  },
  avatar: {
    background: "#D4A674",
    color: theme.palette.secondary.contrastText,
    height: 36,
    width: 36,
  },
  imageIcon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  },
  icon: {
    marginLeft: theme.spacing(2),
    color: theme.palette.secondary.main,
  },
}));

const Holdings = ({ className, account, ...rest }) => {
  const classes = useStyles();
  const { chainId, account: address } = useWeb3React();
  const [holdings, setHoldings] = useState(0);
  const { stakingContract } = useStakingContract();

  const getHoldings = async () => {
    if (account.loggedIn) {
      const sjBalance = await stakingContract.sjBalance(address).catch(err => {
        console.log('Error:', err);
      });
      if (sjBalance) {
        setHoldings(sjBalance);
      }
    }
  };

  useEffect(() => {
    getHoldings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <Card elevation={0} className={clsx(classes.root, className)} {...rest}>
        <Typography component="h3" gutterBottom variant="overline" color="textSecondary">
          Wallet Balance
        </Typography>
      <Box display="flex"  flexGrow={1}>
      <Avatar style={{ marginRight : "18px "}} className={classes.avatar}>
        <AccountBalanceIcon />
      </Avatar>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <Typography variant="h3" color="textPrimary">
            {account.loggedIn ? Math.round(holdings * 10) / 10 : '--'} SJ
          </Typography> 
        </Box>
      </Box>
    </Card>
  );
};

Holdings.propTypes = {
  className: PropTypes.string,
};

export default Holdings;
