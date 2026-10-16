'use client';
import { useEffect, useRef, useState } from 'react';
import { Download, ImageDown, ShieldCheck, X } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Feature, useFeatures } from './FeatureProvider';
import { compressImage } from '@/features/image-compressor/compress';
import {
    validateImage,
    targetBytesFromKB,
} from '@/features/image-compressor/validate';
import { downloadName, formatBytes } from '@/features/image-compressor/format';
import type {
    CompressionResult,
    OutputFormat,
} from '@/features/image-compressor/types';
interface Selection {
    file: File;
    url: string;
    width: number;
    height: number;
}
export default function ImageCompressor() {
    const { enabled } = useFeatures();
    const available =
        enabled('conversions') && enabled('conversion-image-compressor');
    const [selection, setSelection] = useState<Selection | null>(null);
    const [target, setTarget] = useState('100');
    const [format, setFormat] = useState<OutputFormat>('auto');
    const [resize, setResize] = useState(true);
    const [maxWidth, setMaxWidth] = useState('');
    const [maxHeight, setMaxHeight] = useState('');
    const [result, setResult] = useState<CompressionResult | null>(null);
    const [resultUrl, setResultUrl] = useState('');
    const [resultTarget, setResultTarget] = useState(0);
    const [status, setStatus] = useState<'idle' | 'validating' | 'compressing'>(
        'idle',
    );
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const generation = useRef(0);
    const cancellation = useRef<AbortController | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const busy = status !== 'idle';
    useEffect(() => {
        const sequence = generation;
        const controller = cancellation;
        return () => {
            sequence.current++;
            controller.current?.abort();
        };
    }, []);
    useEffect(
        () => () => {
            if (selection) URL.revokeObjectURL(selection.url);
        },
        [selection],
    );
    useEffect(
        () => () => {
            if (resultUrl) URL.revokeObjectURL(resultUrl);
        },
        [resultUrl],
    );
    async function select(file: File) {
        if (!available) return;
        const current = ++generation.current;
        cancellation.current?.abort();
        setStatus('validating');
        setError('');
        let url = '';
        try {
            const info = await validateImage(file);
            url = URL.createObjectURL(file);
            let width = info.width,
                height = info.height;
            if (typeof createImageBitmap === 'function') {
                const bitmap = await createImageBitmap(file, {
                    imageOrientation: 'from-image',
                });
                width = bitmap.width;
                height = bitmap.height;
                bitmap.close();
            } else {
                const image = new Image();
                image.src = url;
                await image.decode();
                width = image.naturalWidth;
                height = image.naturalHeight;
                image.src = '';
            }
            if (current !== generation.current) {
                URL.revokeObjectURL(url);
                return;
            }
            setSelection({ file, url, width, height });
            setResult(null);
            setResultUrl('');
        } catch (failure) {
            if (url) URL.revokeObjectURL(url);
            if (current === generation.current)
                setError(
                    failure instanceof Error
                        ? failure.message
                        : 'Unable to open this image.',
                );
        } finally {
            if (current === generation.current) setStatus('idle');
        }
    }
    function clear() {
        generation.current++;
        cancellation.current?.abort();
        setSelection(null);
        setResult(null);
        setResultUrl('');
        setStatus('idle');
        setError('');
    }
    async function compress() {
        if (!selection || busy || !available) return;
        const current = ++generation.current;
        cancellation.current = new AbortController();
        setError('');
        setProgress(0);
        setResult(null);
        setResultUrl('');
        try {
            const targetBytes = targetBytesFromKB(target);
            const dimension = (value: string) => {
                if (!value) return undefined;
                const pixels = Number(value);
                if (!Number.isInteger(pixels) || pixels < 1 || pixels > 20000)
                    throw new Error(
                        'Dimension limits must be whole numbers from 1 to 20,000 pixels.',
                    );
                return pixels;
            };
            const options = {
                targetBytes,
                outputFormat: format,
                allowResize: resize,
                maxWidth: resize ? dimension(maxWidth) : undefined,
                maxHeight: resize ? dimension(maxHeight) : undefined,
            };
            setStatus('compressing');
            const compressed = await compressImage(
                selection.file,
                options,
                cancellation.current.signal,
                (value) => {
                    if (current === generation.current) setProgress(value);
                },
            );
            if (current !== generation.current) return;
            setResult(compressed);
            setResultTarget(targetBytes);
            setResultUrl(URL.createObjectURL(compressed.blob));
        } catch (failure) {
            if (current === generation.current)
                setError(
                    failure instanceof DOMException &&
                        failure.name === 'AbortError'
                        ? 'Compression cancelled. Your original image is unchanged.'
                        : failure instanceof Error
                          ? failure.message
                          : 'Unable to compress this image.',
                );
        } finally {
            if (current === generation.current) setStatus('idle');
        }
    }
    return (
        <>
            <Navbar />
            <main className="app-container flex-1 py-10">
                <div className="flex items-start gap-4 mb-8">
                    <span className="icon-tile compressor-highlight h-12 w-12">
                        <ImageDown />
                    </span>
                    <div>
                        <h1 className="text-3xl font-semibold flex flex-wrap items-center gap-3">
                            Image compressor
                        </h1>
                        <p className="muted mt-2">
                            Make JPEG, PNG, and WebP images smaller, with a
                            target size and optional resizing.
                        </p>
                        <p className="text-sm muted mt-2 flex items-center gap-2">
                            <ShieldCheck size={16} /> Images stay on your
                            device. No upload or daily quota.
                        </p>
                    </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                    <section className="card p-6" aria-label="Choose image">
                        <h2 className="font-semibold mb-4">
                            Choose your image
                        </h2>
                        <div
                            className="rounded-lg border-2 border-dashed p-6 text-center"
                            style={{ borderColor: 'rgb(var(--card-border))' }}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => {
                                event.preventDefault();
                                if (event.dataTransfer.files.length !== 1)
                                    setError('Choose one image at a time.');
                                else void select(event.dataTransfer.files[0]);
                            }}
                        >
                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="sr-only"
                                aria-label="Choose image file"
                                disabled={busy || !available}
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) void select(file);
                                    event.target.value = '';
                                }}
                            />
                            <button
                                className="btn btn-primary px-5"
                                disabled={busy || !available}
                                onClick={() => fileInput.current?.click()}
                            >
                                Choose image
                            </button>
                            <p className="text-sm muted mt-3">
                                or drop one image here · JPEG, PNG, WebP · up to
                                20 MB / 40 megapixels
                            </p>
                        </div>
                        {selection && (
                            <div className="mt-5">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm break-all">
                                        {selection.file.name}
                                        <span className="block muted">
                                            {formatBytes(selection.file.size)} ·{' '}
                                            {selection.width} ×{' '}
                                            {selection.height} px
                                        </span>
                                    </p>
                                    <button
                                        className="icon-button"
                                        onClick={clear}
                                        aria-label="Remove image"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <img
                                    src={selection.url}
                                    alt="Selected file preview"
                                    className="max-h-80 w-full object-contain mt-4 rounded-lg"
                                />
                            </div>
                        )}
                    </section>
                    <section
                        className="card p-6"
                        aria-label="Compression settings"
                    >
                        <h2 className="font-semibold mb-4">
                            Compression settings
                        </h2>
                        <fieldset
                            disabled={busy || !available}
                            className="space-y-5"
                        >
                            <div>
                                <p className="text-sm mb-2">
                                    Target size presets
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[20, 50, 100, 200].map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            className={`btn px-4 ${Number(target) === value ? 'btn-primary' : 'btn-secondary'}`}
                                            aria-pressed={
                                                Number(target) === value
                                            }
                                            onClick={() =>
                                                setTarget(String(value))
                                            }
                                        >
                                            {value} KB
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <label
                                className="block text-sm"
                                htmlFor="image-target"
                            >
                                Target size (KB)
                                <input
                                    className="input-field mt-2"
                                    id="image-target"
                                    type="number"
                                    min="1"
                                    max="20480"
                                    step="any"
                                    value={target}
                                    onChange={(event) =>
                                        setTarget(event.target.value)
                                    }
                                />
                            </label>
                            <label
                                className="block text-sm"
                                htmlFor="image-format"
                            >
                                Output format
                                <select
                                    className="input-field mt-2"
                                    id="image-format"
                                    value={format}
                                    onChange={(event) =>
                                        setFormat(
                                            event.target.value as OutputFormat,
                                        )
                                    }
                                >
                                    <option value="auto">
                                        Keep original format
                                    </option>
                                    <option value="image/jpeg">JPEG</option>
                                    <option value="image/webp">WebP</option>
                                    <option value="image/png">PNG</option>
                                </select>
                            </label>
                            {format === 'image/jpeg' && (
                                <p className="text-sm muted">
                                    JPEG fills transparent areas with white.
                                </p>
                            )}
                            <label className="flex gap-3 items-center text-sm">
                                <input
                                    type="checkbox"
                                    checked={resize}
                                    onChange={(event) =>
                                        setResize(event.target.checked)
                                    }
                                />
                                Allow resizing to approach the target
                            </label>
                            {resize && (
                                <div className="grid grid-cols-2 gap-3">
                                    <label
                                        className="text-sm"
                                        htmlFor="image-width"
                                    >
                                        Max width
                                        <input
                                            className="input-field mt-2"
                                            id="image-width"
                                            type="number"
                                            min="1"
                                            max="20000"
                                            placeholder="Original"
                                            value={maxWidth}
                                            onChange={(event) =>
                                                setMaxWidth(event.target.value)
                                            }
                                        />
                                    </label>
                                    <label
                                        className="text-sm"
                                        htmlFor="image-height"
                                    >
                                        Max height
                                        <input
                                            className="input-field mt-2"
                                            id="image-height"
                                            type="number"
                                            min="1"
                                            max="20000"
                                            placeholder="Original"
                                            value={maxHeight}
                                            onChange={(event) =>
                                                setMaxHeight(event.target.value)
                                            }
                                        />
                                    </label>
                                </div>
                            )}
                            <button
                                type="button"
                                className="btn btn-primary w-full px-5"
                                disabled={!selection || busy || !available}
                                onClick={() => void compress()}
                            >
                                {status === 'compressing'
                                    ? 'Compressing…'
                                    : status === 'validating'
                                      ? 'Checking image…'
                                      : 'Compress image'}
                            </button>
                        </fieldset>
                        {status === 'compressing' && (
                            <div className="mt-4">
                                <progress
                                    className="w-full"
                                    max="100"
                                    value={progress}
                                    aria-label="Compression progress"
                                />
                                <button
                                    className="btn btn-secondary px-4 mt-2"
                                    onClick={() =>
                                        cancellation.current?.abort()
                                    }
                                >
                                    Cancel compression
                                </button>
                            </div>
                        )}
                        <p className="text-xs muted mt-4">
                            The target is a goal, not a guarantee. Images are
                            never enlarged. Metadata may be removed, and
                            animation becomes a still image.
                        </p>
                    </section>
                </div>
                {error && (
                    <p role="alert" className="alert-error mt-5">
                        {error}
                    </p>
                )}
                <p role="status" className="sr-only">
                    {status === 'compressing'
                        ? `Compressing locally: ${progress} percent.`
                        : result
                          ? 'Compression result ready.'
                          : status === 'validating'
                            ? 'Checking image.'
                            : ''}
                </p>
                {result && selection && resultUrl && (
                    <section
                        className="card p-6 mt-6"
                        aria-label="Compression result"
                    >
                        <h2 className="text-xl font-semibold">
                            {result.targetReached
                                ? 'Target reached'
                                : 'Target not reached'}
                        </h2>
                        <p className="muted mt-2">
                            {formatBytes(selection.file.size)} →{' '}
                            {formatBytes(result.outputBytes)} · Target:{' '}
                            {formatBytes(resultTarget)} · {result.width} ×{' '}
                            {result.height} px
                        </p>
                        <p className="text-sm mt-2">
                            {result.originalKept
                                ? 'Original image kept without changes.'
                                : `${Math.max(0, Math.round((1 - result.outputBytes / selection.file.size) * 100))}% smaller`}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-5 mt-5">
                            <figure>
                                <figcaption className="text-sm mb-2">
                                    Original
                                </figcaption>
                                <img
                                    src={selection.url}
                                    alt="Original comparison"
                                    className="h-64 w-full object-contain rounded-lg"
                                />
                            </figure>
                            <figure>
                                <figcaption className="text-sm mb-2">
                                    Result
                                </figcaption>
                                <img
                                    src={resultUrl}
                                    alt="Compressed file preview"
                                    className="h-64 w-full object-contain rounded-lg"
                                />
                            </figure>
                        </div>
                        {result.warnings.length > 0 && (
                            <ul className="text-sm muted list-disc pl-5 space-y-2 mt-5">
                                {result.warnings.map((warning) => (
                                    <li key={warning}>{warning}</li>
                                ))}
                            </ul>
                        )}
                        <Feature name="downloads">
                            <a
                                className="btn btn-primary px-5 mt-5"
                                href={resultUrl}
                                download={downloadName(
                                    selection.file.name,
                                    result.blob.type,
                                    result.originalKept,
                                )}
                            >
                                <Download size={16} />
                                Download{' '}
                                {result.originalKept ? 'original' : 'image'}
                            </a>
                        </Feature>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
