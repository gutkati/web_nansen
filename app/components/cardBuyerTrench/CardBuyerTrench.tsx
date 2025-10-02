"use client"
import React, {useState} from 'react';
import styles from '@/app/components/cardBuyer/CardBuyer.module.scss'
import ModalForm from "@/app/components/modalWindows/modalForm";
import ModalRemovePurchase from "@/app/components/modalWindows/modalRemovePurchase";
import ModalDeletePurchaseList from "@/app/components/modalWindows/ModalDeletePurchaseList";

type BuyerTrenchProps = {
    buyer: {
        id: number;
        address: string;
        address_labels: string;
        token_amount: string;
        total_outflow: string;
        total_inflow: string;
        label_type: string;
        value_usd: string;
        timestamp: string;
    };
    onDelete: () => void;
    hideBuyerBlackList: (address: string, address_labels: string) => void;
}

const CardBuyerTrench: React.FC<BuyerTrenchProps> = ({
                                                         buyer,
                                                         onDelete,
                                                         hideBuyerBlackList
                                                     }) => {
    const [isModalOpenDelBuyer, setIsModalOpenDelBuyer] = useState<boolean>(false)
    const [isModalOpenDelBlackList, setIsModalOpenDelBlackList] = useState<boolean>(false)

    const handleDeleteBuyer = async (id: number) => {
        try {
            const res = await fetch('/api/deletePurchaseTrench', {
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

            <div className={styles.card__link}>
                <a href={`https://app.nansen.ai/profiler?address=${buyer.address}&chain=all`}
                   target='_blank'>{buyer.address}</a>
            </div>
            <div className={styles.card__name}>
                <p>{buyer.address_labels} <span className={styles.label__type}>{buyer.label_type}</span></p>

            </div>
            <div className={`${styles.card__info} ${styles.card__volume}`}>
                <span className={styles.inactive__text_trench}>Количество токенов</span>
                <span className={`${styles.card__text_bold}`}>{buyer.token_amount}</span>
            </div>

            <div className={`${styles.card__info} ${styles.card__balance}`}>
                <span className={styles.inactive__text_trench}>Отправлено токенов</span>
                <span className={styles.card__text_bold}>{buyer.total_outflow}</span>
            </div>

            <div className={`${styles.card__info} ${styles.card__balance}`}>
                <span className={styles.inactive__text_trench}>Получено токенов</span>
                <span className={styles.card__text_bold}>{buyer.total_inflow}</span>
            </div>

            <div className={`${styles.card__info} ${styles.card__balance}`}>
                <span className={styles.inactive__text_trench}>Текущий баланс USD</span>
                <span className={styles.card__text_bold}>{buyer.value_usd}</span>
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
                        namebtn='Убрать'
                        onClose={closeModalClose}
                        onConfirm={hideBuyerBlackList}
                    />
                    }/>
                )
            }
        </div>
    );
};

export default CardBuyerTrench;