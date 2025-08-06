import Token from "@/app/token/Token";
import type {Metadata} from "next";
import {getTokens} from "@/lib/queries/tokenQueries";
import {getPurchasesAll} from "@/lib/queries/listAllPurchasesQueries"
import {getLastPurchase} from "@/lib/queries/listAllPurchasesQueries";

export const metadata: Metadata = {
    title: "Токены",
    description: "Список токенов",
};

export default async function TokenPage() {
    const tokens = await getTokens()
    const listPurchases = await getPurchasesAll()
    const lastPurchase = await getLastPurchase()
    console.log('all', listPurchases)
    return (
        <>
            <Token tokens={tokens} listPurchases={listPurchases} lastPurchase={lastPurchase}/>
        </>

    )
}