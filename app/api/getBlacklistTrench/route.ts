import connection from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const conn = await connection.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id, address, address_labels, created_at FROM black_list_trench ORDER BY created_at DESC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Ошибка при получении black_list_trench:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  } finally {
    conn.release();
  }
}