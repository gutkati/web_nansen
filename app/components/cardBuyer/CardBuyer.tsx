import React from 'react';
import styles from './CardBuyer.module.scss'

const CardBuyer = () => {
    return (
        <div className={styles.card}>
            <div className={styles.card__link}>
                <a href="https://app.nansen.ai/profiler?address=0xf5213a6a2f0890321712520b8048d9886c1a9900&chain=all" target='_blank'>0xf5213a6a2f0890321712520b8048d9886c1a9900</a>
            </div>
            <div className={styles.card__name}>
                <span>Auros Global [0xf5213a]</span>
            </div>
            <div className={`${styles.card__info} ${styles.card__volume}`}>
                <span>Объем покупки USD</span>
                <span className={`${styles.card__text_bold} ${styles.card__price}`}>17279</span>
            </div>

            <div className={`${styles.card__info} ${styles.card__balance}`}>
                <span>Текущий баланс USD</span>
                <span className={styles.card__text_bold}>22007</span>
            </div>

            <div className={`${styles.card__info} ${styles.card__date}`}>
                <span>Дата</span>
                <span className={styles.card__text_bold}>22-06-2025</span>
            </div>
            
            <div className={`${styles.card__info} ${styles.card__viewing}`}>
                <label form="viewing">Просмотр</label>
                <input type="checkbox" id="viewing"/>
            </div>
        </div>
    );
};

export default CardBuyer;