const repo = require('../repositories/produkRepository');
const kategoriRepo = require('../repositories/kategoriRepository');

function kirim404(res, id) {
  return res.status(404).json({
    status: 'error',
    message: `Produk id ${id} tidak ditemukan`,
  });
}

// GET /api/produk (nilai tambah: ?kategori_id=1)
exports.getAll = async (req, res, next) => {
  try {
    let kategoriId;
    if (req.query.kategori_id !== undefined) {
      kategoriId = Number(req.query.kategori_id);
      if (!Number.isInteger(kategoriId) || kategoriId <= 0 || kategoriId > 2147483647) {
        return res.status(400).json({
          status: 'error',
          message: 'kategori_id harus bilangan bulat positif',
        });
      }
    }
    const data = await repo.findAll(kategoriId);
    res.status(200).json({
      status: 'success',
      message: 'Daftar produk berhasil diambil',
      count: data.length,
      data,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/kategori/:id/produk
exports.getByKategori = async (req, res, next) => {
  try {
    const kategori = await kategoriRepo.findById(req.id);
    if (!kategori) {
      return res.status(404).json({
        status: 'error',
        message: `Kategori id ${req.id} tidak ditemukan`,
      });
    }
    const data = await repo.findAll(req.id);
    res.status(200).json({
      status: 'success',
      message: 'Daftar produk kategori berhasil diambil',
      count: data.length, // kosong tetap 200
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await repo.findById(req.id);
    if (!data) return kirim404(res, req.id);
    res.status(200).json({ status: 'success', message: 'Produk ditemukan', data });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await repo.create(req.body);
    res.status(201).json({ status: 'success', message: 'Produk berhasil ditambahkan', data });
  } catch (err) {
    next(err); // 23505 jadi 409, 23503 jadi 422 (lihat app.js)
  }
};

exports.replace = async (req, res, next) => {
  try {
    const data = await repo.replace(req.id, req.body);
    if (!data) return kirim404(res, req.id);
    res.status(200).json({ status: 'success', message: 'Produk berhasil diganti', data });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await repo.update(req.id, req.body);
    if (!data) return kirim404(res, req.id);
    res.status(200).json({ status: 'success', message: 'Produk berhasil diubah', data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/produk/:id -> soft delete
exports.remove = async (req, res, next) => {
  try {
    const berhasil = await repo.softDelete(req.id);
    if (!berhasil) return kirim404(res, req.id); // tidak ada atau sudah terhapus
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// PATCH /api/produk/:id/restore
exports.restore = async (req, res, next) => {
  try {
    const data = await repo.restore(req.id);
    if (!data) return kirim404(res, req.id); // tidak ada atau sedang aktif
    res.status(200).json({ status: 'success', message: 'Produk berhasil dipulihkan', data });
  } catch (err) {
    next(err);
  }
};

// Nilai tambah: DELETE /api/produk/:id/permanent
exports.removePermanent = async (req, res, next) => {
  try {
    const produk = await repo.findAnyById(req.id);
    if (!produk) return kirim404(res, req.id);
    if (produk.deleted_at === null) {
      return res.status(409).json({
        status: 'error',
        message: 'Produk masih aktif, lakukan soft delete terlebih dahulu',
      });
    }
    await repo.hardDelete(req.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};