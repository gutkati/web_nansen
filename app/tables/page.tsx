import type {Metadata} from "next";
import Tables from "@/app/tables/Tables";

// делает страницу динамической
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Таблицы",
    description: "Список таблиц",
};

export default async function TablesPage() {
    return(
        <Tables/>
    )
}
