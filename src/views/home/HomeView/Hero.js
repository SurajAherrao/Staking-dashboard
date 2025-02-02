import React, { useEffect, useState, useCallback } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { THEMES } from '../../../constants';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  makeStyles,
} from '@material-ui/core';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { useDispatch } from '../../../store';
import { setStakingInfo } from '../../../slices/stakingInfo';
import { useWeb3React } from '@web3-react/core';
import { useStakingContract } from '../../../context/StakingContract';
import { GET_STAKERS_DEPOSIT_TX } from '../../../graphql/Queries';
import { ethClient, maticClient } from '../../../graphql/client';
import { useQuery } from '@apollo/client';
import { filteredStakersList } from '../../../utils/helpers';
import StakingContract from '../../../context/StakingContract/StakingContract';
import { POOL_MAX_CAP } from '../../../config/constants';

const useStyles = makeStyles(theme => ({
  root: {
    background: "#D4A674",
    paddingTop: 100,
    paddingBottom: 200,
    minHeight: '100%',
    [theme.breakpoints.down('md')]: {
      paddingTop: 60,
      paddingBottom: 60,
    },
  },
  card: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: "white",
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  technologyIcon: {
    height: 40,
    margin: theme.spacing(1),
  },
  image: {
    perspectiveOrigin: 'left center',
    transformStyle: 'preserve-3d',
    perspective: 1500,
    '& > img': {
      maxWidth: '90%',
      height: 'auto',
      transform: 'rotateY(-35deg) rotateX(15deg)',
      backfaceVisibility: 'hidden',
      boxShadow: theme.shadows[16],
    },
  },
  shape: {
    position: 'absolute',
    top: 0,
    left: 0,
    '& > img': {
      maxWidth: '90%',
      height: 'auto',
    },
  },
  button: {
    color: theme.palette.text.secondary,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
  },
}));

const initStakingInfo = {
  stakers: 0,
  stakedAmount: 0,
  poolFilled: 0,
  totalBurned: 3189,
};

