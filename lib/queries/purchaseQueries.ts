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
}

export async function getPurchaseByTokenId(tokenId: number): Promise<Purchase[]> {
    const [rows] = await connection.query(
        'SELECT id, token_id, address, address_labels, bought_usd_volume, current_balance, show_key, timestamp FROM bought_sold WHERE token_id = ?',
        [tokenId]
    )

    return rows as Purchase[]
}