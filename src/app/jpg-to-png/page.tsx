import FileConverter from "@/components/FileConverter";
import { FileText } from "lucide-react";
export default function Page() {
  return <FileConverter title="jpg-to-png Converter" description="Convert your files instantly" endpoint="/jpg-to-png" acceptedFormats=".pdf,.jpg,.mp4,.docx,.zip" gradient="from-blue-500 to-violet-600" />;
}
