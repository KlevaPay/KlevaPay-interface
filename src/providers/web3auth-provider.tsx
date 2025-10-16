"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { Web3Auth } from "@web3auth/modal";
import { IProvider } from "@web3auth/base";
import { createWeb3Auth } from "@/lib/web3auth";

interface Web3AuthContextType {
  web3auth: Web3Auth | null;
  provider: IProvider | null;
  isConnected: boolean;
  userInfo: any;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isLoading: boolean;
  isInitialized: boolean;
  initError: string | null;
}

const Web3AuthContext = createContext<Web3AuthContextType>({
  web3auth: null,
  provider: null,
  isConnected: false,
  userInfo: null,
  connect: async () => {},
  disconnect: async () => {},
  isLoading: true,
  isInitialized: false,
  initError: null,
});

export const useWeb3Auth = () => useContext(Web3AuthContext);

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const initializingRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      // Prevent double initialization in React strict mode
      if (initializingRef.current) {
        console.log("Already initializing, skipping...");
        return;
      }

      initializingRef.current = true;

      try {
        console.log("=== Starting Web3Auth Initialization ===");
        console.log("Window object exists:", typeof window !== 'undefined');
        console.log("Client ID:", process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID);

        const web3authInstance = createWeb3Auth();
        console.log("✓ Web3Auth instance created successfully");
        console.log("Instance details:", {
          status: web3authInstance.status,
          connected: web3authInstance.connected
        });

        console.log("Calling init()...");
        await web3authInstance.initModal();

        console.log("✓ init() completed successfully");
        console.log("Final status:", web3authInstance.status);

        setWeb3auth(web3authInstance);
        setIsInitialized(true);
        setInitError(null);

        if (web3authInstance.connected) {
          console.log("User already connected, fetching info...");
          setProvider(web3authInstance.provider);
          setIsConnected(true);
          const user = await web3authInstance.getUserInfo();
          setUserInfo(user);
        }

        console.log("=== Web3Auth Initialization Complete ===");
      } catch (error: any) {
        console.error("=== Web3Auth Initialization FAILED ===");
        console.error("Error:", error);
        console.error("Error message:", error?.message);
        console.error("Error stack:", error?.stack);
        setInitError(error?.message || "Failed to initialize Web3Auth");
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
        initializingRef.current = false;
      }
    };

    // Only initialize on client side
    if (typeof window !== 'undefined') {
      init();
    } else {
      setIsLoading(false);
    }
  }, []);

  const connect = async () => {
    if (!web3auth) {
      console.error("Web3Auth instance is null");
      throw new Error("Web3Auth not initialized. Please refresh the page and try again.");
    }

    if (!isInitialized) {
      throw new Error("Web3Auth is still initializing. Please wait a moment and try again.");
    }

    try {
      console.log("Attempting to connect to Web3Auth...");
      const web3authProvider = await web3auth.connect();

      if (!web3authProvider) {
        throw new Error("Failed to get provider from Web3Auth");
      }

      console.log("Connected successfully");
      setProvider(web3authProvider);
      setIsConnected(true);

      const user = await web3auth.getUserInfo();
      console.log("User info:", user);
      setUserInfo(user);
    } catch (error) {
      console.error("Error connecting to Web3Auth:", error);
      throw error;
    }
  };

  const disconnect = async () => {
    if (!web3auth) {
      return;
    }

    try {
      await web3auth.logout();
      setProvider(null);
      setIsConnected(false);
      setUserInfo(null);
    } catch (error) {
      console.error("Error disconnecting from Web3Auth:", error);
      throw error;
    }
  };

  return (
    <Web3AuthContext.Provider
      value={{
        web3auth,
        provider,
        isConnected,
        userInfo,
        connect,
        disconnect,
        isLoading,
        isInitialized,
        initError,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
}
