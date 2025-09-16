import connection from '../db';

interface TokenTrench {
    id: number;
    name: string;
    url: string;
    added_at: Date | null;
}

export async function getTokensTrench(): Promise<TokenTrench[]> {
    const [queryTokenTrench] = await connection.query('SELECT * FROM trench_tokens')
    return queryTokenTrench as TokenTrench[]
}