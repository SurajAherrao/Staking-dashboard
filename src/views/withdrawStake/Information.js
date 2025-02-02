import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Box, Button, Typography, makeStyles } from '@material-ui/core';
import { useStakingContract, useStakingDispatch } from '../../context/StakingContract';
import { SET_ERROR_WITH_MESSAGE, STAKE_TX_HASH } from '../../context/StakingContract/actions';
import { useWeb3React } from '@web3-react/core';

const useStyles = makeStyles(theme => ({
  root: {},
  editorContainer: {
    marginTop: theme.spacing(3),
  },
  editor: {
    '& .ql-editor': {
      height: 400,
    },
  },
}));

const Information = ({ className, onBack, onNext, onHandleLast, ...rest }) => {
  const classes = useStyles();
  const [isSubmitting, setSubmitting] = useState(false);
  const { stakingContract } = useStakingContract();
  const dispatch = useStakingDispatch();
  const { account } = useWeb3React();
  const [withdrawDate, setInitWithdrawDate] = useState('0');

  useEffect(() => {
    let mounted = true;
    if (account && stakingContract) {
      stakingContract
        .getStakeDeposits(account)
        .then(res => {
          if (mounted) {
            if (res) {
              return setInitWithdrawDate(res[2].toString());
            }
            setInitWithdrawDate('0');
          }
        })
        .catch(err => {
          setInitWithdrawDate('0');
          console.warn('error get stake deposit', err);
        });
    }

    return () => (mounted = false);
  }, [stakingContract, account]);

  const initiateWithdraw = async event => {
    event.preventDefault();

    try {
      setSubmitting(true);
      if (onNext) {
        onNext();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const withdraw = async event => {
    event.preventDefault();

    try {
      setSubmitting(true);
      stakingContract
        .executeWithdrawal()
        .then(v => {
          console.log('withdraw executed', v);
          dispatch({ type: STAKE_TX_HASH, payload: v.hash });
          if (onHandleLast) {
            onHandleLast();
          }
        })
        .catch(e => {
          dispatch({ type: SET_ERROR_WITH_MESSAGE, payload: '' });
          if (onHandleLast) {
            onHandleLast();
          }
          console.warn(e);
        });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (withdrawDate === '0') {
    return (
      <form onSubmit={initiateWithdraw} className={clsx(classes.root, className)} {...rest}>
        <Typography variant="h3" color="textPrimary">
          Attention
        </Typography>
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Are you sure you want to initiate the 7 day unstaking process? Doing so will remove your
            tokens from the staking pool and initiate the withdrawal process. This will also remove
            your claim to any staking rewards or bonuses from this point forward even if you do not
            proceed with the final withdrawal step after the 7 day cooldown period.
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography variant="body2" color="textSecondary">
            You will now be asked to confirm the withdrawal initialization by sending a web3 wallet
            transaction.
          </Typography>
        </Box>
        <Box mt={6} display="flex">
          {onBack && (
            <Button id="initWithdrawalStakeBack" onClick={onBack} size="large">
              Previous
            </Button>
          )}
          <Box flexGrow={1} />
          <Button
            id="initWithdrawalStakeNext"
            color="secondary"
            disabled={isSubmitting}
            type="submit"
            variant="contained"
            size="large"
          >
            Next
          </Button>
        </Box>
      </form>
    );
  } else {
    return (
      <form onSubmit={withdraw} className={clsx(classes.root, className)} {...rest}>
        <Typography variant="h3" color="textPrimary">
          Finalize Withdrawal
        </Typography>
        <Box mt={2}>
          <Typography variant="subtitle1" color="textSecondary">
            2<sup>nd</sup> of 2 transactions needed to withdraw
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            You will now be asked to confirm the withdrawal finalization by sending a web3 wallet
            transaction.
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography variant="body2" color="textSecondary">
            After the transaction is processed your stake as well as the stake reward will be
            transferred back to your wallet.
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography variant="body2" color="textSecondary">
            <strong>Make sure 7 days are passed since initialization, else withdraw wont Occur 
            </strong>
          </Typography>
        </Box>
        <Box mt={6} display="flex">
          {onBack && (
            <Button id="initWithdrawalStakeMobileBack" onClick={onBack} size="large">
              Previous
            </Button>
          )}
          <Box flexGrow={1} />
          <Button
            id="initWithdrawalStakeMobileNext"
            color="secondary"
            disabled={isSubmitting}
            type="submit"
            variant="contained"
            size="large"
          >
            Next
          </Button>
        </Box>
      </form>
    );
  }
};

Information.propTypes = {
  className: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
};

Information.defaultProps = {
  onNext: () => {},
  onBack: () => {},
};

export default Information;
