import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
  TextField,
  Typography,
  makeStyles,
  Paper,
} from '@material-ui/core';

import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useStakingContract, useStakingDispatch } from '../../context/StakingContract';
import { SET_WITHDRAW_VALUE } from '../../context/StakingContract/actions';

const useStyles = makeStyles(theme => ({
  root: {},
  addTab: {
    marginLeft: theme.spacing(2),
  },
  sizedBox: {
    height: '296px',
  },
}));

const AmountToWithdraw = ({ onBack, onNext, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const { stakingContract } = useStakingContract();
  const dispatch = useStakingDispatch();
  const { account } = useWeb3React();

  const [stakedAmount, setStakedAmount] = useState(0);

  const getStakingInfo = useCallback(
    (account, stakingContract) => {
      stakingContract
        .getStakeDeposits(account)
        .then(res => {
          if (res === false) {
            setStakedAmount(0);
            return;
          }
          const stakedAmount = ethers.utils.formatEther(res.initialDeposit);

          setStakedAmount(stakedAmount);
        })
        .catch(err => {
          console.error('error in checking is withdram init', err);
        });
    },
    [dispatch]
  );

  useEffect(() => {
    if (account && stakingContract) {
      getStakingInfo(account, stakingContract);
    }
  }, [account, stakingContract]);

  return (
    <Formik
      initialValues={{
        amountToWithdraw: stakedAmount * 10 / 10,
      }}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({
        amountToWithdraw: Yup.number()
          .required('Required')
          .typeError('Amount to withdraw must be a Number')
          .positive('Amount to withdraw must be greater than 0')
          .min(1, 'The minimum withdraw is 1 SJ')
          .max(stakedAmount, `Your maximum withdraw is ${stakedAmount} SJ`),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          setSubmitting(true);
          setStatus({ success: true });

          dispatch({
            type: SET_WITHDRAW_VALUE,
            payload: parseInt(values.amountToWithdraw),
          });

          if (onNext) {
            onNext();
          }
        } catch (err) {
          console.error('error encounted during submittig AmountToWithdraw Form: ', err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        setFieldValue,
      }) => (
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
                How much do you want to withdraw?
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle1" color="textSecondary">
                  Please enter the amount of SJ you want to withdraw.
                </Typography>
              </Box>
              <Box mt={3}>
                <Paper>
                  <TextField
                    error={Boolean(touched.amountToWithdraw && errors.amountToWithdraw)}
                    fullWidth
                    helperText={touched.amountToWithdraw && errors.amountToWithdraw}
                    label="Amount to withdraw"
                    name="amountToWithdraw"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.amountToWithdraw}
                    variant="outlined"
                  />
                </Paper>
                {mobileDevice ? (
                  <Box>
                    <Box mt={1} display="flex">
                      <Box>
                        <Typography display="inline" variant="body2" color="textPrimary">
                        Total Staked:&nbsp;
                        </Typography>
                        <Typography display="inline" variant="body2" color="secondary">
                          {stakedAmount.toLocaleString('en')}
                        </Typography>
                      </Box>
                    </Box>

                    <Box mt={1} display="flex">
                      <Button
                        color="secondary"
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setFieldValue('amountToWithdraw', stakedAmount * 0.25);
                        }}
                      >
                        25%
                      </Button>
                      <Box ml={1}>
                        <Button
                          color="secondary"
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setFieldValue('amountToWithdraw', stakedAmount * 0.5);
                          }}
                        >
                          50%
                        </Button>
                      </Box>
                      <Box ml={1}>
                        <Button
                          color="secondary"
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setFieldValue('amountToWithdraw', stakedAmount);
                          }}
                        >
                          100%
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box mt={1} display="flex">
                    <Box>
                      <Typography display="inline" variant="body2" color="textPrimary">
                      Total Staked:&nbsp;
                      </Typography>
                      <Typography display="inline" variant="body2" color="secondary">
                        {stakedAmount.toLocaleString('en')}
                      </Typography>
                    </Box>

                    <Box flexGrow={1} />
                    <Button
                      color="secondary"
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setFieldValue('amountToWithdraw', stakedAmount * 0.25);
                      }}
                    >
                      25%
                    </Button>
                    <Box ml={1}>
                      <Button
                        color="secondary"
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setFieldValue('amountToWithdraw', stakedAmount * 0.5);
                        }}
                      >
                        50%
                      </Button>
                    </Box>
                    <Box ml={1}>
                      <Button
                        color="secondary"
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setFieldValue('amountToWithdraw', stakedAmount);
                        }}
                      >
                        100%
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item container direction="column" justifyContent="flex-end">
              <Box mt={6} display="flex">
                {onBack && (
                  <Button onClick={onBack} size="large">
                    Previous
                  </Button>
                )}
                <Box flexGrow={1} />
                <Button
                  color="secondary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  Next
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

AmountToWithdraw.propTypes = {
  className: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
};

AmountToWithdraw.defaultProps = {
  onNext: () => { },
  onBack: () => { },
};

export default AmountToWithdraw;
