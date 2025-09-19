"use client";
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import styles from './Token.module.scss';
import InfoContainer from "@/app/components/infoContainer/InfoContainer";
import colors from '../styles/_variables.module.scss';
import CardBuyer from "@/app/components/cardBuyer/CardBuyer";
import {usePurchaseDates} from "@/app/hooks/usePurchaseDates"
import Loader from "@/app/components/loader/loader";
import {usePurchaseData} from "@/app/hooks/usePurchaseData";
import ButtonBack from "@/app/components/buttonBack/ButtonBack";
import Notification from "@/app/components/notification/Notification";
import ButtonAdd from "@/app/components/buttonAdd/ButtonAdd";
import ModalForm from "@/app/components/modalWindows/modalForm";
import ModalRemovePurchase from "@/app/components/modalWindows/modalRemovePurchase";
import ModalAdd from "@/app/components/modalWindows/ModalAdd";
import AddTokenMessage from "@/app/components/message/AddTokenMessage";
import ButtonBlackList from "@/app/components/buttonBlackList/ButtonBlackList";
import ModalBlackList from "@/app/components/modalWindows/ModalBlackList";
import Tooltip from "@/app/components/tooltip/Tooltip";
import ModalUpdate from "@/app/components/modalWindows/ModalUpdate";
import {TokenType, TokenUpdate, MonthType} from "@/app/types";

type Token = {
    name: string;
    token_address: string;
    chain: string;
    url: string;
    trade_volume: number;
}

type ListPurchases = {
    id: number;
    token_id: number;
};

type LastPurchase = {
    token_id: number;
    purchase_id: number;
    viewed_at: string;
};

type TokenProps = {
    tokens: TokenType[],
    listPurchases: ListPurchases[],
    lastPurchase: LastPurchase[]
}

