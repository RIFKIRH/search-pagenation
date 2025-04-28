import User from '../models/UserModels.js';
import { Op } from 'sequelize'; // Import Op dari sequelize untuk operasi pencarian

// Mendapatkan semua pengguna
export const getUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 0; // Halaman yang diminta
    const limit = parseInt(req.query.limit) || 10; // Jumlah data per halaman   
    const search = req.query.search_query || ''; // Pencarian berdasarkan nama
    const offset = page * limit; // Menghitung offset untuk pagination
    const totalRows = await User.count({ 
        where: { [Op.or]:[{name:{
            [Op.like]: '%'+search+'%'
        }},{email:{
            [Op.like]: '%'+search+'%'
        }}] 
     } 
    }); // Menghitung total data yang sesuai dengan pencarian
    const totalPage = Math.ceil(totalRows / limit); // Menghitung total halaman
    const result = await User.findAll({
        where: { [Op.or]:[{name:{
            [Op.like]: '%'+search+'%'
        }},{email:{
            [Op.like]: '%'+search+'%'
        }}] 
     },
        limit: limit, // Mengatur batasan jumlah data yang diambil
        offset: offset, // Mengatur offset untuk pagination
        order: [['id', 'ASC']], // Mengurutkan berdasarkan ID secara ascending
});
    res.json({
        result: result,
        page: page, // Halaman yang diminta
        limit: limit, // Jumlah data per halaman
        totalRows: totalRows, // Total data yang sesuai dengan pencarian
        totalPage: totalPage // Total halaman
});
}
