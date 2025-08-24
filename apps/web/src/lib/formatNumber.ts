export interface FormatMoneyOptions {
  locale?: string
  currency?: string
  options?: Intl.NumberFormatOptions
}

function formatMoney(value: number, options?: FormatMoneyOptions) {
  return new Intl.NumberFormat(options?.locale || navigator.language, {
    style: 'currency',
    currency: options?.currency || 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    roundingMode: 'trunc',
    ...options,
  }).format(value).replace('MRD', 'B');
}

const suffixNumberFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
});

export {
  formatMoney,
  suffixNumberFormatter,
};
