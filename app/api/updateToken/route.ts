import connection from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function PATCH(req: NextRequest) {
    const {id, trade_volume} = await req.json()

    try {
        await connection.query(
            "UPDATE tokens SET trade_volume = ? WHERE id = ?",
            [trade_volume, id]
        )

        return NextResponse.json({success: true});
    } catch (error) {
        console.error("Ошибка при обновлении trade_volume:", error);
        return NextResponse.json({error: "Ошибка сервера"}, {status: 500});
    }
}