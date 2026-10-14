import FileConverter from "@/components/FileConverter";
import { ImageIcon } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "WebP to PNG Converter – Free Online", description: "Convert WebP images to PNG format online for free." };
export default function Page() {
  return <FileConverter title="WebP to PNG Converter" description="Convert modern WebP images to PNG format with transparency" endpoint="/webp-to-png" acceptedFormats=".webp" icon={<ImageIcon className="w-8 h-8" />} />;
}
