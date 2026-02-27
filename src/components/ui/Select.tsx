import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options?: SelectOption[];
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
    helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, leftElement, rightElement, helperText, id, children, ...props }, ref) => {
        const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="space-y-1.5 w-full">
                {label && (
                    <label htmlFor={selectId} className="text-sm font-medium text-gray-700 block">
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    {leftElement && (
                        <div className="absolute left-3 text-gray-500 sm:text-sm flex items-center pointer-events-none">
                            {leftElement}
                        </div>
                    )}
                    <select
                        id={selectId}
                        ref={ref}
                        className={clsx(
                            'w-full py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all sm:text-sm appearance-none bg-white text-gray-900',
                            leftElement ? 'pl-9' : 'pl-3',
                            rightElement ? 'pr-9' : 'pr-8',
                            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300',
                            className
                        )}
                        {...props}
                    >
                        {options ? (
                            options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))
                        ) : (
                            children
                        )}
                    </select>
                    <div className="absolute right-3 text-gray-500 sm:text-sm flex items-center pointer-events-none">
                        {rightElement || <ChevronDown className="h-4 w-4" />}
                    </div>
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

Select.displayName = 'Select';
