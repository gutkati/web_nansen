"use client"
import styles from './Header.module.scss'
import Link from "next/link";

const Header = () => {
    return (
        <header className={styles.header}>
            <Link href='/' className={styles.logo}></Link>
        </header>
    );
};

export default Header;