import React from 'react';
import { createBrowserHistory } from 'history';
import { create } from 'jss';
import MomentUtils from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import { jssPreset, StylesProvider, ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import GlobalStyles from './components/GlobalStyles';
import ScrollReset from './components/ScrollReset';
import useSettings from './hooks/useSettings';
import { createTheme } from './theme';
import routes, { renderRoutes } from './routes';
import { StakingContractProvider } from './context/StakingContract/index';
import { Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { graphQLClient } from './graphql/client';
import { useWeb3React } from '@web3-react/core';
import "./App.css"
import MiniKitProvider from './minikit-provider';
const jss = create({ plugins: [...jssPreset().plugins] });
const history = createBrowserHistory();

const App = () => {
  const { settings } = useSettings();
  const { chainId } = useWeb3React();

  const theme = createTheme({
    theme: settings.theme,
  });

  return (
    <ApolloProvider client={graphQLClient(chainId)}>
      <MiniKitProvider>
      <StakingContractProvider>
        <ThemeProvider theme={theme}>
          <StylesProvider jss={jss}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <SnackbarProvider dense maxSnack={3}>
                <Router history={history}>
                  <GlobalStyles />
                  <ScrollReset />
                  {renderRoutes(routes)}
                </Router>
              </SnackbarProvider>
            </MuiPickersUtilsProvider>
          </StylesProvider>
        </ThemeProvider>
      </StakingContractProvider>
      </MiniKitProvider>
    </ApolloProvider>
  );
};

export default App;
