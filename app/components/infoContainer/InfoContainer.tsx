"use client";
import React from 'react';
import styles from './InfoContainer.module.scss'

type InfoContainerProps = {
    background: string,
    color: string;
    title: string;
    children: React.ReactNode;
    variant?: "default" | "wide" | "narrow";
}

const InfoContainer: React.FC<InfoContainerProps> = ({background, color, title, children, variant = 'default'}) => {
    return (
        <div className={`${styles.info} ${styles[variant]}`} style={{background: background}}>
            <h3 className={styles.title} style={{color: color}}>{title.toUpperCase()}</h3>
            {children}
        </div>
    );
};

export default InfoContainer;