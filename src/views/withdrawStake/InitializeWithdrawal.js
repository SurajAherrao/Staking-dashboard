import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Box, Button, Typography, makeStyles } from '@material-ui/core';
import { useStakingContract, useStakingDispatch } from '../../context/StakingContract';
import {
  SET_ERROR_WITH_MESSAGE,
  STAKE_TX_HASH,
} from '../../context/StakingContract/actions';

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

const InitializeWithdrawal = ({ className, onBack, onNext, ...rest }) => {
  const classes = useStyles();
  const [isSubmitting, setSubmitting] = useState(false);
  const { stakingContract, state } = useStakingContract();
  const dispatch = useStakingDispatch();

  const withdraw = async event => {
    event.preventDefault();

    try {
      setSubmitting(true);
      stakingContract
        .withdraw(state.staking.withdrawValue.toString())
        .then(v => {
          console.log('withdraw executed', v);
          dispatch({ type: STAKE_TX_HASH, payload: v.hash });
          if (onNext) {
            onNext();
          }
        })
        .catch(e => {
          dispatch({ type: SET_ERROR_WITH_MESSAGE, payload: '' });
          if (onNext) {
            onNext();
          }
          console.warn(e);
        });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={withdraw} className={clsx(classes.root, className)} {...rest}>
      <Typography variant="h3" color="textPrimary">
        Finalize Withdrawal
      </Typography>
      <Box mt={2}>
        <Typography variant="body2" color="textSecondary">
        Please confirm the withdrawal finalization by sending a Web3 wallet transaction. Once the transaction is processed, your Stake will be available in your wallet.
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
};

InitializeWithdrawal.propTypes = {
  className: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
};

InitializeWithdrawal.defaultProps = {
  onNext: () => { },
  onBack: () => { },
};

export default InitializeWithdrawal;
