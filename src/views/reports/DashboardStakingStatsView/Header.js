import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Typography,
  makeStyles
} from '@material-ui/core';
import WalletSelector from '../../../components/WalletSelector/WalletSelector';
import { MiniKit } from '@worldcoin/minikit-js';


const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    background: '#fff',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '7px',
    border: '2px solid #000000',
    borderColor: 'rgb(1, 0, 0)',
    padding: '16px',
    boxShadow: '0 0 #0000, 0 0 #0000, 5px 5px 0 0 #00000026'
  },
  Breadcrumbs: {
    marginTop: '8px'
  },
  Typography: {
    background: '#fff',
    width: '100%',
    borderRadius: '7px',
    margin: '0vh 0vh 2vh',
    border: '2px solid #000000',
    borderColor: 'rgb(1, 0, 0)',
    padding: '16px',
    boxShadow: '0 0 #0000, 0 0 #0000, 5px 5px 0 0 #00000026'
  }
}));

const headers = {
  "": 'Staking Dashboard',
  'staking-stats': 'Staking Dashboard',
  'stake': 'Stake',
  'withdrawStake': 'Withdraw Stakes',
  'withdrawRewards': 'Withdraw Rewards',
  'leaderboard': 'Leaderboard'
};

const Header = ({ className, path, ...rest }) => {
  const classes = useStyles();

  return (
    <Box
      container
      spacing={3}
      justifyContent="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box style={{ width: '100%' }} item>
        <Typography variant="h3">
          {headers[path]}
        </Typography>
      </Box>
      {
        !MiniKit.isInstalled() ? (
          <Box ml={2}>
            <WalletSelector />
          </Box>
        ) : (<></>)}
    </Box>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
