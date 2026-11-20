import { getMe, logout } from "@/api";

const NAME_KEY = "startpage:displayName";

export const meQueryKey = ["me"] as const;

function withStorage<T>(fallback: T, op: (storage: Storage) => T): T {
  try {
    return op(localStorage);
  } catch {
    return fallback;
  }
}

export function readCachedName(): string | undefined {
  return withStorage(undefined, (s) => s.getItem(NAME_KEY) ?? undefined);
}

function writeCachedName(name: string) {
  withStorage(undefined, (s) => s.setItem(NAME_KEY, name));
}

function clearCachedName() {
  withStorage(undefined, (s) => s.removeItem(NAME_KEY));
}

export function goToLogin() {
  window.location.assign("/auth/login");
}

export async function fetchDisplayName(): Promise<string> {
  const { data, response } = await getMe();
  if (response?.status === 401) {
    clearCachedName();
    goToLogin();
    // never settles so callers don't render while the browser navigates away
    return new Promise<string>(() => {});
  }
  if (!data) throw new Error(`GET /api/me failed: ${response?.status}`);
  writeCachedName(data.displayName);
  return data.displayName;
}

export async function signOut() {
  try {
    await logout();
  } finally {
    clearCachedName();
    goToLogin();
  }
}
