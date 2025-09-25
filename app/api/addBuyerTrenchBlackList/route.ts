import connection from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function PATCH(req: NextRequest) {
    const conn = await connection.getConnection();
    try {
        const {address, address_labels} = await req.json();

        if (!address || !address_labels) {
            return NextResponse.json({error: "Неверные параметры запроса"}, {status: 400});
        }

        await conn.beginTransaction()

        await conn.query(
            `INSERT INTO black_list_trench (address, address_labels) VALUES (?, ?)`,
            [address, address_labels]
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