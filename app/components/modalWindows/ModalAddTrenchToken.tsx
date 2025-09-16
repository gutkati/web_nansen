"use client"
import React, {useState} from 'react';
import styles from './ModalAdd.module.scss'

type TokenTrench = {
    name: string;
    token_address: string;
    chain: string;
    url: string;
}

type ModalAddProps = {
    title: string;
    onClose?: () => void;
    onConfirm: (newToken: TokenTrench) => void;
}

const ModalAddTrenchToken: React.FC<ModalAddProps> = ({title, onClose, onConfirm}) => {
        const [link, setLink] = useState<string>('')
        const [errorLink, setErrorLink] = useState<string>('')
        const [name, setName] = useState<string>('')
        const [errorName, setErrorName] = useState<string>('')
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

        function handleSubmit(e: React.FormEvent) {
            e.preventDefault()

            if (!isValidUrl(link)) {
                setErrorLink(textErrorLink);
                return;
            }
            if (!name.trim()) {
                setErrorName(requiredField);
                return;
            }

            // парсим токен из ссылки
            const urlObj = new URL(link);
            const tokenAddress = urlObj.searchParams.get("tokenAddress") || "";
            const chain = urlObj.searchParams.get("chain") || "";

            const newToken: TokenTrench = {
                name: name.trim().toUpperCase(),
                token_address: tokenAddress,
                chain: chain,
                url: link.trim(),
            };

            onConfirm(newToken); // отдаем родителю
            onClose?.(); // закрываем модалку
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
                    >
                        Добавить
                    </button>
                </div>
            </form>
        );
    }
;

export default ModalAddTrenchToken;