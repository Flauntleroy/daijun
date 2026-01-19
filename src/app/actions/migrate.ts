"use server";

import { sql } from "@vercel/postgres";

export async function migrateMoodColumn() {
    try {
        await sql`
            ALTER TABLE laporan_harian 
            ADD COLUMN IF NOT EXISTS mood VARCHAR(50);
        `;
        await sql`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);
        `;
        return { success: true };
    } catch (error) {
        console.error("Migration error:", error);
        return { error: "Migration failed" };
    }
}
