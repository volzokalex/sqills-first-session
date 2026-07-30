// Client-side artifact storage. IndexedDB keyed by artifact id — no server persistence.
const DB = 'sqills-first-session';
const STORE = 'artifacts';

function open() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function saveArtifact(artifact) {
  try {
    const db = await open();
    await new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(artifact);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  } catch (e) {
    // IndexedDB unavailable (private mode etc.) — fall back to sessionStorage so the
    // prototype never dead-ends. The PDF export (fast-follow) is the real durability path.
    sessionStorage.setItem('artifact:' + artifact.id, JSON.stringify(artifact));
  }
  return artifact.id;
}

export async function loadArtifact(id) {
  try {
    const db = await open();
    return await new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readonly');
      const g = tx.objectStore(STORE).get(id);
      g.onsuccess = () => res(g.result || null);
      g.onerror = () => rej(g.error);
    });
  } catch (e) {
    const raw = sessionStorage.getItem('artifact:' + id);
    return raw ? JSON.parse(raw) : null;
  }
}
