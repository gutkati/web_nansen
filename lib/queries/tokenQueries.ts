import connection from '../db';

interface Token {
    id: number;
    name: string;
    url: string;
    trade_volume: number;
    added_at: Date | null;
}

export async function getTokens(): Promise<Token[]> {
    const [queryToken] = await connection.query('SELECT * FROM tokens')
    return queryToken as Token[]
}