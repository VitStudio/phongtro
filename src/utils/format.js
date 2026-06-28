/** Format a number to Vietnamese locale string */
export const formatCurrency = (n) => (Number(n) || 0).toLocaleString('vi-VN');
