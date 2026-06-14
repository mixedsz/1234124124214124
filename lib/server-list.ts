import { put, list } from '@vercel/blob';

const BLOB_PATH = 'config/featured-servers.json';

// Hardcoded fallback used until Blob has been written at least once
const DEFAULT_IDS = ['l7o9o4', 'ql64g9', 'javxzp', 'yjbqg5', '7b9kqrb'];

async function readIds(): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix: 'config/' });
    const blob = blobs.find((b: { pathname: string }) => b.pathname === BLOB_PATH);
    if (!blob) return DEFAULT_IDS;
    const r = await fetch((blob as { url: string }).url, { cache: 'no-store' });
    if (!r.ok) return DEFAULT_IDS;
    const data: unknown = await r.json();
    return Array.isArray(data) && data.length > 0 ? (data as string[]) : DEFAULT_IDS;
  } catch { return DEFAULT_IDS; }
}

async function writeIds(ids: string[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(ids), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export async function getServerIds(): Promise<string[]> {
  return readIds();
}

export async function addServerId(id: string): Promise<{ ids: string[]; added: boolean }> {
  const ids = await readIds();
  if (ids.includes(id)) return { ids, added: false };
  const updated = [...ids, id];
  await writeIds(updated);
  return { ids: updated, added: true };
}

export async function removeServerId(id: string): Promise<{ ids: string[]; removed: boolean }> {
  const ids = await readIds();
  if (!ids.includes(id)) return { ids, removed: false };
  const updated = ids.filter(s => s !== id);
  await writeIds(updated);
  return { ids: updated, removed: true };
}
