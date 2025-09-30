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
    show_key: number | null;
    buyer_type: string | null;
}

export async function getPurchaseTrenchByTokenId(tokenId: number): Promise<PurchaseTrench[]> {
    // const [rows] = await connection.query(
    //     `SELECT id, token_id, address, address_labels, token_amount, total_outflow, total_inflow, value_usd, show_key, buyer_type, timestamp FROM tgm_holders WHERE token_id = ?`,
    //     [tokenId]
    // )

    const [rows] = await connection.query(
        `SELECT b.id, b.token_id, b.address, b.address_labels, b.token_amount,
                b.total_outflow, b.total_inflow, b.label_type, b.value_usd, b.show_key, b.buyer_type, b.timestamp
         FROM tgm_holders b
         LEFT JOIN black_list_trench bl ON b.address = bl.address
         WHERE b.token_id = ? AND bl.address IS NULL`,
        [tokenId]
    )

    return rows as PurchaseTrench[]
}