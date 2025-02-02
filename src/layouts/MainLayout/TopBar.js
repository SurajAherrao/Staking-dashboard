import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { THEMES } from '../../constants';
import { AppBar, Box, Toolbar, Hidden, Typography, Link, makeStyles } from '@material-ui/core';
import Logo from '../../components/Logo';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
  toolbar: {
    height: 64,
  },
  logo: {
    marginRight: theme.spacing(2),
    marginLeft: 0
  },
  link: {
    fontWeight: theme.typography.fontWeightMedium,
    '& + &': {
      // marginLeft: theme.spacing(2),
    },
    ...(theme.name === THEMES.LIGHT
      ? {
          color: theme.palette.background.paper,
        }
      : {
          color: theme.palette.text.secondary,
        }),
  },
  divider: {
    width: 1,
    height: 32,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

const TopBar = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} color="default" {...rest}>
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/app/staking-stats">
          <h2>STAKERS</h2>
        </RouterLink>
        <Hidden mdDown>
          <Typography variant="caption" color="textSecondary"></Typography>
        </Hidden>
        <Box flexGrow={1} />
        <Link
          className={classes.link}
          component={RouterLink}
          to="/app/staking-stats"
          underline="none"
          variant="body2"
        >
          Dashboard
        </Link>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
};

export default TopBar;
