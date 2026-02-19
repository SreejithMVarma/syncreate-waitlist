'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label: string;
    id: string;
}

export default function CustomSelect({ options, value, onChange, label, id }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-2" ref={selectRef}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-silver-300"
            >
                {label}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-white/5 border border-white/10',
                        'text-silver-100 text-left',
                        'focus:outline-none focus:border-silver-500',
                        'focus:shadow-[0_0_20px_rgba(161,161,170,0.15)]',
                        'transition-all duration-300',
                        'backdrop-blur-sm',
                        'cursor-pointer',
                        'flex items-center justify-between'
                    )}
                >
                    <span>{selectedOption?.label}</span>
                    <ChevronDown
                        className={cn(
                            'w-5 h-5 text-silver-400 transition-transform duration-200',
                            isOpen && 'rotate-180'
                        )}
                    />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                'absolute z-50 w-full mt-2',
                                'bg-[#1a1a1a] border border-white/20',
                                'rounded-lg shadow-xl',
                                'backdrop-blur-xl',
                                'overflow-hidden'
                            )}
                        >
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        'w-full px-4 py-3 text-left',
                                        'transition-colors duration-150',
                                        'text-silver-100',
                                        option.value === value
                                            ? 'bg-silver-500/20 text-white'
                                            : 'hover:bg-white/10'
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
