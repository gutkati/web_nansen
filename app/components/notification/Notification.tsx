"use client"
import React from 'react';
import styles from './Notification.module.scss'

type NotificationProps = {
    color: 'green' | 'orange';
}

const Notification:React.FC<NotificationProps> = ({color}) => {
    return (
        <div className={`${styles.notification} ${styles[color]}`}>
            <span>!</span>
        </div>
    );
};

export default Notification;