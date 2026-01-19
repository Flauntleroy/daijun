import { NextResponse } from "next/server";
import { seedDatabase } from "@/app/actions/seed";

export async function GET() {
    const result = await seedDatabase();

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: result.message,
        info: "Database seeded with default admin user (admin/admin123)"
    });
}
