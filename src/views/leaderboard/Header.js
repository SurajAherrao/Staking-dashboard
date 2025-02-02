import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {margin:"10px 0"},

}));

const Header = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      container
      justifyContent="start"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid item>
          <Typography style={{background: "#D4A674", margin:" 2vh 0vh",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}} variant="h3" color="textPrimary">
            Leaderboard
          </Typography>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
