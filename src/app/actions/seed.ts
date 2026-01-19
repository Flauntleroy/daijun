"use server";

import { hash } from "bcryptjs";
import { sql } from "@vercel/postgres";

export async function seedDatabase() {
    try {
        // Create tables if not exists
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        await sql`
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
      )
    `;

        // Create indexes
        await sql`CREATE INDEX IF NOT EXISTS idx_laporan_tanggal ON laporan_harian(tanggal)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_laporan_user ON laporan_harian(user_id)`;

        // Create default admin user with hashed password
        const passwordHash = await hash("admin123", 10);

        await sql`
      INSERT INTO users (username, password_hash, name) 
      VALUES ('admin', ${passwordHash}, 'Administrator')
      ON CONFLICT (username) DO NOTHING
    `;

        return { success: true, message: "Database seeded successfully" };
    } catch (error) {
        console.error("Seed database error:", error);
        return { error: "Failed to seed database" };
    }
}
