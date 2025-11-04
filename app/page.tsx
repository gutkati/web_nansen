import styles from "./styles/Page.module.scss";
import Header from "@/app/components/header/Header";
import ButtonLink from "@/app/components/buttonLink/ButtonLink";
import colors from './styles/_variables.module.scss'

export default async function App() {

    return (
        <div className={styles.app}>
            <Header/>
            <main className={styles.main}>
                <ButtonLink color={colors.btnTablesColor} text="Tables" link='/tables'/>
                <ButtonLink color={colors.lilac} text="Trench tokens" link='/trench'/>
                <ButtonLink color={colors.lightgreenColor} text="Tokens" link='/token'/>
            </main>
        </div>
    );
}