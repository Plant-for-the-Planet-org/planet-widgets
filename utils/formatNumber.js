export function getFormattedNumber(
    number
  ) {
      // To Do - use user's lang code
    const formatter = new Intl.NumberFormat('en-IN');
    return formatter.format(number);
  }
  