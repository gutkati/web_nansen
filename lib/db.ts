import mysql from 'mysql2/promise';

let connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

async function ensureTables() {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    // создать таблицу last_purchase на старте приложения
    await conn.query(`
      CREATE TABLE IF NOT EXISTS last_purchase (
        id INT(12) AUTO_INCREMENT PRIMARY KEY,
        token_id INT(12) NOT NULL,
        purchase_id INT(12) NOT NULL,
        UNIQUE KEY unique_token (token_id)
      )
    `);

    // создать таблицу black_list на старте приложения
    await conn.query(`
      CREATE TABLE IF NOT EXISTS black_list (
        id INT AUTO_INCREMENT PRIMARY KEY,
        address VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (address)
      )
    `);

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.error("Ошибка при создании таблиц:", err);
  } finally {
    conn.release();
  }
}

ensureTables().catch(console.error);

export default connection;

// let connection = await mysql.createConnection({
//     host: '192.168.10.38', // имя хоста
//     database: 'nansen',      // имя базы данных
//     user: 'starscream',      // имя пользователя
//     password: 'Dao5seiw',          // пароль
// });