import crypto from 'crypto';

interface SessionData {
  userId: string;
  createdAt: number;
  [key: string]: unknown;
}

// In-memory session store (replace with Redis in production)
const store = new Map<string, { data: SessionData; expiresAt: number }>();
const SESSION_TTL_MS = parseInt(process.env.SESSION_TTL_MS || '3600000', 10); // 1h

export function createSession(userId: string, extra: Record<string, unknown> = {}): string {
  const token = crypto.randomBytes(32).toString('hex');
  store.set(token, {
    data: { userId, createdAt: Date.now(), ...extra },
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  return token;
}

export function getSession(token: string): SessionData | null {
  const entry = store.get(token);
  if (!entry || Date.now() > entry.expiresAt) {
    store.delete(token);
    return null;
  }
  return entry.data;
}

export function deleteSession(token: string): void {
  store.delete(token);
}

export function refreshSession(token: string): boolean {
  const entry = store.get(token);
  if (!entry || Date.now() > entry.expiresAt) return false;
  entry.expiresAt = Date.now() + SESSION_TTL_MS;
  return true;
}

// Cleanup expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, entry] of store) {
    if (now > entry.expiresAt) store.delete(token);
  }
}, 600_000);
