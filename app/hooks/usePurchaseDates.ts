import {useState} from 'react';

export function usePurchaseDates() {
    const [dates, setDates] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchDates = async (tokenId: number) => {
        setLoading(true)
        setError(null)
        setDates([])

        try {
            const res = await fetch('api/datePurchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({tokenId})
            })
            const data = await res.json()

            if (res.ok) {
                const timestamps = (data.map((item: { timestamp: string }) => item.timestamp))
                setDates(timestamps)
            } else {
                setError(data.error || "Произошла ошибка")
            }
        } catch (err) {
            setError("Ошибка запроса")
        } finally {
            setLoading(false)
        }
    }
    // console.log('dates', dates)
    return {dates, loading, error, fetchDates};
};