"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createLaporan, updateLaporan } from "@/app/actions/laporan";
import type { LaporanHarian } from "@/types";

interface FormLaporanProps {
    initialData?: LaporanHarian;
    isEdit?: boolean;
}

export function FormLaporan({ initialData, isEdit = false }: FormLaporanProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const dateParam = searchParams.get("date");
    const initialDate = dateParam
        ? parse(dateParam, "yyyy-MM-dd", new Date())
        : initialData?.tanggal
            ? new Date(initialData.tanggal)
            : new Date();

    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState<Date | undefined>(initialDate);

    async function handleSubmit(formData: FormData) {
        if (!date) {
            toast.error("Pilih tanggal dulu ya 💕");
            return;
        }

        setIsLoading(true);
        formData.set("tanggal", format(date, "yyyy-MM-dd"));

        try {
            const result = isEdit && initialData
                ? await updateLaporan(initialData.id, formData)
                : await createLaporan(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(isEdit ? "Catatan diupdate! ✨" : "Catatan tersimpan! 💕");
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            toast.error("Oops, ada masalah 😢");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-10 w-10 rounded-xl text-sky-600 hover:bg-sky-50"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-lg lg:text-xl font-semibold text-sky-800">
                        {isEdit ? "Edit Catatan" : "Catatan Baru"}
                    </h1>
                    <p className="text-xs lg:text-sm text-sky-400">
                        {date && format(date, "EEEE, dd MMMM yyyy", { locale: id })}
                    </p>
                </div>
            </div>

            <Card className="border-0 shadow-lg shadow-sky-100 bg-white rounded-3xl overflow-hidden">
                <CardContent className="p-5 lg:p-8">
                    <form action={handleSubmit} className="space-y-5 lg:space-y-6">
                        {/* Date - Hidden if from calendar */}
                        {!dateParam && (
                            <div className="space-y-2">
                                <Label className="text-sky-700 text-sm">Tanggal</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left h-12 rounded-xl border-sky-200 hover:bg-sky-50",
                                                !date && "text-sky-400"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 text-sky-400" />
                                            {date ? format(date, "dd MMMM yyyy", { locale: id }) : "Pilih tanggal"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}

                        {/* Activity Name */}
                        <div className="space-y-2">
                            <Label className="text-sky-700 text-sm">Kegiatan apa hari ini? </Label>
                            <Input
                                name="nama_kegiatan"
                                placeholder="Contoh: Rapat dengan tim marketing..."
                                defaultValue={initialData?.nama_kegiatan || ""}
                                required
                                className="h-12 rounded-xl border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                            />
                        </div>

                        {/* Time - Side by side on desktop */}
                        <div className="grid grid-cols-2 gap-3 lg:gap-4">
                            <div className="space-y-2">
                                <Label className="text-sky-700 text-sm">Jam Mulai</Label>
                                <TimePicker
                                    name="jam_mulai"
                                    value={initialData?.jam_mulai ?? undefined}
                                    placeholder="Mulai..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sky-700 text-sm">Jam Selesai</Label>
                                <TimePicker
                                    name="jam_selesai"
                                    value={initialData?.jam_selesai ?? undefined}
                                    placeholder="Selesai..."
                                />
                            </div>
                        </div>

                        {/* Volume */}
                        <div className="grid grid-cols-2 gap-3 lg:gap-4">
                            <div className="space-y-2">
                                <Label className="text-sky-700 text-sm">Volume</Label>
                                <Input
                                    name="volume"
                                    type="number"
                                    step="0.01"
                                    placeholder="1"
                                    defaultValue={initialData?.volume || ""}
                                    className="h-12 rounded-xl border-sky-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sky-700 text-sm">Satuan</Label>
                                <Input
                                    name="satuan"
                                    placeholder="dokumen, jam..."
                                    defaultValue={initialData?.satuan || ""}
                                    className="h-12 rounded-xl border-sky-200"
                                />
                            </div>
                        </div>

                        {/* Result */}
                        <div className="space-y-2">
                            <Label className="text-sky-700 text-sm">Hasilnya gimana? </Label>
                            <Textarea
                                name="hasil"
                                placeholder="Ceritakan hasil kegiatanmu..."
                                rows={4}
                                defaultValue={initialData?.hasil || ""}
                                className="rounded-xl border-sky-200 resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 lg:h-14 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-medium shadow-lg shadow-sky-200 text-base"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    {isEdit ? "Update Catatan" : "Simpan Catatan"}
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
