"use client"
import React, {useState} from 'react';
import styles from './CardBuyer.module.scss'
import ModalForm from "@/app/components/modalWindows/modalForm";
import ModalRemovePurchase from "@/app/components/modalWindows/modalRemovePurchase";
import ModalDeletePurchaseList from "@/app/components/modalWindows/ModalDeletePurchaseList";
import {formatDate} from "@/app/utils/utils";

type BuyerProps = {
    buyer: {
        id: number;
        address: string;
        address_labels: string;
        bought_usd_volume: string;
        current_balance: string;
        timestamp: string;
        show_key: number | null;
        buyer_type: string | null;
    };
    onDelete: () => void;
    buyerType: 'smart' | 'spec' | null;
    handleTypeBuyer: (address: string, type: 'smart' | 'spec') => void;
    hideBuyerBlackList: (address: string, address_labels: string) => void;
}

const CardBuyer: React.FC<BuyerProps> = ({buyer, onDelete, buyerType, handleTypeBuyer, hideBuyerBlackList}) => {

    const [showKey, setShowKey] = useState<boolean>(Boolean(buyer.show_key))
    const [isModalOpenDelBuyer, setIsModalOpenDelBuyer] = useState<boolean>(false)
    const [isModalOpenDelBlackList, setIsModalOpenDelBlackList] = useState<boolean>(false)

    const linkClass = buyerType === 'smart'
        ? styles.link__smart
        : buyerType === 'spec'
            ? styles.link__spec
            : '';

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
                body: JSON.stringify({id})
            });

            if (!res.ok) {
                console.error('Ошибка при удалении');
                return;
            }

            onDelete()
            setIsModalOpenDelBuyer(false);
        } catch (err) {
            console.error('Сетевая ошибка при удалении:', err);
        }
    };

    function openModalDelBuyer() {
        setIsModalOpenDelBuyer(true)
    }

    function openModalBlackList() {
        setIsModalOpenDelBlackList(true)
    }

    function closeModalClose() {
        setIsModalOpenDelBuyer(false)
        setIsModalOpenDelBlackList(false)
    }

    return (
        <div className={styles.card}>
            <div
                className={styles.card__close}
                onClick={openModalDelBuyer}
            >

            </div>

            <div className={`${styles.card__link} ${linkClass}`}>
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

            <div className={styles.card__containercheck}>
                <div className={`${styles.card__viewing}`}>
                    <label htmlFor={`viewing-${buyer.address}`}>Просмотр</label>
                    <input
                        type="checkbox"
                        id={`viewing-${buyer.address}`}
                        checked={showKey}
                        onChange={handleCheckboxChange}
                    />
                </div>

                <div className={`${styles.card__viewing}`}>
                    <label htmlFor={`smart-${buyer.address}`} className={styles.label__smart}>Смарт</label>
                    <input
                        className={styles.inp__smart}
                        type="checkbox"
                        name={`type-${buyer.address}`} // одинаковое name для группы
                        id={`smart-${buyer.address}`}
                        value='smart'
                        checked={buyerType === 'smart'}
                        onChange={() => handleTypeBuyer(buyer.address, 'smart')}
                    />
                </div>

                <div className={`${styles.card__viewing}`}>
                    <label htmlFor={`spec-${buyer.address}`} className={styles.label__spec}>Спекулянт</label>
                    <input
                        className={styles.inp__spec}
                        type="checkbox"
                        name={`type-${buyer.address}`} // одинаковое name для группы
                        id={`spec-${buyer.address}`}
                        value='spec'
                        checked={buyerType === 'spec'}
                        onChange={() => handleTypeBuyer(buyer.address, 'spec')}
                    />
                </div>
            </div>

            <div
                className={`${styles.card__info} ${styles.card__wallet}`}
                onClick={openModalBlackList}
            >
                <span>Убрать кошельки из списка</span>
            </div>


            {
                isModalOpenDelBuyer && (
                    <ModalForm children={<ModalRemovePurchase
                        key={buyer.id}
                        id={buyer.id}
                        text='Удалить данную покупку?'
                        onClose={closeModalClose}
                        onConfirm={handleDeleteBuyer}
                    />
                    }/>
                )
            }

            {
                isModalOpenDelBlackList && (
                    <ModalForm children={<ModalDeletePurchaseList
                        key={buyer.id}
                        address={buyer.address}
                        address_labels={buyer.address_labels}
                        text='Убрать кошельки из списка?'
                        onClose={closeModalClose}
                        onConfirm={hideBuyerBlackList}
                    />
                    }/>
                )
            }

        </div>
    );
};

export default CardBuyer;

//hideBuyerBlackList(buyer.address)