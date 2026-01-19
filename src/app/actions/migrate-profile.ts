"use server";

import { sql } from "@vercel/postgres";

export async function migrateProfile() {
    try {
        await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);
    `;
        return { success: true };
    } catch (error) {
        console.error("Migration error:", error);
        return { error: "Failed to update users table" };
    }
}
