import { Suspense } from "react";
import { FormLaporan } from "@/components/laporan";

export default function NewLaporanPage() {
    return (
        <Suspense fallback={<div className="text-center py-8 text-sky-400">Loading...</div>}>
            <FormLaporan />
        </Suspense>
    );
}