const Hero = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const [stakingInfoEthereum, setStakingInfoEthereum] = useState(initStakingInfo);
  const [stakingInfoMatic, setStakingInfoMatic] = useState(initStakingInfo);
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const { chainId } = useWeb3React();
  const { stakingContract } = useStakingContract();
  const { data: currentStakerData, error } = useQuery(GET_STAKERS_DEPOSIT_TX);

  if (error) {
    console.error('error encountered during fetching staker deposit tx at Hero:', error);
  }

  const getStakers = useCallback(async () => {
    try {
      const stakingContractEthereum = StakingContract.stakingContractEthereum();
      const stakingContractMatic = StakingContract.stakingContractMatic();

      if (isMountedRef.current) {
        stakingContractMatic.currentTotalStake().then(async result => {
          try {
            const { data: maticGraphData } = await maticClient
              .query({
                query: GET_STAKERS_DEPOSIT_TX,
              })
              .catch(err => {});

            const stakingInfo = {
              stakers: 0,
              stakedAmount: 0,
              poolFilled: 0,
              totalBurned: 3189,
            };
            const stakedAmount = Math.round(result / 10 ** 18);
            stakingInfo.stakedAmount = stakedAmount;
            stakingInfo.poolFilled = Math.round((stakedAmount / POOL_MAX_CAP) * 100);
            stakingInfo.stakers = filteredStakersList(maticGraphData).length;
            setStakingInfoMatic(stakingInfo);
          } catch (err) {
            console.log("🚀 ~ file: Hero.js:135 ~ stakingContractMatic.currentTotalStake ~ err:", err)
          }
        });
        stakingContractEthereum.currentTotalStake().then(async result => {
          try {
            const { data: stakeDepositedData } = await ethClient.query({
              query: GET_STAKERS_DEPOSIT_TX,
            });
            const stakingInfo = {
              stakers: 0,
              stakedAmount: 0,
              poolFilled: 0,
              totalBurned: 3189,
            };
            const stakedAmount = Math.round(result / 10 ** 18);
            stakingInfo.stakedAmount = stakedAmount;
            stakingInfo.poolFilled = Math.round((stakedAmount / POOL_MAX_CAP) * 100);
            stakingInfo.stakers = filteredStakersList(stakeDepositedData).length;
            setStakingInfoEthereum(stakingInfo);
          } catch (err) {
            console.log("🚀 ~ file: Hero.js:156 ~ stakingContractEthereum.currentTotalStake ~ err:", err)
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getStakers();
  }, [getStakers, chainId]);

  useEffect(() => {
    const setStakingInfoFunc = async () => {
      try {
        const result = await stakingContract.currentTotalStake();
        const stakingInfo = {
          stakers: 0,
          stakedAmount: 0,
          poolFilled: 0,
          totalBurned: 3189,
        };
        const stakedAmount = Math.round(result / 10 ** 18);
        stakingInfo.stakedAmount = stakedAmount;
        stakingInfo.poolFilled = Math.round((stakedAmount / POOL_MAX_CAP) * 100);
        stakingInfo.stakers = filteredStakersList(currentStakerData).length;
        dispatch(setStakingInfo(stakingInfo));
      } catch (err) {}
    };

    setStakingInfoFunc();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      {mobileDevice ? (
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
                <Typography variant="overline" color="secondary">
                  Introducing
                </Typography>
                <Typography variant="h1" color="textPrimary">
                  SJ - Dashboard
                </Typography>
                <Box mt={4} bt={4}>
                  <div className={classes.image}>
                    <img
                      alt="Presentation"
                      src={
                        theme.name === THEMES.LIGHT
                          ? '/static/home/light.png'
                          : '/static/home/dark.png'
                      }
                    />
                  </div>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" color="textSecondary">
                    SJ is blockchain-based survey platform employs the World ID verification mechanism to ensure the authenticity of survey participants. By integrating World ID verification, we establish a trust layer that verifies the human identity of participants, mitigating the risk of fake or duplicate responses. This ensures the integrity and reliability of the survey data, instilling confidence in the generated insights.
                  </Typography>
                </Box>
                <Card className={classes.card}>
                  <Box flexGrow={1}>
                    <Typography color="primary" component="h3" gutterBottom variant="overline">
                      Ethereum
                    </Typography>
                    <Box display="flex" alignItems="center" flexWrap="wrap">
                      <Box>
                        <Grid container spacing={3}>
                          <Grid item>
                            <Typography variant="h1" color="secondary">
                              {stakingInfoEthereum.poolFilled}%
                            </Typography>
                            <Typography variant="overline" color="textSecondary">
                              Staked
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h1" color="secondary">
                              {stakingInfoEthereum.stakers}+
                            </Typography>
                            <Typography variant="overline" color="textSecondary">
                              Stakers
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Box>
                </Card>
                <Card className={classes.card}>
                  <Box flexGrow={1}>
                    <Typography color="primary" component="h3" gutterBottom variant="overline">
                      Matic
                    </Typography>
                    <Box display="flex" alignItems="center" flexWrap="wrap">
                      <Box>
                        <Grid container spacing={3}>
                          <Grid item>
                            <Typography variant="h1" color="secondary">
                              {stakingInfoMatic.poolFilled}%
                            </Typography>
                            <Typography variant="overline" color="textSecondary">
                              Staked
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h1" color="secondary">
                              {stakingInfoMatic.stakers}+
                            </Typography>
                            <Typography variant="overline" color="textSecondary">
                              Stakers
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Box>
                </Card>
                <Box mt={3}>
                  <Button
                    id="dashboard"
                    color="secondary"
                    variant="contained"
                    component={RouterLink}
                    size="medium"
                    to="/app/staking-stats"
                  >
                    DASHBOARD
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} >
              <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
                <Typography variant="overline" style={{ display:"flex",justifyContent:"center",color:"white",marginBottom:"60px" }} color="secondary">
                  Introducing
                </Typography>
                <Typography variant="h1" style={{justifyContent:"center", display:"flex",color:"white",margin:"20px"}} color="textPrimary">
                  SJ - Dashboard
                </Typography>
                <Box mt={3} style={{display:"flex",justifyContent:"center",textAlign:"center",margin:"20px"}}>
                  <Typography variant="body1" style={{width:"800px",color:"white"}} color="textSecondary">
                    SJ is blockchain-based survey platform employs the World ID verification mechanism to ensure the authenticity of survey participants. By integrating World ID verification, we establish a trust layer that verifies the human identity of participants, mitigating the risk of fake or duplicate responses.
                  </Typography>
                </Box>
                <div style={{display:"flex",justifyContent:"center"}}>
                <Grid justifyContent='center' style={{margin:"20px"}}  container spacing={3}>
                  <Grid item xs={3}>
                    <Card className={classes.card}>
                      <Box flexGrow={1}>
                        <Typography style={{color:"black"}} component="h2" gutterBottom variant="overline">
                          Ethereum
                        </Typography>
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                          <Box>
                            <Grid container spacing={3}>
                              <Grid item>
                                <Typography variant="h1" color="secondary">
                                  {stakingInfoEthereum.poolFilled}%
                                </Typography>
                                <Typography variant="overline" color="textSecondary">
                                  Staked
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography variant="h1" color="secondary">
                                  {stakingInfoEthereum.stakers}+
                                </Typography>
                                <Typography variant="overline" color="textSecondary">
                                  Stakers
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card className={classes.card}>
                      <Box flexGrow={1}>
                        <Typography style={{color:"black"}}  component="h2" gutterBottom variant="overline">
                          Matic
                        </Typography>
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                          <Box>
                            <Grid container spacing={3}>
                              <Grid item>
                                <Typography variant="h1" color="secondary">
                                  {stakingInfoMatic.poolFilled}%
                                </Typography>
                                <Typography variant="overline" color="textSecondary">
                                  Staked
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography variant="h1" color="secondary">
                                  {stakingInfoMatic.stakers}+
                                </Typography>
                                <Typography variant="overline" color="textSecondary">
                                  Stakers
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
                </div>
                <Box style={{display:"flex",justifyContent:"center"}} >

                <Box  mt={3}>
                  <Button
                    id="dashboardMobile"
                    style={{color:"white",borderColor:"white"}}
                    variant="outlined"
                    component={RouterLink}
                    size="medium"
                    to="/app/staking-stats"
                  >
                   ENTER DASHBOARD  
                  </Button>
                </Box>
                    </Box>
              </Box>
            </Grid>
           
          </Grid>
        </Container>
      )}
    </div>
  );
};

Hero.propTypes = {
  className: PropTypes.string,
};

export default Hero;
