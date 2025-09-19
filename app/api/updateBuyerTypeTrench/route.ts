import connection from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function PATCH(req: NextRequest) {
    const {buyer_type, address} = await req.json()

    if (!address || typeof buyer_type !== "string" && buyer_type !== null) {
        return NextResponse.json({error: "Неверные параметры запроса"}, {status: 400});
    }

    try {
        await connection.query(
            "UPDATE tgm_holders SET buyer_type = ? WHERE address = ?",
            [buyer_type, address]
        )

        return NextResponse.json({success: true});
    } catch (error) {
        console.error("Ошибка при обновлении buyer_type:", error);
        return NextResponse.json({error: "Ошибка сервера"}, {status: 500});
    }
}