import connection from '../db';

interface PurchaseTrench {
    id: number;
    token_id: number;
    address: string;
    address_labels: string;
    token_amount: string;
    total_outflow: string;
    total_inflow: string;
    value_usd: string;
    timestamp: string;
}

export async function getPurchaseTrenchByTokenId(tokenId: number): Promise<PurchaseTrench[]> {

    const [rows] = await connection.query(
        `SELECT b.id, b.token_id, b.address, b.address_labels, b.token_amount,
                b.total_outflow, b.total_inflow, b.label_type, b.value_usd, b.timestamp
         FROM tgm_holders b
         LEFT JOIN black_list_trench bl ON b.address = bl.address
         WHERE b.token_id = ? AND bl.address IS NULL`,
        [tokenId]
    )

    return rows as PurchaseTrench[]
}