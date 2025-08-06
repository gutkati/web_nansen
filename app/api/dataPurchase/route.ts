import {getPurchaseByTokenId} from "@/lib/queries/purchaseQueries";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    const {tokenId} = await request.json() // Получаем tokenId из тела запроса

    try {
        const data = await getPurchaseByTokenId(tokenId)
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            {error: "Не удалось получить данные покупки токена"}
        )
    }
}