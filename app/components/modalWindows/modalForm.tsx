"use client";
import React from 'react';
import styles from "./ModalForm.module.scss"

type ModalFormProps = {
    children?: React.ReactNode;
}

const ModalForm: React.FC<ModalFormProps> = ({children}) => {
    return (
        <div className={styles.modalremove__phone}>
            <div className={styles.modalform}>
                {children}
            </div>
        </div>

    );
};

export default ModalForm;