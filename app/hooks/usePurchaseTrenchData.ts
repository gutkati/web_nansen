import {useState} from "react";
import {normalizeDate} from "@/app/utils/utils"

interface PurchaseData {
    id: number;
    token_id: number;
    address: string;
    address_labels: string;
    token_amount: string;
    total_outflow: string; // DECIMAL(18,2) представлен как string
    total_inflow: string;   // DECIMAL(18,2) представлен как string
    value_usd: string;
    timestamp: string;
    show_key: number | null;
    buyer_type: string | null;
}

export function usePurchaseTrenchData() {
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
            const res = await fetch('api/dataTrenchPurchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({tokenId})
            })
            const listData = await res.json()

            if (res.ok) {
                let purchases = listData as PurchaseData[];

                setData(purchases.reverse())

                //Фильтрация по датам, если переданы
                if (filterDates && filterDates.length > 0) {
                    const targetRaw = normalizeDate(filterDates[0]);

                    purchases = purchases.filter(purchase => {
                        const purchaseRaw = normalizeDate(purchase.timestamp);
                        return purchaseRaw === targetRaw;
                    });
                }
                setDataFilterMonth(purchases)
                return purchases
            } else {
                setErrorPurchase(listData.error || "Произошла ошибка")
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
}