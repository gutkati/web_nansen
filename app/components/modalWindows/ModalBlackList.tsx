import React, {useEffect, useState} from 'react';
import styles from './ModalBlackList.module.scss'
import Loader from "@/app/components/loader/loader";
import {formatDate} from "@/app/utils/utils";

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const list = await getBlackList();
            setItemsBlackList(list);
            setLoading(false);
        }

        fetchData();
    }, []);

    async function getBlackList(): Promise<BlackListItem[]> {

        try {
            const res = await fetch("/api/getBlacklist");
            if (!res.ok) throw new Error("Ошибка при запросе black_list");
            const data = await res.json();
            return data.map((row: { id: number; address: string, address_labels: string, created_at: string }) =>({
                id: row.id,
                address: row.address,
                addressLabels: row.address_labels,
                createdAt: row.created_at
            }) );
        } catch (err) {
            console.error("Ошибка при загрузке black_list:", err);
            return [];
        }
    }

    return (
        <div className={styles.container__blacklist}>
            <div className={styles.btn__close} onClick={onClose}></div>
            <h3 className={styles.title__blacklist}>{title}</h3>

            <div className={styles.container__search}>
                <input className={styles.input__search} type="text" placeholder='Поиск'/>
                <button className={styles.btn__search}></button>
            </div>

            {
                loading ? (
                        <Loader/>
                    ) :
                    itemsBlackList.length > 0 ? (
                        <ul className={styles.list__blacklist}>
                            {itemsBlackList.map((item) => (
                                <li key={item.id} className={styles.item__blacklist}>
                                    <span>{item.address}</span>
                                    <span>{item.addressLabels}</span>
                                    <span>Дата удаления: {formatDate(item.createdAt)}</span>
                                    <button className={styles.item__btn}>Вернуть в список</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.message__blacklist}>Здесь пока пусто!</p>
                    )
            }

        </div>
    );
};

export default ModalBlackList;