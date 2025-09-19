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
import Notification from "@/app/components/notification/Notification";
import ModalForm from "@/app/components/modalWindows/modalForm";
import ModalAdd from "@/app/components/modalWindows/ModalAdd";
import Token from "@/app/token/Token";
import Tooltip from "@/app/components/tooltip/Tooltip";
import ButtonAdd from "@/app/components/buttonAdd/ButtonAdd";
import ModalAddTrenchToken from "@/app/components/modalWindows/ModalAddTrenchToken";
import AddTokenMessage from "@/app/components/message/AddTokenMessage";
import ModalRemovePurchase from "@/app/components/modalWindows/modalRemovePurchase";
import Loader from "@/app/components/loader/loader";
import {useTrenchDates} from "@/app/hooks/useTrenchDates";
import {usePurchaseTrenchData} from "@/app/hooks/usePurchaseTrenchData";
import {groupDatesByMonth} from "@/app/utils/utils"
import CardBuyerTrench from "@/app/components/cardBuyerTrench/CardBuyerTrench";

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

    const [listMonth, setListMonth] = useState<MonthType>([])
    const [activeMonth, setActiveMonth] = useState<string | null>(null)
    const [isShowMonth, setIsShowMonth] = useState<boolean>(false)
    const [openedMonth, setOpenedMonth] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<Date[] | []>([]);

    const [listDates, setListDates] = useState<string[]>([])
    const [isVisibleListDate, setIsVisibleListDate] = useState<boolean>(false)
    const [activeDate, setActiveDate] = useState<string | null>(null)
    const [isShowDate, setIsShowDate] = useState<boolean>(false)
    const [messageDate, setMessageDate] = useState<string>('')
    const [buyerTypesTrench, setBuyerTypesTrench] = useState<Record<string, 'smart' | 'spec' | null>>({});


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
            getGroupDatesByMonth(dates)
            setMessageDate('')
            setActiveMonth(null)
        } else {
            setListMonth([])
            setMessageDate('Покупок не было!')
        }
    }, [dates])

    useEffect(() => {
        const initialTypes: Record<string, 'smart' | 'spec' | null> = {};
        purchasesTokenTrench.forEach(buyer => {
            if (buyer.buyer_type === 'smart' || buyer.buyer_type === 'spec') {
                initialTypes[buyer.address] = buyer.buyer_type;
            } else {
                initialTypes[buyer.address] = null;
            }
        });

        setBuyerTypesTrench(initialTypes);
    }, [purchasesTokenTrench]);

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

    const handleBuyerTypeChange = async (address: string, value: 'smart' | 'spec') => {
        const currentType = buyerTypesTrench[address] || null;
        const newType = currentType === value ? null : value;

        setBuyerTypesTrench(prev => ({
            ...prev,
            [address]: newType
        }));

        try {
            const res = await fetch("/api/updateBuyerTypeTrench", {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    buyer_type: newType,
                    address
                })
            });

            const result = await res.json();
            if (!res.ok) {
                console.error("Ошибка при обновлении:", result.error);
                // откат
                setBuyerTypesTrench(prev => ({...prev, [address]: currentType}));
            }
        } catch (err) {
            console.error("Сетевая ошибка:", err);
            setBuyerTypesTrench(prev => ({...prev, [address]: currentType}));
        }
    };

    async function getUpdatedListBuyer() {
        if (activeTokenId !== null) {

            const updatedPurchases = await fetchData(activeTokenId);
            const updatedDates = updatedPurchases.map(p => p.timestamp);

            getGroupDatesByMonth(updatedDates);

            fetchData(activeTokenId, selectedMonth)
            router.refresh(); // перезагрузить страницу после удаления покупки
        }
    }

    function getGroupDatesByMonth(date: string[]) {
        let result = groupDatesByMonth(date)
        setListMonth(result)
    }

    function groupDatesList(dates: Date[]) {
        if (!dates || dates.length === 0) return

        // Преобразуем строки в Date
        const result = dates
            .map(dateStr => new Date(dateStr))
            .sort((a, b) => b.getTime() - a.getTime()); // свежие сверху

        // Форматируем в "17 сентября 2025"
        const formatted = result.map(date =>
            date.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
        );
// убираем дубликаты
        const unique = Array.from(new Set(formatted));
        setListDates(unique);
        console.log('list', listDates)
    }

    async function getUpdatedListBuyerTrench() {
        if (activeTokenId !== null) {

            const updatedPurchases = await fetchData(activeTokenId);
            const updatedDates = updatedPurchases.map(p => p.timestamp);

            // groupDatesByMonth(updatedDates);

            fetchData(activeTokenId)
            router.refresh(); // перезагрузить страницу после удаления покупки
        }
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
            //fetchDates(tokenId)
        }

    }

    function showListPurchasesTrench(monthDates: Date[], dateStr: string, tokenId: number) {
        setIsShowPurchasesTrench(true)
        setActiveDate(dateStr)

        // находим выбранную дату как Date
        const selected = monthDates.find(d =>
            d.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric"
            }) === dateStr
        );

        if (selected) {
            setActiveDate(dateStr)
            setSelectedMonth([selected])   // сохраняем массив с одной датой
            fetchData(tokenId, [selected]) // передаём в хук
        }
    }

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
                                    onClick={() => showListMonthTrench(token.id)}
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
                isShowMonth ?
                    <InfoContainer background={colors.greyСolor} color={colors.textColor} title='Даты'>

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
                                                     //showListPurchases(date.name, date.date, activeTokenId);
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
                                                            {listDates.map((date, i) => (
                                                                <li key={i}
                                                                    onClick={() => {
                                                                        if (activeTokenId !== null) {
                                                                            showListPurchasesTrench(month.date, date, activeTokenId);
                                                                        }
                                                                    }}
                                                                    className={`${styles.date_item} ${activeDate === date ? styles.text__active : ''}`}>
                                                                    <span>{date}</span>
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
                    <InfoContainer background={colors.greyСolor} color={colors.textColor} title='Покупатели'>
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
                                        buyerType={buyerTypesTrench[buyerTrench.address] || null}
                                        handleTypeBuyer={handleBuyerTypeChange}
                                        // hideBuyerBlackList={hideBuyerBlackList}
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