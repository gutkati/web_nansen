'use client'
import React from 'react';
import styles from './Loader.module.scss'

const Loader: React.FC = () => {
    return (
        <div className={styles.loader}>
            <div className={styles.spinner_big}>
                <div className={styles.spinner_small}></div>
            </div>
        </div>
    );
};

export default Loader;