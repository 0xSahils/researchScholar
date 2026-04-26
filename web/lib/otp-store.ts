type OtpRecord = { code: string; expiresAt: number };

const otpStore = new Map<string, OtpRecord>();

export function setOtp(key: string, code: string, ttlMs = 10 * 60 * 1000) {
  otpStore.set(key, { code, expiresAt: Date.now() + ttlMs });
}

export function verifyOtp(key: string, code: string) {
  const row = otpStore.get(key);
  if (!row) return false;
  if (row.expiresAt < Date.now()) {
    otpStore.delete(key);
    return false;
  }
  const isValid = row.code === code;
  if (isValid) otpStore.delete(key);
  return isValid;
}
