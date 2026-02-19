import FileConverter from "@/components/FileConverter";
import { FileText } from "lucide-react";
export default function Page() {
  return <FileConverter title="heic-to-jpg Converter" description="Convert your files instantly" endpoint="/heic-to-jpg" acceptedFormats=".pdf,.jpg,.mp4,.docx,.zip" gradient="from-blue-500 to-violet-600" />;
}
