import { Sequelize } from "sequelize";

// Konfigurasi koneksi database
const db = new Sequelize('paginate_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql', // Tambahkan properti dialect (MySQL dalam kasus ini)
});

export default db;