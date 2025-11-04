import connection from "@/lib/db";

interface ListNameTables {
    id: number;
    name: string;
    show_key: number | null;
}

export async function getListNameTables(): Promise<ListNameTables[]> {
    const [rows] = await connection.query(
        'SELECT id, name, show_key FROM list_tables_for_show',
    )

    return rows as ListNameTables[]
}