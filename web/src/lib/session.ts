import { getMe, logout } from "@/api";

const NAME_KEY = "startpage:displayName";

export const meQueryKey = ["me"] as const;

export function readCachedName(): string | undefined {
  try {
    return localStorage.getItem(NAME_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

function writeCachedName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // storage unavailable; the name is simply not cached
  }
}

function clearCachedName() {
  try {
    localStorage.removeItem(NAME_KEY);
  } catch {
    // nothing to clear
  }
}

export function goToLogin() {
  window.location.assign("/auth/login");
}

export async function fetchDisplayName(): Promise<string> {
  const { data, response } = await getMe();
  if (response?.status === 401) {
    clearCachedName();
    goToLogin();
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
