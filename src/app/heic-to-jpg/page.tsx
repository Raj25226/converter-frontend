import FileConverter from "@/components/FileConverter";
import { ImageIcon } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "HEIC to JPG Converter – Free Online", description: "Convert iPhone HEIC/HEIF images to JPG format online for free." };
export default function Page() {
  return <FileConverter title="HEIC to JPG Converter" description="Convert iPhone HEIC images to universal JPG format" endpoint="/heic-to-jpg" acceptedFormats=".heic,.heif" icon={<ImageIcon className="w-8 h-8" />} />;
}
