import { Log, Interface, formatUnits } from "ethers"
import { type Log as EthersLog } from "ethers"

export class UniswapV3Parser {
  // Swap event definition
  private static readonly SWAP_EVENT_SIGNATURE =
    "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)"

  // Interface for decoding logs
  private static readonly iface = new Interface([UniswapV3Parser.SWAP_EVENT_SIGNATURE])

  /**
   * Parse Uniswap V3 Swap event and extract ETH/USDC price
   */
  static parseSwapEvent(log: EthersLog): number | null {
    try {
      const parsed = UniswapV3Parser.iface.parseLog(log)
      if (!parsed) {
        console.error("Parsed log is null");
        return null;
      }
      const sqrtPriceX96 = parsed.args.sqrtPriceX96 as bigint;

      return this.calculateETHUSD(sqrtPriceX96)
    } catch (err) {
      console.error("Failed to parse swap log:", err)
      return null
    }
  }

  /**
   * Convert sqrtPriceX96 to ETH/USDC price
   */
  static calculateETHUSD(sqrtPriceX96: bigint): number {
    try {
      const numerator = sqrtPriceX96 * sqrtPriceX96 * BigInt(10 ** 12)
      const denominator = BigInt(Math.pow(2, 192))
      const price = numerator / denominator

      return Number(price) / 1e6 // USDC has 6 decimals
    } catch (err) {
      console.error("Error calculating price:", err)
      return 0
    }
  }
}
