import type {Metadata} from "next";
import {getTokensTrench} from "@/lib/queriesTrench/tokenTrenchQueries";
import {getDateLastPurchase} from "@/lib/queriesTrench/dateListPurchasesQueries";
import Trench from "@/app/trench/Trench";

// делает страницу динамической
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Токены",
    description: "Список токенов",
};

export default async function TokenPageTrench() {
    const tokens = await getTokensTrench();
    const dateLastPurchase = await getDateLastPurchase();

    return (
        <Trench
            tokens={tokens}
            dateLastPurchase={dateLastPurchase}
        />
    );
}