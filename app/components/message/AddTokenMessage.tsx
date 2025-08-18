import React from 'react';
import styles from './AddTokenMessage.module.scss'

type AddTokenMessageProps = {
    text: string;
}

const AddTokenMessage:React.FC<AddTokenMessageProps> = ({text}) => {
    return (
        <div className={styles.add__mess}>
            <p>{text}</p>
        </div>
    );
};

export default AddTokenMessage;