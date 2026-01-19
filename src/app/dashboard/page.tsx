"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday,
} from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, BookOpen, Clock, TrendingUp, Edit, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getLaporanList } from "@/app/actions/laporan";
import type { LaporanHarian } from "@/types";

export default function DashboardPage() {
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [laporanData, setLaporanData] = useState<LaporanHarian[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = monthStart.getDay();

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const startDate = format(monthStart, "yyyy-MM-dd");
            const endDate = format(monthEnd, "yyyy-MM-dd");
            const result = await getLaporanList({ startDate, endDate, limit: 100 });
            if (!result.error) {
                setLaporanData(result.data);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [currentMonth]);

    function getLaporanForDate(date: Date): LaporanHarian[] {
        return laporanData.filter((l) => isSameDay(new Date(l.tanggal), date));
    }

    function handleDateClick(date: Date) {
        setSelectedDate(date);
    }

    function handleAddNote(date: Date) {
        const dateStr = format(date, "yyyy-MM-dd");
        router.push(`/dashboard/laporan/new?date=${dateStr}`);
    }

    const selectedLaporan = getLaporanForDate(selectedDate);
    const totalThisMonth = laporanData.length;
    const totalHours = Math.floor(laporanData.reduce((a, b) => a + (b.durasi_menit || 0), 0) / 60);
    const todayCount = getLaporanForDate(new Date()).length;

    return (
        <div className="space-y-6">
            {/* Desktop: Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Calendar (Takes 2 cols on desktop) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Calendar Card */}
                    <Card className="border-0 shadow-lg shadow-sky-100 bg-white rounded-3xl overflow-hidden">
                        <CardContent className="p-4 md:p-6">
                            {/* Month Navigation */}
                            <div className="flex items-center justify-between mb-6">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                    className="h-10 w-10 rounded-xl text-sky-600 hover:bg-sky-50"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                <h2 className="text-lg font-semibold text-sky-800">
                                    {format(currentMonth, "MMMM yyyy", { locale: id })}
                                </h2>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                    className="h-10 w-10 rounded-xl text-sky-600 hover:bg-sky-50"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                                {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                                    <div
                                        key={day}
                                        className="text-center text-xs font-medium text-sky-400 py-2"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 md:gap-2">
                                {Array.from({ length: startDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square" />
                                ))}

                                {days.map((day) => {
                                    const dayLaporan = getLaporanForDate(day);
                                    const hasLaporan = dayLaporan.length > 0;
                                    const isSelected = isSameDay(day, selectedDate);
                                    const isCurrentDay = isToday(day);

                                    return (
                                        <button
                                            key={day.toISOString()}
                                            onClick={() => handleDateClick(day)}
                                            className={cn(
                                                "aspect-square rounded-xl md:rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 text-sm md:text-base",
                                                isSelected
                                                    ? "bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-200"
                                                    : isCurrentDay
                                                        ? "bg-sky-100 text-sky-700 font-semibold ring-2 ring-sky-300"
                                                        : isSameMonth(day, currentMonth)
                                                            ? "text-sky-700 hover:bg-sky-50"
                                                            : "text-sky-300"
                                            )}
                                        >
                                            <span>{format(day, "d")}</span>
                                            {hasLaporan && !isSelected && (
                                                <div className="absolute bottom-1 md:bottom-2 flex gap-0.5">
                                                    {dayLaporan.slice(0, 3).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-sky-400"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            {hasLaporan && isSelected && (
                                                <span className="text-[10px] md:text-xs mt-0.5">{dayLaporan.length} catatan</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mobile: Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 lg:hidden">
                        <Card className="border-0 shadow-md shadow-sky-50 bg-white rounded-2xl">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-sky-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-sky-400">Bulan Ini</p>
                                    <p className="text-xl font-bold text-sky-700">{isLoading ? "..." : totalThisMonth}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md shadow-sky-50 bg-white rounded-2xl">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-400">Total Jam</p>
                                    <p className="text-xl font-bold text-blue-700">{isLoading ? "..." : `${totalHours}j`}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tip - Mobile only */}
                    <p className="text-center text-xs text-sky-400 lg:hidden">
                        💡 Klik tanggal di kalender untuk melihat atau menambah catatan
                    </p>
                </div>

                {/* Right Column - Stats & Activity (Desktop only) */}
                <div className="hidden lg:block space-y-6">
                    {/* Stats Cards */}
                    <Card className="border-0 shadow-lg shadow-sky-100 bg-white rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-sky-600 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" /> Statistik Bulan Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center">
                                        <BookOpen className="h-5 w-5 text-sky-500" />
                                    </div>
                                    <span className="text-sm text-sky-600">Total Catatan</span>
                                </div>
                                <span className="text-xl font-bold text-sky-700">{totalThisMonth}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <span className="text-sm text-blue-600">Total Jam Kerja</span>
                                </div>
                                <span className="text-xl font-bold text-blue-700">{totalHours}j</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <span className="text-sm text-emerald-600">Catatan Hari Ini</span>
                                </div>
                                <span className="text-xl font-bold text-emerald-700">{todayCount}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Selected Date Detail */}
                    <Card className="border-0 shadow-lg shadow-sky-100 bg-white rounded-2xl">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-sky-600">
                                    {format(selectedDate, "dd MMMM yyyy", { locale: id })}
                                </CardTitle>
                                <Button
                                    size="sm"
                                    onClick={() => handleAddNote(selectedDate)}
                                    className="h-8 rounded-lg bg-sky-500 hover:bg-sky-600 text-xs"
                                >
                                    <Plus className="h-3 w-3 mr-1" /> Tambah
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {selectedLaporan.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-sky-400 text-sm">Belum ada catatan</p>
                                    <p className="text-sky-300 text-xs mt-1">Klik "Tambah" untuk mulai</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {selectedLaporan.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 transition-colors group"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-sky-800 truncate">
                                                        {item.nama_kegiatan}
                                                    </p>
                                                    {item.jam_mulai && item.jam_selesai && (
                                                        <p className="text-xs text-sky-400 mt-0.5">
                                                            {item.jam_mulai} - {item.jam_selesai}
                                                        </p>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/dashboard/laporan/${item.id}/edit`}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-sky-400 hover:text-sky-600"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Link */}
                    <Link href="/dashboard/laporan">
                        <Card className="border-0 shadow-md shadow-sky-50 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-4 flex items-center justify-between text-white">
                                <span className="font-medium">Lihat Semua Catatan</span>
                                <ExternalLink className="h-5 w-5" />
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Floating Action Button - Mobile only */}
            <Button
                onClick={() => handleAddNote(selectedDate)}
                className="md:hidden fixed right-4 bottom-24 h-14 w-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 shadow-lg shadow-sky-300 z-40"
            >
                <Plus className="h-6 w-6" />
            </Button>
        </div>
    );
}
