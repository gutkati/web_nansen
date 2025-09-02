"use client"
import styles from './Header.module.scss'
import {useRouter, usePathname} from "next/navigation";

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
            <div className={styles.logo}></div>
            {pathname !== "/login" && (
                <button className={styles.btn__logout} onClick={handleLogout}>
                    Выйти
                </button>
            )}
        </header>
    );
};

export default Header;