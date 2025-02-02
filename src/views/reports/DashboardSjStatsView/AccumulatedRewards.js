import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  Hidden,
  SvgIcon,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import NumberFormat from 'react-number-format';
import { isMobile } from 'react-device-detect';
import { HelpCircle as HelpIcon } from 'react-feather';

const useStyles = makeStyles(theme => ({
  root: {
    padding:"20px 16px",
    alignItems: 'center',
    justifyContent: 'space-between',
    background:"#f8f8f8",
    borderRadius: "10px",
  },
  avatar: {
    background: "#D4A674",
    color: theme.palette.secondary.contrastText,
    height: 36,
    width: 36,
  },
  icon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.secondary.main,
  },
}));

const AccumulatedRewards = ({ className, accumulatedRewards, weth, login, ...rest }) => {
  const classes = useStyles();

  return (
    <Card elevation={0} className={clsx(classes.root, className)} {...rest}>
        <Typography component="h3" gutterBottom variant="overline" color="textSecondary">
          {weth?'Claimed ETH Rewards': 'Claimed SJ Rewards'}
          <Tooltip title="Total rewards claimed">
            <SvgIcon className={classes.icon} style={{width:"14px",height:"14px"}} >
              <HelpIcon />
            </SvgIcon>
          </Tooltip>
        </Typography>
      <Box display="flex"  flexGrow={1}>
      <Hidden mdDown>
        <Avatar style={{ marginRight : "18px "}} className={classes.avatar}>
          <EmojiEvents />
        </Avatar>
      </Hidden>
        <Box  display="flex" alignItems="center" flexWrap="wrap">
          <Typography variant="h3" color="textPrimary">
            {/* <NumberFormat
              value={accumulatedRewards ? Math.round(accumulatedRewards ) / 10 : 0} //check 
              displayType={'text'}
              thousandSeparator={true}
            />  */}
            {login? accumulatedRewards.toFixed(2): "--"}
          </Typography> 
          <Typography style={{marginLeft:"2px"}} variant="h3" color="textPrimary">{weth?`WETH`:`SJ`}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

AccumulatedRewards.propTypes = {
  className: PropTypes.string,
};

export default AccumulatedRewards;
