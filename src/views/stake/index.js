import React, { useState, useEffect } from 'react';
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
import AmountToStake from './AmountToStake';
import Preauthorization from './Preauthorization';
import Confirm from './Confirm';
import Outcome from './Outcome';
import usePrevious from '../../hooks/usePrevious';
import { useWeb3React } from '@web3-react/core';
import { useStakingDispatch } from '../../context/StakingContract';
import { SET_ERROR } from '../../context/StakingContract/actions';
import { Stepper, Step, StepLabel } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: theme.palette.background.dark,
    // minHeight: '100%',
    
    // paddingBottom: theme.spacing(3),
    // backgroundImage: "radial-gradient(#d1d5db 1px,transparent 1px)",
    // backgroundSize: "16px 16px",
    display: "flex",
    justifyContent: "center",
    
  },
  avatar: {
    backgroundColor: colors.red[600],
  },
  stepper: {
    backgroundColor: 'transparent',
  },
  divider: {
    marginBottom: theme.spacing(3),
    borderBottomWidth: "1px",
    borderColor: "#000000", 
    width:"100%"
  },
  container: { 
    maxWidth:"100%",
    width: "100%",
    backgroundColor: "white", 
    padding: "10px 20px ", 
    borderRadius: "7px", 
    border: "2px solid #000000",
    borderColor: "rgb(1, 0, 0)",
    boxShadow:" 0 0 #0000, 0 0 #0000, 5px 5px 0 0 #00000026", 
    [theme.breakpoints.up(800)]: {
      marginLeft: "20px",
      marginRight: "20px"
    },
    [theme.breakpoints.down(800)]: {
      marginLeft: 0,
      marginRight: 0
    }
  },
  text: { background: "#D4A674", margin: " 2vh 0vh", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  contentWrapper: {
    display: 'flex',
    gap: theme.spacing(3),
    width: '100%',
    [theme.breakpoints.down(800)]: {
      flexDirection: 'column',
    }
  },
  stepperContainer: {
    width: '30%',
    position: 'relative',
    [theme.breakpoints.down(800)]: {
      width: '100%',
      marginBottom: theme.spacing(3)
    }
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    position: 'relative',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    position: 'absolute',
    left: 52,
    fontSize: 16,
    fontFamily: theme.typography.fontFamily,
  },
  stepConnector: {
    position: 'absolute',
    top: 40,
    left: 19,
    width: 2,
    height: '100%',
  },
  componentContainer: {
    background:"#FFF8EF",
    width: '70%',
    border: '2px solid #000000',
    borderRadius: 7,
    padding: theme.spacing(2),
    boxShadow: '5px 5px 0 0 #00000026',
    [theme.breakpoints.down(800)]: {
      width: '100%'
    }
  }
}));

const StakeView = () => {
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

  const handleLast = () => {
    setActiveStep(4);
  };

  const goToStep = step => {
    if (!isNaN(step)) {
      setActiveStep(parseInt(step));
    }
  };

  const handleStartOver = () => {
    setActiveStep(0);
    setCompleted(false);
    dispatch({ type: SET_ERROR, payload: false });
    //window.location.reload();
  };

  useEffect(() => {
    if (prevAccount !== account && account && prevAccount) {
      if (activeStep !== 0) {
        setCompleted(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const steps = [
    { label: 'Prerequisites', component: <Prerequisites onNext={handleNext} /> },
    { label: 'Amount to Stake', component: <AmountToStake onBack={handleBack} onNext={handleNext} /> },
    { label: 'Preauthorization', component: <Preauthorization onBack={handleBack} onNext={handleNext} onLast={handleLast} /> },
    { label: 'Confirm', component: <Confirm onBack={handleBack} onNext={handleNext} goToStep={goToStep} currentStep={activeStep} /> },
    { label: 'Outcome', component: <Outcome onStartOver={handleStartOver} /> }
  ];

  return (
    <Page className={classes.root} title="Stake">
      <Container className={classes.container}>
        <Box mb={3}>
          <Typography className={classes.text} variant="h3" color="textPrimary">
            Stake Your SJ
          </Typography>
        </Box>
        <hr className={classes.divider} />
        {!completed ? (
          <Box className={classes.contentWrapper}>
          <div className={classes.stepperContainer}>
            {steps.map((step, index) => (
              <div key={index} className={classes.stepItem}>
                <div className={classes.stepNumber} style={{
                  borderColor: activeStep > index ? '#010000' : activeStep === index ? '#000000' : '#d1d5db',
                  backgroundColor: activeStep > index ? '#8CE096' : activeStep === index ? '#FFFFFF' : '#FFFFFF',
                }}>
                  <span style={{
                    color: activeStep > index ? '#000000' : activeStep === index ? '#000000' : '#9ca3af'
                  }}>
                    {index + 1}
                  </span>
                </div>
                <span className={classes.stepLabel} style={{
                  color: activeStep >= index ? '#010000' : '#343333'
                }}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={classes.stepConnector} style={{
                    backgroundColor: activeStep > index ? '#010000' : '#343333'
                  }} />
                )}
              </div>
            ))}
          </div>
          
          <div className={classes.componentContainer}>
            {steps[activeStep].component}
          </div>
        </Box>
)  : (
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
                    id="stakeStartOver"
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

export default StakeView;
