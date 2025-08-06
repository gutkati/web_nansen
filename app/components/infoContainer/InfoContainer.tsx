import React from 'react';
import styles from './InfoContainer.module.scss'
import ButtonBack from "@/app/components/buttonBack/ButtonBack";

type InfoContainerProps = {
    background: string,
    color: string,
    title: string,
    children: any,
}

const InfoContainer: React.FC<InfoContainerProps> = ({background, color, title, children}) => {
    return (
        <div className={styles.info} style={{background: background}}>
            <h3 className={styles.title} style={{color: color}}>{title.toUpperCase()}</h3>
            {children}
        </div>
    );
};

export default InfoContainer;