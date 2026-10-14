import FileConverter from "@/components/FileConverter";
import { FileText } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Word to PDF Converter – Free Online", description: "Convert Word documents (.docx, .doc) to PDF format online for free." };
export default function Page() {
  return <FileConverter title="Word to PDF Converter" description="Convert Word documents to PDF format instantly" endpoint="/word-to-pdf" acceptedFormats=".docx,.doc" icon={<FileText className="w-8 h-8" />} />;
}
