import { notFound } from "next/navigation";
import { FormLaporan, FileUpload } from "@/components/laporan";
import { getLaporanById } from "@/app/actions/laporan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EditLaporanPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditLaporanPage({ params }: EditLaporanPageProps) {
    const resolvedParams = await params;
    const laporan = await getLaporanById(parseInt(resolvedParams.id));

    if (!laporan) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Edit Laporan</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Perbarui informasi laporan kinerja harian
                </p>
            </div>

            <FormLaporan initialData={laporan} isEdit />

            {/* File Upload Section */}
            <Card className="border-0 shadow-md">
                <CardHeader className="border-b bg-slate-50">
                    <CardTitle className="text-lg">File Lampiran</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <FileUpload
                        laporanId={laporan.id}
                        currentFile={
                            laporan.file_url && laporan.file_name
                                ? { url: laporan.file_url, name: laporan.file_name }
                                : undefined
                        }
                    />
                </CardContent>
            </Card>
        </div>
    );
}
