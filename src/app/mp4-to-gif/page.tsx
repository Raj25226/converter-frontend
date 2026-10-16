import FileConverter from '@/components/FileConverter';
import { Film } from 'lucide-react';
import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'MP4 to GIF Converter – Free Online',
    description:
        'Convert MP4 and MOV video clips to animated GIF images online for free.',
};
export default function Page() {
    return (
        <FileConverter
            title="MP4 to GIF Converter"
            description="Convert video clips to animated GIF images"
            endpoint="/mp4-to-gif"
            acceptedFormats=".mp4,.mov"
            icon={<Film className="w-8 h-8" />}
            maxSizeMB={20}
        />
    );
}