const Token: React.FC<TokenProps> = ({tokens, listPurchases, lastPurchase}) => {
    const [activeTokenId, setActiveTokenId] = useState<number | null>(null)
    const [activeTokenName, setActiveTokenName] = useState<string>('')
    const [activeTokenVolume, setActiveTokenVolume] = useState<number | null>(null)
    const [isShowMonth, setIsShowMonth] = useState(false);
    const [isShowPurchases, setIsPurchases] = useState(false);
    const [listMonth, setListMonth] = useState<MonthType>([])
    const [messageMonth, setMessageMonth] = useState<string>('')
    const [activeMonth, setActiveMonth] = useState<string | null>(null)
    const [localLastPurchase, setLocalLastPurchase] = useState<LastPurchase[]>(lastPurchase)

    const [selectedMonth, setSelectedMonth] = useState<Date[] | []>([]);

    const [isModalOpenAddToken, setIsModalOpenAddToken] = useState<boolean>(false)
    const [isModalOpenRemoveToken, setIsModalOpenRemoveToken] = useState<boolean>(false)

    const [buyerTypes, setBuyerTypes] = useState<Record<string, 'smart' | 'spec' | null>>({});

    const [successMessageAddToken, setSuccessMessageAddToken] = useState<boolean>(false);
    const [errorMessageAddToken, setErrorMessageAddToken] = useState<boolean>(false)
    const [successMessageDeleteToken, setSuccessMessageDeleteToken] = useState<boolean>(false);
    const [nameAddToken, setNameAddToken] = useState<string>('')

    const [isOpenModalBlackList, setIsOpenModalBlackList] = useState<boolean>(false)

    const [isOpenModalUpdateToken, setIsOpenModalUpdateToken] = useState<boolean>(false)
    const [successMessageUpdateToken, setSuccessMessageUpdateToken] = useState<boolean>(false);

    const [isClient, setIsClient] = useState(false);

    const {dates, loading, error, fetchDates} = usePurchaseDates()
    const {
        data: purchasesToken,
        dataFilterMonth: purchases,
        loadingPurchase,
        errorPurchase,
        fetchData
    } = usePurchaseData()

    const router = useRouter();
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (dates.length > 0) {
            groupDatesByMonth(dates)
            setMessageMonth('')
            setActiveMonth(null)
        } else {
            setListMonth([])
            setMessageMonth('Покупок не было!')
        }
    }, [dates])

    // записывает id последней покупки
    useEffect(() => {
        if (purchasesToken.length > 0 && activeTokenId !== null && isShowPurchases) {

            const latestPurchase = purchasesToken[0]; // самая свежая покупка т.к. сортировка по времени

            const purchaseDate = new Date(latestPurchase.timestamp); // дата свежей покупки
            const selected = selectedMonth[0]; // первая дата из текущего выбранного месяца

            // sameMonth будет true, если последняя покупка была сделана в том же месяце, что и текущий выбранный.
            const sameMonth =
                purchaseDate.getFullYear() === selected.getFullYear() &&
                purchaseDate.getMonth() === selected.getMonth();

            if (sameMonth && latestPurchase?.id) {
                // значит мы можем сохранить этот purchaseId как последний просмотренный, чтобы убрать уведомление.
                saveLastPurchase(activeTokenId, latestPurchase.id)
            } else {
                // Покупок в выбранном месяце нет — ищем предыдущий месяц с покупками
                const previousMonthPurchase = purchasesToken.find(p => {
                    const date = new Date(p.timestamp);
                    return (
                        date.getFullYear() < selected.getFullYear() ||
                        (date.getFullYear() === selected.getFullYear() &&
                            date.getMonth() < selected.getMonth())
                    );
                });

                if (previousMonthPurchase) {
                    saveLastPurchase(activeTokenId, previousMonthPurchase.id);
                }
            }
        }
    }, [purchasesToken, activeTokenId, selectedMonth]);

    useEffect(() => {
        const initialTypes: Record<string, 'smart' | 'spec' | null> = {};
        purchasesToken.forEach(buyer => {
            if (buyer.buyer_type === 'smart' || buyer.buyer_type === 'spec') {
                initialTypes[buyer.address] = buyer.buyer_type;
            } else {
                initialTypes[buyer.address] = null;
            }
        });

        setBuyerTypes(initialTypes);
    }, [purchasesToken]);

    async function saveLastPurchase(tokenId: number, purchaseId: number) {

        fetch('/api/saveLastPurchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tokenId,
                purchaseId
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    console.warn('Ошибка при сохранении последней покупки');
                } else {
                    updateLocalLastPurchase(tokenId, purchaseId)
                }
            })
            .catch(console.error);
    }

    const handleAddToken = async (newToken: Token) => {
        try {
            const res = await fetch('/api/addToken', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({newToken})
            });

            if (res.status === 409) {
                // токен уже существует
                setIsModalOpenAddToken(false);
               // setNameAddToken(newToken.name);
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

    const handleUpdateToken = async (newToken: TokenUpdate) => {
        try {
            const res = await fetch('/api/updateToken', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newToken)
            });

            if (!res.ok) {
                console.error('Ошибка при добавлении токена');
                return;
            }
            setIsOpenModalUpdateToken(false)
            router.refresh(); // обновляем список токенов
            setSuccessMessageUpdateToken(true)
            setTimeout(() => setSuccessMessageUpdateToken(false), 4000)
        } catch (err) {
            console.error('Сетевая ошибка при добавлении токена:', err);
        }
    }

    const handleDeleteToken = async (tokenId: number) => {
        try {
            const res = await fetch('/api/deleteToken', {
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

            setNameAddToken(activeTokenName)
            setSuccessMessageDeleteToken(true)
            setTimeout(() => setSuccessMessageDeleteToken(false), 4000)
        } catch (err) {
            console.error('Сетевая ошибка при удалении:', err);
        }
    };

    const handleBuyerTypeChange = async (address: string, value: 'smart' | 'spec') => {
        const currentType = buyerTypes[address] || null;
        const newType = currentType === value ? null : value;

        setBuyerTypes(prev => ({
            ...prev,
            [address]: newType
        }));

        try {
            const res = await fetch("/api/updateBuyerType", {
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
                setBuyerTypes(prev => ({...prev, [address]: currentType}));
            }
        } catch (err) {
            console.error("Сетевая ошибка:", err);
            setBuyerTypes(prev => ({...prev, [address]: currentType}));
        }
    };

    async function getUpdatedListBuyer() {
        if (activeTokenId !== null) {

            const updatedPurchases = await fetchData(activeTokenId);
            const updatedDates = updatedPurchases.map(p => p.timestamp);

            groupDatesByMonth(updatedDates);

            fetchData(activeTokenId, selectedMonth)
            router.refresh(); // перезагрузить страницу после удаления покупки
        }
    }

    const hideBuyerBlackList = async (address: string, address_labels: string) => {

        try {
            const res = await fetch("/api/addBuyerBlackList", {
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
            getUpdatedListBuyer()

        } catch (err) {
            console.error("Сетевая ошибка:", err);
        }
    }

    function showListMonth(tokenId: number) {
        setActiveTokenId(tokenId)
        setIsShowMonth(true)
        setIsPurchases(false)
        fetchDates(tokenId)
    }

    function groupDatesByMonth(dates: string[]) {
        if (!dates) return
        const monthMap = new Map<string, Date[]>();

        dates.forEach(dateStr => {
            const date = new Date(dateStr);
            const monthName = date.toLocaleString('default', {month: 'long', year: 'numeric'}); // например: "июль 2025"

            if (!monthMap.has(monthName)) {
                monthMap.set(monthName, []);
            }

            monthMap.get(monthName)!.push(date);
        });

        const result: { name: string; date: Date[] }[] = [];

        monthMap.forEach((dates, name) => {
            name = name[0].toUpperCase() + name.slice(1)
            result.push({name, date: dates});
        });

        // сортировка по убыванию дат (чтобы последний месяц был первым)
        result.sort((a, b) => b.date[0].getTime() - a.date[0].getTime());
        setListMonth(result)
    }

    function showListPurchases(monthName: string, date: Date[], tokenId: number) {
        setIsPurchases(true)
        setActiveMonth(monthName)
        setSelectedMonth(date)
        fetchData(tokenId, date)
    }

    function getNotificationStatus(tokenId: number) {
        const latestPurchase = listPurchases.find(p => p.token_id === tokenId)
        const savedPurchase = localLastPurchase.find(t => t.token_id === tokenId)

        if (!latestPurchase) return null; // покупок вообще нет
        if (!savedPurchase) return 'green';   // пользователь ещё не открывал этот токен → значит всё новое
        if (latestPurchase.id > savedPurchase.purchase_id) return 'green'

        const lastViewed = new Date(savedPurchase.viewed_at).getTime()
        const now = new Date()

        // Определяем время последнего апдейта (6:00 или 18:00, ближайшее прошедшее)
        const lastUpdate = new Date(now)
        if (now.getHours() >= 18) {
            lastUpdate.setHours(18, 0, 0, 0)
        } else if (now.getHours() >= 6) {
            lastUpdate.setHours(6, 0, 0, 0)
        } else {
            // ещё до 6 утра → берём прошлые 17:00
            lastUpdate.setDate(lastUpdate.getDate() - 1)
            lastUpdate.setHours(18, 0, 0, 0)
        }

        // Если просмотр был позже последнего обновления → показываем оранжевый
        if (latestPurchase.id === savedPurchase.purchase_id && lastViewed > lastUpdate.getTime()) {
            return "orange"
        }

        return null
    }

    function updateLocalLastPurchase(tokenId: number, purchaseId: number) {
        const updatedLastPurchases = [...localLastPurchase]
        const existing = updatedLastPurchases.find(p => p.token_id === tokenId)
        const now = new Date().toISOString(); // сохраняем ISO строку времени

        if (existing) {

            if (purchaseId > existing.purchase_id) {
                existing.purchase_id = purchaseId
                existing.viewed_at = now
            }

        } else {
            updatedLastPurchases.push({token_id: tokenId, purchase_id: purchaseId, viewed_at: now})
        }
        setLocalLastPurchase(updatedLastPurchases)
    }

    function openModalCloseRemoveToken(tokenId: number, tokenName: string) {
        setIsModalOpenRemoveToken(true)
        setActiveTokenId(tokenId)
        setActiveTokenName(tokenName)
        setIsShowMonth(false)
        setIsPurchases(false)
    }

    function openModalTokenAdd() {
        setIsModalOpenAddToken(true)
    }

    function openModalTokenUpdate(tokenId: number, tokenName: string, tokenVolume: number) {
        setActiveTokenId(tokenId)
        setActiveTokenName(tokenName)
        setActiveTokenVolume(tokenVolume)
        setIsOpenModalUpdateToken(true)
    }

    function openModalBlackList() {
        setIsOpenModalBlackList(true)
    }

    function closeModalToken() {
        setIsModalOpenRemoveToken(false)
        setIsModalOpenAddToken(false)
        setIsOpenModalBlackList(false)
        setIsOpenModalUpdateToken(false)
    }

    return (
        <div className={styles.token}>

            <InfoContainer background={colors.darkgreyСolor} color={colors.lightgreenColor} title='Токены'>
                <div className={styles.token__header}>
                    <ButtonBack text='Главная'/>
                    <div className={styles.container__button}>
                        <Tooltip children={<ButtonAdd openModal={openModalTokenAdd}/>} text="Добавить токен"/>
                        <Tooltip children={<ButtonBlackList openModal={openModalBlackList}/>}
                                 text="Черный список кошельков"/>
                    </div>

                </div>

                <ul className={styles.token__list}>
                    {tokens
                        .slice() // создаём копию, чтобы не мутировать исходный массив
                        .sort((a, b) => a.name.localeCompare(b.name)) // сортировка по имени
                        .map(token => {
                            const notificationStatus = getNotificationStatus(token.id)
                            const isNew = token.added_at ? (new Date().getTime() - new Date(token.added_at).getTime()) < ONE_WEEK_MS : false
                            return (
                                <li key={token.id}
                                    onClick={() => showListMonth(token.id)}
                                    className={`${styles.token__name} ${activeTokenId === token.id ? styles.text__active : ''}`}
                                >
                                    {isClient && notificationStatus && <Notification color={notificationStatus}/>}

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
                                                openModalTokenUpdate(token.id, token.name, token.trade_volume)
                                            }}
                                        >

                                        </div>
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
                    <InfoContainer background={colors.greyСolor} color={colors.textColor} title='Месяцы'>

                        {loading ? (
                            <Loader/>
                        ) : listMonth.length > 0 ? (
                            <ul className={`${styles.token__list} ${styles.monthFadeIn}`}>
                                {listMonth.map((date, i) => (
                                    <li key={i}
                                        onClick={() => {
                                            if (activeTokenId !== null) {
                                                showListPurchases(date.name, date.date, activeTokenId);
                                            }
                                        }}
                                        className={`${styles.month__item} ${activeMonth === date.name ? styles.text__active : ''}`}>
                                        <span>{date.name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={`${styles.text__message} ${styles.monthFadeIn}`}>{messageMonth}</p>
                        )}

                    </InfoContainer>
                    : ''
            }

            {
                isShowPurchases ?
                    <InfoContainer background={colors.greyСolor} color={colors.textColor} title='Покупатели'>
                        <ul className={styles.token__list}>
                            {loadingPurchase ? (
                                <Loader/>
                            ) : purchases
                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                .map((buyer, i) =>
                                    <CardBuyer
                                        key={buyer.id}
                                        buyer={buyer}
                                        onDelete={getUpdatedListBuyer}
                                        buyerType={buyerTypes[buyer.address] || null}
                                        handleTypeBuyer={handleBuyerTypeChange}
                                        hideBuyerBlackList={hideBuyerBlackList}
                                    />
                                )}
                        </ul>
                    </InfoContainer>
                    : ''
            }

            {
                isModalOpenRemoveToken && activeTokenId && (
                    <ModalForm children={<ModalRemovePurchase
                        id={activeTokenId}
                        text={`Удалить токен ${activeTokenName}`}
                        onClose={closeModalToken}
                        onConfirm={handleDeleteToken}
                    />
                    }/>
                )
            }

            {
                isModalOpenAddToken && (
                    <ModalForm children={<ModalAdd
                        title="Добавить токен"
                        onClose={closeModalToken}
                        onConfirm={handleAddToken}
                    />}/>
                )

            }

            {
                isOpenModalUpdateToken && activeTokenId && activeTokenVolume && (
                    <ModalForm children={<ModalUpdate
                        title={`Редактировать токен ${activeTokenName}`}
                        id={activeTokenId}
                        trade_volume={activeTokenVolume}
                        onClose={closeModalToken}
                        onConfirm={handleUpdateToken}
                    />}/>
                )

            }

            {
                isOpenModalBlackList && (
                    <ModalForm children={<ModalBlackList
                        title='Черный список кошельков'
                        onClose={closeModalToken}
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

            {
                successMessageUpdateToken && (
                    <AddTokenMessage text={`Цена сделки токена ${activeTokenName} успешно изменена!`}/>
                )
            }

        </div>
    );
};

export default Token;