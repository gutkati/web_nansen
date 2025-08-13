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
  // Режим сборки определяем по наличию специального флага
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

  if (isBuildPhase) {
    console.log('[BUILD] Skipping DB requests');
    return (
      <Token
        tokens={[]}
        listPurchases={[]}
        lastPurchase={null}
      />
    );
  }

  try {
    const [tokens, listPurchases, lastPurchase] = await Promise.all([
      getTokens(),
      getPurchasesAll(),
      getLastPurchase()
    ]);

    return <Token {...{ tokens, listPurchases, lastPurchase }} />;
  } catch (error) {
    console.error('DB Error:', error);
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