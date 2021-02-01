export function getFormattedNumber(
    number,
    locale
  ) {
    const formatter = new Intl.NumberFormat(locale);
    return formatter.format(number);
  }
  
  // change 'de-disabled' to 'de' if you want to enable custom abbreviations for German
const localizedAbbr = {
  'en': {
    'b': 'b', 'm': 'm', 'k': 'k',
  },
  'de-disabled': {
    'b': 'Mrd.', 'm': 'Mio.', 'k': 'Tsd.',
  },
};

function getLocalizedAbbreviation(langCode, abbr) {
  return localizedAbbr[langCode] ? localizedAbbr[langCode][abbr] : localizedAbbr['en'][abbr];
}

  export function getFormattedRoundedNumber(
    langCode,
    number,
    fractionDigits,
  ) {
    // console.log("getFormattedRoundedNumber", langCode, number, fractionDigits);
    if (Math.round(number) === Math.round(number*fractionDigits*10)/(fractionDigits*10)) 
      fractionDigits = 0;
    const formatter = new Intl.NumberFormat(langCode, {
      // These options are needed to round to whole numbers if that's what you want.
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    return formatter.format(number);
  }

  export function localizedAbbreviatedNumber(
    langCode,
    number,
    fractionDigits,
  ) {
    if (number >= 1000000000)
      return getFormattedRoundedNumber(langCode, number/1000000000, fractionDigits) + getLocalizedAbbreviation(langCode, 'b');
    if (number >= 1000000)
      return getFormattedRoundedNumber(langCode, number/1000000, fractionDigits) + getLocalizedAbbreviation(langCode, 'm');
    if (number >= 1000)
      return getFormattedRoundedNumber(langCode, number/1000, fractionDigits) + getLocalizedAbbreviation(langCode, 'k');
  
    return getFormattedRoundedNumber(langCode, number, fractionDigits);
  }