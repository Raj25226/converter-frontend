import FileConverter from "@/components/FileConverter";
import { ImageIcon } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "PNG to JPG Converter – Free Online", description: "Convert PNG images to JPG format online for free." };
export default function Page() {
  return <FileConverter title="PNG to JPG Converter" description="Convert PNG images to JPG with quality optimization" endpoint="/png-to-jpg" acceptedFormats=".png" icon={<ImageIcon className="w-8 h-8" />} gradient="from-teal-500 to-cyan-600" />;
}
