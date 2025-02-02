import _ from 'lodash';
import { colors, createTheme as createMuiTheme } from '@material-ui/core';
import { THEMES } from '../constants';
import { softShadows, strongShadows } from './shadows';
import typography from './typography';

const baseOptions = {
  typography,
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: 3,
        overflow: 'hidden',
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: 'rgba(0,0,0,0.075)',
      },
    },
  },
};

const themesOptions = [
  {
    name: THEMES.LIGHT,
    typography: {
      fontFamily:"Comic Neue",
    },

    overrides: {
      MuiInputBase: {
        input: {
          '&::placeholder': {
            opacity: 1,
            color: colors.blueGrey[600],
          },
        },
      },
    },
    palette: {
      type: 'light',
      action: {
        active: colors.blueGrey[600],
      },
      background: {
        default: '#FFF',
        dark: '#fff',
        paper: colors.common.white,
        // backgroundImage: "radial-gradient(#d1d5db 1px,transparent 1px)",
        // backgroundSize: "16px 16px",
      },
      divider: 'rgba(0, 0, 0, 0.12)',
      primary: {
        main: '#FFF',
      },
      secondary: {
        main: '#565df6',
      },
      text: {
        primary: colors.blueGrey[900],
        secondary: colors.blueGrey[600],
      },
    },
    shadows: softShadows,
  },
  {
    name: THEMES.DARK,
    palette: {
      type: 'dark',
      action: {
        active: 'rgba(255, 255, 255, 0.54)',
        hover: 'rgba(255, 255, 255, 0.04)',
        selected: 'rgba(255, 255, 255, 0.08)',
        disabled: 'rgba(255, 255, 255, 0.26)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        focus: 'rgba(255, 255, 255, 0.12)',
      },
      background: {
        default: '#282C34',
        dark: '#1c2025',
        paper: '#282C34',
      },
      divider: 'rgba(255, 255, 255, 0.12)',
      primary: {
        main: '#80260f',
      },
      secondary: {
        main: '#565df6',
      },
      text: {
        primary: '#e6e5e8',
        secondary: '#adb0bb',
      },
    },
    shadows: strongShadows,
  },
];

export const createTheme = (config = {}) => {
  let themeOptions = themesOptions.find(theme => theme.name === config.theme);

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    [themeOptions] = themesOptions;
  }

  let theme = createMuiTheme(_.merge({}, baseOptions, themeOptions));

  return theme;
};
