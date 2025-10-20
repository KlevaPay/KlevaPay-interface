"use client"

import { useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { useWeb3Auth } from "@/providers/web3auth-provider";
import { Button } from "./button";
import { Spinner } from "./spinner";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    isConnected: web3authConnected,
    userInfo,
    connect: web3authConnect,
    disconnect: web3authDisconnect,
    isLoading: web3authLoading,
    isInitialized,
    initError
  } = useWeb3Auth();

  const handleWeb3AuthConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await web3authConnect();
      onClose();
    } catch (error: any) {
      console.error("Error connecting with Web3Auth:", error);
      setError(error?.message || "Failed to connect with Web3Auth. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleWeb3AuthDisconnect = async () => {
    try {
      await web3authDisconnect();
      onClose();
    } catch (error) {
      console.error("Error disconnecting from Web3Auth:", error);
    }
  };

  const handleRainbowKitConnect = () => {
    if (openConnectModal) {
      openConnectModal();
      onClose();
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  if (!isOpen) return null;

  if (isConnected || web3authConnected) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div
          className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Connected Wallet
          </h2>
          <div className="space-y-4">
            {isConnected && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Connected with Wallet
                </p>
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {address}
                </p>
              </div>
            )}
            {web3authConnected && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Connected with Web3Auth
                </p>
                {userInfo && (
                  <div className="mt-2 space-y-1">
                    {userInfo.name && (
                      <p className="text-sm text-gray-900 dark:text-white">
                        Name: {userInfo.name}
                      </p>
                    )}
                    {userInfo.email && (
                      <p className="text-sm text-gray-900 dark:text-white">
                        Email: {userInfo.email}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                onClick={isConnected ? handleDisconnect : handleWeb3AuthDisconnect}
                className="flex-1"
                style={{ backgroundColor: "var(--brand-blue)" }}
              >
                Disconnect
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Connect Wallet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Choose how you want to connect to KlevaPay
        </p>

        {(error || initError) && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400 font-semibold mb-1">
              {error ? "Connection Error:" : "Initialization Error:"}
            </p>
            <p className="text-sm text-red-700 dark:text-red-400">{error || initError}</p>
            {initError && (
              <p className="text-xs text-red-600 dark:text-red-500 mt-2">
                Please check the browser console (F12) for more details.
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleRainbowKitConnect}
            className="w-full justify-start text-left"
            size="lg"
            style={{ backgroundColor: "var(--brand-blue)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm10 16H4V9h16v11z"/>
                </svg>
              </div>
              <div>
                <div className="font-medium">Connect Wallet</div>
                <div className="text-xs opacity-80">MetaMask, Coinbase, WalletConnect, etc.</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={handleWeb3AuthConnect}
            className="w-full justify-start text-left"
            size="lg"
            variant="outline"
            disabled={isConnecting || web3authLoading || !isInitialized}
          >
            {isConnecting || web3authLoading ? (
              <div className="flex items-center gap-3">
                <Spinner />
                <span>{web3authLoading ? "Initializing..." : "Connecting..."}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Account Abstraction</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {!isInitialized ? "Initializing..." : "Sign in with Google, Apple, Twitter, etc."}
                  </div>
                </div>
              </div>
            )}
          </Button>
        </div>

        <div className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
          By connecting, you agree to our Terms of Service
        </div>
      </div>
    </div>
  );
}
