import connection from '../db';

interface Token {
    id: number;
    name: string;
    added_at: Date | null;
}

export async function getTokens(): Promise<Token[]> {
    const [queryToken] = await connection.query('SELECT * FROM tokens')
    return queryToken as Token[]
}