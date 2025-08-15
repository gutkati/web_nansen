"usu client"
import React, {useState} from 'react';
import stylesRemove from "@/app/components/modalWindows/ModalRemovePurchase.module.scss";
import styles from './ModalAdd.module.scss'

type ModalAddProps = {
    title: string;
    onClose?: () => void;
    // onConfirm: (id:number) => void;
}

const ModalAdd: React.FC<ModalAddProps> = ({title, onClose}) => {
    const [link, setLink] = useState<string>('')
    const [errorLink, setErrorLink] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [errorName, setErrorName] = useState<string>('')
    const [price, setPrice] = useState<string>('0')
    const [errorPrice, setErrorPrice] = useState<string>('')
    let textErrorLink: string = 'Введите корректный URL'
    let requiredField: string = 'Обязательное поле'

    const isValidUrl = (value: string) => {
        const pattern = /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(:\d+)?(\/.*)?$/i;
        return pattern.test(value);
    };


    const handleBlurLink = () => {
        const trimmedLink = link.trim();

        if (!trimmedLink.trim()) { // пустая строка или только пробелы
            setErrorLink(requiredField);
        } else if (!isValidUrl(trimmedLink.trim())) { // убираем пробелы перед проверкой
            setErrorLink(textErrorLink);
        } else {
            setErrorLink('');
        }
    };

    const handleBlurName = () => {
        const trimmedName = name.trim();

         if (!trimmedName.trim()) {
            setErrorName(requiredField)
        } else if (trimmedName.length > 50) {
            setErrorName('Имя не более 50 символов')
        } else {
            setErrorName('')
        }
    }

    const handleBlurPrice = () => {
        const num = Number(price);
        if (!price.trim()) {
            setErrorPrice('Введите цену');
        } else if (num < 0) {
            setErrorPrice('Введите положительное число');
        } else if (num === 0) {
            setErrorPrice('Введите цену');
        } else if (num < 1) {
            setErrorPrice('Введите корректную цену');
        } else if (/^0\d+/.test(price)) {
            setErrorPrice('Число не должно начинаться с нуля');
        } else {
            setErrorPrice('');
        }
    }


    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!isValidUrl(link)) {
            setErrorLink(textErrorLink);
            return;
        }
        setErrorLink('')
    }

    return (
        <form className={styles.form__add} onSubmit={handleSubmit}>
            <h3 className={styles.add__title}>{title}</h3>

            <label className={styles.add__label}>Ссылка токена
                <input
                    className={styles.add__input}
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    onBlur={handleBlurLink}
                    placeholder='Ссылка'/>
                <span className={styles.add__error}>{errorLink}</span>
            </label>

            <div className={styles.add__container}>
                <label className={styles.add__label}>Имя токена
                    <input
                        className={styles.add__input}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleBlurName}
                        placeholder='Имя'/>
                    <span className={styles.add__error}>{errorName}</span>
                </label>

                <label className={styles.add__label}>Цена сделки
                    <input
                        className={styles.add__input}
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        onBlur={handleBlurPrice}
                        onFocus={() => {
                            if (price === '0') setPrice(''); // убираем 0 при фокусе
                        }}
                        placeholder='Цена'/>
                    <span className={styles.add__error}>{errorPrice}</span>
                </label>
            </div>


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