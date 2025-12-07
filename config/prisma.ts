import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
}

// Transaction client type - excludes methods not available in transaction context
export type TxClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$use' | '$transaction' | '$extends'>;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Parse connection string to extract SSL mode and prepare for Pool
const url = new URL(connectionString);
const sslMode = url.searchParams.get("sslmode") || "prefer";

// Configure SSL based on sslmode parameter
// For Pool, we need to explicitly configure SSL to handle self-signed certificates
// Supabase requires SSL, so use sslmode=require or sslmode=verify-full
let sslConfig: boolean | object = false;
if (sslMode === "require" || sslMode === "prefer") {
  // For require/prefer mode, allow self-signed certificates (useful for Supabase)
  // This is needed because Pool doesn't automatically handle self-signed certs
  // Vercel/Production: Accept self-signed certificates from Supabase
  sslConfig = {
    rejectUnauthorized: false, // Allow self-signed certificates for Supabase
  };
} else if (sslMode === "verify-ca" || sslMode === "verify-full") {
  // For verify modes, still allow self-signed for Supabase compatibility
  sslConfig = {
    rejectUnauthorized: false,
  };
} else if (sslMode === "disable") {
  sslConfig = false;
}

// Remove sslmode from connection string to avoid conflicts with Pool SSL config
// Pool uses its own SSL configuration, not the connection string parameter
const cleanConnectionString = connectionString;
const poolConnectionString = sslMode !== "disable" 
  ? cleanConnectionString.replace(/[?&]sslmode=[^&]*/, "").replace(/[?&]$/, "")
  : cleanConnectionString;

// Create pool with explicit SSL configuration
// Note: Pool requires explicit SSL config even when connection string has sslmode
// Force IPv4 to avoid ENETUNREACH errors with IPv6
const pool = new Pool({ 
  connectionString: poolConnectionString,
  ssl: sslConfig,
  // @ts-expect-error - family is a valid option but not in types
  family: 4, // Force IPv4
});
const adapter = new PrismaPg(pool);

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}


