"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterLaporanProps {
    onFilter: (filters: {
        startDate?: string;
        endDate?: string;
        search?: string;
    }) => void;
}

export function FilterLaporan({ onFilter }: FilterLaporanProps) {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    function handleSearch() {
        onFilter({
            startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
            endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
            search: search || undefined,
        });
    }

    function handleReset() {
        setStartDate(undefined);
        setEndDate(undefined);
        setSearch("");
        onFilter({});
    }

    const hasFilters = startDate || endDate || search;

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-400" />
                    <Input
                        placeholder="Cari kegiatan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-10 h-11 rounded-xl border-sky-200 focus:border-sky-400"
                    />
                </div>
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    variant="outline"
                    className={cn(
                        "h-11 px-4 rounded-xl border-sky-200",
                        isOpen && "bg-sky-50"
                    )}
                >
                    <CalendarIcon className="h-4 w-4 text-sky-500" />
                </Button>
            </div>

            {/* Date Filters - Collapsible */}
            {isOpen && (
                <div className="flex flex-wrap gap-2 p-3 bg-sky-50 rounded-xl">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "h-10 rounded-xl border-sky-200 text-sm",
                                    !startDate && "text-sky-400"
                                )}
                            >
                                {startDate ? format(startDate, "dd MMM", { locale: id }) : "Dari"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "h-10 rounded-xl border-sky-200 text-sm",
                                    !endDate && "text-sky-400"
                                )}
                            >
                                {endDate ? format(endDate, "dd MMM", { locale: id }) : "Sampai"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                        </PopoverContent>
                    </Popover>

                    <Button
                        onClick={handleSearch}
                        className="h-10 rounded-xl bg-sky-500 hover:bg-sky-600"
                    >
                        Filter
                    </Button>

                    {hasFilters && (
                        <Button
                            onClick={handleReset}
                            variant="ghost"
                            className="h-10 rounded-xl text-sky-500"
                        >
                            <X className="h-4 w-4 mr-1" /> Reset
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
