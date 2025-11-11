'use client'
import React, {useEffect, useRef, useState} from 'react';
import styles from "./Tables.module.scss"
import Burger from "@/app/components/burger/Burger";
import ButtonBack from "@/app/components/buttonBack/ButtonBack";
import ModalListTables from "@/app/components/modalWindows/ModalListTables";
import ButtonClose from "@/app/components/buttonClose/ButtonClose";
import CheckBox from "@/app/components/checkBox/CheckBox";
import Loader from "@/app/components/loader/loader";
import TableDB from "@/app/components/tableDB/TableDB";

type ListNameTables = {
    id: number;
    name: string;
    show_key: number | null;
}

type ColNameVisible = {
    name: string;
    visible: boolean;
}

const Tables = () => {
    const [isOpenModalListTables, setIsOpenModalListTables] = useState<boolean>(false)
    const [isOpenModalSettingsTable, setIsOpenModalSettingsTable] = useState<boolean>(false)
    const [tablesName, setTablesName] = useState<ListNameTables[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingListColumns, setLoadingListColumns] = useState<boolean>(false)
    const [updatingCheck, setUpdatingCheck] = useState<number | null>(null)
    const [activeNameTable, setActiveNameTable] = useState<string>('')
    const [nameForShowTable, setNameForShowTable] = useState<string>('')
    const [tableNameColumns, setTableNameColumns] = useState<ColNameVisible[]>([])
    const [visibleTable, setVisibleTable] = useState<boolean>(false)

    const scrollRefTop = useRef<HTMLDivElement | null>(null);
    const scrollRefBottom = useRef<HTMLDivElement | null>(null);

    // Синхронизация скроллов
    useEffect(() => {
        const top = scrollRefTop.current;
        const bottom = scrollRefBottom.current;
        if (!top || !bottom) return;

        const sync = (src: HTMLDivElement, target: HTMLDivElement) => {
            src.addEventListener('scroll', () => {
                target.scrollLeft = src.scrollLeft;
            });
        };
        sync(top, bottom);
        sync(bottom, top);

        return () => {
            top.removeEventListener('scroll', () => {
            });
            bottom.removeEventListener('scroll', () => {
            });
        };
    }, []);

    useEffect(() => {
        fetchNameTables()
    }, []);

    async function fetchNameTables() {
        try {
            const response = await fetch('/api/listNameTables')
            if (response.ok) {
                const data = await response.json()
                console.log("data2", data);
                setTablesName(data)
            }
        } catch (error) {
            console.error('Error loading tables:', error)
        }
    }

    async function openModalListTables() {
        setIsOpenModalListTables(true)

        if (tablesName.length === 0) {
            setLoading(true)
            await fetchNameTables();
        } else {
            setLoading(false)
        }
    }

    function closeModalTables() {
        setIsOpenModalListTables(false)
    }

    function closeModalSettingsTables() {
        setIsOpenModalSettingsTable(false)
        setTableNameColumns([])
        setActiveNameTable('')
    }

    async function handleTabName(id: number, tableName: string) {
        try {
            const response = await fetch('/api/updateTableVisibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    show_key: 0
                }),
            });

            if (response.ok) {
                setTablesName(prev => prev.map(table =>
                    table.id === id ? {...table, show_key: 0} : table
                ));

                if (tableName === nameForShowTable) {
                    setVisibleTable(false)
                }
            }
        } catch (error) {
            console.error('Error hiding table:', error);
        }
    }

    async function handleCheckboxChange(id: number, checked: boolean) {
        setUpdatingCheck(id)

        try {
            const response = await fetch('/api/updateTableVisibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    show_key: checked ? 1 : 0
                }),
            });

            if (response.ok) {
                // Обновляем локальное состояние
                setTablesName(prev => prev.map(table =>
                    table.id === id
                        ? {...table, show_key: checked ? 1 : 0}
                        : table
                ));
                console.log(`Статус таблицы ${id} обновлен: ${checked}`);
            } else {
                console.error('Ошибка при обновлении статуса таблицы');
                // Можно добавить уведомление об ошибке
            }
        } catch (error) {
            console.error('Error updating table visibility:', error);
        } finally {
            setUpdatingCheck(null);
        }
    }

    async function handleColumnCheckboxChange(columnName: string, checked: boolean) {
        try {
            const response = await fetch("/api/updateHiddenColumns", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    tableName: activeNameTable,
                    columnName,
                    hidden: !checked, // false → показываем, true → скрываем
                }),
            });

            if (response.ok) {
                setTableNameColumns(prev =>
                    prev.map(col =>
                        col.name === columnName ? {...col, visible: checked} : col
                    )
                );
            } else {
                console.error("Ошибка при обновлении скрытой колонки");
            }
        } catch (error) {
            console.error("Ошибка при обновлении колонки:", error);
        }
    }

    async function openModalSettingsTable(nameTable: string) {
        setIsOpenModalSettingsTable(true)
        setActiveNameTable(nameTable)
        setLoadingListColumns(true)

        try {
            const response = await fetch(`/api/tableColumns?tableName=${encodeURIComponent(nameTable)}`);
            if (response.ok) {
                const {allColumns, hiddenColumns} = await response.json();

                setTableNameColumns(
                    allColumns.map((col: string) => ({
                        name: col,
                        visible: !hiddenColumns.includes(col),
                    }))
                );
            } else {
                console.error("Ошибка при загрузке столбцов");
            }
        } catch (error) {
            console.error("Error loading table columns:", error);
        } finally {
            setLoadingListColumns(false);
        }
    }

    function showTable(nameTable: string) {
        setNameForShowTable(nameTable)
        setVisibleTable(true)
    }

    const visibleNameTables: ListNameTables[] =
        Array.isArray(tablesName)
            ? tablesName.filter(table => table.show_key === 1)
            : [];

    return (
        <div className={styles.tables}>
            <header className={styles.header}>
                <div className={styles.header__menu}>
                    <ButtonBack text='Главная'/>
                    <Burger openModal={openModalListTables}/>
                </div>
                <div className={styles.header__title}>
                    <h3>Таблицы</h3>
                </div>

                {
                    isOpenModalListTables && (
                        <div className={styles.position__listTables}>
                            <ModalListTables
                                onClose={closeModalTables}
                                title="Список таблиц"
                                children={

                                    loading ? (
                                        <Loader/>
                                    ) : (
                                        <ul className={styles.container__nameTables}>
                                            {
                                                tablesName.map(table => (
                                                    <li className={styles.container__item} key={table.id}>
                                                        <CheckBox id={table.id.toString()} showKey={table.show_key === 1}
                                                                  handleCheckboxChange={(id, checked) => handleCheckboxChange(table.id, checked)}/>
                                                        <label htmlFor={table.id.toString()}>{table.name}</label>
                                                        <div
                                                            className={styles.setting__item}
                                                            onClick={() => openModalSettingsTable(table.name)}>

                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    )
                                }
                            />
                        </div>
                    )
                }

                {
                    isOpenModalSettingsTable && (
                        <div className={`${styles.position__listTables} ${styles.position__listTables_right}`}>
                            <ModalListTables
                                onClose={closeModalSettingsTables}
                                title='Колонки таблицы'
                                subtitle={activeNameTable}
                                children={

                                    loadingListColumns ? (
                                        <Loader/>
                                    ) : (
                                        <ul className={styles.container__nameTables}>
                                            {
                                                tableNameColumns.map(((col, index) => (
                                                    <li className={styles.container__item} key={index}>
                                                        <CheckBox id={col.name} showKey={col.visible}
                                                                  handleCheckboxChange={(id, checked) => handleColumnCheckboxChange(col.name, checked)}/>
                                                        <label htmlFor={col.name}>{col.name}</label>
                                                    </li>
                                                )))
                                            }

                                        </ul>
                                    )
                                }
                            />
                        </div>
                    )
                }
            </header>

            <section className={styles.nameTables}>
                <div className={styles.container__scrollX}>
                    <ul className={styles.nameTables__list}>

                        {visibleNameTables.map(table => (
                            <li
                                className={`${nameForShowTable === table.name ? styles.color__mark : ''} ${styles.nameTables__item}`}
                                key={table.id}
                                onClick={() => showTable(table.name)}
                            >
                                <p>{table.name}</p>
                                <ButtonClose onClose={() => {
                                    handleTabName(table.id, table.name)
                                }}/>
                            </li>
                        ))}
                    </ul>
                </div>

            </section>

            {
                visibleTable && (
                    <section className={`${styles.nameTables} ${styles.nameTablesScroll} ${styles.nameTablesScrollY}`}>
                        <div ref={scrollRefTop} className={`${styles.container__scrollX} ${styles.container__scrollY}`}>
                            <TableDB nameTable={nameForShowTable}/>
                        </div>
                    </section>
                )
            }
        </div>
    );
};

export default Tables;