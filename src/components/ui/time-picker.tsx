"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    name?: string;
    placeholder?: string;
}

export function TimePicker({ value, onChange, name, placeholder = "00:00" }: TimePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [internV, setInternV] = React.useState(value || "");

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

    const [selectedHour, setSelectedHour] = React.useState(value?.split(":")[0] || "00");
    const [selectedMinute, setSelectedMinute] = React.useState(value?.split(":")[1] || "00");

    React.useEffect(() => {
        if (value) {
            const [h, m] = value.split(":");
            setSelectedHour(h || "00");
            setSelectedMinute(m || "00");
            setInternV(value);
        }
    }, [value]);

    const handleSelect = (h: string, m: string) => {
        const newVal = `${h}:${m}`;
        setInternV(newVal);
        if (onChange) onChange(newVal);
    };

    return (
        <div className="relative w-full">
            <input type="hidden" name={name} value={internV} />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between h-12 rounded-xl border-sky-200 hover:bg-sky-50 transition-colors px-4 font-normal text-sky-800",
                            !internV && "text-sky-400"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-sky-400" />
                            <span>{internV || placeholder}</span>
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[180px] p-0 rounded-2xl border-sky-100 shadow-xl shadow-sky-100" align="start">
                    <div className="flex h-64 divide-x divide-sky-50">
                        <ScrollArea className="w-1/2">
                            <div className="flex flex-col p-2">
                                <p className="text-[10px] font-bold text-sky-300 uppercase px-2 mb-1">Jam</p>
                                {hours.map((h) => (
                                    <Button
                                        key={h}
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "justify-center h-10 rounded-lg text-sm mb-0.5",
                                            selectedHour === h ? "bg-sky-500 text-white hover:bg-sky-600 hover:text-white" : "text-sky-700 hover:bg-sky-100"
                                        )}
                                        onClick={() => {
                                            setSelectedHour(h);
                                            handleSelect(h, selectedMinute);
                                        }}
                                    >
                                        {h}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                        <ScrollArea className="w-1/2">
                            <div className="flex flex-col p-2">
                                <p className="text-[10px] font-bold text-sky-300 uppercase px-2 mb-1">Menit</p>
                                {minutes.map((m) => (
                                    <Button
                                        key={m}
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "justify-center h-10 rounded-lg text-sm mb-0.5",
                                            selectedMinute === m ? "bg-sky-500 text-white hover:bg-sky-600 hover:text-white" : "text-sky-700 hover:bg-sky-100"
                                        )}
                                        onClick={() => {
                                            setSelectedMinute(m);
                                            handleSelect(selectedHour, m);
                                        }}
                                    >
                                        {m}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    <div className="p-2 border-t border-sky-50">
                        <Button
                            className="w-full rounded-xl bg-sky-500 hover:bg-sky-600 h-9"
                            size="sm"
                            onClick={() => setOpen(false)}
                        >
                            Pilih
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
