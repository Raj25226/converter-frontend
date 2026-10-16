import FileConverter from '@/components/FileConverter';
import { Music } from 'lucide-react';
import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'MP4 to MP3 Converter – Free Online',
    description:
        'Extract audio from MP4, MOV, and AVI video files and convert to MP3 online for free.',
};
export default function Page() {
    return (
        <FileConverter
            title="MP4 to MP3 Converter"
            description="Extract high-quality audio from video files"
            endpoint="/mp4-to-mp3"
            acceptedFormats=".mp4,.mov,.avi"
            icon={<Music className="w-8 h-8" />}
        />
    );
}
