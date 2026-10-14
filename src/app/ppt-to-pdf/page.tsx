import FileConverter from "@/components/FileConverter";
import { Presentation } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "PowerPoint to PDF Converter – Free Online", description: "Convert PowerPoint presentations (.pptx, .ppt) to PDF online for free." };
export default function Page() {
  return <FileConverter title="PowerPoint to PDF Converter" description="Convert PowerPoint presentations to PDF documents" endpoint="/ppt-to-pdf" acceptedFormats=".pptx,.ppt" icon={<Presentation className="w-8 h-8" />} />;
}
