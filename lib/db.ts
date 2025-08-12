import mysql from 'mysql2/promise';

let connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

export default connection;

// let connection = await mysql.createConnection({
//     host: '192.168.10.38', // имя хоста
//     database: 'nansen',      // имя базы данных
//     user: 'starscream',      // имя пользователя
//     password: 'Dao5seiw',          // пароль
// });