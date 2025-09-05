import React, {useState} from 'react';
import stylesAdd from "@/app/components/modalWindows/ModalAdd.module.scss";
import styles from './ModalUpdate.module.scss';
import Input from "@/app/components/input/Input";

type Token = {
    id: number
    trade_volume: number;
}

type ModalUpdateProps = {
    title: string;
    id: number;

    trade_volume: number;
    onClose?: () => void;
    onConfirm: (newToken: Token) => void;
}

const ModalUpdate: React.FC<ModalUpdateProps> = ({title, id, trade_volume, onClose, onConfirm}) => {
    const [volumeModal, setVolumeModal] = useState<string>(String(trade_volume))
    const [errorVolume, setErrorVolume] = useState<string>('')
    let requiredField: string = 'Обязательное поле'

    const validateVolume = (value: string): string => {
        const num = Number(value);

        if (!value.trim()) return 'Введите цену';
        if (num < 0) return 'Введите положительное число';
        if (num === 0) return 'Введите цену';
        if (num < 1) return 'Введите корректную цену';
        if (/^0\d+/.test(value)) return 'Число не должно начинаться с нуля';

        return '';
    };

    const handleBlurVolume = () => {
        setErrorVolume(validateVolume(volumeModal));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const error = validateVolume(volumeModal);
        if (error) {
            setErrorVolume(error);
            return;
        }

        const newToken: Token = {
            id: id,
            trade_volume: +volumeModal
        };

        onConfirm(newToken); // отдаем родителю
        onClose?.(); // закрываем модалку
    }

    return (
        <form className={stylesAdd.form__add} onSubmit={handleSubmit}>
            <h3 className={stylesAdd.add__title}>{title}</h3>

            <div className={stylesAdd.add__container}>
                <label className={stylesAdd.add__label}>Цена сделки
                    <Input
                        type='number'
                        value={volumeModal}
                        placeholder='Цена сделки'
                        onChange={(e) => setVolumeModal(e.target.value)}
                        onBlur={handleBlurVolume}
                    />
                    <span className={stylesAdd.add__error}>{errorVolume}</span>
                </label>
            </div>

            <div className={stylesAdd.add__btns}>
                <button
                    className={`${stylesAdd.btns} ${stylesAdd.btn__can}`}
                    onClick={() => onClose?.()}
                    type='button'
                >
                    Отмена
                </button>
                <button
                    className={`${stylesAdd.btns} ${stylesAdd.btn__add}`}
                    type='submit'
                >
                    Изменить
                </button>
            </div>
        </form>
    );
};

export default ModalUpdate;