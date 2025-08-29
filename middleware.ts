import {NextResponse} from "next/server"
import type {NextRequest} from "next/server"
import jwt from "jsonwebtoken"
import {jwtVerify} from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");

async function verifyJwt(token: string) {
  try {
    // Поддерживает HS256 токены, выпущенные jsonwebtoken
    return await jwtVerify(token, secret);
  } catch (e) {
    console.error("JWT ERR:", e);
    return null;
  }
}

export async function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl

    // /login и /api/login не проверяем
    if (pathname.startsWith("/login") || pathname.startsWith("/api")) {
        return NextResponse.next()
    }

    const token = req.cookies.get("token")?.value

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    const ok = await verifyJwt(token);
  if (!ok) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|static|favicon.ico).*)"],
    runtime: "nodejs"
}