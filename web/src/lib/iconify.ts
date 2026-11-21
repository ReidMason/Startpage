const API = "https://api.iconify.design";

export async function searchIcons(query: string, signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(`${API}/search?query=${encodeURIComponent(query)}&limit=36`, { signal });
  if (!res.ok) throw new Error(`Iconify search failed: ${res.status}`);
  return ((await res.json()) as { icons: string[] }).icons;
}

export async function fetchIconBody(name: string): Promise<string> {
  const [prefix, icon] = name.split(":");
  const res = await fetch(`${API}/${prefix}.json?icons=${encodeURIComponent(icon)}`);
  if (!res.ok) throw new Error(`Iconify icon fetch failed: ${res.status}`);
  const body = ((await res.json()) as { icons?: Record<string, { body: string }> }).icons?.[icon]?.body;
  if (!body) throw new Error(`Iconify icon ${name} not found`);
  return body;
}
