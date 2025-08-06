import connection from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function PATCH(req: NextRequest) {
    const {show_key, id, address} = await req.json()

    if (!id || typeof show_key !== "boolean") {
        return NextResponse.json({error: "Неверные параметры запроса"}, {status: 400});
    }

    try {
        await connection.query(
            "UPDATE bought_sold SET show_key = ? WHERE id = ? AND address = ?",
            [show_key, id, address]
        )

        return NextResponse.json({success: true});
    } catch (error) {
        console.error("Ошибка при обновлении show_key:", error);
        return NextResponse.json({error: "Ошибка сервера"}, {status: 500});
    }
}