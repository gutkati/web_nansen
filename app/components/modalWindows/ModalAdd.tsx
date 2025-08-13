"usu client"
import React from 'react';
import stylesRemove from "@/app/components/modalWindows/ModalRemovePurchase.module.scss";
import styles from './ModalAdd.module.scss'

type ModalAddProps = {
    id: number;
    title: string;
    onClose?: () => void;
    onConfirm: (id:number) => void;
}

const ModalAdd:React.FC<ModalAddProps> = ({title, onClose}) => {
    return (
        <form className={styles.form__add}>
            <h3 className={styles.add__title}>{title}</h3>
            <label className={styles.add__label}>Вставьте ссылку токена
                <input className={styles.add__input} type="text" placeholder='Ссылка'/>
            </label>

            <div className={styles.add__btns}>
                <button
                    className={`${styles.btns} ${styles.btn__can}`}
                    onClick={() => onClose?.()}
                >
                    Отмена
                </button>
                <button
                    className={`${styles.btns} ${styles.btn__add}`}
                    // onClick={() => onConfirm(id)}
                >
                    Добавить
                </button>
            </div>
        </form>
    );
};

export default ModalAdd;