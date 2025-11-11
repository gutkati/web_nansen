'use client'

import React from 'react';
import styles from "./ModalListTables.module.scss";
import ButtonClose from "@/app/components/buttonClose/ButtonClose";

type ModalListTablesProps = {
    onClose: () => void;
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
}

const ModalListTables: React.FC<ModalListTablesProps> = ({onClose, title, subtitle, children}) => {
    return (
        <div className={styles.list__tables}>
            <ButtonClose onClose={onClose}/>
            <h5 className={styles.title}>{title}<p className={styles.subtitle}>{subtitle}</p></h5>
            <div>
                {children}
            </div>

        </div>
    );
};

export default ModalListTables;