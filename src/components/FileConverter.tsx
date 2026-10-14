"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Upload, Download, Loader2, CheckCircle2, XCircle, ArrowRight, FileCheck, Share2, Clock, Info, Check } from "lucide-react";
import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { tools, categories } from "@/lib/tools";


import { getToken } from "@/lib/auth";

interface FileConverterProps {
  title: string;
  description: string;
  endpoint: string;
  acceptedFormats: string;
  icon?: React.ReactNode;
  maxSizeMB?: number;
  faqItems?: { q: string; a: string }[];
}

export default function FileConverter({
  title,
  description,
  endpoint,
  acceptedFormats,
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
  const [quota, setQuota] = useState({ remaining: 0, limit: 0 });
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshQuota = async () => {
    const token = getToken();
    const response = await axios.get("/api/convert/quota", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    setQuota(response.data);
  };
  useEffect(() => {
    refreshQuota().catch(() => setError("Unable to load your quota. Please try again."));
    return () => requestRef.current?.abort();
  }, []);

  const selectFile = (candidate: File) => {
    if (uploading) return;
    setError(null);
    setDownloadUrl(null);
    setFile(null);
    if (!candidate.size) { setError("This file is empty."); return; }
    if (candidate.size > maxSizeMB * 1024 * 1024) { setError(`File exceeds ${maxSizeMB}MB.`); return; }
    const formats = acceptedFormats.split(",").map(value => value.trim().toLowerCase());
    if (!formats.includes("*") && !formats.includes("*/*") && !formats.some(format =>
      format.startsWith(".") ? candidate.name.toLowerCase().endsWith(format) :
      format.endsWith("/*") ? candidate.type.startsWith(format.slice(0, -1)) : candidate.type === format)) {
      setError(`Choose a supported file: ${acceptedFormats}`); return;
    }
    setFile(candidate);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) selectFile(e.target.files[0]);
    e.target.value = "";
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); if (!uploading) setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) selectFile(e.dataTransfer.files[0]);
  };
  const handleUpload = async () => {
    if (!file || uploading) return;
    requestRef.current = new AbortController();
    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`/api/convert${endpoint}`, formData, {
        headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
        signal: requestRef.current.signal,
        timeout: 150000,
        onUploadProgress: (progressEvent) => {
          const pct = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          setProgress(pct);
        },
      });

      if (response.data.status === "success") {
        setDownloadUrl(response.data.downloadUrl);
        setFileName(response.data.fileName);
        setProgress(100);
        setExpiresAt(response.data.expiresAt);

      } else {
        setError(response.data.message || "Conversion failed");
      }
    } catch (err: any) {
      setError(axios.isCancel(err) ? "Upload cancelled. A conversion already received by the server may finish and count toward your quota." : err.response?.data?.message || "Conversion failed. Please try again.");
    } finally {
      setUploading(false);
      refreshQuota().catch(() => {});
      window.dispatchEvent(new Event("conversion-quota-changed"));
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl || downloading) return;
    setDownloading(true);
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
      setError("This download could not be retrieved. It may have expired. Please convert the file again.");
    } finally { setDownloading(false); }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title, url: window.location.href });
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true); setTimeout(() => setShared(false), 2000);
    } catch { /* Dismissing the share dialog leaves the converter unchanged. */ }
  };

  const resetConverter = () => {
    setFile(null);
    setDownloadUrl(null);
    setExpiresAt(null);
    setFileName(null);
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

  const tool = tools.find(item => `/${item.id}` === endpoint);
  const categoryName = categories.find(item => item.id === tool?.category)?.label;
  const isDocument = tool?.category === "documents";
  const currentStep = downloadUrl ? 3 : uploading ? 2 : 1;
  return <><Navbar /><main className="app-container flex-1 py-8 sm:py-11">
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs muted mb-8"><Link href="/" className="hover:underline">Tools</Link><span aria-hidden="true">/</span>{categoryName && <><span>{categoryName}</span><span aria-hidden="true">/</span></>}<span style={{ color: "rgb(var(--fg))" }}>{tool?.name || title}</span></nav>
    <header className="flex items-start justify-between gap-4 mb-8 sm:mb-10"><div><h1 className="text-3xl sm:text-[36px] font-semibold mb-3">{tool?.name || title.replace(" Converter", "")}</h1><p className="text-sm sm:text-base muted">{description}</p></div><button className="btn btn-secondary !min-h-[36px] px-3 shrink-0" onClick={handleShare} aria-label="Share this converter"><Share2 size={14} /><span className="hidden sm:inline text-xs">{shared ? "Link shared" : "Share tool"}</span></button></header>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_272px] gap-6 lg:gap-8 items-start">
      <section className="card overflow-hidden" aria-label="File conversion">
        <ol className="flex items-center gap-3 sm:gap-6 px-5 sm:px-7 py-5 border-b" style={{ borderColor: "rgb(var(--card-border))" }}>{["Upload", "Convert", "Download"].map((label, index) => <li key={label} className="flex items-center gap-2 text-xs sm:text-sm" aria-current={currentStep === index + 1 ? "step" : undefined}><span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] border ${currentStep >= index + 1 ? "accent" : "muted"}`} style={{ borderColor: currentStep >= index + 1 ? "rgb(var(--primary) / .3)" : "rgb(var(--card-border))", background: currentStep >= index + 1 ? "rgb(var(--subtle))" : "transparent" }}>{currentStep > index + 1 ? <Check size={12} /> : index + 1}</span><span className={currentStep === index + 1 ? "font-medium" : "muted"}>{label}</span>{index < 2 && <ArrowRight size={12} className="muted ml-1 sm:ml-4" />}</li>)}</ol>
        <div className="p-5 sm:p-7">
          {!downloadUrl && <>
            <div className="flex items-center justify-between gap-4 mb-4"><h2 className="text-sm font-medium">{file ? "Selected file" : "Upload your file"}</h2><span className="text-xs muted">Maximum {maxSizeMB} MB</span></div>
            <div className={`upload-area mb-5 ${isDragging ? "dragging" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              {!file ? <button type="button" disabled={uploading} className="w-full py-12 sm:py-16 px-5 flex flex-col items-center disabled:cursor-wait" onClick={() => fileInputRef.current?.click()} aria-label="Choose a file to convert"><div className="icon-tile w-12 h-12 mb-5"><Upload size={23} strokeWidth={1.5} /></div><span className="text-sm font-medium mb-1.5">Drop a file here, or <span className="accent underline underline-offset-4">browse files</span></span><span className="text-xs muted">{acceptedFormats.split(",").map(value => value.replace(".", "").toUpperCase()).join(" · ")}</span></button> : <div className="flex items-center gap-4 p-5 sm:p-7"><span className="icon-tile w-11 h-11 shrink-0"><FileCheck size={22} strokeWidth={1.6} /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{file.name}</p><p className="text-xs muted mt-1">{formatFileSize(file.size)}</p></div><button disabled={uploading} className="text-xs accent font-medium disabled:opacity-40" onClick={() => { resetConverter(); fileInputRef.current?.click(); }}>Change</button></div>}
            </div>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept={acceptedFormats} />
          </>}
          {uploading && <div role="status" className="mb-5"><div className="flex items-center justify-between gap-3 text-xs mb-3"><span className="flex items-center gap-2 muted"><Loader2 size={14} className="animate-spin" />{progress < 100 ? "Uploading your file…" : "Processing your file…"}</span><span className="tabular-nums accent">{progress < 100 ? `${progress}%` : "Upload complete"}</span></div><div role="progressbar" aria-label="File upload" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="quota-bar"><div className="progress-bar" style={{ width: `${progress}%` }} /></div><p className="text-xs muted mt-3">You can stay on this page while the converter finishes.</p></div>}
          {error && <div role="alert" className="alert-error mb-5"><XCircle size={17} className="text-red-700 dark:text-red-400 shrink-0 mt-0.5" /><div><p className="text-sm text-red-800 dark:text-red-300">{error}</p>{quota.limit > 0 && quota.remaining === 0 && <Link href="/login" className="accent text-xs underline mt-2 inline-block">Sign in to check your allowance</Link>}</div></div>}
          {downloadUrl && <div className="mb-7"><div role="status" className="flex items-start gap-3 mb-7"><CheckCircle2 size={22} className="accent shrink-0 mt-0.5" /><div><h2 className="text-lg font-semibold">Your file is ready.</h2><p className="text-sm muted mt-1">Download it before {expiresAt ? new Date(expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "the link expires"}.</p></div></div><div className="flex items-center gap-3 p-4 rounded-lg surface-subtle"><span className="icon-tile h-10 w-10 shrink-0"><FileCheck size={20} /></span><div className="min-w-0"><p className="text-sm font-medium truncate">{fileName}</p><p className="text-xs muted mt-1">Converted file · Ready to download</p></div></div></div>}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 border-t pt-5" style={{ borderColor: "rgb(var(--card-border))" }}><p className="text-xs muted">{quota.limit > 0 ? `${quota.remaining} of ${quota.limit} conversions left today` : "Daily allowance resets at midnight UTC"}</p><div className="flex flex-col sm:flex-row gap-2">{downloadUrl ? <><button onClick={resetConverter} className="btn btn-secondary px-4">Convert another</button><button onClick={handleDownload} disabled={downloading} className="btn btn-primary px-5">{downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}{downloading ? "Downloading…" : "Download file"}</button></> : <>{uploading && <button className="btn btn-secondary px-4" onClick={() => requestRef.current?.abort()}>Cancel upload</button>}<button onClick={handleUpload} disabled={!file || uploading} className="btn btn-primary px-6">{uploading ? <><Loader2 size={15} className="animate-spin" /> Converting…</> : <>Convert file <ArrowRight size={15} /></>}</button></>}</div></div>
        </div>
      </section>
      <aside className="space-y-6"><section className="card p-5"><div className="flex items-center gap-2 mb-4"><Info size={16} className="muted" /><h2 className="text-sm font-medium">About this tool</h2></div><dl className="space-y-3 text-xs"><div className="flex justify-between gap-3"><dt className="muted">Input formats</dt><dd className="font-medium text-right">{acceptedFormats.replaceAll(".", "").toUpperCase()}</dd></div><div className="flex justify-between"><dt className="muted">File limit</dt><dd>{maxSizeMB} MB</dd></div>{tool && <div className="flex justify-between"><dt className="muted">Output</dt><dd>{tool.to}</dd></div>}</dl>{isDocument && <p className="text-xs muted leading-relaxed border-t pt-4 mt-4" style={{ borderColor: "rgb(var(--card-border))" }}>Document conversion extracts and renders content. Complex layouts and scanned PDFs may need a dedicated editor.</p>}</section><div className="px-1"><div className="flex items-center gap-2 mb-2"><Clock size={15} className="muted" /><h2 className="text-xs font-medium">Available for 30 minutes</h2></div><p className="text-xs muted leading-relaxed">Save your download before it expires. Keep the original file if you need to convert it again.</p></div><Link href="/" className="nav-link text-xs inline-flex items-center gap-2 px-1">Browse all tools <ArrowRight size={13} /></Link></aside>
    </div>
    {faqItems.length > 0 && <section className="mt-10 max-w-3xl"><h2 className="text-base font-medium mb-4">Common questions</h2>{faqItems.map(item => <details key={item.q} className="py-4 border-b" style={{ borderColor: "rgb(var(--card-border))" }}><summary className="text-sm font-medium">{item.q}</summary><p className="text-sm muted pt-3">{item.a}</p></details>)}</section>}
  </main><Footer /></>;
}
