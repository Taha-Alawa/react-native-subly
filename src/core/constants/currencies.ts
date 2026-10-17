export const SUPPORTED_CURRENCIES = [
  "SAR",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "KWD",
  "QAR",
  "BHD",
  "OMR",
  "EGP",
  "JOD",
] as const;
export type AppCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY: AppCurrency = "SAR";

/**
 * The new Saudi Riyal sign has no reliable system-font coverage yet, so it is
 * drawn from a one-glyph icon font ("SAR", loaded in RootLayout) at this
 * private-use code point. `MoneyText` swaps the font in wherever it appears.
 */
export const SAR_GLYPH = "";
export const SAR_FONT_FAMILY = "SAR";

export const isSupportedCurrency = (
  value: string | null,
): value is AppCurrency =>
  (SUPPORTED_CURRENCIES as readonly string[]).includes(value ?? "");
