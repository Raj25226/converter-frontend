import FileConverter from '@/components/FileConverter'
import { Image } from 'lucide-react'

export default function WebpToPng() {
  return (
    <FileConverter
      title="WebP to PNG Converter"
      description="Convert modern WebP images to PNG format with transparency"
      endpoint="/webp-to-png"
      acceptedFormats=".webp"
      icon={<Image className="w-16 h-16 text-white" />}
      gradient="from-cyan-500 to-blue-600"
    />
  )
}