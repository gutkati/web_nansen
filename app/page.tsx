import styles from "./styles/Page.module.scss";
import Header from "@/app/components/header/Header";
import ButtonLink from "@/app/components/buttonLink/ButtonLink";
import colors from './styles/_variables.module.scss'

export default function App() {

    const isBuildTime = process.env.BUILD_TIME === 'true';
    const isProd = process.env.NODE_ENV === 'production';

    // Во время сборки (npm run build) показываем заглушку
    if (isBuildTime) {
        return <div>Загрузка данных...</div>;
    }

   // В рантайме — грузим данные
    if (isProd || process.env.NODE_ENV === 'development') {
        return(
            <div className={styles.app}>
                <Header/>

                <main className={styles.main}>
                    <ButtonLink color={colors.lightgreenColor} text="Токены" link='/token'/>
                </main>

            </div>
        );
    }
}