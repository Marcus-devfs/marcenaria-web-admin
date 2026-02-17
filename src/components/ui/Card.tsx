import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`border-b pb-4 mb-4 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
            {children}
        </h3>
    );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
};
