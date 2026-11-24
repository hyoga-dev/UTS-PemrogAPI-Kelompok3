const pool = require('../config/db');

class KategoriRepository {
  async findAll() {
    const { rows } = await pool.query('SELECT * FROM kategori ORDER BY id');
    return rows;
  }

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM kategori WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async create({ nama_kategori, deskripsi }) {
    const sql = `INSERT INTO kategori (nama_kategori, deskripsi)
                 VALUES ($1, $2) RETURNING *`;
    const { rows } = await pool.query(sql, [nama_kategori.trim(), deskripsi ?? null]);
    return rows[0];
  }

  async remove(id) {
    const { rowCount } = await pool.query('DELETE FROM kategori WHERE id = $1', [id]);
    return rowCount > 0; // false jika id tidak ada
  }
}

module.exports = new KategoriRepository(); // diekspor satu instance