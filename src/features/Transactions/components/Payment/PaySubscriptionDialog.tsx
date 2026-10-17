import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "@/core/components/Dialog/ConfirmDialog";
import { useCurrency } from "@/core/store/currencyStore";
import { formatCurrency, getCurrencySymbol } from "@/core/utils/formatters";
import type { PaySubscriptionPayload } from "@/features/Transactions/hooks/Transaction/useSubscriptionPayment";
import type { Subscription } from "@/features/Subscriptions/interfaces/Subscription.interface";

export type PaySubscriptionDialogProps = {
  visible: boolean;
  payload: PaySubscriptionPayload | null;
  onConfirm: (subscription: Subscription) => void | Promise<void>;
  onClose: () => void;
};

/**
 * Paying moves real money off the balance and shifts the renewal date, so both
 * consequences are named before it happens rather than explained afterwards.
 */
const PaySubscriptionDialog = ({
  visible,
  payload,
  onConfirm,
  onClose,
}: PaySubscriptionDialogProps) => {
  const { t } = useTranslation();
  const currency = useCurrency();
  const subscription = payload?.data ?? null;

  return (
    <ConfirmDialog
      visible={visible}
      title={t("transactions.payTitle", "Record Payment")}
      message={t("transactions.payConfirm", {
        name: subscription?.name ?? "",
        amount: formatCurrency(subscription?.price ?? 0, currency),
        date: payload?.nextRenewalDate
          ? dayjs(payload.nextRenewalDate).format("MMM D, YYYY")
          : "",
        defaultValue:
          "Pay {{amount}} for {{name}}? It comes off your balance and the next renewal moves to {{date}}.",
      })}
      glyph={getCurrencySymbol(currency)}
      tone="success"
      disabled={payload?.disabled ?? false}
      confirmLabel={t("transactions.payConfirmLabel", "Pay now")}
      onConfirm={() => subscription && onConfirm(subscription)}
      onClose={onClose}
    />
  );
};

export default PaySubscriptionDialog;
