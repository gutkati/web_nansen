import React, {useState} from 'react';
import styles from './CardBuyer.module.scss'

type BuyerProps = {
    buyer: {
        id: number;
        address: string;
        address_labels: string;
        bought_usd_volume: string;
        current_balance: string;
        timestamp: string;
        show_key: number | null;
    }
}

const CardBuyer: React.FC<BuyerProps> = ({buyer}) => {
    const [showKey, setShowKey] = useState<boolean>(Boolean(buyer.show_key))

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


    return (
        <div className={styles.card}>
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
        </div>
    );
};

export default CardBuyer;