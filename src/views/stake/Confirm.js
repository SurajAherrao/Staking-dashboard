import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  useMediaQuery,
  useTheme,
  Typography,
  makeStyles,
  Link,
} from '@material-ui/core';
import { useStakingContract, useStakingDispatch } from '../../context/StakingContract';
import {
  SET_ERROR_WITH_MESSAGE,
  STAKE_TX_HASH,
  STAKE_TX_HASH_RECEIPT,
} from '../../context/StakingContract/actions';
import LoadingScreen from '../../components/LoadingScreen';

const useStyles = makeStyles(theme => ({
  root: {},
  sizedBox: {
    height: '296px',
  },
}));

const Confirm = ({ className, onBack, onNext, goToStep, currentStep, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { stakingContract, state } = useStakingContract();
  const dispatch = useStakingDispatch();
  const [tx, setTx] = useState('')

  const handleSubmit = async event => {
    setSubmitting(true);
    event.preventDefault();

    try {

      const { staking } = state;
      stakingContract
        .stakeSJ(staking.stakingValue.toString())
        .then(v => {
          if (v === undefined) {
            dispatch({ type: SET_ERROR_WITH_MESSAGE, payload: 'Your stake was not submitted' });
            if (onNext) {
              onNext();
            }
            return;
          }
          dispatch({ type: STAKE_TX_HASH, payload: v.hash });
          setTx(v.hash)
          if (onNext) {
            async function rewardreceipt() {
              const receipt = await v.wait();
              // onNext();
              if (receipt != null || receipt != undefined) {
                onNext();
                dispatch({
                  type: STAKE_TX_HASH_RECEIPT,
                  payload: v.hash,
                });
              }
              // setSubmitting(false); 
            }
            rewardreceipt();
          }
        })
        .catch(err => {
          console.warn('err', err);
          dispatch({
            type: SET_ERROR_WITH_MESSAGE,
            payload: 'Something went wrong with your deposit, try again',
          });
          if (onNext) {
            onNext();
          }
        });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      // setSubmitting(false);
    }
  };

  if (isSubmitting) {

    return (
      <Box className={classes.root} {...rest}>
        <Box mt={2} mb={2}>
          <LoadingScreen width={mobileDevice ? 200 : 400} />
        </Box>
        <Box justifyContent="center" display="flex">
          <Typography variant="h3" color="textPrimary">
            Waiting for the transaction to complete
          </Typography>
        </Box>
        <Box mt={2} justifyContent="center" display="flex">
          {tx &&

            <Link
              variant="subtitle1"
              color="secondary"
              href={
                stakingContract &&
                stakingContract.getCurrentNetwork().explorer + tx
              }
              target="blank"
            >
              {mobileDevice ? `${state.sjInfo.explorerName} link` : `${tx.substr(0, 24)}....`}
            </Link>
          }

        </Box>
      </Box>
    )
  }

  if (mobileDevice) {
    return (
      <form
        className={classes.root}
        onSubmit={handleSubmit}
        display="flex"
        flex-direction="column"
        {...rest}
      >
        <Grid container className={classes.root} display="flex" flex-direction="column">
          <Grid item container direction="column" justifyContent="flex-start">
            <Typography variant="h3" color="textPrimary">
              Confirm
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle1" color="textSecondary">
                Please confirm to <strong>Stake</strong>. 
              </Typography>
            </Box>
            {error && (
              <Box mt={2}>
                <FormHelperText error>{FormHelperText}</FormHelperText>
              </Box>
            )}
          </Grid>
          <Grid item container direction="column" justifyContent="flex-end">
            <Box mt={6} display="flex">
              {goToStep && (
                <Button id="stakeBack" onClick={() => goToStep(currentStep - 2)} size="large">
                  Previous
                </Button>
              )}
              <Box flexGrow={1} />
              <Button
                className={classes.button}
                id="stakeConfirm"
                color="secondary"
                disabled={isSubmitting}
                variant="contained"
                size="large"
                onClick={handleSubmit}
              >
                Confirm
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    );
  } else {
    return (
      <form
        className={mobileDevice ? classes.root : classes.sizedBox}
        onSubmit={handleSubmit}
        display="flex"
        flex-direction="column"
        {...rest}
      >
        <Grid
          container
          className={mobileDevice ? classes.root : classes.sizedBox}
          display="flex"
          flex-direction="column"
        >
          <Grid item container direction="column" justifyContent="flex-start">
            <Typography variant="h3" color="textPrimary">
              Confirm
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle1" color="textSecondary">
                Please Confirm to <strong>Stake</strong>. 
              </Typography>
            </Box>
            {error && (
              <Box mt={2}>
                <FormHelperText error>{FormHelperText}</FormHelperText>
              </Box>
            )}
          </Grid>
          <Grid item container direction="column" justifyContent="flex-end">
            <Box mt={6} display="flex">
              {goToStep && (
                <Button
                  id="stakeConfirmMobileBack"
                  onClick={() => {
                    return goToStep(currentStep - 2);
                  }}
                  size="large"
                >
                  Previous
                </Button>
              )}
              <Box flexGrow={1} />
              <Button
                className={classes.button}
                id="stakeConfirmMobileNext"
                color="secondary"
                disabled={isSubmitting}
                variant="contained"
                size="large"
                onClick={handleSubmit}
              >
                Confirm
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    );
  }
};

Confirm.propTypes = {
  className: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
};

Confirm.defaultProps = {
  onNext: () => { },
  onBack: () => { },
};

export default Confirm;
