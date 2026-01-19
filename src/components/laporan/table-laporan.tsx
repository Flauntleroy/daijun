"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    Edit,
    Trash2,
    FileText,
    MoreHorizontal,
    ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteLaporan } from "@/app/actions/laporan";
import type { LaporanHarian } from "@/types";

interface TableLaporanProps {
    data: LaporanHarian[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function TableLaporan({
    data,
    currentPage,
    totalPages,
    onPageChange,
}: TableLaporanProps) {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            const result = await deleteLaporan(deleteId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Laporan berhasil dihapus");
                router.refresh();
            }
        } catch {
            toast.error("Gagal menghapus laporan");
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-700">Belum ada laporan</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Mulai dengan membuat laporan pertama Anda
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead className="w-[50px]">No</TableHead>
                            <TableHead className="w-[120px]">Tanggal</TableHead>
                            <TableHead>Kegiatan</TableHead>
                            <TableHead className="w-[100px] hidden sm:table-cell">Jam</TableHead>
                            <TableHead className="w-[100px] hidden md:table-cell">Volume</TableHead>
                            <TableHead className="w-[80px] hidden lg:table-cell">File</TableHead>
                            <TableHead className="w-[80px] text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={item.id} className="hover:bg-slate-50/50">
                                <TableCell className="font-medium text-slate-500">
                                    {(currentPage - 1) * 10 + index + 1}
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-medium">
                                        {format(new Date(item.tanggal), "dd MMM yyyy", { locale: id })}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-[300px]">
                                        <p className="font-medium text-slate-800 truncate">
                                            {item.nama_kegiatan}
                                        </p>
                                        {item.hasil && (
                                            <p className="text-xs text-slate-500 truncate mt-1">
                                                {item.hasil}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    {item.jam_mulai && item.jam_selesai ? (
                                        <div className="text-sm">
                                            <span className="text-slate-600">
                                                {item.jam_mulai} - {item.jam_selesai}
                                            </span>
                                            {item.durasi_menit && (
                                                <div className="text-xs text-slate-400">
                                                    ({item.durasi_menit} menit)
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {item.volume ? (
                                        <Badge variant="secondary">
                                            {item.volume} {item.satuan || ""}
                                        </Badge>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    {item.file_url ? (
                                        <a
                                            href={item.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.push(`/dashboard/laporan/${item.id}/edit`)
                                                }
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => setDeleteId(item.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between py-4">
                    <p className="text-sm text-slate-500">
                        Halaman {currentPage} dari {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Laporan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Laporan akan dihapus permanen
                            dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
