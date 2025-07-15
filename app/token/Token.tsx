"use client"; // Добавьте эту строку
import React, {useState} from 'react';
import styles from './Token.module.scss';
import InfoContainer from "@/app/components/infoContainer/InfoContainer";
import colors from '../styles/_variables.module.scss';
import CardBuyer from "@/app/components/cardBuyer/CardBuyer";

type TokenType = {
    id: number;
    name: string;
};

type TokenProps = {
    tokens: TokenType[],
    month: string[],
}
const Token: React.FC<TokenProps> = ({tokens, month}) => {
    const [isShowMonth, setIsShowMonth] = useState(false);
    const [isShowPurchases, setIsPurchases] = useState(false);

    function showListMonth() {
        setIsShowMonth(true)
        setIsPurchases(false)
    }

    function showListPurchases() {
        setIsPurchases(true)
    }

    return (
        <div className={styles.token}>
            <InfoContainer background={colors.darkgreyСolor} color={colors.lightgreenColor} title='Токены'>
                <ul className={styles.token__list}>
                    {tokens.map(token =>
                        <li key={token.id} onClick={showListMonth}>
                            <span>{token.name}</span>
                        </li>
                    )}
                </ul>
            </InfoContainer>

            {
                isShowMonth ?
                    <InfoContainer background={colors.greyСolor} color={colors.textColor} title='Месяцы'>
                        <ul className={styles.token__list}>
                            {month.map((month, i) =>
                                <li key={i} onClick={showListPurchases} className={styles.month_item}>
                                    <span>{month}</span>
                                </li>
                            )}
                        </ul>
                    </InfoContainer>
                    : ''
            }

            {
                isShowPurchases ?
                  <InfoContainer background={colors.greyСolor} color={colors.textColor} title='Покупатели'>
                        <ul className={styles.token__list}>
                            {month.map((month, i) =>
                                <CardBuyer key={i}/>
                            )}
                        </ul>
                    </InfoContainer>
                    : ''
            }
        </div>
    );
};

export default Token;