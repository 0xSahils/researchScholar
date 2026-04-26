/**
 * GST Utility — apply GST rate from site_settings to any base price.
 * gstRate is an integer percentage, e.g. 18 means 18%.
 */

export interface GstBreakdown {
  base: number;
  gstAmount: number;
  total: number;
  gstRate: number;
}

/** Returns a numeric breakdown: base, gst amount, and inclusive total. */
export function applyGst(basePrice: number, gstRate: number): GstBreakdown {
  const gstAmount = Math.round((basePrice * gstRate) / 100);
  return {
    base: basePrice,
    gstAmount,
    total: basePrice + gstAmount,
    gstRate,
  };
}

/** Formats as "₹X,XX,XXX" */
export function fmtINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** Returns total-inclusive price string, e.g. "₹17,700" */
export function formatPriceWithGst(basePrice: number, gstRate: number): string {
  const { total } = applyGst(basePrice, gstRate);
  return fmtINR(total);
}
