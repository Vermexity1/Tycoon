export const formatNumber = (num: number): string => {
  if (num === 0) return "0";
  if (num < 1000) return Math.floor(num).toString();
  
  const suffixes = [
    "", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", 
    "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", "Vg"
  ];
  const suffixNum = Math.floor(Math.log10(Math.abs(num)) / 3);
  
  if (suffixNum === 0) return Math.floor(num).toString();
  if (suffixNum >= suffixes.length) return num.toExponential(2);

  const shortValue = (num / Math.pow(1000, suffixNum));
  // Keep up to 2 decimal places, but remove trailing zeros if integer (e.g. 1.00k -> 1k)
  return parseFloat(shortValue.toFixed(2)) + suffixes[suffixNum];
};