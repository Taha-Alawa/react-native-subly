import { useTranslation } from "react-i18next";
import DialogShell from "@/core/components/Dialog/DialogShell";
import ChipPicker from "@/core/components/Form/ChipPicker";
import currencyStore, { useCurrency } from "@/core/store/currencyStore";
import {
  SUPPORTED_CURRENCIES,
  type AppCurrency,
} from "@/core/constants/currencies";

export type CurrencyDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const CurrencyDialog = ({ visible, onClose }: CurrencyDialogProps) => {
  const { t } = useTranslation();
  const currency = useCurrency();

  return (
    <DialogShell
      visible={visible}
      title={t("settings.chooseCurrency", "Choose currency")}
      onClose={onClose}
      dismissOnBackdropPress
    >
      <ChipPicker<AppCurrency>
        options={SUPPORTED_CURRENCIES.map((code) => ({
          value: code,
          label: `${t(`currencies.${code}`, code)} (${code})`,
        }))}
        value={currency}
        onChange={async (next) => {
          await currencyStore.setCurrency(next);
          onClose();
        }}
      />
    </DialogShell>
  );
};

export default CurrencyDialog;
