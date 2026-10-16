export const articles = [
    {
        slug: 'pdf-to-word-guide',
        title: 'Turn PDF text into an editable Word document',
        excerpt:
            'What text extraction can do, and when you need OCR or a layout editor.',
        category: 'PDF',
        tool: '/pdf-to-word',
        paragraphs: [
            'A PDF describes a finished page. A Word document describes editable content. Converting between them involves interpreting text and choosing how to arrange it in a new document.',
            'Open PDF to Word, upload a PDF with selectable text, and download the DOCX before the link expires. Unimorpher extracts text rather than recreating the original fonts, columns, or embedded images. Check headings, spacing, and tables in Word before sharing the result.',
            'If the PDF is a scan, its text may exist only as an image. This service does not perform OCR. Use an OCR tool first, or edit the source document when accurate layout preservation matters.',
        ],
    },
    {
        slug: 'compress-images-web',
        title: 'Choose the right image format for your website',
        excerpt:
            'Compare JPEG, PNG, and WebP and check the result before publishing.',
        category: 'Images',
        tool: '/file-compress',
        paragraphs: [
            'JPEG is useful for photos, while PNG preserves transparency and exact pixel values. WebP offers another option for delivering images. The best choice depends on the image and the quality you need.',
            'Use File Compress for a JPEG quality reduction, or JPG to WebP to create a WebP version. Compare the output size and inspect fine details before replacing the original. Re-encoding an already optimized PNG may produce little or no size reduction.',
            'Keep an original copy and serve images at dimensions appropriate for the page. Converting PNG to JPEG adds a white background where the source was transparent. Choose PNG if that transparency is needed.',
        ],
    },
    {
        slug: 'heic-to-jpg',
        title: 'Convert HEIC photos for easier sharing',
        excerpt: 'Make a JPEG copy while keeping your original photo.',
        category: 'Images',
        tool: '/heic-to-jpg',
        paragraphs: [
            'HEIC is commonly used for photos from Apple devices. Some applications accept JPEG more readily, so making a JPEG copy can help when a photo will not open in another application.',
            'Choose HEIC to JPG, upload your photo, and download the result. The server needs FFmpeg or ImageMagick with HEIC support. If the conversion is unavailable, the service operator needs to enable the required native tools.',
            "Check the output's colors and orientation. Converting an image may change its metadata or discard features of the original container. Keep the source HEIC as your master copy.",
        ],
    },
    {
        slug: 'extract-audio-video',
        title: 'Extract an MP3 from an MP4 video',
        excerpt: 'Save a video’s audio track as a separate file.',
        category: 'Audio',
        tool: '/mp4-to-mp3',
        paragraphs: [
            'An MP4 can contain video and audio tracks. Extracting audio creates a separate file that can be played without the video. A video without an audio track cannot produce an MP3 through this tool.',
            'Open MP4 to MP3, upload your video, and wait for processing to finish. Upload progress measures the transfer, so the converter may still be working after it reaches 100 percent. Download the MP3 before its temporary link expires.',
            "This conversion re-encodes audio and does not improve the source recording's quality. Use WAV to MP3 for a WAV source. Convert and distribute recordings only when you have permission to do so.",
        ],
    },
    {
        slug: 'excel-to-pdf-tips',
        title: 'Export spreadsheet values to PDF',
        excerpt:
            'Understand how the converter handles cells, charts, and print layout.',
        category: 'Documents',
        tool: '/excel-to-pdf',
        paragraphs: [
            "Unimorpher's Excel to PDF converter reads spreadsheet values and renders them as text. This works for reviewing simple data, but it does not reproduce an Excel print layout or render charts.",
            'Upload an XLS or XLSX workbook, download the PDF, and check that the rows and columns are readable. Formula results may depend on cached values saved by the spreadsheet application. Recalculate and save your workbook before uploading if those values matter.',
            "For a report with charts, page breaks, print areas, or carefully designed formatting, use the original spreadsheet application's PDF export. Keep your workbook because a PDF is not a replacement for editable formulas.",
        ],
    },
    {
        slug: 'webp-format-guide',
        title: 'Use WebP images and convert them when needed',
        excerpt: 'Create a WebP copy or return to PNG for editing.',
        category: 'Images',
        tool: '/jpg-to-webp',
        paragraphs: [
            'WebP is an image format used on websites. Whether it saves space compared with another format depends on the picture, encoder settings, and quality target. Compare files rather than assuming every conversion makes a smaller image.',
            "JPG to WebP creates a WebP copy using the server's FFmpeg encoder. Download it and test it in the applications where you intend to use it. Keep the original JPEG so you can create another variant later.",
            'If an editor does not accept a WebP, use WebP to PNG. The converter handles the image rather than promising to preserve every piece of metadata or all features of an animated container.',
        ],
    },
].map((article) => ({
    ...article,
    date: '2026-10-14',
    readTime: '2 min read',
}));
