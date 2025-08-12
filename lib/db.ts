import mysql from 'mysql2/promise';

async function createConnection() {
    try {
        console.log('🔌 Подключение к базе данных...');
        console.log('DB_HOST:', process.env.DB_HOST);
        console.log('DB_USER:', process.env.DB_USER);
        console.log('DB_NAME:', process.env.DB_NAME);

        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Пробуем сделать запрос, чтобы проверить подключение
        await pool.query('SELECT 1');
        console.log('✅ Успешное подключение к базе данных!');

        return pool;
    } catch (error) {
        console.error('❌ Ошибка подключения к базе данных:', error);
        process.exit(1); // Останавливаем процесс, если база недоступна
    }
}

const connection = await createConnection();
export default connection;


// let connection = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// })
//
// export default connection;

// let connection = await mysql.createConnection({
//     host: '192.168.10.38', // имя хоста
//     database: 'nansen',      // имя базы данных
//     user: 'starscream',      // имя пользователя
//     password: 'Dao5seiw',          // пароль
// });