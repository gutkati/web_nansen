import {NextResponse} from "next/server"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    const {username, password} = await req.json()

    if (
        username === process.env.AUTH_USER &&
        password === process.env.AUTH_PASS
    ) {
        const token = jwt.sign(
            {user: username},
            process.env.JWT_SECRET!,
            {expiresIn: "1h"} // время жизни токена
        )
        const response = NextResponse.json({success: true})
        //const response = NextResponse.redirect(new URL("/", req.url))
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            //secure: false,
            sameSite: "lax",
            maxAge: 60 * 60, // 1 час
            path: "/"
        })

        return response
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}