'use client';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { requiredFeature, useFeatures } from './FeatureProvider';
export default function FeatureLink(props: ComponentProps<typeof NextLink>) {
    const { enabled } = useFeatures();
    const path =
        typeof props.href === 'string'
            ? props.href.split(/[?#]/)[0]
            : props.href.pathname || '';
    const required = requiredFeature(path);
    if (required && !enabled(required)) return null;
    return <NextLink {...props} />;
}
