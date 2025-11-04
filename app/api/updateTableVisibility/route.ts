// app/api/updateTableVisibility/route.ts
import { NextResponse } from "next/server";
import connection from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { id, show_key } = await request.json();

        if (!id || show_key === undefined) {
            return NextResponse.json(
                { error: "Необходимы tables_id и show_key" },
                { status: 400 }
            );
        }

        // Обновляем поле show_key в базе данных
        const [result] = await connection.query(
            'UPDATE list_tables_for_show SET show_key = ? WHERE id = ?',
            [show_key, id]
        );

        return NextResponse.json({
            success: true,
            message: "Статус таблицы обновлен"
        });
    } catch (error) {
        console.error('Error updating table visibility:', error);
        return NextResponse.json(
            { error: "Не удалось обновить статус таблицы" },
            { status: 500 }
        );
    }
}