import FileConverter from '@/components/FileConverter'
import { Image } from 'lucide-react'

export default function PngToJpg() {
  return (
    <FileConverter
      title="PNG to JPG Converter"
      description="Convert PNG images to JPG format with quality optimization"
      endpoint="/png-to-jpg"
      acceptedFormats=".png"
      icon={<Image className="w-16 h-16 text-white" />}
      gradient="from-teal-500 to-cyan-600"
    />
  )
}