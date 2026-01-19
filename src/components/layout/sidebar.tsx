"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    Home,
    CalendarDays,
    PenLine,
    LogOut,
    Sparkles,
    Settings,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
    { href: "/dashboard", label: "Beranda", icon: Home },
    { href: "/dashboard/laporan", label: "Catatan", icon: CalendarDays },
    { href: "/dashboard/laporan/new", label: "Tulis Baru", icon: PenLine },
    { href: "/dashboard/profile", label: "Profil Sayang", icon: User },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(" ")[0] || "User";

    return (
        <>
            {/* Desktop Sidebar - Full with labels */}
            <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col bg-white border-r border-sky-100">
                {/* Logo & Title */}
                <div className="flex items-center gap-3 px-6 py-6 border-b border-sky-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg shadow-sky-200">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-sky-800">Catatan Kinerja</h1>
                        <p className="text-xs text-sky-400">Daily Diary</p>
                    </div>
                </div>

                {/* User Info */}
                {/* <div className="px-4 py-4 border-b border-sky-50">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-50">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-medium">
                                {firstName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-sky-800 truncate">
                                {session?.user?.name || "User"}
                            </p>
                            <p className="text-xs text-sky-400">Online ✨</p>
                        </div>
                    </div>
                </div> */}

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1">
                    <p className="text-xs font-medium text-sky-300 uppercase tracking-wide px-3 mb-3">
                        Menu
                    </p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md shadow-sky-200"
                                        : "text-sky-600 hover:bg-sky-50"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="px-4 py-4 border-t border-sky-50 space-y-2">
                    <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 p-3 rounded-xl bg-sky-50 hover:bg-sky-100 transition-all border border-sky-100 group"
                    >
                        <Avatar className="h-9 w-9 ring-2 ring-white">
                            <AvatarImage src={session?.user?.image || ""} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-500 text-white text-xs">
                                {firstName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-sky-800 truncate">
                                {session?.user?.name || "User"}
                            </p>
                            <p className="text-[10px] text-sky-400 group-hover:text-sky-600 transition-colors">Edit Profil ✨</p>
                        </div>
                    </Link>

                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sky-400 hover:bg-sky-50 hover:text-sky-600 transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Tablet Sidebar - Icon only */}
            <aside className="hidden md:flex lg:hidden fixed left-0 top-0 z-40 h-screen w-20 flex-col items-center bg-white border-r border-sky-100 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg shadow-sky-200 mb-8">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>

                <nav className="flex-1 flex flex-col items-center gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-md shadow-sky-200"
                                        : "text-sky-400 hover:bg-sky-50 hover:text-sky-600"
                                )}
                                title={item.label}
                            >
                                <item.icon className="h-5 w-5" />
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-sky-300 hover:bg-sky-50 hover:text-sky-500 transition-all"
                    title="Keluar"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </aside>

            {/* Mobile Bottom Navigation - UNCHANGED */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-sky-100 px-6 py-3 safe-bottom">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-200",
                                    isActive
                                        ? "bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-200"
                                        : "text-sky-400"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
