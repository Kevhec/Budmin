interface FormatMoneyParams {
  number: number
  locale?: string
  currency?: string
  options?: Intl.NumberFormatOptions
}

function formatMoney({
  number, locale = 'es-CO', currency = 'COP', options,
}: FormatMoneyParams) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    roundingMode: 'trunc',
    ...options,
  }).format(number).replace('MRD', 'B');
}

const suffixNumberFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
});

export {
  formatMoney,
  suffixNumberFormatter,
};
