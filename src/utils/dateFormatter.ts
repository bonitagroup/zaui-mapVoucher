export const formatCountdown = (milliseconds: number): string => {
  if (milliseconds <= 0) return '00:00:00';

  const totalSec = Math.floor(milliseconds / 1000);
  const h = Math.floor(totalSec / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((totalSec % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');

  return `${h}:${m}:${s}`;
};

export const formatDateVN = (dateInput: string | Date | number): string => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
