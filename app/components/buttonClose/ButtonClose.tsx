"use client"

import React from 'react';
import styles from "./ButtonClose.module.scss"

type ButtonCloseProps = {
    onClose: () => void;
}

const ButtonClose: React.FC<ButtonCloseProps> = ({onClose}) => {
    return (
        <div
            className={styles.btn__close}
            onClick={onClose}
        >

        </div>
    );
};

export default ButtonClose;