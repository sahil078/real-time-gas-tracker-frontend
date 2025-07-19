import { ethers } from "ethers"

export class UniswapV3Parser {
  private static readonly SWAP_EVENT_SIGNATURE = "Swap(address,address,int256,int256,uint160,uint128,int24)"

  static parseSwapEvent(log: ethers.providers.Log): number | null {
    try {
      const iface = new ethers.utils.Interface([
        "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)",
      ])

      const parsed = iface.parseLog(log)
      const sqrtPriceX96 = parsed.args.sqrtPriceX96

      // Calculate price from sqrtPriceX96
      // price = (sqrtPriceX96**2 * 10**12) / (2**192)
      const price = sqrtPriceX96.pow(2).mul(ethers.BigNumber.from(10).pow(12)).div(ethers.BigNumber.from(2).pow(192))

      return Number.parseFloat(ethers.utils.formatUnits(price, 6)) // USDC has 6 decimals
    } catch (error) {
      console.error("Error parsing swap event:", error)
      return null
    }
  }

  static calculateETHUSD(sqrtPriceX96: ethers.BigNumber): number {
    try {
      // Convert sqrtPriceX96 to actual price
      const Q96 = ethers.BigNumber.from(2).pow(96)
      const price = sqrtPriceX96.pow(2).div(Q96.pow(2))

      // Adjust for token decimals (ETH: 18, USDC: 6)
      const adjustedPrice = price.mul(ethers.BigNumber.from(10).pow(12))

      return Number.parseFloat(ethers.utils.formatEther(adjustedPrice))
    } catch (error) {
      console.error("Error calculating ETH/USD:", error)
      return 0
    }
  }
}
