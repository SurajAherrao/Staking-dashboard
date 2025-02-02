import useLocalStorage from './useLocalStorage';

export default function useConnectedWallet() {
  const [connectedWallet, setConnectedWallet] = useLocalStorage('connected_wallet', '');
  return [connectedWallet, setConnectedWallet];
}
