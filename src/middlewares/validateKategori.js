const aturan = {
  nama_kategori: (v) => typeof v === 'string' && v.trim() !== '' && v.length <= 50,
  deskripsi: (v) => v === undefined || v === null || (typeof v === 'string' && v.length <= 200),
};

const pesan = {
  nama_kategori: 'nama_kategori wajib diisi (maksimal 50 karakter)',
  deskripsi: 'deskripsi maksimal 200 karakter',
};

function validasi(body) {
  const errors = [];
  for (const f of Object.keys(aturan)) {
    if (!aturan[f](body[f])) errors.push(pesan[f]);
  }
  return errors;
}

const validateKategori = (req, res, next) => {
  const errors = validasi(req.body || {});
  if (errors.length > 0) {
    return res.status(400).json({ status: 'error', message: 'Validasi gagal', errors });
  }
  next();
};

module.exports = { validateKategori };