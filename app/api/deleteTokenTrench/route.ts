import connection from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function DELETE(req: NextRequest) {
    const conn = await connection.getConnection();
    try {
        const {tokenId} = await req.json();

        if (!tokenId) {
            return NextResponse.json({error: "Неверные параметры запроса"}, {status: 400});
        }

        await conn.beginTransaction();

        // await conn.query("DELETE FROM bought_sold WHERE token_id = ?", [tokenId]);
        // await conn.query("DELETE FROM last_purchase WHERE token_id = ?", [tokenId]);
        await conn.query("DELETE FROM trench_tokens WHERE id = ?", [tokenId]);

        await conn.commit();

        return NextResponse.json({success: true});
    } catch (error) {
        await conn.rollback();
        return NextResponse.json({error: "Ошибка сервера"}, {status: 500});
    } finally {
        conn.release();
    }
}