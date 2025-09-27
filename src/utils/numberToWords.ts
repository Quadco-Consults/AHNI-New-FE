/**
 * Convert numbers to words in Nigerian English format
 * Supports amounts up to trillions with "naira" and "kobo" suffixes
 */

const ones = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const tens = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

const scales = [
  '', 'thousand', 'million', 'billion', 'trillion'
];

function convertHundreds(num: number): string {
  let result = '';

  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' hundred';
    num %= 100;
    if (num > 0) result += ' and ';
  }

  if (num >= 20) {
    result += tens[Math.floor(num / 10)];
    num %= 10;
    if (num > 0) result += '-' + ones[num];
  } else if (num > 0) {
    result += ones[num];
  }

  return result;
}

function convertToWords(num: number): string {
  if (num === 0) return 'zero';

  let result = '';
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk !== 0) {
      const chunkWords = convertHundreds(chunk);
      const scale = scales[scaleIndex];
      result = chunkWords + (scale ? ' ' + scale : '') + (result ? ' ' + result : '');
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return result;
}

export function numberToWords(amount: string | number): string {
  try {
    // Convert to number and handle empty/invalid inputs
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount) || numAmount < 0) {
      return '';
    }

    if (numAmount === 0) {
      return 'Zero naira only';
    }

    // Split into naira and kobo
    const parts = numAmount.toFixed(2).split('.');
    const naira = parseInt(parts[0]);
    const kobo = parseInt(parts[1]);

    let result = '';

    // Convert naira part
    if (naira > 0) {
      result += convertToWords(naira) + ' naira';
    }

    // Convert kobo part
    if (kobo > 0) {
      if (result) result += ' and ';
      result += convertToWords(kobo) + ' kobo';
    }

    // Add "only" at the end
    result += ' only';

    // Capitalize first letter
    return result.charAt(0).toUpperCase() + result.slice(1);

  } catch (error) {
    console.error('Error converting number to words:', error);
    return '';
  }
}

// Additional helper for formatting with proper grammar
export function formatAmountInWords(amount: string | number): string {
  const words = numberToWords(amount);

  // Handle special cases for better grammar
  return words
    .replace(/\bone\s+naira/gi, 'One naira') // Capitalize "One"
    .replace(/\bone\s+kobo/gi, 'one kobo')
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim();
}

// Examples of usage:
// numberToWords(1500) => "One thousand five hundred naira only"
// numberToWords(1500.50) => "One thousand five hundred naira and fifty kobo only"
// numberToWords(3000000) => "Three million naira only"