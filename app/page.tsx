import styles from "./styles/Page.module.scss";
import Header from "@/app/components/header/Header";
import ButtonLink from "@/app/components/buttonLink/ButtonLink";
import colors from './styles/_variables.module.scss'

export default function App() {
    return (
        <div className={styles.app}>
            <Header/>

            <main className={styles.main}>
                <ButtonLink color={colors.lightgreenColor} text="Токены" link='/token'/>
            </main>

        </div>
    );
}