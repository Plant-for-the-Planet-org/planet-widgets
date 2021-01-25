export function getFormattedNumber(
    number,
    locale
  ) {
      // To Do - use user's lang code
    const formatter = new Intl.NumberFormat(locale);
    return formatter.format(number);
  }
  