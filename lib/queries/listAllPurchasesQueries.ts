import connection from "@/lib/db";

interface ListPurchases {
    id: number;
    token_id: number;
}

interface LastPurchase {
    token_id: number;
    purchase_id: number
}

export async function getPurchasesAll(): Promise<ListPurchases[]> {
    const [rows] = await connection.query(
        `SELECT MAX(b.id) as id, b.token_id
         FROM bought_sold b
                  LEFT JOIN black_list bl ON b.address = bl.address
         WHERE bl.address IS NULL
         GROUP BY b.token_id`
    );

    return rows as ListPurchases[]
}

export async function getLastPurchase(): Promise<LastPurchase[]> {
    const [rows] = await connection.query(
        'SELECT token_id, purchase_id FROM last_purchase',
    )

    return rows as LastPurchase[]
}