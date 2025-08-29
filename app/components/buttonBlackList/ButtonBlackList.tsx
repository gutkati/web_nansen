"use client"
import React from 'react';
import styles from './ButtonBlackList.module.scss'

type ButtonBlackListProps = {
    openModal: () => void;
}

const ButtonBlackList:React.FC<ButtonBlackListProps> = ({openModal}) => {
    return (
        <div className={styles.buttonBlacklist}
             onClick={openModal}
        >
        </div>
    );
};

export default ButtonBlackList;