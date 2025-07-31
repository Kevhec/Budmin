import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Typography } from '@budmin/ui/internal/Typography';

interface Props {
  className?: string
}

export default function Footer({ className }: Props) {
  const { t } = useTranslation();

  return (
    <footer className={cn('py-6 bg-[#343A40] text-white text-center', className)}>
      <Typography className="text-sm">
        {t('footer.credits')}
        {' '}
        <a href="https://kevhec.dev/" target="_blank" rel="noreferrer" className="underline underline-offset-4">KevHec</a>
      </Typography>
    </footer>
  );
}
