import connection from "@/lib/db";

interface DateLastPurchase {
    token_id: number;
    id: number;
    timestamp: string;
}

export async function getDateLastPurchase(): Promise<DateLastPurchase[]> {
    const [rows] = await connection.query(
         `
        SELECT t.token_id, t.id, t.timestamp
        FROM tgm_holders t
        LEFT JOIN black_list_trench b ON t.address = b.address
        WHERE b.address IS NULL
        `
    )

    return rows as DateLastPurchase[]
}