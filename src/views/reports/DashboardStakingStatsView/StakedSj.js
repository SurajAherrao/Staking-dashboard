import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, Hidden, Typography, makeStyles } from '@material-ui/core';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import NumberFormat from 'react-number-format';
import { isMobile } from 'react-device-detect';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius:"7px",
    color: theme.palette.secondary.contrastText,
    padding: isMobile ? theme.spacing(2) : theme.spacing(3),
    alignItems: 'center',
    justifyContent: 'space-between',
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
}));

const StakedSj = ({ className, prop, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
        <Typography style={{fontSize:"18px",color:"black"}} >
          Staked SJ
        </Typography>
      <Box display="flex"  flexGrow={1}>
        <Hidden mdDown>
        <Avatar style={{ marginRight : " 30px "}} className={classes.avatar} color="inherit">
          <FlashOnIcon />
        </Avatar>
      </Hidden>
        <Box  style={{ fontFamily: "Comic Neue"}} display="flex" alignItems="center" flexWrap="wrap">
          <Typography  style={{ fontFamily: "Comic Neue"}} color="textPrimary" variant="h4">
            <NumberFormat
             style={{ fontFamily: "Comic Neue"}} 
              value={Math.round(prop * 10) / 10}
              displayType={'text'}
              thousandSeparator={true}
            />
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

StakedSj.propTypes = {
  className: PropTypes.string,
};

export default StakedSj;
