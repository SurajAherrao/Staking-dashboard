import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, Hidden, Typography, makeStyles } from '@material-ui/core';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import GradeIcon from '@material-ui/icons/Grade';
const useStyles = makeStyles(theme => ({
  root: {
    color: "white",
    padding: "20px 16px",
    alignItems: 'center',
    justifyContent: 'space-between',
    background: "#f8f8f8",
    borderRadius: "10px",
  },
  avatar: {
    background: "#D4A674",
    color: theme.palette.secondary.contrastText,
    height: 36,
    width: 36,
  },
}));

const Rewards = ({ className, rewards, matic, weth, login, ...rest }) => {
  const classes = useStyles();

  return (
    <Card elevation={0} className={clsx(classes.root, className)} {...rest}>
      <Typography component="h3" gutterBottom variant="overline" color="textSecondary">
        {matic ? weth ? `Weth Rewards in Polygon` : `Sj Rewards in Polygon` : weth ? `Eth Rewards ` : `Sj Rewards`}
      </Typography>
      <Box display="flex" flexGrow={1}>
        <Hidden mdDown>
          <Avatar style={{ marginRight: "18px " }} className={classes.avatar}>
            <GradeIcon />

          </Avatar>
        </Hidden>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          {
            login ?
              <div style={{ display: "flex" }}>
                <Typography variant="h3" color="textPrimary">
                  {parseFloat(rewards).toFixed(2)}
                  {/* <NumberFormat
              value={Math.round(rewards * 100) / 100}
              displayType={'text'}
              thousandSeparator={true}
            />  */}
                </Typography>
                <Typography style={{ marginLeft: "2px" }} variant="h3" color="textPrimary">
                  {weth ? "WETH" : "SJ"}
                </Typography>
              </div> :
              <div style={{ display: "flex" }}>
                <Typography variant="h3" color="textPrimary">
                  {"--"}
                </Typography>
                <Typography style={{ marginLeft: "2px" }} variant="h3" color="textPrimary">
                  {weth ? "WETH" : "SJ"}
                </Typography>
              </div>
          }
        </Box>
      </Box>
    </Card>
  );
};

Rewards.propTypes = {
  className: PropTypes.string,
};

export default Rewards;
