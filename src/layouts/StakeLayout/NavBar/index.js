/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  BarChart,
  Grid,
} from 'react-feather';
import Logo from '../../../components/Logo';
import NavItem from './NavItem';
import NumberFormat from 'react-number-format';
import { useSelector, useDispatch } from '../../../store';
import { setRewards, setStake } from '../../../slices/account';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useStakingContract } from '../../../context/StakingContract';
import WalletSelector from '../../../components/WalletSelector/WalletSelector';
import SideBar from '../SideBar';

const sections = [
  {
    subheader: 'Dashboard',
    items: [
      {
        title: 'Staking Stats',
        icon: Grid,
        href: '/app/staking-stats',
      },
      {
        title: 'Leaderboard',
        icon: BarChart,
        href: '/app/leaderboard',
      },
    ],
  },
];


function renderNavItems({ items, pathname, depth = 0 }) {
  return (
    <List disablePadding>
      {items.reduce((acc, item) => reduceChildRoutes({ acc, item, pathname, depth }), [])}
    </List>
  );
}

function reduceChildRoutes({ acc, pathname, item, depth }) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false,
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items,
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        info={item.info}
        key={key}
        title={item.title}
      />
    );
  }

  return acc;
}

const useStyles = makeStyles(theme => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
  card: {
    backgroundColor: theme.palette.background.dark,
  },
  logoBg: {
    backgroundColor: theme.palette.background.default,
  },
  networkButtonBox: {
    marginTop: '1px',
    display: 'flex',
  },
  networkButton: {
    borderRadius: 0,
  },
  logo: {
    width: '24px',
    height: '24px',
    marginRight: theme.spacing(1),
  },
  button: {
    '&:hover': {
      background: "#daeaff",
      color: "#546e7a"
    },
    background: "#D4A674",
    color: "white",
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightRegular,
    '&.depth-0': {
      '& $title': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
  }
}));

const NavBar = ({ onMobileClose, openMobile, ...rest }) => {
  const classes = useStyles();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const { stakingContract } = useStakingContract();
  const { account } = useWeb3React();
  const acc = useSelector(state => state.account);
  const dispatch = useDispatch();

  useEffect(() => {
    if (stakingContract && account) {
      const getStakingInfo = account => {
        stakingContract
          .getStakeDeposits(account)
          .then(res => {
            const stakedAmount = ethers.utils.formatEther(res.initialDeposit);
            const rewards = ethers.utils.formatEther(res.rewards);

            dispatch(setStake(stakedAmount));
            dispatch(setRewards(rewards));
          })
          .catch(err => {
            console.warn('error in checking is withdram init', err);
          });
      };
      getStakingInfo(account);
    }
  }, [stakingContract, account, location.pathname]);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Hidden lgUp>
          <Box className={classes.logoBg} p={2} display="flex" justifyContent="center">
            <RouterLink to="/">
              <h2>STAKERS</h2>
            </RouterLink>
          </Box>
        </Hidden>
        <Box ml={2}>
          <WalletSelector />
        </Box>
        <Box p={2}>
          {sections.map(section => (
            <div>
              <List
                key={section.subheader}
              >
                {renderNavItems({
                  items: section.items,
                  pathname: location.pathname,
                  classes: classes
                })}
              </List>
            </div>
          ))}
        </Box>
        <Divider />
        <Box p={2}>
          <Typography display="inline" variant="body2" style={{ color: "black" }}>
            Staked: &nbsp;
          </Typography>
          <Typography display="inline" variant="body1" color="secondary">
            <NumberFormat
              value={acc.loggedIn && (acc.stake > 0) ? Math.round(acc.stake * 10) / 10 : 0}
              displayType={'text'}
              thousandSeparator={true}
            />
          </Typography>
        </Box>
        <Box style={{ paddingBottom: "10px" }}>
          <div style={{ margin: "0px 10px" }}>
            <Button
              className={classes.button}
              component={RouterLink}
              to="/app/stake"
              fullWidth
            >
              {acc.loggedIn && acc.stake > 0 ? 'Stake More' : 'Stake'}
            </Button>
          </div>
          <div style={{ margin: "0px 10px" }}>
            {acc.loggedIn && acc.stake > 0 && (
              <Box justifyContent="center" display="flex" mt={2} >
                <Button
                  className={classes.button}
                  component={RouterLink}
                  to="/app/withdrawStake"
                  fullWidth
                >
                  Withdraw
                </Button>
              </Box>
            )}
          </div>
        </Box>
        <Divider />
        <Box p={2}>
          <Typography display="inline" variant="body2" style={{ color: "black" }}>
            Rewards: &nbsp;
          </Typography>
        </Box>
        <Box>
          <div style={{ margin: "0px 10px" }}>

            {acc.loggedIn && (
              <Box justifyContent="center" display="flex" mt={1} >
                <Button
                  className={classes.button}
                  component={RouterLink}
                  to="/app/withdrawRewards"
                  fullWidth
                >
                  Withdraw
                </Button>
              </Box>
            )}
          </div>
        </Box>
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          <SideBar/>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer anchor="left" classes={{ paper: classes.desktopDrawer }} open variant="persistent">
          <SideBar/>
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default NavBar;
