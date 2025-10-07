import connection from '../db';

interface Timestamp {
    token_id: number;
    timestamp: string;
}

export async function getTrenchDatesByTokenId(tokenId: number): Promise<Timestamp[]> {
    const [rows] = await connection.query(
        `SELECT b.token_id, DATE (b.timestamp) AS timestamp
         FROM tgm_holders b
             LEFT JOIN black_list_trench bl
         ON b.address = bl.address
         WHERE
             b.token_id = ?
           AND bl.address IS NULL -- исключаем чёрный список
         GROUP BY DATE (b.timestamp)
         ORDER BY DATE (b.timestamp) DESC`,
        [tokenId]
    )
    return rows as Timestamp[]
}