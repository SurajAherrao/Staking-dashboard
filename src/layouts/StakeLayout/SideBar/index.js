/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
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
// import NavItem from './NavItem';
import NumberFormat from 'react-number-format';
import { useSelector, useDispatch } from '../../../store';
import { setRewards, setStake } from '../../../slices/account';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useStakingContract } from '../../../context/StakingContract';
import WalletSelector from '../../../components/WalletSelector/WalletSelector';
import NavItem from '../NavBar/NavItem';
import CustomBorderComponent from '../CustomBorderComponent';

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

const buttons = [
    { label: "Home", link: "/app/staking-stats", bgColor: "#FFFAF2" },
    { label: "Stake", link: "/app/stake", bgColor: "#FFFAF2" },
    { label: "Withdraw", link: "/app/withdrawStake", bgColor: "#FFFAF2" },
    { label: "Rewards", link: "/app/withdrawRewards", bgColor: "#FFFAF2" },
    {label:"Leaderboard", link: "/app/leaderboard", bgColor: "#FFFAF2"},
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
    root: {
        minWidth: "250px", 
        maxWidth: "280px", 
        width: "100%",
        padding: "16px",
        borderRadius: "7px",
        border: "2px solid #000000",
        borderColor: "rgb(1, 0, 0)",
        boxShadow: " 0 0 #0000, 0 0 #0000, 5px 5px 0 0 #00000026",
        background: "#ffffff",
        height: "100%",
        [`@media (min-width: 800px)`]: {
            height: "100%",
        },
    },
    mobileDrawer: {
        borderRadius: "7px",
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
        // '&:hover': {
        //     background: "#daeaff",
        //     color: "#546e7a"
        // },
        // background: "#D4A674",
        color: "black",
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
    },
    btn:{
        marginTop: '10px',
        marginBottom: '10px',
        height: '48px',
    }
}));

const SideBar = ({ onMobileClose, openMobile, ...rest }) => {
    const classes = useStyles();
    const location = useLocation();
    console.log("🚀 ~ file: index.js:166 ~ SideBar ~ location:", location)
    const currentSegment = location.pathname.split("/").pop();
    console.log("🚀 ~ file: index.js:168 ~ SideBar ~ currentSegment:", currentSegment)

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

    return (
        <>
            <div className={classes.root}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <h2> {"STAKERS"}</h2>

                </div>
                <hr style={{borderBottomWidth: "1px",borderColor: "#000000", width:"100%" , margin:"10px 0px"}} />
                
                {buttons.map((button, index) => (
                <div className={classes.btn}>
                    <HoverableButton
                    key={index}
                    className={classes.button}
                    link={button.link}
                    label={button.label}
                    bgColor={button.bgColor}
                    />
                </div>
                ))}
            </div>
        </>
    );
};

SideBar.propTypes = {
    onMobileClose: PropTypes.func,
    openMobile: PropTypes.bool,
};

const HoverableButton = ({ className, link, label, bgColor }) => {
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();

    return (
        <div
            style={{
                backgroundColor: "white",
                padding: "10px",
                margin: "20px 0px",
                position: "relative", // Ensures proper positioning of CustomBorderComponent
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered ? (
                <CustomBorderComponent bgColor={bgColor} flagBorder={true}>
                    <Button 
                        className={className}
                        component={RouterLink}
                        to={link}
                        fullWidth
                        style={{ color:"#D4A674",zIndex: isHovered ? 1 : 0 }} // Ensures Button remains functional
                    >
                        {label}
                    </Button>
                </CustomBorderComponent>
            ) : location.pathname === link || (location.pathname === "/" && link === "/app/staking-stats") ? (
                <CustomBorderComponent bgColor={bgColor} flagBorder={true}>
                    <Button
                        className={className}
                        component={RouterLink}
                        to={link}
                        fullWidth
                        style={{ color:"#D4A674", zIndex: isHovered ? 1 : 0 }} // Ensures Button remains functional
                    >
                        {label}
                    </Button>
                </CustomBorderComponent>
            ) : (
                <Button
                    className={className}
                    component={RouterLink}
                    to={link}
                    fullWidth
                    style={{ height:"48px" ,zIndex: isHovered ? 1 : 0 }}
                     // Ensures Button remains functional
                >
                    {label}
                </Button>)}
        </div>
    );
};

export default SideBar;
