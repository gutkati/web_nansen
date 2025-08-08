import React from 'react';
import styles from './ModalRemovePurchase.module.scss'

type ModalRemoveProps = {
    id: number;
    onClose?: () => void;
    onConfirm: (id:number) => void;
}

const ModalRemovePurchase:React.FC<ModalRemoveProps> = ({id, onClose, onConfirm}) => {
    return (

            <div className={styles.modalremove}>
                <div className={styles.modalremove__text}>
                    <p>Удалить данную покупку?</p>
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
                        onClick={() => onConfirm(id)}
                    >
                        Удалить</button>
                </div>
            </div>
    );
};

export default ModalRemovePurchase;