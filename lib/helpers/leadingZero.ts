const toHexWithLeadingZero = (number: Number) => {
  const hex = Number(number).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

export default toHexWithLeadingZero;
