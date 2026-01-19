"use server";

import { put, del } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData, laporanId: number) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
        return { error: "File tidak ditemukan" };
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        return { error: "Ukuran file maksimal 10MB" };
    }

    // Allowed file types
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
        return { error: "Tipe file tidak didukung" };
    }

    try {
        const filename = `laporan/${session.user.id}/${Date.now()}-${file.name}`;
        const blob = await put(filename, file, {
            access: "public",
        });

        // Update laporan with file info
        await sql`
      UPDATE laporan_harian 
      SET file_url = ${blob.url}, file_name = ${file.name}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${laporanId} AND user_id = ${parseInt(session.user.id)}
    `;

        revalidatePath("/dashboard/laporan");
        return { success: true, url: blob.url };
    } catch (error) {
        console.error("Upload file error:", error);
        return { error: "Gagal mengupload file" };
    }
}

export async function deleteFile(laporanId: number, fileUrl: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        // Delete from Vercel Blob
        await del(fileUrl);

        // Update laporan to remove file info
        await sql`
      UPDATE laporan_harian 
      SET file_url = NULL, file_name = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${laporanId} AND user_id = ${parseInt(session.user.id)}
    `;

        revalidatePath("/dashboard/laporan");
        return { success: true };
    } catch (error) {
        console.error("Delete file error:", error);
        return { error: "Gagal menghapus file" };
    }
}
