import type { Metadata } from 'next';
import ImageCompressor from '@/components/ImageCompressor';
export const metadata: Metadata = {
    title: 'Image Compressor',
    description:
        'Compress JPEG, PNG, and WebP images privately on your device with target sizes, previews, and optional resizing.',
};
export default function ImageCompressorPage() {
    return <ImageCompressor />;
}
