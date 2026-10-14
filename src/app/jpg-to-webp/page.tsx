import FileConverter from "@/components/FileConverter";
import { ImageIcon } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "JPG to WebP Converter – Free Online", description: "Convert JPG images to modern WebP format online for free." };
export default function Page() {
  return <FileConverter title="JPG to WebP Converter" description="Convert JPG images to WebP for smaller file sizes" endpoint="/jpg-to-webp" acceptedFormats=".jpg,.jpeg" icon={<ImageIcon className="w-8 h-8" />} />;
}
