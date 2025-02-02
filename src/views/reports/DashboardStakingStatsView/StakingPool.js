import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Box, Card, LinearProgress, Typography, makeStyles } from '@material-ui/core';
import { isMobile } from 'react-device-detect';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius:"10px",
      padding: isMobile ? theme.spacing(2) : theme.spacing(3),
  },
  progress: {
    margin: theme.spacing(0, 1),
    flexGrow: 1,
  },
}));

const StakingPool = ({ className, prop, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Typography component="h3" gutterBottom variant="overline" color="textSecondary">
        {isMobile ? 'Pool filled' : 'Stakingpool filled'}
      </Typography>
      <Box display="flex" style={{padding:"10px 0px "}} alignItems="center" flexWrap="wrap">
        <Typography variant="h3" color="textPrimary">
          {prop}%
        </Typography>
        <LinearProgress
          className={classes.progress}
          value={prop}
          color="secondary"
          variant="determinate"
        />
      </Box>
    </Card>
  );
};

StakingPool.propTypes = {
  className: PropTypes.string,
};

export default StakingPool;
