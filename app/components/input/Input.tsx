"use client"
import React from 'react';
import styles from "./Input.module.scss";

type InputProps = {
    type: string;
    placeholder: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void
}

const Input:React.FC<InputProps> = ({type, placeholder, value, onChange, onBlur}) => {
    return (
        <input
            className={styles.input__search}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
};

export default Input;