/**
 * Decorator to rate limit an event or RPC
 * @param maxCallsPm numberOfReqs/timeframe (ms, s, m, h)
 */
export const Throttle = (maxCallsPm: `${number}/${"ms" | "s" | "m" | "h"}`) => {

}