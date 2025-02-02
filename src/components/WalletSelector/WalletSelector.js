import React, { useState, useEffect, useCallback } from 'react';
import { useStakingContract } from '../../context/StakingContract/index';
import { coinbaseWallet, metamask } from '../connectors/connectors';
import { useWeb3React } from '@web3-react/core';
import { isMobile } from 'react-device-detect';
import StakingContract from '../../context/StakingContract/StakingContract';
import { convertLongStrToShort } from '../../utils/helpers';
import useConnectedWallet from '../../hooks/useConnectedWallet';
import PropTypes from 'prop-types';
import wait from '../../utils/wait';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { DEEPLINK } from '../../config/constants';
import { ChevronRight, CreditCard } from 'react-feather';
import CustomBorderComponent from '../../layouts/StakeLayout/CustomBorderComponent/index';
const useStyles = makeStyles(theme => ({
  root: {},
  img: {
    cursor: 'pointer',
    width: 32,
    height: 32,
    marginLeft: theme.spacing(2)
  },
  dialogTitle: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
  button: {
    borderRadius: 30,
    textTransform: 'none',
    padding: theme.spacing(1.5, 3),
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      borderColor: theme.palette.secondary.main,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4]
    },
  },
  activeWallet: {
    borderColor: theme.palette.secondary.main,
    borderRadius: 30,
    backgroundColor: theme.palette.background.paper,
  },
  rootStyle: {
    borderRadius: 20,
    backgroundColor: theme.palette.background.paper,
  },
  walletButton: {
    background: theme.palette.primary.main,
    padding: theme.spacing(1, 3),
    color: theme.palette.primary.contrastText,
    width:"100%",
  
  },
  borderWrapper: {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)',
    }
  },
  dialogContent: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
  },
  walletOption: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    borderRadius: 15,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    }
  }
}));

export const SUPPORTED_WALLETS = {
  METAMASK: {
    connector: metamask,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_LINK: {
    connector: coinbaseWallet,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5',
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    connector: null,
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: DEEPLINK.COINBASE,
    color: '#315CF5',
    mobile: true,
    mobileOnly: true,
  },
};

export default function WalletSelector() {
  const { stakingContract } = useStakingContract();
  const { account, provider, connector, isActive } = useWeb3React();
  const [connectedWallet, setConnectedWallet] = useConnectedWallet();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const classes = useStyles();


  const handleClickOpen = () => {
    if (isMobile && StakingContract.hasMetamask()) {
        tryActivation(metamask, true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = value => {
    setOpen(false);
    setSelectedValue(value);
  };

  const handleEveryConnection = () => {
    if (true) {
      if (isMobile && StakingContract.hasMetamask()) {
          tryActivation(metamask, true);
      } else {
        setOpen(true)
      }
    }

  }

  useEffect(() => {
    if (stakingContract) {
      stakingContract.setWeb3ReactProvider(provider);
    }
  }, [stakingContract, provider]);

  const tryActivation = useCallback(
    async (connector, skipSetConnectedWallet = false) => {
      if (!skipSetConnectedWallet) {
        Object.keys(SUPPORTED_WALLETS).map(key => {
          if (connector === SUPPORTED_WALLETS[key].connector) {
            setConnectedWallet(key);
            return false;
          }
          return true;
        });
      }

      await wait(1000); // ugly! Change it

      await connector
        .activate()
        .then(res => {
          setOpen(false);
        })
        .catch(async error => {
          console.log(`error: unsupported`, error);
        });
    },
    [setConnectedWallet]
  );

  useEffect(() => {
    handleEveryConnection()
  }, [])

  useEffect(() => {
    if (connectedWallet) {
      if (connectedWallet === 'METAMASK') {
        metamask.connectEagerly().catch(error => {
          console.error('Persistent connection error at metamask: ', error);
        });
      } else if (connectedWallet === 'WALLET_LINK' || connectedWallet === 'COINBASE_LINK') {
        coinbaseWallet.connectEagerly().catch(error => {
          console.error('Persistent connection error at coinbaseWallet: ', error);
        });
      }
    }
  }, [connectedWallet]);

  useEffect(() => {
    if (connectedWallet) {
    }
  }, [])

  useEffect(() => {
      if (isMobile && StakingContract.hasMetamask()) {
        metamask.connectEagerly().catch(error => {
          console.error('Persistent connection error at metamask: ', error);
        });
      }
  }, [connectedWallet]);

  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask;
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key];
      // check for mobile options
      if (isMobile) {
        if (!window.ethereum && option.mobile) {
          return key;
        }
        return null;
      }

      // overwrite injected when needed
      if (option.connector === metamask) {
        // don't show injected if there's no injected provider
        if (!window.ethereum) {
          return null;
        }

        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null;
        }
      }

      // return rest of options
      if (!isMobile && !option.mobileOnly) {
        return key;
      } else {
        return null;
      }
    });
  }

  function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = value => {
      tryActivation(SUPPORTED_WALLETS[value].connector);
      onClose(value);
    };

    const onDisconnect = () => {
      try {
        if (connector?.deactivate) {
          connector.deactivate();
          setConnectedWallet('');
        } else {
          connector.resetState();
          setConnectedWallet('');
        }
        handleClose(selectedValue);
      } catch (error) {
        console.error('error occured during deactivate wallet: ', error);
      }
    };

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        fullWidth
        maxWidth={'xs'}
        classes={{
          paper: classes.rootStyle
        }}
      >
        <DialogContent className={classes.dialogContent} dividers>
          <Box mb={4} textAlign="center">
            <Typography variant='h4' color="textPrimary">
              Connect Wallet
            </Typography>
          </Box>
          {getOptions().map(
            connectorObject =>
              connectorObject && (
                <Box
                  key={connectorObject}
                  className={`${classes.walletOption} ${isActive && SUPPORTED_WALLETS[connectorObject].connector === connector ? classes.activeWallet : ''
                    }`}
                >
                  <Button
                    id={connectorObject}
                    className={classes.button}
                    onClick={() => handleListItemClick(connectorObject)}
                    fullWidth
                    variant="outlined"
                    href={SUPPORTED_WALLETS[connectorObject].href}
                  >
                    <Typography variant="body1" color="textPrimary">
                      {SUPPORTED_WALLETS[connectorObject].name}
                    </Typography>
                    <Box flexGrow={1} />
                    <img
                      alt={SUPPORTED_WALLETS[connectorObject].name}
                      className={classes.img}
                      src={`/static/images/walletIcons/${SUPPORTED_WALLETS[connectorObject].iconName}`}
                    />
                    <ChevronRight color="action" />
                  </Button>
                </Box>
              )
          )}
          <Box mt={3} display="flex" justifyContent="flex-end">
            {provider && (
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={onDisconnect}
              >
                Disconnect
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  return (
    <>
       <div className={classes.borderWrapper}>


        <CustomBorderComponent flagBorder={true}>

          <Button
            id="connectToWallet"
            // className={classe.walletButton}
            className={classes.walletButton}
            // size="medium"
            onClick={handleClickOpen}
            startIcon={<CreditCard />}
          >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>

            {account ? convertLongStrToShort(account, 6, 4) : 'Connect Wallet'}
            </div>
          </Button>
        </CustomBorderComponent>
      </div>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
    </>
  );
}
