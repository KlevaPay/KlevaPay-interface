import { useCallback } from "react"
import { parseEther, parseUnits, type Address, type Hash, type TransactionReceipt } from "viem"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import customerAbi from "@/common/abi/customer"

type SupportedToken = "USDT" | "ETH"

const CONTRACT_ADDRESS: Address = "0x37bFDD0Ff0A4BaE7924B711acDC134bB2aF91029"
const MERCHANT_ADDRESS: Address = "0xb2e8755dcA0190ee8D0495eb2cE8D97b78d481e6"
const USDT_ADDRESS: Address = "0x6158861064D00Ac52d35f9c99593e5666B8fd468"
const WETH_ADDRESS: Address = "0x76e34d0ECBF3E62dC74584a865735FB1031E2dC2"

const ERC20_ABI = [
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

const TOKEN_MAP: Record<SupportedToken, Address> = {
  USDT: USDT_ADDRESS,
  ETH: WETH_ADDRESS,
}

interface PayWithTokenParams {
  token: SupportedToken
  amount: string | number
  tokenDecimals?: number
  txRef: string
  merchantAddress?: Address
}

export function usePayWithToken() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const payWithToken = useCallback(
    async ({
      token,
      amount,
      tokenDecimals = token === "ETH" ? 18 : 6,
      txRef,
      merchantAddress = MERCHANT_ADDRESS,
    }: PayWithTokenParams): Promise<{ hash: Hash; receipt: TransactionReceipt }> => {
      if (!walletClient || !publicClient) throw new Error("Wallet not connected")
      if (!address) throw new Error("Wallet address not found")

      const amountInWei =
        typeof amount === "string"
          ? token === "ETH"
            ? parseEther(amount)
            : parseUnits(amount, tokenDecimals)
          : token === "ETH"
            ? parseEther(amount.toString())
            : parseUnits(amount.toString(), tokenDecimals)

      const value = token === "ETH" ? amountInWei : BigInt(0)

      if (token !== "ETH") {
        const allowance = await publicClient.readContract({
          address: TOKEN_MAP[token],
          abi: ERC20_ABI,
          functionName: "allowance",
          args: [address as Address, CONTRACT_ADDRESS],
        })

        if (allowance < amountInWei) {
          const approvalHash = await walletClient.writeContract({
            address: TOKEN_MAP[token],
            abi: ERC20_ABI,
            functionName: "approve",
            args: [CONTRACT_ADDRESS, amountInWei],
          })

          await publicClient.waitForTransactionReceipt({ hash: approvalHash })
        }
      }

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: customerAbi,
        functionName: "payWithToken",
        args: [
          token === "ETH" ? WETH_ADDRESS : TOKEN_MAP[token],
          amountInWei,
          merchantAddress,
          token,
          txRef,
        ],
        value,
      })

      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      return { hash: hash as Hash, receipt }
    },
    [address, publicClient, walletClient]
  )

  return { payWithToken }
}
