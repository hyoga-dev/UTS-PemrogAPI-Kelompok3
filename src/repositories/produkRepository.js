const pool = require('../config/db');

// Kolom yang boleh diisi client (id, created_at, deleted_at tidak boleh)
const KOLOM = ['kategori_id', 'kode_produk', 'nama_produk', 'harga', 'stok'];

function bersihkan(body) {
  const hasil = {};
  for (const k of KOLOM) {
    if (body[k] === undefined) continue;
    hasil[k] = typeof body[k] === 'string' ? body[k].trim() : body[k];
  }
  return hasil;
}

class ProdukRepository {
  // Hanya produk aktif. kategoriId opsional (untuk filter dan endpoint nested)
  async findAll(kategoriId) {
    let sql = 'SELECT * FROM produk WHERE deleted_at IS NULL';
    const values = [];
    if (kategoriId !== undefined) {
      sql += ' AND kategori_id = $1';
      values.push(kategoriId);
    }
    sql += ' ORDER BY id';
    const { rows } = await pool.query(sql, values);
    return rows;
  }

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM produk WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return rows[0] || null;
  }

  // Termasuk yang sudah di-soft delete (dipakai endpoint /permanent)
  async findAnyById(id) {
    const { rows } = await pool.query('SELECT * FROM produk WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async create(body) {
    const d = bersihkan(body);
    const sql = `INSERT INTO produk (kategori_id, kode_produk, nama_produk, harga, stok)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const { rows } = await pool.query(sql, [
      d.kategori_id, d.kode_produk, d.nama_produk, d.harga, d.stok,
    ]);
    return rows[0];
  }

  // PUT: ganti semua field sekaligus
  async replace(id, body) {
    const d = bersihkan(body);
    const sql = `UPDATE produk
                 SET kategori_id = $1, kode_produk = $2, nama_produk = $3,
                     harga = $4, stok = $5
                 WHERE id = $6 AND deleted_at IS NULL
                 RETURNING *`;
    const { rows } = await pool.query(sql, [
      d.kategori_id, d.kode_produk, d.nama_produk, d.harga, d.stok, id,
    ]);
    return rows[0] || null;
  }

  // PATCH: ubah hanya field yang dikirim
  async update(id, body) {
    const d = bersihkan(body);
    const kunci = Object.keys(d); // sudah difilter daftar KOLOM, aman dari field asing
    const set = kunci.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = [...kunci.map((k) => d[k]), id];
    const sql = `UPDATE produk SET ${set}
                 WHERE id = $${kunci.length + 1} AND deleted_at IS NULL
                 RETURNING *`;
    const { rows } = await pool.query(sql, values);
    return rows[0] || null;
  }

  // Soft delete: hanya menandai, baris tetap ada
  async softDelete(id) {
    const { rowCount } = await pool.query(
      'UPDATE produk SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return rowCount > 0;
  }

  // Restore: hanya untuk baris yang sedang terhapus
  async restore(id) {
    const { rows } = await pool.query(
      `UPDATE produk SET deleted_at = NULL
       WHERE id = $1 AND deleted_at IS NOT NULL
       RETURNING *`,
      [id]
    );
    return rows[0] || null;
  }

  // Nilai tambah: hard delete, hanya untuk baris yang sudah di-soft delete
  async hardDelete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM produk WHERE id = $1 AND deleted_at IS NOT NULL',
      [id]
    );
    return rowCount > 0;
  }
}

module.exports = new ProdukRepository();