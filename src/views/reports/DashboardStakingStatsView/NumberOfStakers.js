/* eslint-disable no-undef */
import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, Hidden, Typography, makeStyles } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/PeopleAlt';
import NumberFormat from 'react-number-format';
import { isMobile } from 'react-device-detect';
import { filteredStakersList } from '../../../utils/helpers';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius:"7px",
    padding: isMobile ? theme.spacing(2) : theme.spacing(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    border: "2px solid #000000",
    borderColor: "rgb(1, 0, 0)",
    boxShadow:" 0 0 #0000, 0 0 #0000, 5px 5px 0 0 #00000026"
  },
  label: {
    marginLeft: theme.spacing(1),
  },
  avatar: {
    background: "#D4A674",
    color: theme.palette.secondary.contrastText,
    height: 48,
    width: 48,
  },
}));


const NumberOfStakers = ({ stakers, className, ...rest }) => {
  const classes = useStyles();
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Typography style={{fontSize:"18px"}} color="#000">
          {'Number of Stakers'}
        </Typography>
      <Box display="flex"  flexGrow={1}>
      <Hidden mdDown>
        <Avatar style={{ marginRight : " 30px "}} className={classes.avatar}>
          <PeopleIcon />
        </Avatar>
      </Hidden>
        
        <Box  style={{ fontFamily: "Comic Neue"}} display="flex" alignItems="center" flexWrap="wrap">
          <Typography variant='h4' style={{ fontFamily: "Comic Neue"}}  color="textPrimary">
            <NumberFormat style={{ fontFamily: "Comic Neue"}}
              value={stakers || 0}
              displayType={'text'}
              thousandSeparator={true}
            />
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

NumberOfStakers.propTypes = {
  className: PropTypes.string,
};

export default NumberOfStakers;
