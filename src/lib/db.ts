import mongoose from "mongoose";
import { env } from "./env";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;
if (!g.__mongooseCache) g.__mongooseCache = { conn: null, promise: null } as Cache;
const cache: Cache = g.__mongooseCache;

export async function dbConnect() {
  if (cache.conn) return cache.conn;
  if (!env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  if (!cache.promise) {
    cache.promise = mongoose.connect(env.MONGODB_URI, { bufferCommands: false });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
