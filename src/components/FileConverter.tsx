"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Upload, Download, Loader2, CheckCircle2, XCircle, ArrowLeft, FileCheck, Share2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { trackConversion } from "./Analytics";
import { canConvert, incrementQuota, getRemainingQuota } from "@/lib/quota";
import { getUser, saveConversionHistory } from "@/lib/auth";

interface FileConverterProps {
  title: string;
  description: string;
  endpoint: string;
  acceptedFormats: string;
  icon?: React.ReactNode;
  gradient?: string;
  maxSizeMB?: number;
  faqItems?: { q: string; a: string }[];
}

export default function FileConverter({
  title,
  description,
  endpoint,
  acceptedFormats,
  icon,
  gradient = "from-blue-600 to-violet-600",
  maxSizeMB = 50,
  faqItems = [],
}: FileConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [quota, setQuota] = useState({ remaining: 2, limit: 2 });
  const [shared, setShared] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = getUser();
    const q = getRemainingQuota(!!user);
    setQuota({ remaining: q.remaining, limit: q.limit });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }
      setFile(f);
      setError(null);
      setDownloadUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      if (f.size > maxSizeMB * 1024 * 1024) { setError(`File size exceeds ${maxSizeMB}MB`); return; }
      setFile(f);
      setError(null);
      setDownloadUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const user = getUser();
    if (!canConvert(!!user)) {
      setError(user
        ? "Daily limit reached (10/day). Upgrade to Pro for unlimited conversions."
        : "Guest limit reached (2/day). Sign in for 10 conversions/day, or upgrade to Pro."
      );
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`/api/convert${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const pct = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          setProgress(pct);
        },
      });

      if (response.data.status === "success") {
        setDownloadUrl(response.data.downloadUrl);
        setFileName(response.data.fileName);
        setProgress(100);
        incrementQuota();
        const q = getRemainingQuota(!!user);
        setQuota({ remaining: q.remaining, limit: q.limit });
        await trackConversion(endpoint.replace("/", ""));
        // Save to history
        saveConversionHistory({
          type: endpoint.replace("/", ""),
          fileName: response.data.fileName || file.name,
          downloadUrl: response.data.downloadUrl,
          timestamp: Date.now(),
        });
      } else {
        setError(response.data.message || "Conversion failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during conversion");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const response = await axios.get(downloadUrl, { responseType: "blob" });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "converted-file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download file");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Converted with unimorpher`, url: window.location.href });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const resetConverter = () => {
    setFile(null);
    setDownloadUrl(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
  };

  const quotaPct = ((quota.limit - quota.remaining) / quota.limit) * 100;

  return (
    <div className="min-h-screen" style={{ background: "rgb(var(--bg))" }}>
      {/* Hero header */}
      <div className={`bg-gradient-to-r ${gradient} text-white py-14`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex w-16 h-16 bg-white/20 backdrop-blur rounded-2xl items-center justify-center">
              {icon || <Upload className="w-8 h-8" />}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>{title}</h1>
              <p className="text-white/80">{description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
        <div className="card p-6 md:p-10 animate-slide-up">
          {/* Quota bar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: "rgb(var(--muted))" }}>
                <span>Daily quota</span>
                <span>{quota.remaining} / {quota.limit} remaining</span>
              </div>
              <div className="quota-bar">
                <div className="quota-bar-fill" style={{ width: `${quotaPct}%` }} />
              </div>
            </div>
            <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all" style={{ background: "rgb(var(--card-border))", color: "rgb(var(--fg))" }}>
              <Share2 className="w-3.5 h-3.5" />
              {shared ? "Copied!" : "Share"}
            </button>
          </div>

          {/* Upload area */}
          {!downloadUrl && (
            <div className="mb-6">
              <div
                className={`upload-area p-10 text-center ${isDragging ? "dragging" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {!file ? (
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-base font-semibold mb-1">Drop your file here, or <span className="text-blue-500">browse</span></p>
                    <p className="text-sm mb-3" style={{ color: "rgb(var(--muted))" }}>Accepted: {acceptedFormats}</p>
                    <span className="badge badge-blue">Max {maxSizeMB}MB</span>
                  </div>
                ) : (
                  <div>
                    <div className={`w-14 h-14 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg`}>
                      <FileCheck className="w-7 h-7 text-white" />
                    </div>
                    <p className="font-semibold mb-1 truncate">{file.name}</p>
                    <p className="text-sm mb-3" style={{ color: "rgb(var(--muted))" }}>{formatFileSize(file.size)}</p>
                    <button onClick={(e) => { e.stopPropagation(); resetConverter(); }} className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                      Choose different file
                    </button>
                  </div>
                )}
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept={acceptedFormats} />
              </div>
            </div>
          )}

          {/* Progress */}
          {uploading && (
            <div className="mb-6 animate-fade-in">
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: "rgb(var(--muted))" }}>{progress < 100 ? "Converting..." : "Finalizing..."}</span>
                <span className="font-semibold text-blue-500">{progress}%</span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: "8px", background: "rgb(var(--card-border))" }}>
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert-error mb-6 animate-fade-in">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-red-700 dark:text-red-400">Error</p>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                {quota.remaining === 0 && (
                  <Link href="/signup" className="inline-block mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 underline">
                    Sign up for more conversions →
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Success */}
          {downloadUrl && (
            <div className="space-y-4 animate-scale-in mb-6">
              <div className="alert-success">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">Conversion successful!</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-300">File will be auto-deleted in 30 minutes</p>
                </div>
              </div>
              <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: "rgb(var(--card-border))" }}>
                <div className="truncate mr-3">
                  <p className="font-medium text-sm truncate">{fileName}</p>
                  <p className="text-xs" style={{ color: "rgb(var(--muted))" }}>Ready to download</p>
                </div>
                <Download className="w-6 h-6 flex-shrink-0" style={{ color: "rgb(var(--muted))" }} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!downloadUrl ? (
              <button
                onClick={handleUpload}
                disabled={!file || uploading || quota.remaining === 0}
                className="btn btn-primary px-8 py-3.5 text-base flex-1"
              >
                {uploading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Converting...</>
                ) : (
                  <><Upload className="w-5 h-5 mr-2" /> Convert File</>
                )}
              </button>
            ) : (
              <>
                <button onClick={handleDownload} className="btn btn-success px-8 py-3.5 text-base flex-1">
                  <Download className="w-5 h-5 mr-2" /> Download File
                </button>
                <button onClick={resetConverter} className="btn btn-secondary px-6 py-3.5 text-base">
                  Convert Another
                </button>
              </>
            )}
          </div>

          {/* Security note */}
          <div className="mt-6 p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
            <AlertTriangle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs" style={{ color: "rgb(var(--muted))" }}>
              Files are encrypted in transit and automatically deleted 30 minutes after conversion. We never store or share your files.
            </p>
          </div>
        </div>

        {/* FAQ section */}
        {faqItems.length > 0 && (
          <div className="mt-8 card p-6">
            <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "Syne, sans-serif" }}>Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i} className="pb-4" style={{ borderBottom: i < faqItems.length - 1 ? "1px solid rgb(var(--card-border))" : "none" }}>
                  <p className="font-semibold text-sm mb-1.5">{item.q}</p>
                  <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors nav-link">
            <ArrowLeft className="w-4 h-4" /> Back to all converters
          </Link>
        </div>
      </div>
    </div>
  );
}
