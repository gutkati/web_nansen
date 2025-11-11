"use client"

import React from 'react';
import styles from "./ButtonClose.module.scss"

type ButtonCloseProps = {
    onClose: () => void;
}

const ButtonClose: React.FC<ButtonCloseProps> = ({onClose}) => {

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onClose?.();
    };

    return (
        <div
            className={styles.btn__close}
            onClick={handleClick}
        >
        </div>
    );
};

export default ButtonClose;