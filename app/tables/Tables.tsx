'use client'
import React, {useState} from 'react';
import styles from "./Tables.module.scss"
import Burger from "@/app/components/burger/Burger";
import ButtonBack from "@/app/components/buttonBack/ButtonBack";
import ModalListTables from "@/app/components/modalWindows/ModalListTables";
import ButtonClose from "@/app/components/buttonClose/ButtonClose";
import CheckBox from "@/app/components/checkBox/CheckBox";
import Loader from "@/app/components/loader/loader";

type ListNameTables = {
    id: number;
    name: string;
    show_key: number | null;
}


const Tables = () => {
    const [isOpenModalListTables, setIsOpenModalListTables] = useState<boolean>(false)
    const [tablesName, setTablesName] = useState<ListNameTables[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [updatingCheck, setUpdatingCheck] = useState<number | null>(null)

    async function openModalListTables() {
        setIsOpenModalListTables(true)
        setLoading(true)

        try {
            const response = await fetch('/api/listNameTables')
            if (response.ok) {
                const data = await response.json()
                setTablesName(data)
            }
        } catch (error) {
            console.error('Error loading tables:', error)
        } finally {
            setLoading(false)
        }
    }

    function closeModalTables() {
        setIsOpenModalListTables(false)
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
                                                        <label htmlFor="1">{table.name}</label>
                                                        <div className={styles.setting__item}></div>
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
            </header>

            <section className={styles.nameTables}>
                <ul className={styles.nameTables__list}>
                    {/*<li className={styles.nameTables__item}>*/}
                    {/*    <p>Bought_sold</p>*/}
                    {/*    <ButtonClose onClose={closeModalTables}/>*/}
                    {/*</li>*/}
                    {/*<li className={styles.nameTables__item}>*/}
                    {/*    <p>Bought_sold</p>*/}
                    {/*    <ButtonClose onClose={closeModalTables}/>*/}
                    {/*</li>*/}
                    {/*<li className={styles.nameTables__item}>*/}
                    {/*    <p>Bought_sold</p>*/}
                    {/*    <ButtonClose onClose={closeModalTables}/>*/}
                    {/*</li>*/}
                    {/*<li className={styles.nameTables__item}>*/}
                    {/*    <p>Bought_sold</p>*/}
                    {/*    <ButtonClose onClose={closeModalTables}/>*/}
                    {/*</li>*/}
                </ul>
            </section>

        </div>
    );
};

export default Tables;