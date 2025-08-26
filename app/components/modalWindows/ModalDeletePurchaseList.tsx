import React from 'react';
import styles from "@/app/components/modalWindows/ModalRemovePurchase.module.scss";

type ModalDelPurchaseListProps = {
    address: string;
    address_labels: string;
    text: string;
    namebtn: string;
    onClose?: () => void;
    onConfirm: (address: string, address_labels: string) => void;
}

const ModalDeletePurchaseList:React.FC<ModalDelPurchaseListProps> = ({address, address_labels, text, namebtn, onClose, onConfirm}) => {
    return (

            <div className={styles.modalremove}>
                <div className={styles.modalremove__text}>
                    <p>{text}</p>
                </div>
                <div className={styles.modalremove__btns}>
                    <button
                        className={`${styles.btns} ${styles.btn__can}`}
                        onClick={() => onClose?.()}
                    >
                        Отмена
                    </button>
                    <button
                        className={`${styles.btns} ${styles.btn__del}`}
                        onClick={() => onConfirm(address, address_labels)}
                    >
                        {namebtn}</button>
                </div>
            </div>
    );
};

export default ModalDeletePurchaseList;