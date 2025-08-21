import connection from '../db';

interface Timestamp {
    token_id: number;
    timestamp: string;
}

export async function getPurchaseDatesByTokenId(tokenId: number): Promise<Timestamp[]> {
    const [rows] = await connection.query(
        `SELECT b.timestamp
         FROM bought_sold b
                  LEFT JOIN black_list bl ON b.address = bl.address
         WHERE b.token_id = ? AND bl.address IS NULL`,
        [tokenId]
    )
    return rows as Timestamp[]
}