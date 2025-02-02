import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Link,
  useMediaQuery,
  useTheme,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { useStakingContract, useStakingDispatch } from '../../context/StakingContract';
import { SET_ERROR } from '../../context/StakingContract/actions';

const useStyles = makeStyles(theme => ({
  form: {
    height: 'auto',
  },
}));

const Outcome = ({ className, onStartOver }) => {
  const classes = useStyles();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const { state, stakingContract } = useStakingContract();
  const dispatch = useStakingDispatch();
  const success = !state.error.isError;
  const { staking } = state;

  useEffect(() => {
    return () => {
      dispatch({ type: SET_ERROR, payload: false });
    };
  }, []);

  const Success = ({ txHash }) => (
    <form className={classes.form}>
      <Box mt={3} display="flex" justifyContent="center">
        <CheckCircleOutlineIcon fontSize="large" color="secondary" />
      </Box>
      <Box mt={1} display="flex" justifyContent="center">
        <Typography variant="body1" color="textSecondary">
          Success
        </Typography>
      </Box>
      <Box mt={1} display="flex" justifyContent="center">
        <Typography variant="body2" color="textSecondary">
          Congratulations! You have completed the Token staking process.
        </Typography>
      </Box>
      <Box mt={1} display="flex" justifyContent="center">
        <Typography variant="body2" color="textSecondary">
          Please check {state.sjInfo.explorerName} to see if the transaction was successful.
        </Typography>
      </Box>
      <Box mt={2} justifyContent="center" display="flex">
        <Link
          variant="subtitle1"
          color="secondary"
          href={stakingContract && stakingContract.getCurrentNetwork().explorer + txHash}
          target="blank"
        >
          <Typography className={classes.wrap}>
            {mobileDevice ? `${state.sjInfo.explorerName} link` : `${txHash.substr(0, 24)}...`}
          </Typography>
        </Link>
      </Box>
      <Box mt={3} display="flex" justifyContent="center">
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          size="medium"
          to="/app/staking-stats"
        >
          DASHBOARD
        </Button>
      </Box>
    </form>
  );

  const Failure = ({ startOver, errorMessage }) => {
    const handleStartOver = () => {
      if (startOver) {
        startOver();
      }
    };

    return (
      <form className={classes.form}>
        <Box mt={3} display="flex" justifyContent="center">
          <ErrorOutlineIcon fontSize="large" color="error" />
        </Box>
        <Box mt={1} display="flex" justifyContent="center">
          <Typography variant="body1" color="textSecondary">
            {errorMessage}
          </Typography>
        </Box>
        <Box
          mt={6}
          display="flex"
          flex-direction="column"
          height="100%"
          alignItems="flex-end"
          justifyContent="center"
        >
          <Button
            id="outcomeStartOver"
            color="secondary"
            variant="contained"
            size="large"
            type="submit"
            onClick={handleStartOver}
          >
            START OVER
          </Button>
        </Box>
      </form>
    );
  };

  return (
    <>
      {success ? (
        <Success txHash={staking.stakeTxHash} />
      ) : (
        <Failure startOver={onStartOver} errorMessage={state.error.errorMessage} />
      )}
    </>
  );
};

Outcome.propTypes = {
  className: PropTypes.string,
  onStartOver: PropTypes.func,
};

Outcome.defaultProps = {
  onStartOver: () => { },
};

export default Outcome;
