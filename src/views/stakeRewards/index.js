import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  colors,
  makeStyles,
} from '@material-ui/core';
import {
  RotateCw as RotateCwIcon,
} from 'react-feather';
import Page from '../../components/Page';
import Prerequisites from './Prerequisites';
import Confirm from './Confirm';
import Outcome from './Outcome';
import usePrevious from '../../hooks/usePrevious';
import { useWeb3React } from '@web3-react/core';
import { useStakingDispatch } from '../../context/StakingContract';
import { SET_ERROR } from '../../context/StakingContract/actions';

// const steps = [
//   {
//     label: 'Prerequisites',
//     icon: ListIcon,
//   },
//   {
//     label: 'Confirm',
//     icon: KeyIcon,
//   },
//   {
//     label: 'Confirmation',
//     icon: SendIcon,
//   },
// ];

// const CustomStepConnector = withStyles(theme => ({
//   vertical: {
//     marginLeft: 19,
//     padding: 0,
//   },
//   line: {
//     borderColor: theme.palette.divider,
//   },
// }))(StepConnector);

const useCustomStepIconStyles = makeStyles(theme => ({
  root: {},
  active: {
    background: "#D4A674",
    boxShadow: theme.shadows[10],
    color: theme.palette.secondary.contrastText,
  },
  completed: {
    background: "#D4A674",
    color: theme.palette.secondary.contrastText,
  },
}));

const CustomStepIcon = ({ active, completed, icon }) => {
  const classes = useCustomStepIconStyles();

  // const Icon = steps[icon - 1].icon;

  return (
    <Avatar
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icon}
    </Avatar>
  );
};

CustomStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  avatar: {
    backgroundColor: colors.red[600],
  },
  stepper: {
    backgroundColor: 'transparent',
  },
}));

const StakeRewardsView = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { account } = useWeb3React();
  const prevAccount = usePrevious(account);
  const dispatch = useStakingDispatch();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStartOver = () => {
    setActiveStep(0);
    setCompleted(false);
    dispatch({ type: SET_ERROR, payload: false });
  };

  const handleComplete = () => {
    setCompleted(true);
  };

  useEffect(() => {
    if (prevAccount !== account && account && prevAccount) {
      if (activeStep !== 0) {
        handleComplete();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <Page className={classes.root} title="Stake Rewards">
      <Container style={{ backgroundColor: "white" ,padding:"10px 20px " , borderRadius:"18px",boxShadow:"0 0 0 1px rgba(63,63,68,0.05), 0 1px 2px 0 rgba(63,63,68,0.15)"}} maxWidth="sm">
        <Box mb={3}>
        
          <Typography style={{ background: "#D4A674", margin: " 2vh 0vh", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }} variant="h3" color="textPrimary">
            Stake Your Rewards
          </Typography>
        </Box>
        {!completed ? (
          <Box>
            {/* <Hidden smDown>

              <Box item xs={12} md={12}>
                <Stepper
                  activeStep={activeStep}
                  className={classes.stepper}
                  connector={<CustomStepConnector />}
                  orientation="horizontal"
                >
                  {steps.map(step => (
                    <Step key={step.label}>
                      <StepLabel StepIconComponent={CustomStepIcon}>{step.label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Hidden>
            */}
            <Grid container>
              <Grid item xs={12} md={12}>
                <Box p={3}>
                  {activeStep === 0 && <Prerequisites onNext={handleNext} />}
                  {activeStep === 1 && <Confirm onBack={handleBack} onNext={handleNext} />}
                  {activeStep === 2 && <Outcome onStartOver={handleStartOver} />}
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Card>
            <CardContent>
              <Box maxWidth={450} mx="auto">
                <Box display="flex" justifyContent="center">
                  <Avatar className={classes.avatar}>
                    <RotateCwIcon />
                  </Avatar>
                </Box>
                <Box mt={2}>
                  <Typography variant="h3" color="textPrimary" align="center">
                    Account changed
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle1" color="textSecondary" align="center">
                    We have detected account change. Please start the process from beginning.
                  </Typography>
                </Box>
                <Box mt={2} display="flex" justifyContent="center">
                  <Button
                    id="stakeRewardsStartOver"
                    variant="contained"
                    color="secondary"
                    onClick={handleStartOver}
                  >
                    Start Over
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Page>
  );
};

export default StakeRewardsView;
