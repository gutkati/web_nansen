import React, {useState} from 'react';
import styles from './CardBuyer.module.scss'
import ModalForm from "@/app/components/modalWindows/modalForm";
import ModalRemovePurchase from "@/app/components/modalWindows/modalRemovePurchase";

type BuyerProps = {
    buyer: {
        id: number;
        address: string;
        address_labels: string;
        bought_usd_volume: string;
        current_balance: string;
        timestamp: string;
        show_key: number | null;
    };
    onDelete: () => void;
}

const CardBuyer: React.FC<BuyerProps> = ({buyer, onDelete}) => {
    // const [buyers, setBuyers] = useState(buyer | [])
    const [showKey, setShowKey] = useState<boolean>(Boolean(buyer.show_key))
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU')
    }

    const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setShowKey(newValue);

        try {
            const res = await fetch("/api/updateShowKey", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    show_key: newValue,
                    id: buyer.id,
                    address: buyer.address,
                })
            })

            const result = await res.json()

            if (!res.ok) {
                console.error("Ошибка при обновлении:", result.error);
                // Откатим чекбокс обратно
                setShowKey(!newValue);
            }
        } catch (err) {
            console.error("Сетевая ошибка:", err);
            setShowKey(!newValue);
        }
    }

    const handleDeleteBuyer = async (id: number) => {
    try {
        const res = await fetch('/api/deletePurchase', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

        if (!res.ok) {
            console.error('Ошибка при удалении');
            return;
        }

        onDelete()
        setIsModalOpen(false);
    } catch (err) {
        console.error('Сетевая ошибка при удалении:', err);
    }
};

    function openModalClose() {
        console.log('id', buyer.id)
        setIsModalOpen(true)
    }

    function closeModalClose() {
        setIsModalOpen(false)
    }

    return (
        <div className={styles.card}>
            <div
                className={styles.card__close}
                onClick={openModalClose}
            >

            </div>

            <div className={styles.card__link}>
                <a href={`https://app.nansen.ai/profiler?address=${buyer.address}&chain=all`}
                   target='_blank'>{buyer.address}</a>
            </div>
            <div className={styles.card__name}>
                <span>{buyer.address_labels}</span>
            </div>
            <div className={`${styles.card__info} ${styles.card__volume}`}>
                <span>Объем покупки USD</span>
                <span className={`${styles.card__text_bold} ${styles.card__price}`}>{buyer.bought_usd_volume}</span>
            </div>

            <div className={`${styles.card__info} ${styles.card__balance}`}>
                <span>Текущий баланс USD</span>
                <span className={styles.card__text_bold}>{buyer.current_balance}</span>
            </div>

            <div className={`${styles.card__info} ${styles.card__date}`}>
                <span>Дата</span>
                <span className={styles.card__text_bold}>{formatDate(buyer.timestamp)}</span>
            </div>

            <div className={`${styles.card__info} ${styles.card__viewing}`}>
                <label htmlFor={`viewing-${buyer.address}`}>Просмотр</label>
                <input
                    type="checkbox"
                    id={`viewing-${buyer.address}`}
                    checked={showKey}
                    onChange={handleCheckboxChange}
                />
            </div>
            {
                isModalOpen && (
                    <ModalForm children={<ModalRemovePurchase
                        key={buyer.id}
                        id={buyer.id}
                        onClose={closeModalClose}
                        onConfirm={handleDeleteBuyer}
                    />
                    }/>
                )
            }

        </div>
    );
};

export default CardBuyer;