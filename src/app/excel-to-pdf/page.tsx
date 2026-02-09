import FileConverter from '@/components/FileConverter'
import { FileSpreadsheet } from 'lucide-react'

export default function ExcelToPdf() {
  return (
    <FileConverter
      title="Excel to PDF Converter"
      description="Convert your Excel spreadsheets to professional PDF documents"
      endpoint="/excel-to-pdf"
      acceptedFormats=".xlsx,.xls"
      icon={<FileSpreadsheet className="w-16 h-16 text-white" />}
      gradient="from-orange-500 to-orange-600"
    />
  )
}