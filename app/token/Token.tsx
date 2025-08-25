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

type TokenType = {
    id: number;
    name: string;
    added_at: Date | null;
};

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
};

type TokenProps = {
    tokens: TokenType[],
    listPurchases: ListPurchases[],
    lastPurchase: LastPurchase[]
}

type MonthType = {
    name: string;
    date: Date[];
}[]

const Token: React.FC<TokenProps> = ({tokens, listPurchases, lastPurchase}) => {
    const [activeTokenId, setActiveTokenId] = useState<number | null>(null)
    const [activeTokenName, setActiveTokenName] = useState<string>('')
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
    const [successMessageDeleteToken, setSuccessMessageDeleteToken] = useState<boolean>(false);
    const [nameAddToken, setNameAddToken] = useState<string>('')

    const [isOpenModalBlackList, setIsOpenModalBlackList] = useState<boolean>(false)

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
    //const ONE_WEEK_MS = 24 * 60 * 60 * 1000;

    useEffect(() => {
        if (dates.length > 0) {
            console.log('dates', dates)
            groupDatesByMonth(dates)
            setMessageMonth('')
            setActiveMonth(null)
        } else {
            console.log('dates2', dates)
            setListMonth([])
            setMessageMonth('Покупок не было!')
        }
    }, [dates])

    // записывает id последней покупки
    useEffect(() => {
        if (purchasesToken.length > 0 && activeTokenId !== null && isShowPurchases) {

            const latestPurchase = purchasesToken[0]; // самая свежая покупка т.к. сортировка по времени

            //setActiveTokenId(latestPurchase)
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

            if (!res.ok) {
                console.error('Ошибка при добавлении токена');
                return;
            }

            setIsModalOpenAddToken(false);
            router.refresh(); // обновляем список токенов
            setNameAddToken(newToken.name)
            setSuccessMessageAddToken(true)
            setTimeout(() => setSuccessMessageAddToken(false), 3000)
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
            setTimeout(() => setSuccessMessageDeleteToken(false), 3000)
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
                body: JSON.stringify({address, address_labels
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

        console.log('result', result)
        setListMonth(result)
    }

    function showListPurchases(monthName: string, date: Date[], tokenId: number) {
        setIsPurchases(true)
        setActiveMonth(monthName)
        setSelectedMonth(date)
        fetchData(tokenId, date)
    }

    function hasTodayPurchases(tokenId: number) {
        const latestPurchase = listPurchases.find(p => p.token_id === tokenId)
        const savedPurchase = localLastPurchase.find(t => t.token_id === tokenId)

        if (!latestPurchase) return false; // покупок вообще нет
        if (!savedPurchase) return true;   // пользователь ещё не открывал этот токен → значит всё новое
        //return latestPurchase.id > (savedPurchase?.purchase_id ?? 0)
        return latestPurchase.id > savedPurchase.purchase_id
    }

    function updateLocalLastPurchase(tokenId: number, purchaseId: number) {
        const updatedLastPurchases = [...localLastPurchase]
        const existing = updatedLastPurchases.find(p => p.token_id === tokenId)

        if (existing) {
            existing.purchase_id = purchaseId
        } else {
            updatedLastPurchases.push({token_id: tokenId, purchase_id: purchaseId})
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

    function openModalBlackList() {
        setIsOpenModalBlackList(true)
    }

    function closeModalToken() {
        setIsModalOpenRemoveToken(false)
        setIsModalOpenAddToken(false)
        setIsOpenModalBlackList(false)
    }

    return (
        <div className={styles.token}>

            <InfoContainer background={colors.darkgreyСolor} color={colors.lightgreenColor} title='Токены'>
                <div className={styles.token__header}>
                    <ButtonBack text='Главная'/>
                    <div className={styles.container__button}>
                        <ButtonAdd
                            openModal={openModalTokenAdd}/>
                        <ButtonBlackList openModal={openModalBlackList}/>
                    </div>

                </div>

                <ul className={styles.token__list}>
                    {tokens
                        .slice() // создаём копию, чтобы не мутировать исходный массив
                        .sort((a, b) => a.name.localeCompare(b.name)) // сортировка по имени
                        .map(token => {
                            const showNotification = hasTodayPurchases(token.id)
                            const isNew = token.added_at ? (new Date().getTime() - new Date(token.added_at).getTime()) < ONE_WEEK_MS : false
                            return (
                                <li key={token.id}
                                    onClick={() => showListMonth(token.id)}
                                    className={`${styles.token__name} ${activeTokenId === token.id ? styles.text__active : ''}`}
                                >
                                    {showNotification && <Notification/>}
                                    <span>{token.name} {isNew && <span className={styles.newLabel}>(new)</span>}</span>

                                    <div
                                        className={styles.token__remove}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            openModalCloseRemoveToken(token.id, token.name)
                                        }}
                                    >
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
                                        className={`${styles.month_item} ${activeMonth === date.name ? styles.text__active : ''}`}>
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
                successMessageDeleteToken && (
                    <AddTokenMessage text={`Токен ${nameAddToken} успешно удален!`}/>
                )
            }

        </div>
    );
};

export default Token;