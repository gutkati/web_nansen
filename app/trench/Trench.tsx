'use client'
import React, {useState} from 'react';
import InfoContainer from "@/app/components/infoContainer/InfoContainer";
import styles from "@/app/token/Token.module.scss";
import ButtonBack from "@/app/components/buttonBack/ButtonBack";
import Tooltip from "@/app/components/tooltip/Tooltip";
import ButtonAdd from "@/app/components/buttonAdd/ButtonAdd";
import ButtonBlackList from "@/app/components/buttonBlackList/ButtonBlackList";
import colors from '../styles/_variables.module.scss';
import {TokenType, TokenUpdate, MonthType} from "@/app/types";
import Notification from "@/app/components/notification/Notification";

type TrenchProps = {
    tokens: TokenType[];
}

const Trench: React.FC<TrenchProps> = ({tokens}) => {
    const [activeTokenId, setActiveTokenId] = useState<number | null>(null)

    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

    return (
        <div className={styles.token}>

            <InfoContainer background={colors.darkgreyСolor} color={colors.lilacTitle} title="Токены">
                <div className={styles.token__header}>
                    <ButtonBack text='Главная'/>
                    <div className={styles.container__button}>
                        {/*<Tooltip children={<ButtonAdd openModal={openModalTokenAdd}/>} text="Добавить токен"/>*/}
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
                                            <span className={styles.newLabel}>(new)</span>}</span>
                                        <span className={styles.token__trade_volume}>{token.trade_volume}</span>
                                    </div>


                                    <div className={styles.token__action}>
                                        <div
                                            className={`${styles.token__update} ${styles.token__icons_style}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                // openModalTokenUpdate(token.id, token.name, token.trade_volume)
                                            }}
                                        >

                                        </div>
                                        <div
                                            className={`${styles.token__remove} ${styles.token__icons_style}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                // openModalCloseRemoveToken(token.id, token.name)
                                            }}
                                        >
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                </ul>
            </InfoContainer>
        </div>
    );
};

export default Trench;