"use client"
import React, {useState} from 'react';
import styles from './LoginPage.module.scss'
import Input from "@/app/components/input/Input";
import {useRouter} from "next/navigation"
import Header from "@/app/components/header/Header";

const LoginPage = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const router = useRouter()
    let textError = 'Неверный логин или пароль'

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        const res = await fetch("/api/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password}),
            credentials: "include" // ВАЖНО
        })

        const data = await res.json()

        if (res.ok && data.success) {
            router.push("/") // куда редиректить после входа
        } else {
            setError(textError)
        }
    }

    // Валидация логина
    const validateUsername = (value: string): string => {
        if (!value.trim()) return 'Логин обязателен';
        return '';
    }

    // Валидация пароля
    const validatePassword = (value: string): string => {
        if (!value.trim()) return 'Пароль обязателен';
        return '';
    }

    // Обработчик blur для логина
    const handleBlurUsername = () => {
        setError(validateUsername(username));
    }

    // Обработчик blur для пароля
    const handleBlurPassword = () => {
        setError(validatePassword(password));
    }

    return (
        <div className={styles.login__page}>
            <Header/>
            <div className={styles.login}>
                <div className={styles.login__container}>
                    <h2 className={styles.login__title}>Авторизация</h2>
                    <form className={styles.login__form} onSubmit={handleLogin}>

                        <div className={styles.input__container}>
                            <Input
                                type='text'
                                placeholder='Логин'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={handleBlurUsername}
                            />
                        </div>

                        <div className={styles.input__container}>
                            <Input
                                type='password'
                                placeholder='Пароль'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={handleBlurPassword}
                            />
                            <span className={styles.login__error}>{error}</span>
                        </div>

                        <button
                            className={styles.btnlogin}
                            type='submit'
                        >
                            Войти
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;