const express = require('express');
const kategoriRoutes = require('./routes/kategoriRoutes');
const produkRoutes = require('./routes/produkRoutes');

const app = express();

app.use(express.json());

app.use('/api/kategori', kategoriRoutes);
app.use('/api/produk', produkRoutes);

// URL tidak dikenal
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route tidak ditemukan' });
});

// Error handler terpusat (4 parameter, dipasang paling akhir)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'error', message: 'JSON tidak valid' });
  }
  if (err.code === '23505') {
    return res.status(409).json({
      status: 'error',
      message: 'Data bentrok: nilai unik sudah terdaftar',
    });
  }
  if (err.code === '23503') {
    // Pada INSERT/UPDATE produk: kategori_id tidak ada di tabel kategori
    return res.status(422).json({
      status: 'error',
      message: 'kategori_id tidak ditemukan di tabel kategori',
    });
  }
  console.error(err); // detail hanya di console
  res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
});

module.exports = app;