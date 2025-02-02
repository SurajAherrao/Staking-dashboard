import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, Hidden, Typography, makeStyles } from '@material-ui/core';
import LockItem from '@material-ui/icons/Lock';
import NumberFormat from 'react-number-format';
import { useWeb3React } from '@web3-react/core';
import { useStakingContract } from '../../../context/StakingContract';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Link as RouterLink } from 'react-router-dom';
import { ethers } from 'ethers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: "20px 16px",
    alignItems: 'center',
    justifyContent: 'space-between',
    background: "#f8f8f8",
    borderRadius: "10px"
  },
  avatar: {
    background: "#D4A674",
    color: theme.palette.secondary.contrastText,
    height: 36,
    width: 36,
  },
}));

const Staked = ({ className, stake, login, ...rest }) => {
  const classes = useStyles();
  const { account } = useWeb3React();
  const { stakingContract } = useStakingContract();
  const [staked, setStaked] = useState()

  useEffect(() => {
    if (account && stakingContract) {
      stakingContract
        .getStakedAmount(account)
        .then(res => {
          const stakedAmount = ethers.utils.formatEther(res);
          setStaked(Number(stakedAmount).toFixed(1))
        })
        .catch(err => {
          console.warn('error in checking is withdram init', err);
        })
    }
  }, [account, stakingContract])



  return (
    <Card elevation={0} className={clsx(classes.root, className)} {...rest}>
      <Typography color="textSecondary" component="h2" gutterBottom variant="overline">
        Staked
      </Typography>
      <Box display="flex" justifyContent="space-between" >
        <div style={{ display: "flex" }}>

          <Hidden mdDown>
            <Avatar style={{ marginRight: "18px " }} className={classes.avatar} color="inherit">
              <LockItem />
            </Avatar>
          </Hidden>
          <Box display="flex" alignItems="center" flexWrap="wrap">
            {login ?
              <Typography color="inherit" variant="h3">
                <NumberFormat
                  value={staked ? staked : stake ? Math.round(stake * 10) / 10 : 0}
                  displayType={'text'}
                  thousandSeparator={true}
                /> SJ
              </Typography> :
              <Typography color="inherit" variant="h3">
                {"-- SJ"}
              </Typography>
            }
          </Box>
        </div>
        <Box component={RouterLink}
          to="/app/stake" style={{ display: "flex", alignItems: "end", fontSize: "12px", textDecoration: "none", color: "#546e7a" }}>
          <div style={{ display: "flex", alignItems: 'center' }}>
            <div>Stake More </div>  <OpenInNewIcon style={{ width: "11px", height: "11px" }} />
          </div>
        </Box>
      </Box>
    </Card>
  );
};

Staked.propTypes = {
  className: PropTypes.string,
};

export default Staked;
