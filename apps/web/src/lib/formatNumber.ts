function formatMoney(number: number, locale: string = 'es-CO', currency: string = 'COP') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

const suffixNumberFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
});

export {
  formatMoney,
  suffixNumberFormatter,
};
