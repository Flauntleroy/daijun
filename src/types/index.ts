export interface User {
    id: number;
    username: string;
    password_hash: string;
    name: string;
    image_url?: string | null;
    created_at: Date;
}

export interface LaporanHarian {
    id: number;
    user_id: number;
    tanggal: Date;
    nama_kegiatan: string;
    jam_mulai: string | null;
    jam_selesai: string | null;
    durasi_menit: number | null;
    volume: number | null;
    satuan: string | null;
    hasil: string | null;
    mood: string | null;
    file_url: string | null;
    file_name: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface LaporanFormData {
    tanggal: string;
    nama_kegiatan: string;
    jam_mulai?: string;
    jam_selesai?: string;
    volume?: number;
    satuan?: string;
    hasil?: string;
    mood?: string;
}

export interface LaporanFilter {
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}
