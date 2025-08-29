"use client"
import React, {useEffect, useState} from 'react';
import styles from './ModalBlackList.module.scss'
import Loader from "@/app/components/loader/loader";
import CardBlackList from "@/app/components/cardBlackList/CardBlackList";

type BlackListProps = {
    title: string;
    onClose: () => void;
}

type BlackListItem = {
    id: number;
    address: string;
    addressLabels: string;
    createdAt: string;
}

const ModalBlackList: React.FC<BlackListProps> = ({title, onClose}) => {

    const [itemsBlackList, setItemsBlackList] = useState<BlackListItem[]>([])
    // const [filteredItems, setFilteredItems] = useState<BlackListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('')

    useEffect(() => {
        async function fetchData() {
            const list = await getBlackList();
            setItemsBlackList(list);
            //setFilteredItems(list)
            setLoading(false);
        }

        fetchData();
    }, []);

    async function getBlackList(): Promise<BlackListItem[]> {

        try {
            const res = await fetch("/api/getBlacklist");
            if (!res.ok) throw new Error("Ошибка при запросе black_list");
            const data = await res.json();
            return data.map((row: { id: number; address: string, address_labels: string, created_at: string }) => ({
                id: row.id,
                address: row.address,
                addressLabels: row.address_labels,
                createdAt: row.created_at
            }));
        } catch (err) {
            console.error("Ошибка при загрузке black_list:", err);
            return [];
        }
    }

    // Подтверждение "Вернуть в список"
    async function handleConfirmReturn(address: string) {
        try {
            const res = await fetch("/api/deleteCardBlacklist", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({address})
            });

            if (!res.ok) throw new Error("Ошибка при восстановлении из black_list");

            // обновляем список
            setItemsBlackList(prev => prev.filter(item => item.address !== address));
            setSearchValue('')
        } catch (err) {
            console.error("Ошибка при восстановлении:", err);
        }
    }

    const filteredList =

        itemsBlackList.filter(item =>
            item.address.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.addressLabels.toLowerCase().includes(searchValue.toLowerCase())
        )


    return (
        <div className={styles.container__blacklist}>
            <div className={styles.btn__close} onClick={onClose}></div>
            <h3 className={styles.title__blacklist}>{title}</h3>

            <div className={styles.container__search}>
                <input
                    className={styles.input__search}
                    type="text"
                    placeholder='Поиск'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                {/*<button className={styles.btn__search}></button>*/}
            </div>

            {loading ? (
                <Loader/>
            ) : itemsBlackList.length === 0 ? (
                <p className={styles.message__blacklist}>Здесь пока пусто!</p>
            ) : filteredList.length === 0 ? (
                <p className={styles.message__blacklist}>Ничего не найдено!</p>
            ) : (
                <div className={styles.list__blacklist}>
                    {filteredList.map((item) => (
                        <CardBlackList
                            key={item.id}
                            item={item}
                            onConfirm={handleConfirmReturn}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default ModalBlackList;