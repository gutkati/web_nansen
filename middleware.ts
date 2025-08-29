import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // /login и /api/login не проверяем
  if (pathname.startsWith("/login") || pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const token = req.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!)
    console.log("3", process.env.JWT_SECRET)
    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
   matcher: ["/((?!_next|static|favicon.ico).*)"],
  //matcher: ["/:path*"],
}