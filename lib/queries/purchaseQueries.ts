import connection from '../db';

interface Purchase {
    id: number;
    token_id: number;
    address: string
    address_labels: string;
    bought_usd_volume: string;
    current_balance: string;
    timestamp: string;
    show_key: number | null;
    buyer_type: string | null;
}

export async function getPurchaseByTokenId(tokenId: number): Promise<Purchase[]> {
    // const [rows] = await connection.query(
    //     'SELECT id, token_id, address, address_labels, bought_usd_volume, current_balance, show_key, buyer_type, timestamp FROM bought_sold WHERE token_id = ?',
    //     [tokenId]
    // )

    const [rows] = await connection.query(
        `SELECT b.id, b.token_id, b.address, b.address_labels, b.bought_usd_volume, 
                b.current_balance, b.show_key, b.buyer_type, b.timestamp
         FROM bought_sold b
         LEFT JOIN black_list bl ON b.address = bl.address
         WHERE b.token_id = ? AND bl.address IS NULL`,
        [tokenId]
    )

    return rows as Purchase[]
}