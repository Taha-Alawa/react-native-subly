import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { createStore } from "@/core/store/createStore";
import {
  DEFAULT_CURRENCY,
  isSupportedCurrency,
  type AppCurrency,
} from "@/core/constants/currencies";

const CURRENCY_STORAGE_KEY = "app_currency";

/**
 * One display currency for the whole app. There are no exchange rates, so
 * every amount — balance, totals, each record — is shown in this currency.
 */
const store = createStore<{ currency: AppCurrency }>({
  currency: DEFAULT_CURRENCY,
});

/** Restores the saved choice before first paint, mirroring `initI18n`. */
const init = async () => {
  if (Platform.OS === "web") return;
  try {
    const stored = await SecureStore.getItemAsync(CURRENCY_STORAGE_KEY);
    if (isSupportedCurrency(stored)) store.setState({ currency: stored });
  } catch {
    // Fall back to the default — a missing preference is not an error.
  }
};

const setCurrency = async (currency: AppCurrency) => {
  store.setState({ currency });
  try {
    if (Platform.OS !== "web") {
      await SecureStore.setItemAsync(CURRENCY_STORAGE_KEY, currency);
    }
  } catch {
    // Ignore persistence failures — the in-memory change still applies.
  }
};

/** Components read the currency here so they re-render when it changes. */
export const useCurrency = () => store.useStore().currency;

const currencyStore = { ...store, init, setCurrency };

export default currencyStore;
