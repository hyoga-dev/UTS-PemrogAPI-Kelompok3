INSERT INTO kategori (nama_kategori, deskripsi) VALUES
  ('Elektronik', 'Perangkat elektronik dan aksesori'),
  ('Pakaian', 'Pakaian pria dan wanita'),
  ('Makanan', 'Makanan dan minuman kemasan');

INSERT INTO produk (kategori_id, kode_produk, nama_produk, harga, stok) VALUES
  (1, 'ELK-001', 'Mouse Wireless', 85000, 50),
  (1, 'ELK-002', 'Keyboard Mekanik', 350000, 20),
  (2, 'PKN-001', 'Kaos Polos', 65000, 100),
  (2, 'PKN-002', 'Celana Jeans', 180000, 40),
  (3, 'MKN-001', 'Keripik Singkong', 15000, 200);