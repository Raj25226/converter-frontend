import FileConverter from "@/components/FileConverter";
import { Minimize2 } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "File Compressor Online – Free", description: "Compress and reduce image and PDF file sizes online for free." };
export default function Page() {
  return <FileConverter title="File Compressor" description="Compress and reduce file sizes — images and PDFs" endpoint="/file-compress" acceptedFormats=".jpg,.jpeg,.png,.pdf" icon={<Minimize2 className="w-8 h-8" />} gradient="from-slate-600 to-gray-700" />;
}
