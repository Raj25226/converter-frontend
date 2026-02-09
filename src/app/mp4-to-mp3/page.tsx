import FileConverter from '@/components/FileConverter'
import { Music } from 'lucide-react'

export default function Mp4ToMp3() {
  return (
    <FileConverter
      title="MP4 to MP3 Converter"
      description="Extract high-quality audio from your video files in MP3 format"
      endpoint="/mp4-to-mp3"
      acceptedFormats=".mp4,.mov,.avi"
      icon={<Music className="w-16 h-16 text-white" />}
      gradient="from-purple-500 to-purple-600"
    />
  )
}