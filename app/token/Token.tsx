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

type TokenType = {
    id: number;
    name: string;
};

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
    const [isShowMonth, setIsShowMonth] = useState(false);
    const [isShowPurchases, setIsPurchases] = useState(false);
    const [listMonth, setListMonth] = useState<MonthType>([])
    const [messageMonth, setMessageMonth] = useState<string>('')
    const [activeMonth, setActiveMonth] = useState<string | null>(null)
    const [isNotification, setIsNotification] = useState(false)
    const [localLastPurchase, setLocalLastPurchase] = useState<LastPurchase[]>(lastPurchase)
    const [clientPurchases, setClientPurchases] = useState<ListPurchases[]>(listPurchases)

    const [selectedMonth, setSelectedMonth] = useState<Date[] | []>([]);

    const {dates, loading, error, fetchDates} = usePurchaseDates()
    const {
        data: purchasesToken,
        dataFilterMonth: purchases,
        loadingPurchase,
        errorPurchase,
        fetchData
    } = usePurchaseData()

    const router = useRouter();

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

    // записывает id последней закупки
    useEffect(() => {
        if (purchasesToken.length > 0 && activeTokenId !== null) {
            console.log('purchases', purchasesToken)
            const latestPurchase = purchasesToken[0]; // т.к. сортировка по времени
            const purchaseDate = new Date(latestPurchase.timestamp);
            const selected = selectedMonth[0];

            const sameMonth =
                purchaseDate.getFullYear() === selected.getFullYear() &&
                purchaseDate.getMonth() === selected.getMonth();

            if (sameMonth) {
                fetch('/api/saveLastPurchase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tokenId: activeTokenId,
                        purchaseId: latestPurchase.id,
                    }),
                })
                    .then(res => res.json())
                    .then(data => {
                        if (!data.success) {
                            console.warn('Ошибка при сохранении последней покупки');
                        } else {
                            updateLocalLastPurchase(activeTokenId, latestPurchase.id)
                        }
                    })
                    .catch(console.error);
            }
        }
    }, [purchases, activeTokenId]);

    function showListMonth(tokenId: number) {
        setActiveTokenId(tokenId)
        setIsShowMonth(true)
        setIsPurchases(false)
        fetchDates(tokenId)
    }

    function groupDatesByMonth(dates: string[]) {
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
        return !!latestPurchase && latestPurchase.id !== savedPurchase?.purchase_id
    }

    function handleDeleteBuyer() {
        if (activeTokenId !== null) {
            fetchData(activeTokenId, selectedMonth)
            router.refresh();
        }
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

    return (
        <div className={styles.token}>

            <InfoContainer background={colors.darkgreyСolor} color={colors.lightgreenColor} title='Токены'>
                <ButtonBack text='Главная'/>
                <ul className={styles.token__list}>
                    {tokens.map(token => {
                        const showNotification = hasTodayPurchases(token.id)
                        return (
                            <li key={token.id}
                                onClick={() => showListMonth(token.id)}
                                className={activeTokenId === token.id ? styles.text__active : ''}
                            >
                                {showNotification && <Notification/>}
                                <span>{token.name}</span>
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
                                        onDelete={ handleDeleteBuyer}/>
                                )}
                        </ul>
                    </InfoContainer>
                    : ''
            }
        </div>
    );
};

export default Token;