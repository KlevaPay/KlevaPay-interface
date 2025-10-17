import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;

if (!clientId) {
  throw new Error("NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is not defined in environment variables");
}


const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x144", 
  rpcTarget: "https://rpc.sepolia-api.lisk.com",
  displayName: "Lisk Sepolia",
  blockExplorerUrl: "https://sepolia-blockscout.lisk.com",
  ticker: "ETH",
  tickerName: "Ethereum",
};

export const createWeb3Auth = () => {
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });

  const web3auth = new Web3Auth({
    clientId,
    privateKeyProvider,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    uiConfig: {
      appName: "KleverPay",
      mode: "light",
      loginMethodsOrder: ["google", "apple", "twitter", "github", "discord"],
      defaultLanguage: "en",
      modalZIndex: "2147483647",
    },
  });

  return web3auth;
};
