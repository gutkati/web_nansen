import connection from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function PATCH(req: NextRequest) {
    const conn = await connection.getConnection();
    try {
        const {address} = await req.json();

        if (!address) {
            return NextResponse.json({error: "Неверные параметры запроса"}, {status: 400});
        }

        await conn.beginTransaction()

        // 1. Создаём таблицу, если её нет
        await conn.query(`
            CREATE TABLE IF NOT EXISTS black_list (
                id INT AUTO_INCREMENT PRIMARY KEY,
                address VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await conn.query(
            `INSERT INTO black_list (address) VALUES (?)`,
            [address]
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