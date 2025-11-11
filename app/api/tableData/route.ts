import connection from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";
import {RowDataPacket} from "mysql2";

/** Тип строки из SHOW COLUMNS */
interface TableColumnRow extends RowDataPacket {
    Field: string;
}

/** Тип строки с скрытыми колонками */
interface HiddenColumnsRow extends RowDataPacket {
    hidden_columns: string | null;
}

/** Тип произвольной строки данных таблицы */
type DataRow = Record<string, unknown>;

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const tableName = searchParams.get("tableName");

    if (!tableName) {
        return NextResponse.json({error: "tableName required"}, {status: 400});
    }

    try {
        // 1️⃣ Получаем все колонки таблицы
        const [columns] = await connection.execute<TableColumnRow[]>(
            `SHOW COLUMNS FROM \`${tableName}\``
        );
        const allColumns = columns.map(c => c.Field);

        // 2️⃣ Получаем скрытые колонки
        const [hiddenRows] = await connection.execute<HiddenColumnsRow[]>(
            `SELECT hidden_columns
             FROM columns_table_hidden
             WHERE table_name = ?`,
            [tableName]
        );

        let hiddenColumns: string[] = [];
        if (hiddenRows.length > 0 && hiddenRows[0].hidden_columns) {
            try {
                const parsed = JSON.parse(hiddenRows[0].hidden_columns);
                if (Array.isArray(parsed)) {
                    hiddenColumns = parsed.filter(col => typeof col === "string");
                }
            } catch (e) {
                console.warn("Ошибка парсинга hidden_columns:", e);
            }
        }

        // 3️⃣ Определяем видимые колонки
        const visibleColumns = allColumns.filter(col => !hiddenColumns.includes(col));

        if (visibleColumns.length === 0) {
            return NextResponse.json({columns: [], data: []});
        }

        // 4️⃣ Формируем SQL-запрос с нужными колонками
        const sql = `SELECT ${visibleColumns.map(c => `\`${c}\``).join(", ")}
                     FROM \`${tableName}\``;

        const [rows] = await connection.execute<DataRow[]>(sql);

        return NextResponse.json({
            columns: visibleColumns,
            data: rows,
        });
    } catch (err) {
        console.error("Ошибка при получении данных таблицы:", err);
        return NextResponse.json({error: "Ошибка при получении данных таблицы"}, {status: 500});
    }
}


// import connection from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";
//
// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const tableName = searchParams.get("tableName");
//
//   if (!tableName) {
//     return NextResponse.json({ error: "tableName required" }, { status: 400 });
//   }
//
//   try {
//     // 1️⃣ Получаем видимые колонки через тот же механизм, что и раньше
//     const [columns]: any[] = await connection.execute(`SHOW COLUMNS FROM \`${tableName}\``);
//     const allColumns = columns.map((c: any) => c.Field);
//
//     const [hiddenRows]: any[] = await connection.execute(
//       `SELECT hidden_columns FROM columns_table_hidden WHERE table_name = ?`,
//       [tableName]
//     );
//
//     let hiddenColumns: string[] = [];
//     if (hiddenRows.length && hiddenRows[0].hidden_columns) {
//       try {
//         hiddenColumns = JSON.parse(hiddenRows[0].hidden_columns);
//       } catch {
//         hiddenColumns = [];
//       }
//     }
//
//     const visibleColumns = allColumns.filter((c: string) => !hiddenColumns.includes(c));
//
//     if (visibleColumns.length === 0) {
//       return NextResponse.json({ columns: [], data: [] });
//     }
//
//     // 2️⃣ Формируем SQL с нужными колонками
//     const sql = `SELECT ${visibleColumns.map(c => `\`${c}\``).join(", ")} FROM \`${tableName}\``;
//
//     const [rows]: any[] = await connection.execute(sql);
//
//     return NextResponse.json({
//       columns: visibleColumns,
//       data: rows,
//     });
//   } catch (err) {
//     console.error("Ошибка при получении данных таблицы:", err);
//     return NextResponse.json({ error: "Ошибка при получении данных таблицы" }, { status: 500 });
//   }
// }
