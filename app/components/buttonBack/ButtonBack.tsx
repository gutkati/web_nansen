"use client"

import React from 'react';
import styles from './ButtonBack.module.scss'
import Link from "next/link";

type BackProps = {
    text: string;
}

const ButtonBack:React.FC<BackProps> = ({text}) => {
    return (
        <div className={styles.back}>
            <Link href='/' className={styles.back__text}>{text.toUpperCase()}</Link>
        </div>
    );
};

export default ButtonBack;