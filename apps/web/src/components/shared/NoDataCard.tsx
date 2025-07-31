import { useTranslation } from 'react-i18next';
import {
  Typography,
} from '@budmin/ui/internal/Typography';

export default function NoDataCard() {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full absolute grid place-items-center rounded-lg bg-white">
      <Typography className="text-sm text-slate-600">
        {t('helpers.noData')}
      </Typography>
    </div>
  );
}
