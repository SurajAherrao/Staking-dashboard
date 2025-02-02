import React, { useState, useEffect, useCallback } from 'react';
import BigNumber from 'bignumber';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  FormHelperText,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  makeStyles,
} from '@material-ui/core';
import { Checkbox } from 'formik-material-ui';
import { useSelector } from '../../store';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import TermsAndConditions from './TermsAndConditions';
import { ethers } from 'ethers';
import { useStakingContract, useStakingDispatch } from '../../context/StakingContract';
import {
  SET_ADDEES_NOT_STAKED,
  SET_WITHDRAW_INITIATED_DATE,
  SET_IS_WITHDRAW_INITIATED,
  SET_STAKED_AMOUNT,
  SET_REWARD_VALUE,
  SET_CONNECTED_ADDRESS,
  SET_SJ_BALANCE,
  SET_SJ_BALANCE_BOOL,
  SET_ETH_BALANCE_BOOL,
  SET_EXISTING_ALLOWANCE,
  SET_METAMASK,
  SET_STAKING_VALUE,
  SET_TOTAL_STAKE,
} from '../../context/StakingContract/actions';
import { useWeb3React } from '@web3-react/core';
import { SUPPORTED_WALLETS } from '../../components/WalletSelector/WalletSelector';
import { metamask as injected } from '../../components/connectors/connectors';
import LoadingScreen from '../../components/LoadingScreen';
import { Check, X } from "lucide-react";

