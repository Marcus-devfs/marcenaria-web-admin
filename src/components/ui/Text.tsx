import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'small' | 'muted';
    className?: string;
    children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
    as: Component = 'p',
    variant = 'body',
    className,
    children,
    ...props
}) => {
    const variants = {
        h1: 'text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900',
        h2: 'text-3xl font-bold tracking-tight text-gray-900',
        h3: 'text-2xl font-semibold tracking-tight text-gray-900',
        h4: 'text-xl font-semibold tracking-tight text-gray-900',
        h5: 'text-lg font-semibold tracking-tight text-gray-900',
        body: 'text-base leading-7 text-gray-700',
        small: 'text-sm font-medium leading-none text-gray-900',
        muted: 'text-sm text-gray-500',
    };

    // If component is not explicitly set, try to match variant if it's a heading
    const ComponentToRender = Component || (['h1', 'h2', 'h3', 'h4'].includes(variant) ? variant : 'p');

    return (
        // @ts-ignore
        <ComponentToRender
            className={cn(variants[variant], className)}
            {...props}
        >
            {children}
        </ComponentToRender>
    );
};
