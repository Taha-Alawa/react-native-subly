import dayjs from "dayjs";
import i18n from "@/core/i18n";
import currencyStore from "@/core/store/currencyStore";
import { SAR_GLYPH } from "@/core/constants/currencies";

/**
 * Generic, domain-agnostic formatting. Anything that knows what a Subscription
 * is belongs in that feature's utils, not here — core must stay reusable.
 */

const numberFormatLocale = () => (i18n.language === "ar" ? "ar-EG" : "en-US");

/**
 * Saudi Riyal is formatted with its ISO code so Intl still decides placement
 * and bidi marks for the locale, then the code is swapped for the new sign —
 * render the result through `MoneyText` so the sign gets its font.
 */
const formatMoney = (
  value: number,
  currency: string,
  fractionDigits: number,
): string => {
  const isRiyal = currency === "SAR";
  try {
    const text = new Intl.NumberFormat(numberFormatLocale(), {
      style: "currency",
      currency,
      currencyDisplay: isRiyal ? "code" : "symbol",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
    return isRiyal ? text.replace(/SAR|ر\.س\.?/, SAR_GLYPH) : text;
  } catch {
    const plain = value.toFixed(fractionDigits);
    return isRiyal ? `${SAR_GLYPH} ${plain}` : plain;
  }
};

export const formatCurrency = (
  value: number,
  currency: string = currencyStore.getState().currency,
): string => formatMoney(value, currency, 2);

/** Money without the cents, for tight spots: chart axes, tiles, list rows. */
export const formatCurrencyShort = (
  value: number,
  currency: string = currencyStore.getState().currency,
): string => formatMoney(value, currency, 0);

/** The bare sign ("$", "€", the riyal glyph) for badges and input adornments. */
export const getCurrencySymbol = (currency: string): string => {
  if (currency === "SAR") return SAR_GLYPH;
  try {
    return (
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ?? currency
    );
  } catch {
    return currency;
  }
};

export const formatDate = (value?: string): string => {
  if (!value) return i18n.t("common.notProvided", "Not provided");
  const parsed = dayjs(value);
  return parsed.isValid()
    ? parsed.format("MM/DD/YYYY")
    : i18n.t("common.notProvided", "Not provided");
};

type DisplayNameUser =
  | { displayName?: string | null; email?: string | null }
  | null
  | undefined;

/**
 * Email/password sign-up leaves `displayName` empty, so fall back to the local
 * part of the address rather than showing a blank header.
 */
export const getDisplayName = (
  user: DisplayNameUser,
  fallback?: string,
): string => {
  const name = user?.displayName?.trim();
  if (name) return name;

  const email = user?.email;
  if (email) {
    const localPart = email.split("@")[0];
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }

  return fallback ?? i18n.t("common.guestFallback", "there");
};