const useStyles = makeStyles(theme => ({
  root: {},
  typeOption: {
    alignItems: 'flex-start',
    display: 'flex',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  stepButton: {
    '& + &': {
      marginLeft: theme.spacing(2),
    },
  },
}));

const Prerequisites = ({ className, onNext, ...rest }) => {
  const classes = useStyles();
  const acc = useSelector(state => state.account);
  console.log("🚀 ~ file: Prerequisites.js:59 ~ Prerequisites ~ acc:", acc)
  const dispatch = useStakingDispatch();
  const [isLoading, setIsLoading] = useState(1);
  const { account, connector, provider } = useWeb3React();
  const { stakingContract, state } = useStakingContract();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  function formatConnectorName() {
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);

    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        k =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map(k => SUPPORTED_WALLETS[k].name)[0];
    return name;
  }

  const thisWorks = useCallback((account, provider, stakingContract) => {
    dispatch({ type: SET_METAMASK, payload: true });
    setIsLoading(7);


    stakingContract.stakingContract
      .totalSupply()
      .then(val => {
        dispatch({ type: SET_TOTAL_STAKE, payload: val });
      })
      .catch(err => {
        console.warn('error fetching total stake', err);
      })
      .finally(() => {
        setIsLoading(isLoading => --isLoading);
      });

    // 4. Check if connected account has SJ and ETH balances
    provider
      .getSigner()
      .getAddress()
      .then(addr => {
        setIsLoading(isLoading => --isLoading);
        dispatch({ type: SET_CONNECTED_ADDRESS, payload: addr });

        provider
          .getBalance(account)
          .then(ethBalance => {
          console.log("🚀 ~ thisWorks ~ ethBalance:", ethBalance)

            if (ethBalance > new BigNumber(0)) {
              dispatch({ type: SET_ETH_BALANCE_BOOL, payload: true });
            } else {
              dispatch({ type: SET_ETH_BALANCE_BOOL, payload: true });
            }
          })
          .catch(e => {
            console.error(e);
            dispatch({ type: SET_ETH_BALANCE_BOOL, payload: true });
          })
          .finally(() => {
            setIsLoading(isLoading => --isLoading);
          });

        stakingContract
          .sjBalance(account)
          .then(sjBalance => {
            setIsLoading(isLoading => --isLoading);
            if (sjBalance > 0) {
              dispatch({ type: SET_SJ_BALANCE_BOOL, payload: true });
            } else {
              dispatch({ type: SET_SJ_BALANCE_BOOL, payload: false });
            }
            dispatch({ type: SET_SJ_BALANCE, payload: sjBalance });
            dispatch({ type: SET_STAKING_VALUE, payload: sjBalance });
          })
          .catch(e => {
            console.error(e);
            dispatch({ type: SET_SJ_BALANCE_BOOL, payload: false });
            dispatch({ type: SET_SJ_BALANCE, payload: 0 });
          })
          .finally(() => {
            setIsLoading(isLoading => --isLoading);
          });

        stakingContract
          .getStakeDeposits(account)
          .then(res => {
            if (res === false) {
              dispatch({ type: SET_IS_WITHDRAW_INITIATED, payload: false });
              dispatch({ type: SET_WITHDRAW_INITIATED_DATE, payload: '0' });
              return;
            }
            const result = res.endDate.toString() !== '0';
            const stakedAmount = ethers.utils.formatEther(res.initialDeposit);
            const reward = ethers.utils.formatEther(res.rewards);
            dispatch({ type: SET_IS_WITHDRAW_INITIATED, payload: result });
            dispatch({ type: SET_WITHDRAW_INITIATED_DATE, payload: res.endDate.toString() });

            dispatch({ type: SET_STAKED_AMOUNT, payload: stakedAmount });
            dispatch({ type: SET_REWARD_VALUE, payload: reward });
          })
          .catch(err => {
            console.warn('error in checking is withdram init', err);
          })
          .finally(() => {
            setIsLoading(isLoading => --isLoading);
          });

        stakingContract
          .getAllowance(account)
          .then(allowance => {
            dispatch({ type: SET_EXISTING_ALLOWANCE, payload: allowance });
          })
          .catch(e => console.error(e))
          .finally(() => {
            setIsLoading(isLoading => --isLoading);
          });

        // Check if address is already staked:
        stakingContract
          .alreadyStaked(account)
          .then(staked => {
            setIsLoading(isLoading => --isLoading);
            dispatch({ type: SET_ADDEES_NOT_STAKED, payload: !staked });
            if (staked) {
              return;
            }
          })
          .catch(e => {
            console.error(e);
            setIsLoading(isLoading => isLoading - 2);
          });
      })
      .catch(e => {
        setIsLoading(isLoading => isLoading - 4);
      });
  }, []);

  useEffect(() => {
    if (account && provider && stakingContract) {

      thisWorks(account, provider, stakingContract);
    }
  }, [account, provider, stakingContract, thisWorks]);

  const { prerequisites, staking } = state;

  if (isLoading <= 0 || !acc.loggedIn) {
    return (
      <Formik
        initialValues={{
          checkedConnected: acc.loggedIn,
          checkedSjBalance: prerequisites.sjBalance && acc.loggedIn,
          checkedEthBalance: prerequisites.ethBalance && acc.loggedIn,
          checkedTermsAndConditions: false,
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          checkedConnected: Yup.boolean().oneOf([true], 'Must connect a wallet'),
          checkedSjBalance: Yup.boolean().oneOf([true], 'Must have SJ in your wallet'),
          checkedEthBalance: Yup.boolean().oneOf(
            [true],
            `Must have ${state?.sjInfo?.tokenSymbol} in your wallet`
          ),
          checkedTermsAndConditions: Yup.boolean().oneOf(
            [true],
            'Pleace accept the Terms and Conditions'
          ),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setStatus({ success: true });
            setSubmitting(true);

            if (onNext) {
              onNext();
            }
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleSubmit,
          isSubmitting,
          values,
        }) => (
          <form onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest}>
            <Typography variant="h3" color="textPrimary">
              Prerequisites
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle1" color="textSecondary">
                In order to move to the next step, we are automatically checking that the following
                conditions are met:
              </Typography>
            </Box>
            <Box mt={2}>
              <Box className={classes.typeOption} elevation={10}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>

                  <Box
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "white",
                      border: "1px solid #010000",
                      borderRadius: "7px",
                      boxShadow: "3px 3px 0 0 rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {values.checkedConnected ? (
                      <Check style={{ color: "#4caf50", width: "24px", height: "24px" }} />
                    ) : (
                      <X style={{ color: "#f44336", width: "24px", height: "24px" }} />
                    )}
                  </Box>
                </div >
                <Box ml={2}>
                  {acc.loggedIn ? (
                    <Typography gutterBottom variant="h5" color="textPrimary">
                      {formatConnectorName()} Connected
                    </Typography>
                  ) : (
                    <Typography gutterBottom variant="h5" color="textPrimary">
                      Please connect to a wallet
                    </Typography>
                  )}
                  <Typography variant="body1" color="textPrimary">
                    If not connected, Make sure to connect your Wallet!
                  </Typography>
                </Box>
              </Box>
              <Box className={classes.typeOption} elevation={10}>
                <Box
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "white",
                    border: "1px solid #010000",
                    borderRadius: "7px",
                    boxShadow: "3px 3px 0 0 rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {values.checkedSjBalance ? (
                    <Check style={{ color: "#4caf50", width: "24px", height: "24px" }} />
                  ) : (
                    <X style={{ color: "#f44336", width: "24px", height: "24px" }} />
                  )}
                </Box>

                <Box ml={2}>
                  <Typography gutterBottom variant="h5" color="textPrimary">
                    Balance {acc.loggedIn ? staking.sjBalance.toLocaleString('en') : '0'}
                  </Typography>
                  <Typography variant="body1" color="textPrimary">
                    Your current SJ balance in your wallet
                  </Typography>
                </Box>
              </Box>
              <Box className={classes.typeOption} elevation={10}>
                <Box
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "white",
                    border: "1px solid #010000",
                    borderRadius: "7px",
                    boxShadow: "3px 3px 0 0 rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {values.checkedEthBalance ? (
                    <Check style={{ color: "#4caf50", width: "24px", height: "24px" }} />
                  ) : (
                    <X style={{ color: "#f44336", width: "24px", height: "24px" }} />
                  )}
                </Box>

                <Box ml={2}>
                  <Typography gutterBottom variant="h5" color="textPrimary">
                    {state?.sjInfo?.tokenSymbol} {"Balance > 0"}
                  </Typography>
                  <Typography variant="body1" color="textPrimary">
                    Only required for transaction fees
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box alignItems="center" display="flex" mt={2} ml={-1}>
              <Field component={Checkbox} type="checkbox" name="checkedTermsAndConditions" />{' '}
              <TermsAndConditions />
            </Box>
            {errors.checkedTermsAndConditions && (
              <Box mt={2}>
                <FormHelperText error>{errors.checkedTermsAndConditions}</FormHelperText>
              </Box>
            )}
            <Box mt={6} display="flex">
              {/* <Button id="prerequirementsBack" size="large">
                Previous
              </Button> */}
              <Box flexGrow={1} />
              <Button
                id="prerequirementsNext"
            
                disabled={
                  isSubmitting ||
                  !acc.loggedIn ||
                  !values.checkedSjBalance ||
                  !values.checkedEthBalance ||
                  !values.checkedTermsAndConditions
                }
                style={{backgroundColor: "#D4A674"}}
                type="submit"
                variant="contained"
                size="large"
              >
                Next
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    );
  } else {
    return (
      <Box className={classes.root} {...rest}>
        <Box mt={2} mb={2}>
          <LoadingScreen width={mobileDevice ? 200 : 400} />
        </Box>
        <Box justifyContent="center" display="flex">
          <Typography variant="h3" color="textPrimary">
            Fetching account details
          </Typography>
        </Box>
      </Box>
    );
  }
};

Prerequisites.propTypes = {
  className: PropTypes.string,
  onNext: PropTypes.func,
};

Prerequisites.defaultProps = {
  onNext: () => { },
};

export default Prerequisites;
