import React from 'react';
import styles from './Header.module.scss'

const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                {/*<img src="../../images/logo.png" alt="логотип"/>*/}
            </div>
        </div>
    );
};

export default Header;