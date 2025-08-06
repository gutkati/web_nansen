'use client'
import React from 'react';
import Link from "next/link";
import styles from './ButtomLink.module.scss'

type ButtonLinkProps = {
    color: string,
    text: string,
    link: string,
}

const ButtonLink: React.FC<ButtonLinkProps> = ({color, text, link}) => {

    return (
        <Link href={link} className={styles.button} style={{background: color}}>
            <span>{text.toUpperCase()}</span>
        </Link>
    );
};

export default ButtonLink;