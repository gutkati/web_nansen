export type TokenType = {
    id: number;
    name: string;
    url: string;
    trade_volume: number;
    added_at: Date | null;
};

export type TokenTrenchType = {
    id: number;
    name: string;
    url: string;
    added_at: Date | null;
};

export type TokenUpdate = {
    id: number
    trade_volume: number;
}

export type MonthType = {
    name: string;
    date: Date[];
}[]