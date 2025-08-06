import connection from '../db';

interface Token {
    id: number;
    name: string;
}

export async function getTokens(): Promise<Token[]> {
    const [queryToken] = await connection.query('SELECT * FROM tokens')
    return queryToken as Token[]
}