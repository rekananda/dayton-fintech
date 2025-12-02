import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1d";

if (!JWT_SECRET) {
  console.warn("[JWT] JWT_SECRET tidak terdefinisi. Set di .env untuk keamanan.");
}

const encoder = new TextEncoder();
const secretKey = JWT_SECRET ? encoder.encode(JWT_SECRET) : undefined;

export type TokenPayload = {
  sub: string;
  username: string;
  email: string;
  name?: string | null;
  role?: string;
};

export const signToken = async (payload: TokenPayload) => {
  if (!secretKey) {
    throw new Error("JWT_SECRET not configured");
  }

  return new SignJWT({
    username: payload.username,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
};

export const verifyToken = async (token: string): Promise<TokenPayload | null> => {
  if (!secretKey) {
    throw new Error("JWT_SECRET not configured");
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      sub: payload.sub ?? "",
      username: (payload.username as string) ?? "",
      email: (payload.email as string) ?? "",
      name: (payload.name as string) ?? null,
      role: (payload.role as string) ?? undefined,
    };
  } catch {
    return null;
  }
};

