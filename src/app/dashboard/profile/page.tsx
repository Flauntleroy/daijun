"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Save, ArrowLeft, Heart, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile } from "@/app/actions/user";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(session?.user?.image || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        formData.append("currentImageUrl", session?.user?.image || "");

        try {
            const result = await updateProfile(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                // Update next-auth session
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: formData.get("name"),
                        image: result.imageUrl
                    }
                });
                toast.success("Profil Sayang sudah diupdate! 💕");
                router.refresh();
            }
        } catch (error) {
            toast.error("Gagal update profil 😢");
        } finally {
            setIsLoading(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-10 w-10 rounded-xl text-sky-600 hover:bg-sky-50"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-semibold text-sky-800">Profil Sayang</h1>
                    <p className="text-sm text-sky-400">Atur profil pribadimu di sini ✨</p>
                </div>
            </div>

            <Card className="border-0 shadow-xl shadow-sky-100 bg-white rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-sky-400 to-blue-500 py-8 flex items-center justify-center">
                    <div className="relative group">
                        <Avatar className="h-28 w-28 border-4 border-white shadow-2xl scale-110">
                            <AvatarImage src={previewUrl || ""} className="object-cover" />
                            <AvatarFallback className="bg-sky-100 text-sky-500 text-3xl font-bold">
                                {session?.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 h-9 w-9 bg-white rounded-full flex items-center justify-center shadow-lg text-sky-500 hover:text-sky-600 hover:scale-110 transition-all border-2 border-sky-50"
                        >
                            <Camera className="h-5 w-5" />
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <form action={handleSubmit} className="space-y-6">
                        <input
                            type="file"
                            name="image"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <div className="space-y-2">
                            <Label className="text-sky-700 text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4" /> Nama Lengkap
                            </Label>
                            <Input
                                name="name"
                                defaultValue={session?.user?.name || ""}
                                placeholder="Nama Sayang..."
                                required
                                className="h-12 rounded-xl border-sky-100 focus:border-sky-300 focus:ring-sky-300 bg-sky-50/30"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sky-300 text-sm font-medium">Username</Label>
                            <Input
                                value={session?.user?.username || ""}
                                disabled
                                className="h-12 rounded-xl border-dashed border-sky-100 bg-gray-50 text-sky-300"
                            />
                            <p className="text-[10px] text-sky-300 italic">Username tidak bisa diubah ya 💕</p>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-semibold shadow-lg shadow-sky-200 text-base flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Note */}
            <div className="text-center">
                <p className="text-xs text-sky-300 flex items-center justify-center gap-1">
                    Terima kasih sudah rajin mencatat hari ini! <Heart className="h-3 w-3 fill-rose-300 text-rose-300" />
                </p>
            </div>
        </div>
    );
}
