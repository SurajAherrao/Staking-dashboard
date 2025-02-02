import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Breadcrumbs, Grid, Link, Typography, makeStyles } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles(() => ({
  root: {},
}));

const Header = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      justifyContent="space-between"  
      spacing={3}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs style={{marginTop:"8px"}}  separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link variant="body1" color="inherit" to="/app/staking-stats" component={RouterLink}>
            Dashboard
          </Link>
          <Typography variant="body1" color="textPrimary">
            Personal Stats
          </Typography>
        </Breadcrumbs>
        <Typography style={{background: "#D4A674", margin:" 2vh 0vh",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}} variant="h3" color="textPrimary">
          Your SJ Statistics
        </Typography>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

Header.defaultProps = {};

export default Header;
