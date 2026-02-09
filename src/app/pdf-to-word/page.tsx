import FileConverter from '@/components/FileConverter'
import { FileText } from 'lucide-react'

export default function PdfToWord() {
  return (
    <FileConverter
      title="PDF to Word Converter"
      description="Convert your PDF documents to editable Word files (.docx) instantly"
      endpoint="/pdf-to-word"
      acceptedFormats=".pdf"
      icon={<FileText className="w-16 h-16 text-white" />}
      gradient="from-blue-500 to-blue-600"
    />
  )
}