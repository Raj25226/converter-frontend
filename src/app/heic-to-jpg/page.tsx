import FileConverter from '@/components/FileConverter'
import { Image } from 'lucide-react'

export default function HeicToJpg() {
  return (
    <FileConverter
      title="HEIC to JPG Converter"
      description="Convert iPhone HEIC images to universal JPG format"
      endpoint="/heic-to-jpg"
      acceptedFormats=".heic,.heif"
      icon={<Image className="w-16 h-16 text-white" />}
      gradient="from-indigo-500 to-purple-600"
    />
  )
}