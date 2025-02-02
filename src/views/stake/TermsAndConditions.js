import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Typography,
} from '@material-ui/core';
import { XSquare } from 'react-feather';

export default function TermsAndConditions() {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = scrollType => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Box alignItems="center" display="flex">
        <Typography variant="body2" color="textSecondary">
          I have read the&nbsp;
        </Typography>
        <Link
          component="a"
          variant="body2"
          color="secondary"
          onClick={handleClickOpen('paper')}
          href="#"
          hover="none"
        >
          Terms and Conditions
        </Link>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title"> <div style={{display:"flex",justifyContent:"space-between"}}><div>Terms and conditions</div><div onClick={handleClose}><XSquare/></div></div>  </DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Typography component="span" variant="body1" color="textSecondary">
              Nothing on SJ.io website is an offer to sell, or the solicitation of an offer
              to buy, any tokens. Nothing on this website should be treated or read as a guarantee
              or promise of how SJ' business or the tokens will develop or of the utility
              or value of the tokens. This website outlines current plans, which could change at its
              SJ' discretion, and the success of which will depend on many factors outside
              SJ' control, including market-based factors and factors within the data and
              cryptocurrency industries, among others. Any statements about future events are based
              solely on SJ' analysis of the issues described on SJ.io website or on
              its blog. That analysis may prove to be incorrect.
            </Typography>
            <br />
            <br />
            <Typography component="span" variant="body1" color="textSecondary">
              The primary purpose of staking SJ is to secure the SJ Network. SJ
              tokens are not "stock", "equity", "shares" or any similar instrument in any
              jurisdiction. Sending tokens to the wrong address or failure to properly follow
              instructions may result in loss of tokens.
            </Typography>
            <br />
            <br />
            <Typography component="span" variant="body1" color="textSecondary">
              <strong>Technical disclaimer:</strong> smart contracts (for staking and for ERC20 in
              this case) are deployed and executed on Ethereum blockSJ platform. The platform,
              its programming language, and other software related to the smart contract or this
              website can have their own vulnerabilities that can lead to hacks. Thus, SJ
              can't guarantee explicit security of smart contracts even if they were audited by
              several independent third-parties.
            </Typography>
            <br />
            <br />
            <Typography component="span" variant="body1" color="textSecondary">
              <strong>Risk warning:</strong> All crypto transactions are subject to high market
              risk. Please make your decisions very cautiously. SJ will not be responsible
              for any losses.
            </Typography>
            <br />
            <br />
            <Typography component="span" variant="body1" color="textSecondary">
              <strong>Geo restrictions:</strong> Users from the following countries are not allowed
              to participate in the staking process: United States of America (including its
              territories and dependencies, any state of the United States and the District of
              Columbia).
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="termsAndConditionsStakeClose" onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
