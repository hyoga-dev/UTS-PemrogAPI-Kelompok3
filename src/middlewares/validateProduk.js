const MAX_INT = 2147483647; // batas INTEGER PostgreSQL, agar tidak jadi error 500

const teks = (v, max) =>
  typeof v === 'string' && v.trim() !== '' && v.trim().length <= max;

const aturan = {
  kategori_id: (v) => Number.isInteger(v) && v >= 1 && v <= MAX_INT,
  kode_produk: (v) => teks(v, 20),
  nama_produk: (v) => teks(v, 100),
  harga: (v) => Number.isInteger(v) && v > 0 && v <= MAX_INT,
  stok: (v) => Number.isInteger(v) && v >= 0 && v <= MAX_INT,
};

const pesan = {
  kategori_id: 'kategori_id harus bilangan bulat >= 1',
  kode_produk: 'kode_produk wajib diisi (maksimal 20 karakter)',
  nama_produk: 'nama_produk wajib diisi (maksimal 100 karakter)',
  harga: 'harga harus bilangan bulat > 0',
  stok: 'stok harus bilangan bulat >= 0',
};

function validasi(body, parsial) {
  const errors = [];
  const fields = Object.keys(aturan);
  for (const f of fields) {
    if (parsial && body[f] === undefined) continue; // PATCH: lewati yang tidak dikirim
    if (!aturan[f](body[f])) errors.push(pesan[f]);
  }
  if (parsial && fields.every((f) => body[f] === undefined)) {
    errors.push('minimal satu field harus dikirim');
  }
  return errors;
}

const cek = (parsial) => (req, res, next) => {
  const errors = validasi(req.body || {}, parsial);
  if (errors.length > 0) {
    return res.status(400).json({ status: 'error', message: 'Validasi gagal', errors });
  }
  next();
};

module.exports = {
  validateProduk: cek(false), // POST dan PUT: semua wajib
  validatePatch: cek(true),   // PATCH: hanya yang dikirim
};