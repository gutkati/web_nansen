import connection from "@/lib/db";

interface DateLastPurchase {
    token_id: number;
    id: number;
    timestamp: string;
}

export async function getDateLastPurchase(): Promise<DateLastPurchase[]> {
    const [rows] = await connection.query(
        'SELECT token_id, id, timestamp FROM tgm_holders',
    )

    return rows as DateLastPurchase[]
}