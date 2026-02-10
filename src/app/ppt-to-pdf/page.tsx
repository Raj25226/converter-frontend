import FileConverter from '@/components/FileConverter'
import { Presentation } from 'lucide-react'

export default function PptToPdf() {
  return (
    <FileConverter
      title="PowerPoint to PDF Converter"
      description="Convert PowerPoint presentations to PDF documents"
      endpoint="/ppt-to-pdf"
      acceptedFormats=".pptx,.ppt"
      icon={<Presentation className="w-16 h-16 text-white" />}
      gradient="from-red-500 to-pink-600"
    />
  )
}