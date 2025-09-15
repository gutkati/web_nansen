import type {Metadata} from "next";
import {getTokensTrench} from "@/lib/queriesTrench/tokenTrenchQueries";
import {getPurchasesAll} from "@/lib/queries/listAllPurchasesQueries"
import {getLastPurchase} from "@/lib/queries/listAllPurchasesQueries";
import Trench from "@/app/trench/Trench";

// делает страницу динамической
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Токены",
    description: "Список токенов",
};

export default async function TokenPageTrench() {
         const tokens = await getTokensTrench();
        // const listPurchases = await getPurchasesAll();
        // const lastPurchase = await getLastPurchase();

        return (
            <Trench
                tokens={tokens}
                // listPurchases={listPurchases}
                // lastPurchase={lastPurchase}
            />
        );
}