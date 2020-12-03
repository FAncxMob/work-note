export function formatPrice(val, floatNum = 2) {
  if (!checkIsValidNumber(val)) return val;

  if (floatNum < 0) return val;
  const [integerVal, float = ''] = parseFloat(val).toFixed(floatNum).toString().split('.');
  const integer = integerVal.toString().replace(/\B(?=(?:(\d{3})+\b))/g, ',');

  if (floatNum === 0) return integer;

  return `${integer}.${float}`;
}

function checkIsValidNumber(val) {
  return /^\d+\.?\d*?$/.test(val);
}
