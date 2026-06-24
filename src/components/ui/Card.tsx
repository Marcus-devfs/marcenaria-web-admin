import React from 'react';
import { cn } from '@/components/ui/Text';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
    return (
        <div className={cn('bg-white shadow rounded-lg p-4', className)} style={style}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={cn('border-b pb-4 mb-4', className)}>
            {children}
        </div>
    );
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <h3 className={cn('text-lg font-medium text-gray-900', className)}>
            {children}
        </h3>
    );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={cn(className)}>
            {children}
        </div>
    );
};
