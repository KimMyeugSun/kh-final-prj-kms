export const DateFormat = (date, formatString) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours24 = String(date.getHours()).padStart(2, '0');
  const hours12 = String(date.getHours() % 12 || 12).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = date.getHours() < 12 ? 'AM' : 'PM';

  return formatString
    .replace(/YYYY|yyyy/g, year)
    .replace(/MM/g, month)
    .replace(/DD|dd/g, day)
    .replace(/HH/g, hours24)
    .replace(/hh/g, hours12)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds)
    .replace(/A/g, ampm);
};