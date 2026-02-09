"use client";

import { useState, useRef } from "react";
import axios from "axios";
import {
	Upload,
	Download,
	Loader2,
	CheckCircle2,
	XCircle,
	ArrowLeft,
	FileCheck,
} from "lucide-react";
import Link from "next/link";

interface FileConverterProps {
	title: string;
	description: string;
	endpoint: string;
	acceptedFormats: string;
	icon?: React.ReactNode;
	gradient?: string;
}

export default function FileConverter({
	title,
	description,
	endpoint,
	acceptedFormats,
	icon,
	gradient = "from-blue-600 to-purple-600",
}: FileConverterProps) {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
			setError(null);
			setDownloadUrl(null);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			setFile(e.dataTransfer.files[0]);
			setError(null);
			setDownloadUrl(null);
		}
	};

	const handleUpload = async () => {
		if (!file) return;

		setUploading(true);
		setProgress(0);
		setError(null);

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await axios.post(
				`/api/convert${endpoint}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
					onUploadProgress: (progressEvent) => {
						const percentCompleted = progressEvent.total
							? Math.round(
									(progressEvent.loaded * 100) /
										progressEvent.total,
								)
							: 0;
						setProgress(percentCompleted);
					},
				},
			);

			if (response.data.status === "success") {
				setDownloadUrl(response.data.downloadUrl);
				setFileName(response.data.fileName);
				setProgress(100);
			} else {
				setError(response.data.message || "Conversion failed");
			}
		} catch (err: any) {
			setError(
				err.response?.data?.message ||
					"An error occurred during conversion",
			);
		} finally {
			setUploading(false);
		}
	};

	const handleDownload = async () => {
		if (!downloadUrl) return;

		try {
			const response = await axios.get(downloadUrl, {
				responseType: "blob",
			});

			const blob = new Blob([response.data]);
			const url = window.URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;
			link.download = fileName || "converted-file";
			document.body.appendChild(link);
			link.click();

			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			setError("Failed to download file");
		}
	};

	const resetConverter = () => {
		setFile(null);
		setDownloadUrl(null);
		setError(null);
		setProgress(0);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return (
			Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
		);
	};

	return (
		<div className="min-h-screen gradient-bg">
			{/* Header */}
			<div className={`bg-gradient-to-r ${gradient} text-white py-16`}>
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<Link
						href="/"
						className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						Back to Home
					</Link>

					<div className="flex items-center gap-6">
						<div className="hidden sm:block">
							{icon || <Upload className="w-16 h-16" />}
						</div>
						<div>
							<h1 className="text-4xl md:text-5xl font-bold mb-3">
								{title}
							</h1>
							<p className="text-xl text-white/90">
								{description}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
				<div className="card p-8 md:p-12 animate-slide-up">
					{/* File Upload Area */}
					{!downloadUrl && (
						<div className="mb-8">
							<label className="block text-sm font-semibold text-gray-700 mb-3">
								Choose Your File
							</label>
							<div
								className={`upload-area p-12 text-center transition-all ${
									isDragging ? "dragging scale-105" : ""
								}`}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								onClick={() => fileInputRef.current?.click()}
							>
								<div className="flex flex-col items-center">
									{!file ? (
										<>
											<div
												className={`w-20 h-20 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}
											>
												<Upload className="w-10 h-10 text-white" />
											</div>
											<p className="text-lg font-semibold text-gray-700 mb-2">
												Drop your file here, or{" "}
												<span className="text-blue-600">
													browse
												</span>
											</p>
											<p className="text-sm text-gray-500 mb-4">
												Supported formats:{" "}
												{acceptedFormats}
											</p>
											<div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
												<FileCheck className="w-4 h-4 mr-2" />
												Maximum file size: 50MB
											</div>
										</>
									) : (
										<div className="w-full">
											<div
												className={`w-20 h-20 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl`}
											>
												<FileCheck className="w-10 h-10 text-white" />
											</div>
											<div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
												<p className="font-semibold text-gray-900 mb-2 truncate">
													{file.name}
												</p>
												<p className="text-sm text-gray-500">
													{formatFileSize(file.size)}
												</p>
											</div>
											<button
												onClick={(e) => {
													e.stopPropagation();
													resetConverter();
												}}
												className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
											>
												Choose different file
											</button>
										</div>
									)}
								</div>
								<input
									ref={fileInputRef}
									type="file"
									className="hidden"
									onChange={handleFileChange}
									accept={acceptedFormats}
								/>
							</div>
						</div>
					)}

					{/* Progress Bar */}
					{uploading && (
						<div className="mb-8 animate-fade-in">
							<div className="flex items-center justify-between mb-3">
								<span className="text-sm font-semibold text-gray-700">
									{progress < 100
										? "Uploading and converting..."
										: "Processing..."}
								</span>
								<span className="text-sm font-bold text-blue-600">
									{progress}%
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
								<div
									className="progress-bar h-3 shadow-lg"
									style={{ width: `${progress}%` }}
								></div>
							</div>
						</div>
					)}

					{/* Error Message */}
					{error && (
						<div className="alert-error mb-8 animate-fade-in">
							<XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
							<div className="flex-1">
								<p className="font-semibold text-red-800">
									Conversion Failed
								</p>
								<p className="text-sm text-red-700 mt-1">
									{error}
								</p>
							</div>
						</div>
					)}

					{/* Success Message */}
					{downloadUrl && (
						<div className="space-y-6 animate-scale-in">
							<div className="alert-success">
								<CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
								<div className="flex-1">
									<p className="font-semibold text-green-800">
										Conversion Successful!
									</p>
									<p className="text-sm text-green-700 mt-1">
										Your file is ready to download
									</p>
								</div>
							</div>

							<div className="card p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-semibold text-gray-900 mb-1">
											Converted File
										</p>
										<p className="text-sm text-gray-600 truncate">
											{fileName}
										</p>
									</div>
									<Download className="w-8 h-8 text-gray-400" />
								</div>
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 mt-8">
						{!downloadUrl ? (
							<button
								onClick={handleUpload}
								disabled={!file || uploading}
								className="btn btn-primary px-8 py-4 text-lg flex-1"
							>
								{uploading ? (
									<>
										<Loader2 className="w-6 h-6 mr-3 animate-spin" />
										Converting...
									</>
								) : (
									<>
										<Upload className="w-6 h-6 mr-3" />
										Convert File
									</>
								)}
							</button>
						) : (
							<>
								<button
									onClick={handleDownload}
									className="btn btn-success px-8 py-4 text-lg flex-1"
								>
									<Download className="w-6 h-6 mr-3" />
									Download File
								</button>
								<button
									onClick={resetConverter}
									className="btn btn-secondary px-8 py-4 text-lg sm:w-auto"
								>
									Convert Another
								</button>
							</>
						)}
					</div>

					{/* Security Info */}
					<div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
						<div className="flex items-start gap-3">
							<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
								<CheckCircle2 className="w-6 h-6 text-blue-600" />
							</div>
							<div>
								<h4 className="font-semibold text-blue-900 mb-1">
									Privacy & Security
								</h4>
								<p className="text-sm text-blue-800 leading-relaxed">
									Your file will be automatically deleted from
									our servers after 30 minutes. We take your
									privacy seriously and never store your files
									permanently.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Additional Info */}
				<div className="mt-8 text-center pb-12">
					<Link
						href="/"
						className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to all converters
					</Link>
				</div>
			</div>
		</div>
	);
}
