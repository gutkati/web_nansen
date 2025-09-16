'use client'
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import InfoContainer from "@/app/components/infoContainer/InfoContainer";
import styles from "@/app/token/Token.module.scss";
import ButtonBack from "@/app/components/buttonBack/ButtonBack";
import ButtonBlackList from "@/app/components/buttonBlackList/ButtonBlackList";
import colors from '../styles/_variables.module.scss';
import {TokenTrenchType, TokenUpdate, MonthType} from "@/app/types";
import Notification from "@/app/components/notification/Notification";
import ModalForm from "@/app/components/modalWindows/modalForm";
import ModalAdd from "@/app/components/modalWindows/ModalAdd";
import Token from "@/app/token/Token";
import Tooltip from "@/app/components/tooltip/Tooltip";
import ButtonAdd from "@/app/components/buttonAdd/ButtonAdd";
import ModalAddTrenchToken from "@/app/components/modalWindows/ModalAddTrenchToken";
import AddTokenMessage from "@/app/components/message/AddTokenMessage";
import ModalRemovePurchase from "@/app/components/modalWindows/modalRemovePurchase";

type TokenTrench = {
    name: string;
    token_address: string;
    chain: string;
    url: string;
}

type TrenchProps = {
    tokens: TokenTrenchType[];
}

const Trench: React.FC<TrenchProps> = ({tokens}) => {
    const [activeTokenId, setActiveTokenId] = useState<number | null>(null)
    const [isModalOpenAddToken, setIsModalOpenAddToken] = useState<boolean>(false)
    const [nameAddToken, setNameAddToken] = useState<string>('')
    const [successMessageAddToken, setSuccessMessageAddToken] = useState<boolean>(false)
    const [errorMessageAddToken, setErrorMessageAddToken] = useState<boolean>(false)
    const [successMessageDeleteToken, setSuccessMessageDeleteToken] = useState<boolean>(false)
    const [isModalOpenRemoveToken, setIsModalOpenRemoveToken] = useState<boolean>(false)

    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

    const router = useRouter();


    const handleAddTokenTrench = async (newToken: TokenTrench) => {
        try {
            const res = await fetch('/api/addTokenTrench', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({newToken})
            });

            if (res.status === 409) {
                // токен уже существует
                setIsModalOpenAddToken(false);
                setNameAddToken(newToken.name);
                setErrorMessageAddToken(true);
                setTimeout(() => setErrorMessageAddToken(false), 4000)
                return;
            }

            if (!res.ok) {
                console.error('Ошибка при добавлении токена');
                return;
            }

            setIsModalOpenAddToken(false);
            router.refresh(); // обновляем список токенов
            setNameAddToken(newToken.name)
            setSuccessMessageAddToken(true)
            setTimeout(() => setSuccessMessageAddToken(false), 4000)
        } catch (err) {
            console.error('Сетевая ошибка при добавлении токена:', err);
        }
    }

    const handleDeleteTokenTrench = async (tokenId: number) => {
        try {
            const res = await fetch('/api/deleteTokenTrench', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tokenId})
            });

            if (!res.ok) {
                console.error('Ошибка при удалении');
                return;
            }

            setIsModalOpenRemoveToken(false);
            router.refresh(); // перезагрузить страницу после удаления токена

            setNameAddToken(nameAddToken)
            setSuccessMessageDeleteToken(true)
            setTimeout(() => setSuccessMessageDeleteToken(false), 4000)
        } catch (err) {
            console.error('Сетевая ошибка при удалении:', err);
        }
    };

    function openModalCloseRemoveToken(tokenId: number, tokenName: string) {
        setIsModalOpenRemoveToken(true)
        setActiveTokenId(tokenId)
        setNameAddToken(tokenName)
        // setIsShowMonth(false)
        // setIsPurchases(false)
    }

    function openModalTokenTrenchAdd() {
        setIsModalOpenAddToken(true)
    }

    function closeModalTokenTrench() {
        setIsModalOpenAddToken(false)
        setIsModalOpenRemoveToken(false)

    }

    return (
        <div className={styles.token}>

            <InfoContainer background={colors.darkgreyСolor} color={colors.lilacTitle} title="Токены">
                <div className={styles.token__header}>
                    <ButtonBack text='Главная'/>
                    <div className={styles.container__button}>
                        <Tooltip children={<ButtonAdd openModal={openModalTokenTrenchAdd}/>} text="Добавить токен"/>
                        {/*<Tooltip children={<ButtonBlackList openModal={openModalBlackList}/>}*/}
                        {/*         text="Черный список кошельков"/>*/}
                    </div>
                </div>

                <ul className={styles.token__list}>
                    {tokens
                        .slice() // создаём копию, чтобы не мутировать исходный массив
                        .sort((a, b) => a.name.localeCompare(b.name)) // сортировка по имени
                        .map(token => {
                            const isNew = token.added_at ? (new Date().getTime() - new Date(token.added_at).getTime()) < ONE_WEEK_MS : false
                            return (
                                <li key={token.id}
                                    // onClick={() => showListMonth(token.id)}
                                    className={`${styles.token__name} ${activeTokenId === token.id ? styles.text__active : ''}`}
                                >
                                    {/*{isClient && notificationStatus && <Notification color={notificationStatus}/>}*/}

                                    <div className={styles.token__info}>
                                        <span>{token.name} {isNew &&
                                            <span className={styles.newLabel}>(new)</span>}
                                        </span>
                                        {/*<span className={styles.token__trade_volume}>{token.trade_volume}</span>*/}
                                    </div>

                                    <div className={styles.token__action}>

                                        <div
                                            className={`${styles.token__remove} ${styles.token__icons_style}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                openModalCloseRemoveToken(token.id, token.name)
                                            }}
                                        >
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                </ul>
            </InfoContainer>

            {
                isModalOpenAddToken && (
                    <ModalForm children={<ModalAddTrenchToken
                        title="Добавить токен"
                        onClose={closeModalTokenTrench}
                        onConfirm={handleAddTokenTrench}
                    />}/>
                )
            }

            {
                isModalOpenRemoveToken && activeTokenId && (
                    <ModalForm children={<ModalRemovePurchase
                        id={activeTokenId}
                        text={`Удалить токен ${nameAddToken}`}
                        onClose={closeModalTokenTrench}
                        onConfirm={handleDeleteTokenTrench}
                    />
                    }/>
                )
            }

            {
                successMessageAddToken && (
                    <AddTokenMessage text={`Токен ${nameAddToken} успешно добавлен!`}/>
                )
            }

            {
                errorMessageAddToken && (
                    <AddTokenMessage text={`Токен с таким адресом уже сохранен!`}/>
                )
            }

            {
                successMessageDeleteToken && (
                    <AddTokenMessage text={`Токен ${nameAddToken} успешно удален!`}/>
                )
            }
        </div>
    );
};

export default Trench;