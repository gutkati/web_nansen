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
    const [loadingPurchase, setLoadingPurchase] = useState(false)
    const [errorPurchase, setErrorPurchase] = useState<string | null>(null)

    const fetchData = async (tokenId: number) => {
        setLoadingPurchase(true)
        setErrorPurchase(null)
        setData([])

        try {
            const res = await fetch('api/dataPurchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({tokenId})
            })
            const data = await res.json()

            if (res.ok) {
                const purchases = data as PurchaseData[];
                setData(purchases)
                console.log('data', data)
            } else {
                setErrorPurchase(data.error || "Произошла ошибка")
            }
        } catch (err) {
            setErrorPurchase("Ошибка запроса")
        } finally {
            setLoadingPurchase(false)
        }
    }

    return {data, loadingPurchase, errorPurchase, fetchData};
};