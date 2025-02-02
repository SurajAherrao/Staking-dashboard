/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { useWeb3React } from '@web3-react/core';
import { useStakingContract } from '../../../context/StakingContract';
import { SJ_NETWORK, SupportedNetworks } from '../../../config/constants';
import { convertLongStrToShort } from '../../../utils/helpers';
import { useQuery } from '@apollo/client';
import { GET_REWARDS_DISTRIBUTED } from '../../../graphql/Queries';

const currentNetwork = {
  eth : "ethereum",
  matic : "matic",
  op : "optimism"
}


const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: "7px",
    display: 'flex',
    flexDirection: 'column',
    height: "100%",
    border: "2px solid #000000",
    borderColor: "rgb(1, 0, 0)",
    boxShadow:" 0 0 #0000, 0 0 #0000, 5px 5px 0 0 #00000026"
  },
  avatar: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.common.white,
  },
  cardhead: { background: "#D4A674", color: "#fff", borderRadius: "10px", },
  sjRewardsSec: { margin: "17px 0px", paddingTop: "12px", paddingBottom: "11px", background: "#f8f8f8", borderRadius: "10px" },
  ethRewardsSec: { width: "100%", margin: "17px 0px", paddingTop: "12px", paddingBottom: "11px", background: "#f8f8f8", borderRadius: "10px" },
  addressSec: { margin: "17px 0px", paddingTop: "12px", paddingBottom: "12px", background: "#f8f8f8", borderRadius: "10px" },
  totalSupplySec: { margin: "17px 0px", paddingTop: "12px", paddingBottom: "12px", background: "#f8f8f8", borderRadius: "10px" }
}));

function sumRewardsByToken(arrayOfObjects, targetToken) {
  let sum = BigInt(0);

  for (const obj of arrayOfObjects) {
    if (obj._rewardsToken === targetToken) {
      sum += BigInt(obj.reward);
    }
  }

  return parseFloat(Number(sum) / 10 ** 18).toFixed(2);
}

const ContractInfo = ({ className, ...rest }) => {
  const classes = useStyles();
  const [totalWethRewards, setTotalWethRewards] = useState(0);
  const [totalSjRewards, setTotalSjRewards] = useState(0);
  const { chainId } = useWeb3React();
  const { stakingContract } = useStakingContract();
  const [network, setNetwork] = React.useState('');

  const [totalSupply, setTotalSupply] = useState(0);
  const { data: rewardData, error } = useQuery(GET_REWARDS_DISTRIBUTED);
  console.log("🚀 ~ file: ContractInfo.js:74 ~ ContractInfo ~ rewardData:", rewardData)

  if (error) {
    console.error("Error while fetching the reward data")
  }

  useEffect(() => {
    if (rewardData && network) {
      const rewards = rewardData?.rewardAddeds ? rewardData?.rewardAddeds : []
      const wethRewards = sumRewardsByToken(rewards, SupportedNetworks[currentNetwork[network]].WethAddress.toLowerCase())
      setTotalWethRewards(wethRewards)
      const sjRewards = sumRewardsByToken(rewards, SupportedNetworks[currentNetwork[network]].SjTokenAddress.toLowerCase())
      setTotalSjRewards(sjRewards)
    }

  }, [rewardData,network])

  useEffect(() => {
    if (stakingContract) {
      stakingContract.totalSupply().then(res => {
        return res
      })
    }
  }, [stakingContract])

  useEffect(() => {
    if (chainId === SupportedNetworks.matic.chainID) {
      setNetwork("matic")
    }
    else if (chainId === SupportedNetworks.ethereum.chainID) {
      setNetwork("eth")
    }
    else if (chainId === SupportedNetworks.optimism.chainID) {
      setNetwork("op")
    }
  }, [chainId])

  // latest block timestamp for reward distributed

  const getContractInfo = useCallback(
    async stakingContract => {
      try {


        let totalSupply = await stakingContract.totalSupply();

        setTotalSupply(totalSupply);

      } catch (err) {
        console.error(err);
      }
    },
    [chainId]
  );



  useEffect(() => {
    if (stakingContract) {
      getContractInfo(stakingContract);
    }
  }, [getContractInfo, stakingContract]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Typography color="textPrimary" style={{padding:"16px"}} component="h1" gutterBottom variant='h3' >
      Staking Contract Info
      </Typography>
      <div style={{paddingLeft:"16px", paddingRight:"16px"}}>

      <hr style={{borderBottomWidth: "1px",borderColor: "#000000", width:"100%"}} />
      </div>

      <List style={{ padding: "10px 15px" }} disablePadding>
        <ListItem key={'Total SJ Rewards'} className={classes.sjRewardsSec}>
          <div style={{ width: "100%" }}>

            <ListItemText primary={'Total SJ Rewards'} primaryTypographyProps={{ variant: 'h4' }} />
            <div style={{ display: "flex", }}>

              <Typography variant="body1" color="textSecondary">
                {parseFloat(totalSjRewards).toFixed(2)}
                {/* <NumberFormat value={totalSjRewards} displayType={'text'} thousandSeparator={true} />{' '} */}
              </Typography>
              <Typography style={{ paddingLeft: "2px" }} variant="body1" color="textSecondary">SJ</Typography>
            </div>
          </div>
        </ListItem>
        <ListItem key={'Total ETH Rewards'} className={classes.ethRewardsSec}>
          <div style={{ width: "100%" }}>

            <ListItemText primary={'Total ETH Rewards'} primaryTypographyProps={{ variant: 'h4' }} />
            <div style={{ display: "flex", }}>

              <Typography variant="body1" color="textSecondary">
                {/* <NumberFormat value={totalWethRewards} displayType={'text'} thousandSeparator={true} />{' '} */}
                {parseFloat(totalWethRewards).toFixed(2)}

              </Typography>
              <Typography style={{ paddingLeft: "2px" }} variant="body1" color="textSecondary">WETH</Typography>
            </div>
          </div>
        </ListItem>

        <ListItem key={'Address'} className={classes.addressSec}>
          <div style={{ width: "100%" }}>

            <ListItemText primary={'Staking Contract Address'} primaryTypographyProps={{ variant: 'h4' }} />
            <div style={{ display: "flex", }}>

              <Typography variant="body1" color="textSecondary">
                <Link
                  component="a"
                  color="inherit"
                  underline="always"
                  href={SJ_NETWORK[chainId]?.STAKING_ACC_EXP_URL}
                  target="_blank"
                >
                  {network === "WN" || !network
                    ? "Connect Network"
                    : convertLongStrToShort(SupportedNetworks[currentNetwork[network]].StakingAddress, 5, 4)}
                </Link>
              </Typography>
            </div>
          </div>
        </ListItem>
        <ListItem key={'totalSupply'} className={classes.totalSupplySec}>
          <div style={{ width: "100%" }}>

            <ListItemText primary={'Total Supply'} primaryTypographyProps={{ variant: 'h4' }} />
            <div style={{ display: "flex", }}>

              <Typography variant="body1" color="textSecondary">
                <NumberFormat value={totalSupply} displayType={'text'} thousandSeparator={true} /> SJ
              </Typography>
            </div>
          </div>
        </ListItem>

      </List>
    </Card>
  );
};

ContractInfo.propTypes = {
  className: PropTypes.string,
};

export default ContractInfo;
