"use client"
import React from 'react';
import styles from './ButtonAdd.module.scss'

type ButtonAddProps = {
    openModal: () => void;
}

const ButtonAdd:React.FC<ButtonAddProps> = ({openModal}) => {
    return (
        <div
            className={styles.add}
            onClick={openModal}
        >

        </div>
    );
};

export default ButtonAdd;