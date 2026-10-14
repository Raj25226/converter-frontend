import FileConverter from "@/components/FileConverter";
import { ImageIcon } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "JPG to PNG Converter – Free Online", description: "Convert JPG and JPEG images to PNG format online for free." };
export default function Page() {
  return <FileConverter title="JPG to PNG Converter" description="Convert JPG/JPEG images to PNG with transparency support" endpoint="/jpg-to-png" acceptedFormats=".jpg,.jpeg" icon={<ImageIcon className="w-8 h-8" />} />;
}
