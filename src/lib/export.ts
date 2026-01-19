import { jsPDF } from "jspdf";
import type { LaporanHarian } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function exportToCSV(data: LaporanHarian[], filename: string = "laporan-harian"): void {
    const headers = [
        "No",
        "Tanggal",
        "Nama Kegiatan",
        "Jam Mulai",
        "Jam Selesai",
        "Volume",
        "Satuan",
        "Hasil",
        "File",
    ];

    const rows = data.map((row, index) => [
        index + 1,
        format(new Date(row.tanggal), "dd/MM/yyyy"),
        row.nama_kegiatan,
        row.jam_mulai || "-",
        row.jam_selesai || "-",
        row.volume || "-",
        row.satuan || "-",
        row.hasil || "-",
        row.file_name || "-",
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}-${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportToPDF(data: LaporanHarian[], filename: string = "laporan-harian"): void {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Laporan Kinerja Harian", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: id })}`, 105, 28, { align: "center" });

    // Table headers
    const startY = 40;
    const lineHeight = 8;
    const colWidths = [10, 25, 55, 20, 20, 20, 35];
    const headers = ["No", "Tanggal", "Kegiatan", "Mulai", "Selesai", "Volume", "Hasil"];

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");

    let x = 14;
    headers.forEach((header, i) => {
        doc.text(header, x, startY);
        x += colWidths[i];
    });

    // Table content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    let y = startY + lineHeight;

    data.forEach((row, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        const rowData = [
            String(index + 1),
            format(new Date(row.tanggal), "dd/MM/yy"),
            row.nama_kegiatan.substring(0, 30),
            row.jam_mulai || "-",
            row.jam_selesai || "-",
            row.volume ? `${row.volume} ${row.satuan || ""}` : "-",
            (row.hasil || "-").substring(0, 20),
        ];

        x = 14;
        rowData.forEach((cell, i) => {
            doc.text(cell, x, y);
            x += colWidths[i];
        });

        y += lineHeight;
    });

    doc.save(`${filename}-${format(new Date(), "yyyyMMdd")}.pdf`);
}
