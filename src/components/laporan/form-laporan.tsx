"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Loader2, ArrowLeft, Sparkles, Heart } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

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

const moodOptions = [
    { label: "Senang", emoji: "😊", value: "happy", color: "bg-amber-50 text-amber-600 border-amber-200" },
    { label: "Semangat", emoji: "💪", value: "productive", color: "bg-sky-50 text-sky-600 border-sky-200" },
    { label: "Capek", emoji: "😴", value: "tired", color: "bg-purple-50 text-purple-600 border-purple-200" },
    { label: "Bersyukur", emoji: "😇", value: "grateful", color: "bg-rose-50 text-rose-600 border-rose-200" },
    { label: "Pusing", emoji: "🤯", value: "stressed", color: "bg-orange-50 text-orange-600 border-orange-200" },
];

const loveNotes = [
    "Kamu hebat banget hari ini, Sayang! 💕",
    "Kerjaan selesai, waktunya istirahat ya manis... ✨",
    "Bangga banget sama kamu, tetap semangat ya! 💖",
    "Istirahat yang cukup ya, kamu sudah melakukan yang terbaik! 😇",
    "Selesaikan hari ini dengan senyuman, I love you! ❤️",
    "Kamu itu inspirasi aku setiap hari. Hebat! 🌟",
    "Capek ya? Sini aku peluk virtual dulu... 🤗",
    "Setiap langkah kecilmu itu berarti besar. Proud of you! 🌈",
];

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
    const [selectedMood, setSelectedMood] = useState<string>(initialData?.mood || "happy");

    async function handleSubmit(formData: FormData) {
        if (!date) {
            toast.error("Pilih tanggal dulu ya 💕");
            return;
        }

        setIsLoading(true);
        formData.set("tanggal", format(date, "yyyy-MM-dd"));
        formData.set("mood", selectedMood);

        try {
            const result = isEdit && initialData
                ? await updateLaporan(initialData.id, formData)
                : await createLaporan(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                // Trigger Confetti!
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#38bdf8", "#0ea5e9", "#f43f5e", "#fbbf24"]
                });

                const randomNote = loveNotes[Math.floor(Math.random() * loveNotes.length)];
                toast.success(randomNote, {
                    duration: 5000,
                    icon: "💖",
                });

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
                        {/* Mood Selector */}
                        <div className="space-y-3 p-4 rounded-3xl bg-sky-50/50 border border-sky-100">
                            <Label className="text-sky-700 text-sm font-medium flex items-center gap-2">
                                <Heart className="h-4 w-4 text-rose-400 fill-rose-400" />
                                Mood hari ini
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {moodOptions.map((mood) => (
                                    <button
                                        key={mood.value}
                                        type="button"
                                        onClick={() => setSelectedMood(mood.value)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-2xl text-sm transition-all border",
                                            selectedMood === mood.value
                                                ? cn(mood.color, "ring-2 ring-offset-2 ring-sky-200 scale-105")
                                                : "bg-white text-sky-400 border-transparent hover:border-sky-100"
                                        )}
                                    >
                                        <span className="text-lg">{mood.emoji}</span>
                                        <span className={selectedMood === mood.value ? "font-semibold" : ""}>
                                            {mood.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

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
                            <Label className="text-sky-700 text-sm"> Kegiatan </Label>
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
                            <Label className="text-sky-700 text-sm">Hasil Kegiatan </Label>
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
