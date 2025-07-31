export default function extractYearAndMonth(dateString?: string) {
  if (!dateString) {
    return null;
  }

  const re = /^\d{4}-(0[1-9]|1[0-2])$/;

  if (!re.test(dateString)) {
    throw new Error('String must satisfy format YYYY-MM');
  }

  return String(dateString).split('-').map(Number);
}
