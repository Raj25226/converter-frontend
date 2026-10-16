import FileConverter from '@/components/FileConverter';
import { FileSpreadsheet } from 'lucide-react';
import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'PDF to Excel Converter – Free Online',
    description:
        'Extract tables from PDF files to Excel spreadsheets online for free.',
};
export default function Page() {
    return (
        <FileConverter
            title="PDF to Excel Converter"
            description="Extract tables and data from PDF to Excel spreadsheets"
            endpoint="/pdf-to-excel"
            acceptedFormats=".pdf"
            icon={<FileSpreadsheet className="w-8 h-8" />}
        />
    );
}
