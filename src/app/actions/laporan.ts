"use server";

import { sql } from "@vercel/postgres";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { LaporanHarian, LaporanFilter } from "@/types";
import { laporanSchema } from "@/lib/validations";

export async function createLaporan(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const rawData = {
        tanggal: formData.get("tanggal") as string,
        nama_kegiatan: formData.get("nama_kegiatan") as string,
        jam_mulai: formData.get("jam_mulai") as string,
        jam_selesai: formData.get("jam_selesai") as string,
        volume: formData.get("volume") as string,
        satuan: formData.get("satuan") as string,
        hasil: formData.get("hasil") as string,
        mood: formData.get("mood") as string,
    };

    const validation = laporanSchema.safeParse(rawData);
    if (!validation.success) {
        const firstError = validation.error.issues[0];
        return { error: firstError?.message || "Validasi gagal" };
    }

    const data = validation.data;
    const tanggal = data.tanggal;
    const nama_kegiatan = data.nama_kegiatan;
    const jam_mulai = data.jam_mulai;
    const jam_selesai = data.jam_selesai;
    const volume = data.volume;
    const satuan = data.satuan;
    const hasil = data.hasil;
    const mood = data.mood;

    // Calculate duration in minutes if both times are provided
    let durasi_menit: number | null = null;
    if (jam_mulai && jam_selesai) {
        const [h1, m1] = jam_mulai.split(":").map(Number);
        const [h2, m2] = jam_selesai.split(":").map(Number);
        durasi_menit = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (durasi_menit < 0) durasi_menit += 24 * 60; // Handle overnight
    }

    try {
        await sql`
      INSERT INTO laporan_harian (user_id, tanggal, nama_kegiatan, jam_mulai, jam_selesai, durasi_menit, volume, satuan, hasil, mood)
      VALUES (${parseInt(session.user.id)}, ${tanggal}, ${nama_kegiatan}, ${jam_mulai || null}, ${jam_selesai || null}, ${durasi_menit}, ${volume || null}, ${satuan || null}, ${hasil || null}, ${mood || null})
    `;

        revalidatePath("/dashboard/laporan");
        return { success: true };
    } catch (error) {
        console.error("Create laporan error:", error);
        return { error: "Gagal menyimpan laporan" };
    }
}


export async function updateLaporan(id: number, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const rawData = {
        tanggal: formData.get("tanggal") as string,
        nama_kegiatan: formData.get("nama_kegiatan") as string,
        jam_mulai: formData.get("jam_mulai") as string,
        jam_selesai: formData.get("jam_selesai") as string,
        volume: formData.get("volume") as string,
        satuan: formData.get("satuan") as string,
        hasil: formData.get("hasil") as string,
        mood: formData.get("mood") as string,
    };

    const validation = laporanSchema.safeParse(rawData);
    if (!validation.success) {
        const firstError = validation.error.issues[0];
        return { error: firstError?.message || "Validasi gagal" };
    }

    const { tanggal, nama_kegiatan, jam_mulai, jam_selesai, volume, satuan, hasil, mood } = validation.data;

    let durasi_menit: number | null = null;
    if (jam_mulai && jam_selesai) {
        const [h1, m1] = jam_mulai.split(":").map(Number);
        const [h2, m2] = jam_selesai.split(":").map(Number);
        durasi_menit = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (durasi_menit < 0) durasi_menit += 24 * 60;
    }

    try {
        await sql`
      UPDATE laporan_harian 
      SET tanggal = ${tanggal}, 
          nama_kegiatan = ${nama_kegiatan}, 
          jam_mulai = ${jam_mulai || null}, 
          jam_selesai = ${jam_selesai || null}, 
          durasi_menit = ${durasi_menit},
          volume = ${volume || null}, 
          satuan = ${satuan || null}, 
          hasil = ${hasil || null},
          mood = ${mood || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${parseInt(session.user.id)}
    `;

        revalidatePath("/dashboard/laporan");
        return { success: true };
    } catch (error) {
        console.error("Update laporan error:", error);
        return { error: "Gagal mengupdate laporan" };
    }
}

export async function deleteLaporan(id: number) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        await sql`
      DELETE FROM laporan_harian 
      WHERE id = ${id} AND user_id = ${parseInt(session.user.id)}
    `;

        revalidatePath("/dashboard/laporan");
        return { success: true };
    } catch (error) {
        console.error("Delete laporan error:", error);
        return { error: "Gagal menghapus laporan" };
    }
}

export async function getLaporanList(filters: LaporanFilter = {}) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized", data: [], total: 0 };
    }

    const { startDate, endDate, search, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;
    const userId = parseInt(session.user.id);

    try {
        let whereConditions = `user_id = ${userId}`;

        if (startDate) {
            whereConditions += ` AND tanggal >= '${startDate}'`;
        }
        if (endDate) {
            whereConditions += ` AND tanggal <= '${endDate}'`;
        }
        if (search) {
            whereConditions += ` AND nama_kegiatan ILIKE '%${search}%'`;
        }

        const countResult = await sql.query(
            `SELECT COUNT(*) as total FROM laporan_harian WHERE ${whereConditions}`
        );
        const total = parseInt(countResult.rows[0].total);

        const dataResult = await sql.query(
            `SELECT * FROM laporan_harian WHERE ${whereConditions} ORDER BY tanggal DESC, created_at DESC LIMIT ${limit} OFFSET ${offset}`
        );

        return {
            data: dataResult.rows as LaporanHarian[],
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    } catch (error) {
        console.error("Get laporan list error:", error);
        return { error: "Gagal mengambil data", data: [], total: 0 };
    }
}

export async function getLaporanById(id: number) {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    try {
        const result = await sql`
      SELECT * FROM laporan_harian 
      WHERE id = ${id} AND user_id = ${parseInt(session.user.id)}
    `;

        return result.rows[0] as LaporanHarian | undefined;
    } catch (error) {
        console.error("Get laporan by id error:", error);
        return null;
    }
}

export async function getAllLaporanForExport(filters: LaporanFilter = {}) {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    const { startDate, endDate, search } = filters;
    const userId = parseInt(session.user.id);

    try {
        let whereConditions = `user_id = ${userId}`;

        if (startDate) {
            whereConditions += ` AND tanggal >= '${startDate}'`;
        }
        if (endDate) {
            whereConditions += ` AND tanggal <= '${endDate}'`;
        }
        if (search) {
            whereConditions += ` AND nama_kegiatan ILIKE '%${search}%'`;
        }

        const dataResult = await sql.query(
            `SELECT * FROM laporan_harian WHERE ${whereConditions} ORDER BY tanggal DESC, created_at DESC`
        );

        return dataResult.rows as LaporanHarian[];
    } catch (error) {
        console.error("Get all laporan for export error:", error);
        return [];
    }
}
