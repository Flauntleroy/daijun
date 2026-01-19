"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    Edit,
    Trash2,
    Clock,
    Download,
    FileDown,
    ArrowLeft,
    MoreHorizontal,
    Plus,
    CalendarDays,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { FilterLaporan } from "@/components/laporan";
import { getLaporanList, getAllLaporanForExport, deleteLaporan } from "@/app/actions/laporan";
import { exportToCSV, exportToPDF } from "@/lib/export";
import type { LaporanHarian, LaporanFilter } from "@/types";

export default function LaporanListPage() {
    const router = useRouter();
    const [data, setData] = useState<LaporanHarian[]>([]);
    const [filters, setFilters] = useState<LaporanFilter>({});
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const result = await getLaporanList({ ...filters, limit: 50 });
        if (!result.error) {
            setData(result.data);
        }
        setIsLoading(false);
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    async function handleExport(formatType: "csv" | "pdf") {
        const allData = await getAllLaporanForExport(filters);
        if (formatType === "csv") {
            exportToCSV(allData);
        } else {
            exportToPDF(allData);
        }
        toast.success(`Export ${formatType.toUpperCase()} berhasil! 📄`);
    }

    async function handleDelete() {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const result = await deleteLaporan(deleteId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Catatan dihapus 🗑️");
                fetchData();
            }
        } catch {
            toast.error("Gagal menghapus");
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    }

    // Group data by date for desktop view
    const groupedData = data.reduce((acc, item) => {
        const dateKey = format(new Date(item.tanggal), "yyyy-MM-dd");
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
    }, {} as Record<string, LaporanHarian[]>);

    return (
        <div className="space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/dashboard")}
                        className="h-10 w-10 rounded-xl text-sky-600 hover:bg-sky-50"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg lg:text-xl font-semibold text-sky-800">Catatan Harian </h1>
                        <p className="text-xs lg:text-sm text-sky-400">{data.length} catatan ditemukan</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded-xl border-sky-200 text-sky-600">
                                <Download className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleExport("csv")}>
                                <FileDown className="mr-2 h-4 w-4" /> Export CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("pdf")}>
                                <FileDown className="mr-2 h-4 w-4" /> Export PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        onClick={() => router.push("/dashboard/laporan/new")}
                        size="sm"
                        className="rounded-xl bg-sky-500 hover:bg-sky-600"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Tulis Baru</span>
                    </Button>
                </div>
            </div>

            {/* Filter */}
            <FilterLaporan onFilter={(f) => setFilters(f)} />

            {/* Content */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent mx-auto" />
                    <p className="text-sky-400 text-sm mt-3">Memuat catatan...</p>
                </div>
            ) : data.length === 0 ? (
                <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-2xl bg-sky-100 flex items-center justify-center mx-auto mb-4">
                        <CalendarDays className="h-8 w-8 text-sky-400" />
                    </div>
                    <p className="text-sky-600 font-medium">Belum ada catatan 📭</p>
                    <p className="text-sky-400 text-sm mt-1">Mulai catat kegiatanmu!</p>
                </div>
            ) : (
                <>
                    {/* Mobile: Simple List */}
                    <div className="lg:hidden space-y-3">
                        {data.map((item) => (
                            <Card
                                key={item.id}
                                className="border-0 shadow-md shadow-sky-50 bg-white rounded-2xl overflow-hidden"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sky-800 truncate">
                                                {item.nama_kegiatan}
                                            </p>
                                            <p className="text-xs text-sky-400 mt-1">
                                                {format(new Date(item.tanggal), "EEEE, dd MMM yyyy", { locale: id })}
                                            </p>
                                            {item.hasil && (
                                                <p className="text-sm text-sky-600 mt-2 line-clamp-2">
                                                    {item.hasil}
                                                </p>
                                            )}
                                            {(item.jam_mulai || item.volume) && (
                                                <div className="flex items-center gap-3 mt-2 text-xs text-sky-400">
                                                    {item.jam_mulai && item.jam_selesai && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {item.jam_mulai} - {item.jam_selesai}
                                                        </span>
                                                    )}
                                                    {item.volume && (
                                                        <span className="bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full">
                                                            {item.volume} {item.satuan}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-sky-400">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => router.push(`/dashboard/laporan/${item.id}/edit`)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(item.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Desktop: Grouped by Date */}
                    <div className="hidden lg:block space-y-6">
                        {Object.entries(groupedData).map(([dateKey, items]) => (
                            <Card key={dateKey} className="border-0 shadow-lg shadow-sky-100 bg-white rounded-2xl overflow-hidden">
                                <CardHeader className="bg-sky-50 py-3 px-5">
                                    <CardTitle className="text-sm font-medium text-sky-700 flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4" />
                                        {format(new Date(dateKey), "EEEE, dd MMMM yyyy", { locale: id })}
                                        <span className="ml-auto text-sky-400 font-normal">{items.length} catatan</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-sky-50">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-4 hover:bg-sky-50/50 transition-colors group"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Time Column */}
                                                    <div className="w-24 flex-shrink-0 text-center">
                                                        {item.jam_mulai && item.jam_selesai ? (
                                                            <div className="text-sm text-sky-600">
                                                                <div className="font-medium">{item.jam_mulai}</div>
                                                                <div className="text-xs text-sky-400">- {item.jam_selesai}</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-sky-300">-</span>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sky-800">{item.nama_kegiatan}</p>
                                                        {item.hasil && (
                                                            <p className="text-sm text-sky-600 mt-1 line-clamp-2">{item.hasil}</p>
                                                        )}
                                                        {item.volume && (
                                                            <span className="inline-block mt-2 text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-full">
                                                                {item.volume} {item.satuan}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-sky-400 hover:text-sky-600"
                                                            onClick={() => router.push(`/dashboard/laporan/${item.id}/edit`)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-400 hover:text-red-600"
                                                            onClick={() => setDeleteId(item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Catatan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Catatan ini akan dihapus permanen 😢
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 rounded-xl"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
