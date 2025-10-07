'use client'
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import InfoContainer from "@/app/components/infoContainer/InfoContainer";
import styles from "@/app/token/Token.module.scss";
import stylesTrench from './Trench.module.scss';
import ButtonBack from "@/app/components/buttonBack/ButtonBack";
import ButtonBlackList from "@/app/components/buttonBlackList/ButtonBlackList";
import colors from '../styles/_variables.module.scss';
import {TokenTrenchType, MonthType} from "@/app/types";
import ModalForm from "@/app/components/modalWindows/modalForm";
import Tooltip from "@/app/components/tooltip/Tooltip";
import ButtonAdd from "@/app/components/buttonAdd/ButtonAdd";
import ModalAddTrenchToken from "@/app/components/modalWindows/ModalAddTrenchToken";
import AddTokenMessage from "@/app/components/message/AddTokenMessage";
import ModalRemovePurchase from "@/app/components/modalWindows/modalRemovePurchase";
import Loader from "@/app/components/loader/loader";
import {useTrenchDates} from "@/app/hooks/useTrenchDates";
import {usePurchaseTrenchData} from "@/app/hooks/usePurchaseTrenchData";
import {formatDate, groupDatesByMonth} from "@/app/utils/utils"
import CardBuyerTrench from "@/app/components/cardBuyerTrench/CardBuyerTrench";
import {normalizeDate} from "@/app/utils/utils"
import ModalBlackListTrench from "@/app/components/modalWindows/ModalBlackListTrench";

type TokenTrench = {
    name: string;
    token_address: string;
    chain: string;
    url: string;
}

type TrenchProps = {
    tokens: TokenTrenchType[];
    dateLastPurchase: DateLastPurchase[];
}

type DateItem = {
    raw: string;   // например "2025-09-17"
    display: string; // "17 сентября"
}

type DateLastPurchase = {
    token_id: number;
    id: number;
    timestamp: string;
};

