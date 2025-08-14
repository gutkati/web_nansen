"usu client"
import React, {useState} from 'react';
import stylesRemove from "@/app/components/modalWindows/ModalRemovePurchase.module.scss";
import styles from './ModalAdd.module.scss'

type ModalAddProps = {
    title: string;
    onClose?: () => void;
    // onConfirm: (id:number) => void;
}

const ModalAdd:React.FC<ModalAddProps> = ({title, onClose}) => {
    const [link, setLink] = useState<string>('')
    const [errorLink, setErrorLink] = useState<string>('')
    let textErrorLink: string = 'Введите корректный URL'

    const isValidUrl = (value: string) => {
        const pattern = /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(:\d+)?(\/.*)?$/i;
        return pattern.test(value);
    };

    const handleBlur = () => {
        if (link.trim() && !isValidUrl(link)) {
            setErrorLink(textErrorLink);
        } else {
            setErrorLink('');
        }
    };


    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if(!isValidUrl(link)) {
            setErrorLink(textErrorLink);
            return;
        }
        setErrorLink('')
    }

    return (
        <form className={styles.form__add} onSubmit={handleSubmit}>
            <h3 className={styles.add__title}>{title}</h3>
            <label className={styles.add__label}>Вставьте ссылку токена
                <input
                    className={styles.add__input}
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    onBlur={handleBlur}
                    placeholder='Ссылка'/>
                <span className={styles.add__error}>{errorLink}</span>
            </label>

            <div className={styles.add__btns}>
                <button
                    className={`${styles.btns} ${styles.btn__can}`}
                    onClick={() => onClose?.()}
                    type='button'
                >
                    Отмена
                </button>
                <button
                    className={`${styles.btns} ${styles.btn__add}`}
                    type='submit'
                    // onClick={() => onConfirm(id)}
                >
                    Добавить
                </button>
            </div>
        </form>
    );
};

// https://app.nansen.ai/token-god-mode?tokenAddress=0x0001a500a6b18995b03f44bb040a5ffc28e45cb0&chain=ethereum

export default ModalAdd;