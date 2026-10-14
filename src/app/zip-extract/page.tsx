import FileConverter from "@/components/FileConverter";
import { Archive } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "ZIP Extract Online – Free", description: "Extract ZIP, RAR, and 7Z archive files online for free. No software needed." };
export default function Page() {
  return <FileConverter title="ZIP Extract" description="Extract ZIP, RAR, and 7Z archives online — no software needed" endpoint="/zip-extract" acceptedFormats=".zip,.rar,.7z" icon={<Archive className="w-8 h-8" />} />;
}
