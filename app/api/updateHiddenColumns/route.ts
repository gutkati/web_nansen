import { NextRequest, NextResponse } from "next/server";
import connection from "@/lib/db";
import { RowDataPacket } from "mysql2";

type HiddenRow = {
  hidden_columns: string | null;
} & RowDataPacket;

export async function POST(req: NextRequest) {
  try {
    const { tableName, columnName, hidden } = await req.json();

    if (!tableName || !columnName) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    console.log("🔹 Запрос:", { tableName, columnName, hidden });

    const [rows] = await connection.execute<HiddenRow[]>(
      `SELECT hidden_columns FROM columns_table_hidden WHERE table_name = ?`,
      [tableName]
    );

    let hiddenColumns: string[] = [];

    // если запись есть — парсим
    if (rows.length > 0 && rows[0].hidden_columns) {
      try {
        const parsed = JSON.parse(rows[0].hidden_columns);
        if (Array.isArray(parsed)) {
          hiddenColumns = parsed;
        }
      } catch (e) {
        console.warn("⚠️ Ошибка парсинга JSON:", e);
        hiddenColumns = [];
      }
    }

    console.log("🧩 Текущее состояние:", hiddenColumns);

    // обновляем массив
    if (hidden) {
      if (!hiddenColumns.includes(columnName)) {
        hiddenColumns.push(columnName);
      }
    } else {
      hiddenColumns = hiddenColumns.filter(c => c !== columnName);
    }

    const jsonData = JSON.stringify(hiddenColumns);

    console.log("💾 Новое состояние:", jsonData);

    // если запись уже есть → обновляем
    if (rows.length > 0) {
      await connection.execute(
        `UPDATE columns_table_hidden SET hidden_columns = ? WHERE table_name = ?`,
        [jsonData, tableName]
      );
    } else {
      await connection.execute(
        `INSERT INTO columns_table_hidden (table_name, hidden_columns) VALUES (?, ?)`,
        [tableName, jsonData]
      );
    }

    return NextResponse.json({ success: true, hiddenColumns });
  } catch (error) {
    console.error("❌ Ошибка при обновлении скрытых колонок:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}


// вариант 2
// import { NextRequest, NextResponse } from "next/server";
// import connection from "@/lib/db";
// import { RowDataPacket } from "mysql2";
//
// type HiddenRow = {
//   hidden_columns: string;
// } & RowDataPacket;
//
// export async function POST(req: NextRequest) {
//   try {
//     const { tableName, columnName, hidden } = await req.json();
//
//     if (!tableName || !columnName) {
//       return NextResponse.json({ error: "Invalid input" }, { status: 400 });
//     }
//
//     // Получаем текущие скрытые колонки
//     const [rows] = await connection.execute<HiddenRow[]>(
//       `SELECT hidden_columns FROM columns_table_hidden WHERE table_name = ?`,
//       [tableName]
//     );
//
//     let hiddenColumns: string[] = [];
//
//     if (rows.length > 0 && rows[0].hidden_columns) {
//       try {
//         hiddenColumns = JSON.parse(rows[0].hidden_columns);
//       } catch {
//         hiddenColumns = [];
//       }
//     }
//
//     // Обновляем массив
//     if (hidden) {
//       // Добавляем, если нет
//       if (!hiddenColumns.includes(columnName)) {
//         hiddenColumns.push(columnName);
//       }
//     } else {
//       // Удаляем, если показываем обратно
//       hiddenColumns = hiddenColumns.filter(c => c !== columnName);
//     }
//
//     const jsonData = JSON.stringify(hiddenColumns);
//
//     // Если запись уже есть → UPDATE
//     if (rows.length > 0) {
//       await connection.execute(
//         `UPDATE columns_table_hidden SET hidden_columns = ? WHERE table_name = ?`,
//         [jsonData, tableName]
//       );
//     } else {
//       // Если записи нет → INSERT
//       await connection.execute(
//         `INSERT INTO columns_table_hidden (table_name, hidden_columns) VALUES (?, ?)`,
//         [tableName, jsonData]
//       );
//     }
//
//     return NextResponse.json({ success: true, hiddenColumns: hiddenColumns });
//   } catch (error) {
//     console.error("Ошибка при обновлении скрытых колонок:", error);
//     return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
//   }
// }

// вариант 1
// import connection from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";
// import { RowDataPacket } from "mysql2";
//
// type HiddenRow = {
//   hidden_columns: string;
// } & RowDataPacket;
//
// export async function POST(req: NextRequest) {
//   const { tableName, columnName, hidden } = await req.json();
//
//   if (!tableName || !columnName || typeof hidden !== "boolean") {
//     return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
//   }
//
//   try {
//     // 1️⃣ Получаем текущий массив скрытых колонок
//     const [rows] = await connection.execute<HiddenRow[]>(
//       `SELECT hidden_columns FROM columns_table_hidden WHERE table_name = ?`,
//       [tableName]
//     );
//
//     let hiddenColumns: string[] = [];
//
//     if (rows.length && rows[0].hidden_columns) {
//       try {
//         hiddenColumns = JSON.parse(rows[0].hidden_columns);
//         if (!Array.isArray(hiddenColumns)) hiddenColumns = [];
//       } catch {
//         hiddenColumns = [];
//       }
//     }
//
//     // 2️⃣ Добавляем или убираем колонку
//     if (hidden) {
//       // скрываем
//       if (!hiddenColumns.includes(columnName)) hiddenColumns.push(columnName);
//     } else {
//       // показываем
//       hiddenColumns = hiddenColumns.filter(c => c !== columnName);
//     }
//
//     // 3️⃣ Обновляем запись
//     await connection.execute(
//       `UPDATE columns_table_hidden SET hidden_columns = ? WHERE table_name = ?`,
//       [JSON.stringify(hiddenColumns), tableName]
//     );
//
//     return NextResponse.json({ success: true, hiddenColumns });
//   } catch (err) {
//     console.error("Ошибка при обновлении скрытых колонок:", err);
//     return NextResponse.json({ error: "Ошибка при обновлении скрытых колонок" }, { status: 500 });
//   } finally {
//     // Если connection глобальный — не закрываем
//   }
// }
