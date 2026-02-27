import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftElement, rightElement, helperText, id, ...props }, ref) => {
        const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="space-y-1.5 w-full">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-gray-700 block">
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    {leftElement && (
                        <div className="absolute left-3 text-gray-500 sm:text-sm flex items-center pointer-events-none">
                            {leftElement}
                        </div>
                    )}
                    <input
                        id={inputId}
                        ref={ref}
                        className={clsx(
                            'w-full py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all sm:text-sm text-gray-900 placeholder:text-gray-400',
                            leftElement ? 'pl-9' : 'pl-3',
                            rightElement ? 'pr-9' : 'pr-3',
                            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300',
                            className
                        )}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute right-3 text-gray-500 sm:text-sm flex items-center pointer-events-none">
                            {rightElement}
                        </div>
                    )}
                </div>
                {(error || helperText) && (
                    <p className={clsx('text-xs mt-1', error ? 'text-red-500' : 'text-gray-500')}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
