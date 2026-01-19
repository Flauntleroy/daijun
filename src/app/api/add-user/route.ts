import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { hash } from "bcryptjs";

export async function GET() {
    try {
        const hashedPassword = await hash("Mimi@1412", 10);

        // Check if user already exists
        const existing = await sql`SELECT COUNT(*) FROM users WHERE username = 'mi'`;
        if (parseInt(existing.rows[0].count) > 0) {
            return NextResponse.json({ error: "User already exists" });
        }

        await sql`
      INSERT INTO users (username, password_hash, name)
      VALUES ('mi', ${hashedPassword}, 'Mimi ')
    `;

        return NextResponse.json({ success: true, message: "User 'mi' created!" });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user" });
    }
}
