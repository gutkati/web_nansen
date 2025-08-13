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
  // Отладочный вывод в консоль сервера (или браузера, если есть гидратация)
    console.log('[DEBUG] Build environment check:', {
    isBuildTime: !!process.env.NEXT_PUBLIC_IS_BUILD_TIME,
    nodeEnv: process.env.NODE_ENV,
    isServer: typeof window === 'undefined',
    runtime: process.env.NEXT_RUNTIME
  });
  // Для production-сборки возвращаем заглушку

   if (typeof window === 'undefined' && process.env.NEXT_PUBLIC_IS_BUILD_TIME) {
    return <div>Загрузка фиганных...</div>;
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