import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

export const laporanSchema = z.object({
    tanggal: z.string().min(1, "Tanggal wajib diisi"),
    nama_kegiatan: z.string().min(3, "Nama kegiatan minimal 3 karakter"),
    jam_mulai: z.string().optional(),
    jam_selesai: z.string().optional(),
    volume: z.coerce.number().optional(),
    satuan: z.string().optional(),
    hasil: z.string().optional(),
    mood: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type LaporanFormInput = z.infer<typeof laporanSchema>;
