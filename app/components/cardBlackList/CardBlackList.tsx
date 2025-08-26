import React, {useState} from 'react';
import styles from "./CardBlackList.module.scss";
import {formatDate} from "@/app/utils/utils";
import ModalForm from "@/app/components/modalWindows/modalForm";
import ModalDeletePurchaseList from "@/app/components/modalWindows/ModalDeletePurchaseList";

type BlackListItem = {
    id: number;
    address: string;
    addressLabels: string;
    createdAt: string;
};

type CardBlackListProps = {
    item: BlackListItem;
    onConfirm: (address: string) => void;
};

const CardBlackList: React.FC<CardBlackListProps> = ({item, onConfirm}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    if (!item) return null;

    return (
        <div className={styles.blacklist__container}>
            <div className={styles.item__blacklist}>
                <span>{item.address}</span>
                <span>{item.addressLabels}</span>
                <span className={styles.item__date}>Дата удаления: {formatDate(item.createdAt)}</span>

                <button
                    type="button"
                    className={styles.item__btn}
                    onClick={() => setIsOpen(true)}
                >
                    Вернуть в список
                </button>

            </div>

            {isOpen && (
                <ModalForm children={
                    <ModalDeletePurchaseList
                        address={item.address}
                        address_labels={item.addressLabels}
                        text="Вернуть кошелек в список?"
                        namebtn="Вернуть"
                        onClose={() => setIsOpen(false)}
                        onConfirm={() => {
                            onConfirm(item.address);
                            setIsOpen(false);
                        }}
                    />
                }/>
            )}

        </div>
    );
};

export default CardBlackList;