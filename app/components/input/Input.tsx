"use client"
import React from 'react';
import styles from "./Input.module.scss";

type InputProps = {
    type: string;
    placeholder: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input:React.FC<InputProps> = ({type, placeholder, value, onChange}) => {
    return (
        <input
            className={styles.input__search}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

export default Input;