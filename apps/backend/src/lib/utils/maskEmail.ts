import { clamp } from './math';

function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;

  const safePortion = clamp(3, 0, user.length);
  const visible = user.slice(0, safePortion);
  const masked = '*'.repeat(user.length - safePortion);

  return `${visible}${masked}@${domain}`;
}

export default maskEmail;
