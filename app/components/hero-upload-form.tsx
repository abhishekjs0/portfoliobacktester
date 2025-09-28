"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { uploadFiles, trackEvent } from "@/lib/api";

type ToastState = { tone: "success" | "error"; message: string } | null;

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export function HeroUploadForm() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const resetDragStateTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    return () => {
      if (resetDragStateTimeout.current) {
        window.clearTimeout(resetDragStateTimeout.current);
        resetDragStateTimeout.current = null;
      }
    };
  }, []);

  const showToast = useCallback((tone: "success" | "error", message: string) => {
    setToast({ tone, message });
  }, []);

  const validateFiles = useCallback((files: File[]): string | null => {
    if (!files.length) {
      return "Select at least one CSV file.";
    }

    const invalidFile = files.find((file) => !file.name.toLowerCase().endsWith(".csv"));
    if (invalidFile) {
      return "Invalid file format. Please upload TradingView Strategy Tester CSVs (max 20 MB).";
    }

    const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFile) {
      return "One or more files exceed 20 MB. Trim your exports and try again.";
    }

    return null;
  }, []);

  const beginUpload = useCallback(
    async (files: File[]) => {
      const validationError = validateFiles(files);
      if (validationError) {
        showToast("error", validationError);
        return;
      }

      setIsUploading(true);
      try {
        trackEvent("landing_csv_selection", { files: files.length });
        const response = await uploadFiles(files);
        trackEvent("landing_csv_upload", { files: response.files.length });
        showToast("success", "Upload complete. Sign in to view combined results.");

        window.setTimeout(() => {
          router.push(`/dashboard?batchId=${response.batchId}`);
        }, 600);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Upload failed. Please try again.";
        showToast("error", message);
      } finally {
        setIsUploading(false);
      }
    },
    [router, showToast, validateFiles],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (!fileList) return;
      const files = Array.from(fileList);
      void beginUpload(files);
      event.target.value = "";
    },
    [beginUpload],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const files = Array.from(event.dataTransfer.files ?? []);
      if (files.length === 0) {
        return;
      }
      void beginUpload(files);
    },
    [beginUpload],
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (resetDragStateTimeout.current) {
      window.clearTimeout(resetDragStateTimeout.current);
      resetDragStateTimeout.current = null;
    }
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    if (resetDragStateTimeout.current) {
      window.clearTimeout(resetDragStateTimeout.current);
    }
    resetDragStateTimeout.current = window.setTimeout(() => {
      setIsDragging(false);
      resetDragStateTimeout.current = null;
    }, 120);
  }, []);

  return (
    <form className="hero__upload" aria-label="Upload TradingView CSV">
      <div
        className={`hero__upload-box${isDragging ? " hero__upload-box--drag" : ""}${isUploading ? " hero__upload-box--loading" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        role="group"
        aria-busy={isUploading}
        aria-live={isUploading ? "assertive" : "polite"}
      >
        <svg aria-hidden="true" focusable="false" width="48" height="48" viewBox="0 0 48 48" className="hero__upload-icon">
          <path d="M24 12v18m0-18-6 6m6-6 6 6M16 30h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="5" y="5" width="38" height="38" rx="11" stroke="currentColor" strokeWidth="2" opacity="0.25" />
        </svg>
        <p className="hero__upload-title">Drop your TradingView CSVs</p>
        <p className="hero__upload-subtitle">Drag &amp; drop Strategy Tester exports or browse to select them manually.</p>
        <label htmlFor="hero-upload" className="button button--outline hero__upload-button" data-loading={isUploading}>
          {isUploading ? "Uploading…" : "Choose file"}
        </label>
        <input
          id="hero-upload"
          type="file"
          accept=".csv"
          multiple
          className="hero__file-input"
          aria-describedby="upload-hint"
          onChange={handleInputChange}
          disabled={isUploading}
        />
        <p id="upload-hint" className="hero__upload-hint">
          Upload up to 100 CSV exports · Max 20MB each
        </p>
      </div>
      <p className="hero__disclaimer">Processing happens locally in your browser session. No trading data is persisted.</p>
      {toast && (
        <div
          className={`hero__toast hero__toast--${toast.tone}`}
          role={toast.tone === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          <span className="hero__toast-indicator" aria-hidden="true" />
          <span>{toast.message}</span>
        </div>
      )}
    </form>
  );
}
