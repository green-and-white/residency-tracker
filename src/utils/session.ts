export function createSession() {
  const session = {
    sessionId: Math.random().toString(36).substring(2),
    expiresAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
  };
  localStorage.setItem('session', JSON.stringify(session));
  return session;
}

export function getSession() {
  const sessionStr = localStorage.getItem('session');
  if (!sessionStr) return null;

  const session = JSON.parse(sessionStr);

  if (new Date(session.expiresAt) < new Date()) {
    localStorage.removeItem('session');
    return null;
  }

  return session;
}

export function destroySession() {
  localStorage.removeItem('session');
}
