"use client"
import React from 'react';
import styles from './Notification.module.scss'

const Notification = () => {
    return (
        <div className={styles.notification}>
            <span>!</span>
        </div>
    );
};

export default Notification;