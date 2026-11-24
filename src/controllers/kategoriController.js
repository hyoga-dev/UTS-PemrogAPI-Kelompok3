const repo = require('../repositories/kategoriRepository');

exports.getAll = async (req, res, next) => {
  try {
    const data = await repo.findAll();
    res.status(200).json({
      status: 'success',
      message: 'Daftar kategori berhasil diambil',
      count: data.length,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await repo.findById(req.id);
    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: `Kategori id ${req.id} tidak ditemukan`,
      });
    }
    res.status(200).json({ status: 'success', message: 'Kategori ditemukan', data });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await repo.create(req.body);
    res.status(201).json({ status: 'success', message: 'Kategori berhasil ditambahkan', data });
  } catch (err) {
    next(err); // 23505 (nama ganda) ditangani error handler di app.js
  }
};

exports.remove = async (req, res, next) => {
  try {
    const dihapus = await repo.remove(req.id);
    if (!dihapus) {
      return res.status(404).json({
        status: 'error',
        message: `Kategori id ${req.id} tidak ditemukan`,
      });
    }
    res.status(204).send(); // sukses tanpa body
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({
        status: 'error',
        message: 'Kategori tidak bisa dihapus karena masih dipakai oleh produk',
      });
    }
    next(err);
  }
};