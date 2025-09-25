import connection from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const {id} = await req.json()

        if (!id) {
            return NextResponse.json({error: "Неверные параметры запроса"}, {status: 400});
        }
        await connection.query(
            "DELETE FROM tgm_holders WHERE id = ?",
            [id]
        )

        return NextResponse.json({success: true});
    } catch (error) {
        return NextResponse.json({error: "Ошибка сервера"}, {status: 500});
    }
}