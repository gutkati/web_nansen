import connection from "@/lib/db";
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

type LastPurchaseRow = {
    purchase_id: number;
} & RowDataPacket;

export async function saveLastPurchase(tokenId: number, purchaseId: number): Promise<void> {
    const [rows] = await connection.query<LastPurchaseRow[]>(
        'SELECT purchase_id FROM last_purchase WHERE token_id = ?',
        [tokenId]
    );

    const existingId = Array.isArray(rows) && rows.length > 0 ? rows[0].purchase_id : null;

    if (existingId === null || existingId !== purchaseId) {
        await connection.query(
            `INSERT INTO last_purchase (token_id, purchase_id)
             VALUES (?, ?) ON DUPLICATE KEY
            UPDATE purchase_id =
            VALUES (purchase_id)`,
            [tokenId, purchaseId]);
    }
}