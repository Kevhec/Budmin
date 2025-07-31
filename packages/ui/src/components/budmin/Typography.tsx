import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils';

const typographyVariants = cva(
  '',
  {
    variants: {
      variant: {
        p: 'font-inter text-base',
        h1: 'font-openSans text-2xl md:text-4xl font-bold',
        h2: 'font-openSans text-lg font-semibold',
        h3: 'font-openSans',
        h4: 'font-openSans',
        h5: 'font-openSans',
        h6: 'font-openSans',
        span: '',
      },
    },
  },
);

type TypographyVariants = VariantProps<typeof typographyVariants>['variant'];

type TypographyProps = {
  variant?: TypographyVariants;
};

type Props <T extends React.ElementType> =
  React.PropsWithChildren<TypographyProps> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof TypographyProps>;

export function Typography <T extends React.ElementType = 'p'>({
  variant = 'p', className, children, ...restProps
}: Props<T>) {
  const Component = variant as React.ElementType;
  const classes = cn(typographyVariants({ variant, className }));

  return (
    <Component className={classes} {...restProps}>
      {children}
    </Component>
  );
}
