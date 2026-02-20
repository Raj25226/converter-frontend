import FileConverter from "@/components/FileConverter";
import { FileSpreadsheet } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Excel to PDF Converter – Free Online", description: "Convert Excel spreadsheets (.xlsx, .xls) to PDF online for free." };
export default function Page() {
  return <FileConverter title="Excel to PDF Converter" description="Convert Excel spreadsheets to professional PDF documents" endpoint="/excel-to-pdf" acceptedFormats=".xlsx,.xls" icon={<FileSpreadsheet className="w-8 h-8" />} gradient="from-orange-500 to-amber-600" />;
}
