"use client";

import { useRef, useState } from "react";
import { Upload, X, FileIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadFile, deleteFile } from "@/app/actions/upload";

interface FileUploadProps {
    laporanId: number;
    currentFile?: {
        url: string;
        name: string;
    };
    onUploadComplete?: () => void;
}

export function FileUpload({
    laporanId,
    currentFile,
    onUploadComplete,
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<{ url: string; name: string } | undefined>(
        currentFile
    );
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleFile(selectedFile: File) {
        setIsUploading(true);
        const formData = new FormData();
        formData.set("file", selectedFile);

        try {
            const result = await uploadFile(formData, laporanId);
            if (result.error) {
                toast.error(result.error);
            } else {
                setFile({ url: result.url!, name: selectedFile.name });
                toast.success("File berhasil diupload");
                onUploadComplete?.();
            }
        } catch {
            toast.error("Gagal mengupload file");
        } finally {
            setIsUploading(false);
        }
    }

    async function handleRemove() {
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await deleteFile(laporanId, file.url);
            if (result.error) {
                toast.error(result.error);
            } else {
                setFile(undefined);
                toast.success("File berhasil dihapus");
                onUploadComplete?.();
            }
        } catch {
            toast.error("Gagal menghapus file");
        } finally {
            setIsUploading(false);
        }
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFile(droppedFile);
        }
    }

    if (file) {
        return (
            <div className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-slate-50">
                <FileIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:underline truncate block"
                    >
                        {file.name}
                    </a>
                    <p className="text-xs text-slate-500">File terlampir</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                    disabled={isUploading}
                    className="flex-shrink-0"
                >
                    {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <X className="h-4 w-4" />
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
                "flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                isDragging
                    ? "border-amber-400 bg-amber-50"
                    : "border-slate-300 bg-slate-50 hover:border-slate-400"
            )}
        >
            {isUploading ? (
                <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
            ) : (
                <Upload className="h-8 w-8 text-slate-400 mb-2" />
            )}
            <p className="text-sm text-slate-600 text-center">
                {isUploading ? (
                    "Mengupload..."
                ) : (
                    <>
                        <span className="font-medium text-amber-600">Klik untuk upload</span>
                        {" "}atau drag & drop
                    </>
                )}
            </p>
            <p className="text-xs text-slate-400 mt-1">
                PDF, DOC, XLS, gambar (max 10MB)
            </p>
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) handleFile(selectedFile);
                }}
            />
        </div>
    );
}
