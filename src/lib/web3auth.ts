import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Ethereum Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

export const createWeb3Auth = () => {
  if (!clientId) {
    throw new Error("Web3Auth Client ID is not configured");
  }

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });

  const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // Changed to DEVNET for testing
    privateKeyProvider,
    uiConfig: {
      appName: "KleverPay",
      mode: "dark",
      loginMethodsOrder: ["google", "apple", "twitter", "github", "discord"],
      defaultLanguage: "en",
      modalZIndex: "2147483647",
    },
  });

  return web3auth;
};
