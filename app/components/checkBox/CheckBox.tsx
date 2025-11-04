import React from 'react';
import styles from './CheckBox.module.scss'

type CheckBoxProps = {
    id: string;
    showKey: boolean;
    handleCheckboxChange: (id: string, checked: boolean) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({id, showKey, handleCheckboxChange}) => {
    return (
        <input
            className={styles.input}
            type="checkbox"
            id={id}
            checked={showKey}
            onChange={(e) => handleCheckboxChange(id, e.target.checked)}
        />
    );
};

export default CheckBox;