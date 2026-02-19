import FileConverter from "@/components/FileConverter";
import { FileText } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "PDF to Word Converter – Free Online", description: "Convert PDF documents to editable Word files (.docx) online for free." };
export default function Page() {
  return <FileConverter title="PDF to Word Converter" description="Convert PDF documents to editable Word files instantly" endpoint="/pdf-to-word" acceptedFormats=".pdf" icon={<FileText className="w-8 h-8" />} gradient="from-blue-500 to-blue-600" faqItems={[{q:"Is it safe?",a:"Files are auto-deleted after 30 minutes and never shared."},{q:"Formatting preserved?",a:"We preserve fonts, tables, and layout as accurately as possible."}]} />;
}
