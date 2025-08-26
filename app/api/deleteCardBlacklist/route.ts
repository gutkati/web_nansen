import connection from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const {address} = await req.json()

        if (!address) {
            return NextResponse.json({error: "Неверные параметры запроса"}, {status: 400});
        }
        await connection.query(
            "DELETE FROM black_list WHERE address = ?",
            [address]
        )

        return NextResponse.json({success: true});
    } catch (error) {
        return NextResponse.json({error: "Ошибка сервера"}, {status: 500});
    }
}