const pool = require('./config/db');

(async () => {
  try {
    const res = await pool.query('SELECT NOW() AS waktu');
    console.log('Terhubung:', res.rows[0].waktu);
  } catch (err) {
    console.error('Gagal terhubung:', err.message);
  } finally {
    await pool.end();
  }
})();