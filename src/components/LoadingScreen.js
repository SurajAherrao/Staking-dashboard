import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import { THEMES } from '../constants';
import { Box, LinearProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    ...(theme.name === THEMES.LIGHT
      ? {
          backgroundColor: theme.palette.background.paper,
        }
      : {
          backgroundColor: theme.palette.background.default,
        }),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    minHeight: '100%',
    padding: theme.spacing(3),
    '& .MuiLinearProgress-colorPrimary': {
      backgroundColor: 'rgb(43, 46, 123)',
      ...(theme.name === THEMES.LIGHT
        ? {
            backgroundColor: 'rgb(190, 193, 251)',
          }
        : {
            backgroundColor: 'rgb(43, 46, 123)',
          }),
    },
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: '#565df6',
    },
  },
}));

const LoadingScreen = ({ width = 200 }) => {
  const classes = useStyles();

  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className={classes.root}>
      <Box width={width}>
        <LinearProgress />
      </Box>
    </div>
  );
};

export default LoadingScreen;
