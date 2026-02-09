import FileConverter from '@/components/FileConverter'
import { Image } from 'lucide-react'

export default function JpgToPng() {
  return (
    <FileConverter
      title="JPG to PNG Converter"
      description="Convert your JPG/JPEG images to PNG format with transparency support"
      endpoint="/jpg-to-png"
      acceptedFormats=".jpg,.jpeg"
      icon={<Image className="w-16 h-16 text-white" />}
      gradient="from-green-500 to-green-600"
    />
  )
}