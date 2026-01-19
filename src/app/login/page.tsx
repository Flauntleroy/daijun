"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Username atau password salah 😢");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("Ada masalah, coba lagi ya");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-white p-6">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-sky-200/50 blur-3xl" />
            <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-blue-200/50 blur-3xl" />

            {/* Logo */}
            <div className="mb-8 text-center relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-xl shadow-sky-200 mx-auto mb-4">
                    <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-sky-800">Catatan Kinerja ✨</h1>
                <p className="text-sm text-sky-500 mt-1">Personal Daily Diary</p>
            </div>

            {/* Login Card */}
            <Card className="w-full max-w-sm border-0 shadow-xl shadow-sky-100 bg-white/90 backdrop-blur-sm rounded-3xl">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sky-700 text-sm">Username</Label>
                            <Input
                                name="username"
                                type="text"
                                placeholder="Masukkan username"
                                required
                                className="h-12 rounded-xl border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                                autoComplete="username"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sky-700 text-sm">Password</Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Masukkan password"
                                required
                                className="h-12 rounded-xl border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600 text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-medium shadow-lg shadow-sky-200"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Heart className="mr-2 h-4 w-4" />
                                    Masuk
                                </>
                            )}
                        </Button>
                    </form>

                </CardContent>
            </Card>

            {/* Footer */}
            <p className="mt-8 text-xs text-sky-400">
                Made with 💕 for you
            </p>
        </div>
    );
}
