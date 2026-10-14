import FileConverter from "@/components/FileConverter";
import { Music } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "WAV to MP3 Converter – Free Online", description: "Convert WAV audio files to compressed MP3 format online for free." };
export default function Page() {
  return <FileConverter title="WAV to MP3 Converter" description="Convert WAV audio files to compressed MP3 format" endpoint="/wav-to-mp3" acceptedFormats=".wav" icon={<Music className="w-8 h-8" />} />;
}
