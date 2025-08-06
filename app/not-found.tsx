import styles from "./styles/NotFound.module.scss"
import Link from "next/link";

export default function NotFound() {
    return (
        <div className={styles.not__found}>
            <h1 className={styles.title}>Ошибка 404</h1>
            <p className={styles.text}>
                Кажется вы заблудились, перейдите на <span><Link href='/'> главную страницу</Link></span>
            </p>
        </div>
    )
}