const Trench: React.FC<TrenchProps> = ({tokens, dateLastPurchase}) => {
    const [activeTokenId, setActiveTokenId] = useState<number | null>(null)
    const [isModalOpenAddToken, setIsModalOpenAddToken] = useState<boolean>(false)
    const [nameAddToken, setNameAddToken] = useState<string>('')
    const [successMessageAddToken, setSuccessMessageAddToken] = useState<boolean>(false)
    const [errorMessageAddToken, setErrorMessageAddToken] = useState<boolean>(false)
    const [successMessageDeleteToken, setSuccessMessageDeleteToken] = useState<boolean>(false)
    const [isModalOpenRemoveToken, setIsModalOpenRemoveToken] = useState<boolean>(false)

    const [listMonth, setListMonth] = useState<MonthType>([])
    const [activeMonth, setActiveMonth] = useState<string | null>(null)
    const [isShowMonth, setIsShowMonth] = useState<boolean>(false)
    const [openedMonth, setOpenedMonth] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<Date[] | []>([]);

    const [listDates, setListDates] = useState<DateItem[]>([])
    const [isVisibleListDate, setIsVisibleListDate] = useState<boolean>(false)
    const [activeDate, setActiveDate] = useState<string | null>(null)
    const [isShowDate, setIsShowDate] = useState<boolean>(false)
    const [messageDate, setMessageDate] = useState<string>('')
    const [isOpenModalBlackList, setIsOpenModalBlackList] = useState<boolean>(false)

    const [isShowPurchasesTrench, setIsShowPurchasesTrench] = useState<boolean>(false)

    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

    const router = useRouter();

    const {dates, loading, error, fetchDates} = useTrenchDates()
    const {
        data: purchasesTokenTrench,
        dataFilterMonth: purchasesTrench,
        loadingPurchase,
        errorPurchase,
        fetchData
    } = usePurchaseTrenchData()

    useEffect(() => {
        if (dates.length > 0) {
            console.log('dates2', dates)
            getGroupDatesByMonth(dates)
            setMessageDate('')
            setActiveMonth(null)
        } else {
            setListMonth([])
            setMessageDate('Покупок не было!')
        }
    }, [dates])

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

    const hideBuyerTrenchBlackList = async (address: string, address_labels: string) => {

        try {
            const res = await fetch("/api/addBuyerTrenchBlackList", {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    address, address_labels
                })
            });

            if (!res.ok) {
                console.error("Ошибка при добавлении кошелька в черный список:");
            }
            // Обновляем список покупок после внесения в черный список
            getUpdatedListBuyerTrench()

        } catch (err) {
            console.error("Сетевая ошибка:", err);
        }
    }

    async function getUpdatedListBuyerTrench() {
        if (activeTokenId !== null) {

            const updatedPurchases = await fetchData(activeTokenId);
            const updatedDates = updatedPurchases.map(p => p.timestamp);

            getGroupDatesByMonth(updatedDates);

            fetchData(activeTokenId, selectedMonth)
            console.log('✅ чистые даты покупок:', updatedPurchases.map(p => normalizeDate(p.timestamp)));
            router.refresh(); // перезагрузить страницу после удаления покупки
        }
    }

    function getGroupDatesByMonth(date: string[]) {
        let result = groupDatesByMonth(date)
        setListMonth(result)
    }

    function groupDatesList(dates: Date[]) {
        if (!dates || dates.length === 0) return

        const result = dates
            .map(date => {
                const raw = normalizeDate(date); // YYYY-MM-DD
                return {
                    raw,
                    display: new Date(date).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long"
                    })
                };
            })
            .sort((a, b) => b.raw.localeCompare(a.raw));

        const unique = Array.from(new Map(result.map(item => [item.raw, item])).values());
        setListDates(unique);
    }

    function showListMonthTrench(tokenId: number) {
        setActiveTokenId(tokenId)
        setIsShowMonth(true)
        setOpenedMonth(null)
        setIsShowDate(false)
        setIsVisibleListDate(false)
        setListDates([])
        setActiveMonth(null)
        setActiveDate(null)
        setIsShowPurchasesTrench(false)
        fetchDates(tokenId)
    }

    function showListDate(monthName: string, date: Date[]) {

        if (openedMonth === monthName) {
            setOpenedMonth(null)
            setIsShowDate(false)
            setIsVisibleListDate(false)
            setListDates([])
            setActiveMonth(null)
            setActiveDate(null)
            setIsShowPurchasesTrench(false)
        } else {
            setOpenedMonth(monthName)
            setIsShowDate(true)
            setIsVisibleListDate(true)
            groupDatesList(date)
            setActiveMonth(monthName)
            setIsShowPurchasesTrench(false)
        }
    }

    function showListPurchasesTrench(monthDates: Date[], rawDate: string, tokenId: number) {
        setIsShowPurchasesTrench(true);
        setActiveDate(rawDate);

        const selected = monthDates.find(d => normalizeDate(d) === rawDate);

        if (selected) {
            setSelectedMonth([selected]);
            fetchData(tokenId, [selected]);
        }
    }

    function openModalCloseRemoveToken(tokenId: number, tokenName: string) {
        setIsModalOpenRemoveToken(true)
        setActiveTokenId(tokenId)
        setNameAddToken(tokenName)
        setIsShowMonth(false)
        setIsShowDate(false)
    }

    function openModalTokenTrenchAdd() {
        setIsModalOpenAddToken(true)
    }

    function openModalBlackListTrench() {
        setIsOpenModalBlackList(true)
    }

    function closeModalTokenTrench() {
        setIsModalOpenAddToken(false)
        setIsModalOpenRemoveToken(false)
        setIsOpenModalBlackList(false)
    }

    return (
        <div className={styles.token}>

            <InfoContainer background={colors.darkgreyСolor} color={colors.lilacTitle} title="Токены" variant="narrow">
                <div className={styles.token__header}>
                    <ButtonBack text='Главная'/>
                    <div className={styles.container__button}>
                        <Tooltip children={<ButtonAdd openModal={openModalTokenTrenchAdd}/>} text="Добавить токен"/>
                        <Tooltip children={<ButtonBlackList openModal={openModalBlackListTrench}/>}
                                 text="Черный список кошельков"/>
                    </div>
                </div>

                <ul className={styles.token__list}>
                    {tokens
                        .slice() // создаём копию, чтобы не мутировать исходный массив
                        .sort((a, b) => a.name.localeCompare(b.name)) // сортировка по имени
                        .map(token => {
                            const isNew = token.added_at ? (new Date().getTime() - new Date(token.added_at).getTime()) < ONE_WEEK_MS : false

                            const lastPurchase = dateLastPurchase
                                .filter(p => p.token_id === token.id)   // берем только по токену
                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] // самая свежая

                            const lastPurchaseDate = lastPurchase
                                ? formatDate(lastPurchase.timestamp)
                                : '' // если покупок нет

                            return (
                                <li key={token.id}
                                    onClick={() => showListMonthTrench(token.id)}
                                    className={`${styles.token__name} ${activeTokenId === token.id ? styles.text__active : ''}`}
                                >

                                    <div className={styles.token__info}>
                                        <span>{token.name} {isNew &&
                                            <span className={styles.newLabel}>(new)</span>}
                                        </span>
                                        <span
                                            className={`${styles.token__last_date} ${styles.token__trade_volume}`}>{lastPurchaseDate}</span>
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
                isShowMonth ?
                    <InfoContainer background={colors.greyСolor} color={colors.textColor} title='Даты' variant="narrow">

                        {loading ? (
                            <Loader/>
                        ) : listMonth.length > 0 ? (
                            <ul className={`${styles.token__list} ${styles.monthFadeIn}`}>
                                {listMonth.map((month, i) => (
                                    <li key={i}

                                        className={`${styles.month__item} ${styles.month__item_trench} ${openedMonth === month.name ? styles.text__active : ''}`}>
                                        <div className={styles.month__container}
                                             onClick={() => {
                                                 if (activeTokenId !== null) {
                                                     showListDate(month.name, month.date)
                                                 }
                                             }}
                                        >
                                            <span>{month.name}</span>
                                            <button
                                                className={`
                                            ${styles.btn__arrow} 
                                            ${isVisibleListDate ? styles.btn__close : styles.btn__open} 
                                            `}>
                                            </button>
                                        </div>

                                        {openedMonth === month.name && (
                                            <div className={stylesTrench.list__dates}>
                                                {
                                                    loading ? (
                                                        <Loader/>
                                                    ) : listDates.length > 0 ? (
                                                        <ul className={`${stylesTrench.list} ${styles.monthFadeIn}`}>
                                                            {listDates.map((dateObj, i) => (
                                                                <li key={i}
                                                                    onClick={() => {
                                                                        if (activeTokenId !== null) {
                                                                            showListPurchasesTrench(month.date, dateObj.raw, activeTokenId);
                                                                        }
                                                                    }}
                                                                    className={`${styles.date_item} ${activeDate === dateObj.raw ? styles.text__active : ''}`}>
                                                                    <span>{dateObj.display}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className={`${styles.text__message} ${styles.monthFadeIn}`}>{messageDate}</p>
                                                    )
                                                }
                                            </div>
                                        )}
                                    </li>
                                ))}

                            </ul>
                        ) : (
                            <p className={`${styles.text__message} ${styles.monthFadeIn}`}>{messageDate}</p>
                        )}

                    </InfoContainer>
                    : ''
            }

            {
                isShowPurchasesTrench ?
                    <InfoContainer background={colors.greyСolor} color={colors.textColor} title='Покупатели'
                                   variant="wide">
                        <ul className={styles.token__list}>
                            {loadingPurchase ? (
                                <Loader/>
                            ) : purchasesTrench
                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                .map((buyerTrench, i) =>
                                    <CardBuyerTrench
                                        key={buyerTrench.id}
                                        buyer={buyerTrench}
                                        onDelete={getUpdatedListBuyerTrench}
                                        hideBuyerBlackList={hideBuyerTrenchBlackList}
                                    />
                                )}
                        </ul>
                    </InfoContainer>
                    : ''
            }

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
                isOpenModalBlackList && (
                    <ModalForm children={<ModalBlackListTrench
                        title='Черный список кошельков'
                        onClose={closeModalTokenTrench}
                    />}/>
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