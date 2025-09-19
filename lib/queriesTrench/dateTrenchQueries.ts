import connection from '../db';

interface Timestamp {
    token_id: number;
    timestamp: string;
}

export async function getTrenchDatesByTokenId(tokenId: number): Promise<Timestamp[]> {
    const [rows] = await connection.query(
        `SELECT b.token_id, b.timestamp
         FROM tgm_holders b WHERE b.token_id = ?`,
        [tokenId]
    )
    return rows as Timestamp[]
}