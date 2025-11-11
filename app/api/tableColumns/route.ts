import connection from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";
import {RowDataPacket} from "mysql2";

type ColumnRow = { Field: string };
type HiddenRow = { hidden_columns: string };

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const tableName = searchParams.get("tableName");

    if (!tableName) {
        return NextResponse.json({error: "tableName required"}, {status: 400});
    }

    try {
        // 1️⃣ Получаем все колонки таблицы
        const [columns] = await connection.execute<ColumnRow[] & RowDataPacket[]>(`SHOW COLUMNS FROM \`${tableName}\``);
        const allColumns = columns.map(c => c.Field);

        // 2️⃣ Получаем скрытые колонки из БД
        const [hiddenRows] = await connection.execute<HiddenRow[] & RowDataPacket[]>(
            `SELECT hidden_columns
             FROM columns_table_hidden
             WHERE table_name = ?`,
            [tableName]
        );

        let hiddenColumns: string[] = [];
        if (hiddenRows.length && hiddenRows[0].hidden_columns) {
            try {
                hiddenColumns = JSON.parse(hiddenRows[0].hidden_columns);
            } catch (e) {
                console.error("Ошибка парсинга hidden_columns:", e);
            }
        }

        return NextResponse.json({allColumns, hiddenColumns});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Ошибка при получении колонок"}, {status: 500});
    }

}


// import connection from "@/lib/db";
// import { NextResponse } from "next/server";
// import { RowDataPacket } from "mysql2";
//
// /** Тип строки из таблицы columns_table_hidden */
// type ColumnsTableHiddenRow = {
//   table_name: string;
//   hidden_columns: string; // хранится в БД в виде JSON-строки
// };
//
// /** Тип строки из SHOW COLUMNS */
// type TableColumnRow = {
//   Field: string;
// };
//
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const tableName = searchParams.get("tableName");
//
//   if (!tableName) {
//     return NextResponse.json({ error: "tableName required" }, { status: 400 });
//   }
//
//   try {
//     // 1️⃣ Получаем все столбцы указанной таблицы
//     const [columns] = await connection.execute<TableColumnRow[] & RowDataPacket[]>(`
//       SHOW COLUMNS FROM \`${tableName}\`
//     `);
//     const allColumns = columns.map(c => c.Field); // string[]
//
//     // 2️⃣ Получаем скрытые столбцы из columns_table_hidden
//     const [hiddenResult] = await connection.execute<ColumnsTableHiddenRow[] & RowDataPacket[]>(
//       `SELECT hidden_columns FROM columns_table_hidden WHERE table_name = ?`,
//       [tableName]
//     );
//
//     let hiddenColumns: string[] = [];
//
//     if (hiddenResult.length && hiddenResult[0].hidden_columns) {
//       try {
//         const parsed = JSON.parse(hiddenResult[0].hidden_columns);
//
//         // Проверяем, что это именно массив строк
//         if (Array.isArray(parsed) && parsed.every(item => typeof item === "string")) {
//           hiddenColumns = parsed;
//         } else {
//           console.warn("⚠️ Поле hidden_columns не массив строк:", parsed);
//         }
//       } catch (e) {
//         console.error("Ошибка парсинга hidden_columns:", e);
//       }
//     }
//
//     // 3️⃣ Возвращаем только видимые колонки
//     const visibleColumns = allColumns.filter(c => !hiddenColumns.includes(c));
//
//     return NextResponse.json(visibleColumns);
//   } catch (err) {
//     console.error("Ошибка при получении колонок:", err);
//     return NextResponse.json({ error: "Ошибка при получении колонок" }, { status: 500 });
//   } finally {
//     // ✅ Не закрывай соединение, если connection — глобальный (из lib/db)
//     // await connection.end();
//   }
// }
