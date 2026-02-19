import FileConverter from "@/components/FileConverter";
import { FileText } from "lucide-react";
export default function Page() {
  return <FileConverter title="mp4-to-gif Converter" description="Convert your files instantly" endpoint="/mp4-to-gif" acceptedFormats=".pdf,.jpg,.mp4,.docx,.zip" gradient="from-blue-500 to-violet-600" />;
}
