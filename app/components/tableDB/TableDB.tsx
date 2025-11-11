'use client'

import React, {useState, useEffect} from 'react';
import styles from './TableDB.module.scss'
import Loader from "@/app/components/loader/loader";

type TableDBProps = {
    nameTable: string;
}

const TableDB: React.FC<TableDBProps> = ({nameTable}) => {
    const [columns, setColumns] = useState<string[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!nameTable) return;
        fetchTableData(nameTable);
    }, [nameTable]);

    async function fetchTableData(tableName: string) {
        setLoading(true);
        try {
            const response = await fetch(`/api/tableData?tableName=${tableName}`);
            if (response.ok) {
                const {columns, data} = await response.json();
                console.log("data:", data);
                setColumns(columns);
                setRows(data);
            } else {
                console.error("Ошибка при получении данных таблицы");
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loader/>;

    return (
        <table className={styles.tableDB}>
            <thead className={styles.thead}>
            <tr className={styles.thead__tr}>
                {columns.map(col => (
                    <th scope='col' className={styles.tr__th} key={col}>
                        <div className={styles.thContainer}>
                            <span className={styles.name}>{col}</span>
                            <span className={styles.btn}></span>
                        </div>
                    </th>
                ))}
            </tr>
            </thead>
            <tbody className={styles.tbody}>
            {rows.map((row, rowIndex) => (
                <tr className={styles.tbody__tr} key={row.id ?? rowIndex}>
                    {columns.map(col => (
                        <td className={styles.tr__td} key={col}>{row[col]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    )
        ;
};

export default TableDB;
