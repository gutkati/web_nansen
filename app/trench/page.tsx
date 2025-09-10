import Token from "@/app/token/Token";
import type {Metadata} from "next";
import {getTokens} from "@/lib/queries/tokenQueries";
import {getPurchasesAll} from "@/lib/queries/listAllPurchasesQueries"
import {getLastPurchase} from "@/lib/queries/listAllPurchasesQueries";

// делает страницу динамической
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Токены",
    description: "Список токенов",
}

export default async function TokenPage() {
        // const tokens = await getTokens();
        // const listPurchases = await getPurchasesAll();
        // const lastPurchase = await getLastPurchase();
        //
        // return (
        //     <Token
        //         tokens={tokens}
        //         listPurchases={listPurchases}
        //         lastPurchase={lastPurchase}
        //     />
        // );
}