import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, Hidden, Typography, makeStyles } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Label from '../../../../components/Label';
import { useDispatch, useSelector } from '../../../../store';
import { setPrice } from '../../../../slices/price';
import { isMobile } from 'react-device-detect';
import CoinGecko from 'coingecko-api';

const useStyles = makeStyles(theme => ({
  root: {
  backgroundColor: "white",
    padding: isMobile ? theme.spacing(2) : theme.spacing(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: "7px",
    borderWidth: "2px",
    border: "2px solid #000000",
borderColor: "rgb(1, 0, 0)",
boxShadow:" 0 0 #0000, 0 0 #0000, 5px 5px 0 0 #00000026"
  },
avatar: {
  background: "#D4A674",
    color: theme.palette.secondary.contrastText,
      height: 48,
        width: 48,
  },
whiteBg: { 
  fontFamily: "Comic Neue",
  background: "white", borderRadius: "5px" }
}));

const getPriceInfo = async () => {
  try {
    const tokenList = ['chain-games'];
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenList.join(
        ','
      )}&vs_currencies=usd&include_24hr_change=true`
    );
    const data = await response.json();
    console.log(data['chain-games']);
    return data['chain-games'] 
  } catch (error) {
    console.error(`Can't get price of chain: ${error}`);
  }
};

const SjPrice = ({ className, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const price = useSelector(state => state.price);
  const currency = '$';

  useEffect(() => {
    getPriceInfo().then(price => {
      dispatch(setPrice(price));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // <Card className={clsx(classes.root, className)} {...rest}>
    <div className={classes.root} {...rest}>

      <Typography style={{fontSize:"16px"}}>
        SJ price
      </Typography>
      <Box display="flex" flexGrow={1}>
        <Hidden mdDown>
          <Avatar style={{ marginRight: " 30px " }} className={classes.avatar}>
            <AttachMoneyIcon />
          </Avatar>
        </Hidden>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <Typography className={classes.whiteBg} variant="h4" >
            {currency}

            {price.value}
          </Typography>
          {!isMobile && (
            <div className={classes.whiteBg} >
              <Label color={price.usd_24h_change > 0 ? 'success' : 'error'}>
                {price.usd_24h_change > 0 ? '+' : ''}
                {Math.round(price.usd_24h_change * 10) / 10}%
              </Label>
            </div>
          )}
        </Box>
      </Box>
          </div>
 
  );
};

SjPrice.propTypes = {
  className: PropTypes.string,
};

export default SjPrice;
