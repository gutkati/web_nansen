import React from 'react';
import styles from './CardBuyer.module.scss'

const CardBuyer = () => {
    return (
        <div className={styles.card}>
            <div className={styles.card__link}>
                <a href="/">0xf5213a6a2f0890321712520b8048d9886c1a9900</a>
            </div>
            <div className={styles.card__name}>
                <span>Auros Global [0xf5213a]</span>
            </div>
            <div className={styles.card__volume}>
                <span>Bought volume usd</span>
                <span>17279</span>
            </div>

            <div className={styles.card__balance}>
                <span>Current balance usd</span>
                <span>22007</span>
            </div>
        </div>
    );
};

export default CardBuyer;