import FileConverter from "@/components/FileConverter";
import { FileText } from "lucide-react";
export default function Page() {
  return <FileConverter title="wav-to-mp3 Converter" description="Convert your files instantly" endpoint="/wav-to-mp3" acceptedFormats=".pdf,.jpg,.mp4,.docx,.zip" gradient="from-blue-500 to-violet-600" />;
}
