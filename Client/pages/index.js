import styles from "../styles/Home.module.css";
import { AE_AMOUNT_FORMATS } from '@aeternity/aepp-sdk';
import useAeternitySDK from '../hooks/useAeternitySDK';
import network from "../configs/network";
import { useEffect, useRef, useState } from "react";
import Dashboard from "./dashboard"


const WalletConnectionStatus = Object.freeze({
	Error: 0,
	Connecting: 1,
	Connected: 2,
});

export default function Home() {
  const [client, clientReady] = useAeternitySDK();
	const [address, setAddress] = useState(null);
	const [balance, setBalance] = useState(null);
	const [errorMsg, setErrorMsg] = useState("");
	const [status, setStatus] = useState(WalletConnectionStatus.Connecting)

  let aeSdk = useRef(null);

  const handleNetworkChange = async function (walletNetworkId) {
    if (!aeSdk) return;
		if (status !== WalletConnectionStatus.Error && walletNetworkId !== network.id) {
			setErrorMsg(`Network "${walletNetworkId}" is not supported. Please switch to "${network.id}" in your wallet.`)
			setStatus(WalletConnectionStatus.Error);
      setAddress(null);
			setBalance(null);
		} else {
      if(status !== WalletConnectionStatus.Connected) {
        setStatus(WalletConnectionStatus.Connected);
      }
      updateAccountInfo();
		}
	}

  const handleAddressChange = async function () {
    // TODO: not working as expected
    // if (status === WalletConnectionStatus.Connected) {
    //   updateAccountInfo();
    // } else {
    //   console.log("Not connected, ignoring address change. Please connect to your wallet to the correct network.")
    // }
    updateAccountInfo();
  }

  const updateAccountInfo = async function () {
    const _address = await aeSdk.address;
    const _balance = await aeSdk.getBalance(_address, {
      format: AE_AMOUNT_FORMATS.AE
    });
    setAddress(_address);
    setBalance(_balance);
  }

	useEffect(() => {
		if (clientReady && client) {
			aeSdk = client.current.aeSdk;

      if (!aeSdk) return;
      aeSdk.onAddressChange = (accounts) => handleAddressChange();
			aeSdk.onNetworkChange = (params) => handleNetworkChange(params.networkId);
			handleNetworkChange(client.current.walletNetworkId);
		}
    
	}, [clientReady, client]);

  console.log('sddasd')
  return (
    <Dashboard address={address} balance={balance}></Dashboard>
  );
}
