-- Laporan Kinerja Harian Database Schema
-- Run this in Vercel Postgres SQL console

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Laporan Harian table
CREATE TABLE IF NOT EXISTS laporan_harian (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  nama_kegiatan VARCHAR(500) NOT NULL,
  jam_mulai TIME,
  jam_selesai TIME,
  durasi_menit INTEGER,
  volume DECIMAL(10,2),
  satuan VARCHAR(50),
  hasil TEXT,
  file_url VARCHAR(1000),
  file_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_laporan_tanggal ON laporan_harian(tanggal);
CREATE INDEX IF NOT EXISTS idx_laporan_user ON laporan_harian(user_id);
CREATE INDEX IF NOT EXISTS idx_laporan_kegiatan ON laporan_harian(nama_kegiatan);

-- Insert default admin user (password: admin123)
-- You should change this password after first login
INSERT INTO users (username, password_hash, name) 
VALUES ('admin', '$2a$10$5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Oz5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Administrator')
ON CONFLICT (username) DO NOTHING;
