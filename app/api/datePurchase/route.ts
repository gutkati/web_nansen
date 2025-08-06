import {getPurchaseDatesByTokenId} from '@/lib/queries/dateQueries';
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    const {tokenId} = await request.json() // Получаем tokenId из тела запроса

    try {
        const date = await getPurchaseDatesByTokenId(tokenId)
        return NextResponse.json(date)
    } catch (error) {
        return NextResponse.json(
            {error: "Не удалось получить даты покупки токена"}
        )
    }
}