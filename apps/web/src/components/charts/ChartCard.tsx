import { cn } from '@/lib/utils';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@budmin/ui';

interface Props {
  children: React.ReactNode
  title: string
  titleIcon?: React.ReactNode
  titleLeft?: boolean
  titleClassName?: string
  containerClassName?: string
  headerRightElement?: React.ReactNode
  headerClassName?: string
  contentClassName?: string
  subtitle?: string | number | React.ReactNode
  hidden?: boolean
}

export default function ChartCard({
  title,
  titleIcon,
  titleLeft,
  titleClassName,
  headerClassName,
  headerRightElement,
  containerClassName,
  contentClassName,
  subtitle,
  hidden,
  children,
}: Props) {
  const containerClasses = cn({
    invisible: hidden,
  }, 'flex flex-col border-none pb-4 rounded-md shadow-none', containerClassName);

  const titleClasses = cn({
    'flex gap-2 items-center': titleIcon,
    'w-full': titleLeft,
  }, 'font-openSans text-xl', titleClassName);

  const headerClasses = cn('flex-row items-center p-4 justify-between', headerClassName);

  const contentClasses = cn('flex-1 pb-0', contentClassName);

  return (
    <Card className={containerClasses}>
      <CardHeader className={headerClasses}>
        <div className="grow">
          <CardTitle className={titleClasses}>
            <>
              {titleIcon}
              {title}
            </>
          </CardTitle>
          {
            subtitle && (
              (typeof subtitle === 'string' || typeof subtitle === 'number') ? (
                <CardDescription className="font-inter capitalize text-left w-full !mt-0">{subtitle}</CardDescription>
              ) : (
                subtitle
              )
            )
          }
        </div>
        <>
          {headerRightElement}
        </>
      </CardHeader>
      <CardContent className={contentClasses}>
        <>
          {children}
        </>
      </CardContent>
    </Card>
  );
}
