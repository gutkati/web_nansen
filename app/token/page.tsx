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
  // Для production-сборки возвращаем заглушку
  if (process.env.BUILD_TIME === 'true') {
    return <div>Загрузка данных...</div>;
  }

  // Всегда делаем запросы при реальной работе приложения
  try {
    const tokens = await getTokens();
    const listPurchases = await getPurchasesAll();
    const lastPurchase = await getLastPurchase();

    return (
      <Token tokens={tokens} listPurchases={listPurchases} lastPurchase={lastPurchase}/>
    );
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    return <div>Ошибка загрузки данных</div>;
  }
}

    // // Для production-сборки возвращаем заглушку
    // if (process.env.BUILD_TIME === 'true') {
    //     const tokens = await getTokens()
    //     const listPurchases = await getPurchasesAll()
    //     const lastPurchase = await getLastPurchase()
    //
    //     return (
    //         <Token tokens={tokens} listPurchases={listPurchases} lastPurchase={lastPurchase}/>
    //     )
    // }
    // console.log('Подключение', process.env.DB_NAME)
    // // В production-режиме (после деплоя) делаем реальные запросы
    // //if (process.env.NODE_ENV === 'production') {
    // const tokens = await getTokens()
    // const listPurchases = await getPurchasesAll()
    // const lastPurchase = await getLastPurchase()
    //
    // return (
    //     <Token tokens={tokens} listPurchases={listPurchases} lastPurchase={lastPurchase}/>
    // )
    // // }
    //
    // // Для dev-режима
    // // return <div>Режим разработки</div>
}