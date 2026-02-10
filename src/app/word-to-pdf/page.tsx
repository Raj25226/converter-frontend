import FileConverter from '@/components/FileConverter'
import { FileText } from 'lucide-react'

export default function WordToPdf() {
  return (
    <FileConverter
      title="Word to PDF Converter"
      description="Convert your Word documents (.docx, .doc) to PDF format instantly"
      endpoint="/word-to-pdf"
      acceptedFormats=".docx,.doc"
      icon={<FileText className="w-16 h-16 text-white" />}
      gradient="from-blue-600 to-indigo-600"
    />
  )
}