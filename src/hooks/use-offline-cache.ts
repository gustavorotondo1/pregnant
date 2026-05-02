"use client";

import { openDB } from "idb";

const DB_NAME = "pregnant-offline-db";
const STORE_NAME = "offline-records";

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export async function saveOfflineRecord<T>(record: T & { id: string }) {
  const db = await getDb();
  await db.put(STORE_NAME, record);
}

export async function getOfflineRecords<T>() {
  const db = await getDb();
  return (await db.getAll(STORE_NAME)) as T[];
}

export async function clearOfflineRecord(id: string) {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}
