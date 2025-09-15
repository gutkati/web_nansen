import connection from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function PATCH(req: NextRequest) {
    const conn = await connection.getConnection();
    try {
        const {newToken} = await req.json();

        if (!newToken) {
            return NextResponse.json({error: "Неверные параметры запроса"}, {status: 400});
        }

        const {name, token_address, chain, url, trade_volume} = newToken

        // Проверяем, есть ли уже такой токен
        const [rows] = await conn.query(
            `SELECT id FROM tokens WHERE token_address = ? LIMIT 1`,
            [token_address, name]
        );

        if ((rows as any[]).length > 0) {
            // Уже есть → 409 Conflict
            return NextResponse.json(
                { error: "Токен с таким адресом уже сохранён" },
                { status: 409 }
            );
        }

        await conn.beginTransaction()
        await conn.query(
            `INSERT INTO tokens (name, token_address, chain, url, trade_volume, added_at) VALUES (?, ?, ?, ?, ?, NOW())`,
            [name, token_address, chain, url, trade_volume]
        );
        await conn.commit();

        return NextResponse.json({success: true});
    } catch (error) {
        console.error("DB ERROR:", error);
        await conn.rollback();
        return NextResponse.json({error: "Ошибка сервера"}, {status: 500});
    } finally {
        conn.release();
    }
}