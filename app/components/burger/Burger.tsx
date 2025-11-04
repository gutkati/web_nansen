'use client'

import React from 'react';
import styles from './Burger.module.scss'

type BurgerProps = {
    openModal: () => void;
}

const Burger: React.FC<BurgerProps> = ({openModal}) => {
    return (
        <button className={styles.burger} onClick={openModal}>
            <span></span>
            <span></span>
            <span></span>
        </button>
    );
};

export default Burger;