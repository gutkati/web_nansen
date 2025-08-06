import connection from '../db';

interface Timestamp {
    token_id: number;
    timestamp: string;
}

export async function getPurchaseDatesByTokenId(tokenId: number): Promise<Timestamp[]> {
    const [rows] = await connection.query(
        'SELECT timestamp FROM bought_sold WHERE token_id = ?',
        [tokenId]
    )
    return rows as Timestamp[]
}