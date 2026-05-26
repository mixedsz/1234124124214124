import { put, list } from '@vercel/blob';

const REGISTRY_PATH = 'metrics/registry.json';

export interface ServerRecord {
  id: string;
  cfxId?: string;
  name: string;
  players: number;
  maxPlayers: number;
  resources: string[];
  lastSeen: number;
}

export type Registry = Record<string, ServerRecord>;

export async function readRegistry(): Promise<Registry> {
  try {
    const { blobs } = await list({ prefix: 'metrics/' });
    const registryBlob = blobs.find((b: { pathname: string; url: string }) => b.pathname === REGISTRY_PATH);
    if (!registryBlob) return {};
    const r = await fetch(registryBlob.url, { cache: 'no-store' });
    if (!r.ok) return {};
    return await r.json();
  } catch { return {}; }
}

export async function writeRegistry(registry: Registry): Promise<void> {
  await put(REGISTRY_PATH, JSON.stringify(registry), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}
