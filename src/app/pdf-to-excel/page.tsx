import FileConverter from '@/components/FileConverter'
import { FileSpreadsheet } from 'lucide-react'

export default function PdfToExcel() {
  return (
    <FileConverter
      title="PDF to Excel Converter"
      description="Extract tables and data from PDF to Excel spreadsheets"
      endpoint="/pdf-to-excel"
      acceptedFormats=".pdf"
      icon={<FileSpreadsheet className="w-16 h-16 text-white" />}
      gradient="from-green-600 to-emerald-600"
    />
  )
}