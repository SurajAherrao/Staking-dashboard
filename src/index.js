import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'prismjs/prism';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'nprogress/nprogress.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/prism.css';
import { Provider } from 'react-redux';
// import store from './store';
import { SettingsProvider } from './contexts/SettingsContext';
import { Web3ReactProvider } from '@web3-react/core';
import {
  metamask,
  metamaskHooks,
  coinbaseWallet,
  coinbaseWalletHooks,
} from './components/connectors/connectors';
import "./index.css";
import store from './store/index';

import { Buffer } from 'buffer';

if (!global.Buffer) {
  global.Buffer = Buffer;
}

const connectors = [
  [metamask, metamaskHooks],
  [coinbaseWallet, coinbaseWalletHooks],
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <SettingsProvider>
      <Web3ReactProvider connectors={connectors}>
        <App />
      </Web3ReactProvider>
    </SettingsProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
