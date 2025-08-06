import {NextResponse} from "next/server";
import {saveLastPurchase} from '@/lib/queries/lastPurchaseQueries'

export async function POST(request: Request) {
    try {
        const { tokenId, purchaseId } = await request.json();
        await saveLastPurchase(tokenId, purchaseId)
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
