import {useState} from "react";

interface PurchaseData {
    id: number;
    token_id: number;
    address: string;
    address_labels: string;
    bought_usd_volume: string; // DECIMAL(18,2) представлен как string
    current_balance: string;   // DECIMAL(18,2) представлен как string
    timestamp: string;
    show_key: number | null;
}

export function usePurchaseData() {
    const [data, setData] = useState<PurchaseData[]>([])
    const [dataFilterMonth, setDataFilterMonth] = useState<PurchaseData[]>([])
    const [loadingPurchase, setLoadingPurchase] = useState(false)
    const [errorPurchase, setErrorPurchase] = useState<string | null>(null)

    const fetchData = async (tokenId: number, filterDates?: Date[]) => {
        setLoadingPurchase(true)
        setErrorPurchase(null)
        setData([])
        setDataFilterMonth([])

        try {
            const res = await fetch('api/dataPurchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({tokenId})
            })
            const lisData = await res.json()
            console.log('lisData', lisData)
            if (res.ok) {
                let purchases = lisData as PurchaseData[];
                setData(purchases.reverse())
                // purchases.reverse()
                //Фильтрация по датам, если переданы
                if (filterDates && filterDates.length > 0) {
                    const baseDate = new Date(filterDates[0]);
                    const targetYear = baseDate.getFullYear();
                    const targetMonth = baseDate.getMonth();

                    purchases = purchases.filter(purchase => {
                        const purchaseDate = new Date(purchase.timestamp);
                        return (
                            purchaseDate.getFullYear() === targetYear &&
                            purchaseDate.getMonth() === targetMonth
                        );
                    });
                }
                console.log('data', data)
                setDataFilterMonth(purchases)
                return purchases
            } else {
                setErrorPurchase(lisData.error || "Произошла ошибка")
                return []
            }
        } catch (err) {
            setErrorPurchase("Ошибка запроса")
            return []
        } finally {
            setLoadingPurchase(false)
        }
    }

    return {data, dataFilterMonth, loadingPurchase, errorPurchase, fetchData};
};