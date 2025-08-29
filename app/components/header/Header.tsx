"use client"
import styles from './Header.module.scss'
import Link from "next/link";
import {useRouter, usePathname} from "next/navigation";
import {useState, useEffect} from "react";

const Header = () => {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: "POST",
            credentials: "include"
        })
        router.push("/login")
    }

    return (
        <header className={styles.header}>
            <Link href='/' className={styles.logo}></Link>
            {pathname !== "/login" && (
                <button className={styles.btn__logout} onClick={handleLogout}>
                    Выйти
                </button>
            )}
        </header>
    );
};

export default Header;