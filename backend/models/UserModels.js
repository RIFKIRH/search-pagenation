import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

// Definisi model User
const User = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true, // Mencegah Sequelize mengubah nama tabel menjadi bentuk jamak
});

export default User;

// Sinkronisasi model dengan database
(async () => {
    await db.sync();
})();