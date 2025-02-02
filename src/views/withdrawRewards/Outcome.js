import React from 'react';
import PropTypes from 'prop-types';
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
import { useStakingContract } from '../../context/StakingContract';
import { Link as RouterLink } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  form: {
    height: 'auto',
  },
}));


const Success = ({ txHash }) => {
  const classes = useStyles();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const { stakingContract, state } = useStakingContract();

  return (
    <form className={classes.form}>
      <Box mt={3} display="flex" justifyContent="center">
      
        <CheckCircleOutlineIcon fontSize="large" color="secondary" />
      </Box>
      <Box mt={1} display="flex" justifyContent="center">
        <Typography variant="body1" color="textSecondary">
          Transaction Sent
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
          href={stakingContract && stakingContract.getCurrentNetwork().explorer +  txHash}
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
};

const Failure = ({ startOver, errorMessage }) => {
  const classes = useStyles();

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
          Error
        </Typography>
      </Box>
      <Box mt={1} display="flex" justifyContent="center">
        <Typography variant="body2" color="textSecondary">
          The process has encountered an error and needs to be started over.
        </Typography>
      </Box>
      <Box mt={1} display="flex" justifyContent="center">
        <Typography variant="body2" color="textSecondary">
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
          id="withdrawRewardsOutcomeStartOver"
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

const Outcome = ({ className, onStartOver }) => {
  const { state } = useStakingContract();
  const success = !state.error.isError;
  const { staking } = state;
  console.log("🚀 ~ file: Outcome.js:120 ~ Outcome ~ staking:", staking)

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
  onStartOver: () => {},
};

export default Outcome;
