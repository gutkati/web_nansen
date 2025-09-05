import {NextResponse} from "next/server"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    const {username, password} = await req.json()

    if (
        username === process.env.AUTH_USER &&
        password === process.env.AUTH_PASS
    ) {
        // 7 дней в секундах
        const weekSeconds = 60 * 60 * 24 * 7

        const token = jwt.sign(
            {user: username},
            process.env.JWT_SECRET!,
            {expiresIn: `${weekSeconds}s`} // время жизни токена
        )
        const response = NextResponse.json({success: true})
        //const response = NextResponse.redirect(new URL("/", req.url))
        response.cookies.set("token", token, {
            httpOnly: true,
            //secure: process.env.NODE_ENV === "production",
            secure: false,
            sameSite: "lax",
            maxAge: weekSeconds, // 1 неделя
            path: "/"
        })
        return response
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}