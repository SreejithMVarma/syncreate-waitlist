'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { joinWaitlist } from '@/app/actions/join-waitlist';
import { cn } from '@/lib/utils';
import CustomSelect from '@/components/CustomSelect';

import { waitlistSchema, type WaitlistFormData } from '@/lib/schemas';

type FormData = WaitlistFormData;

const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'developer', label: 'Developer' },
    { value: 'founder', label: 'Founder' },
    { value: 'designer', label: 'Designer' },
    { value: 'other', label: 'Other' },
];

export default function WaitlistForm() {
    const [isPending, startTransition] = useTransition();
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(waitlistSchema),
        defaultValues: {
            email: '',
            role: 'developer',
            customRole: '',
        },
    });

    const selectedRole = watch('role');
    const showCustomRole = selectedRole === 'other';

    const onSubmit = async (data: FormData) => {
        setSubmitStatus({ type: null, message: '' });

        startTransition(async () => {
            const result = await joinWaitlist(data);

            if (result.success) {
                setSubmitStatus({
                    type: 'success',
                    message: result.message,
                });
                reset();
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: result.error || result.message,
                });
            }
        });
    };

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            {/* Email Input */}
            <div className="space-y-2">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-silver-300"
                >
                    Email Address
                </label>
                <input
                    {...register('email')}
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-white/5 border border-white/10',
                        'text-silver-100 placeholder:text-silver-600',
                        'focus:outline-none focus:border-silver-500',
                        'focus:shadow-[0_0_20px_rgba(161,161,170,0.15)]',
                        'transition-all duration-300',
                        'backdrop-blur-sm',
                        errors.email && 'border-red-500/50 focus:border-red-500'
                    )}
                />
                <AnimatePresence mode="wait">
                    {errors.email && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-red-400 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errors.email.message}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* Role Select - Custom Component */}
            <Controller
                name="role"
                control={control}
                render={({ field }) => (
                    <CustomSelect
                        options={roleOptions}
                        value={field.value}
                        onChange={field.onChange}
                        label="I am a"
                        id="role"
                    />
                )}
            />

            {/* Custom Role Input (Animated) */}
            <AnimatePresence>
                {showCustomRole && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="space-y-2 overflow-hidden"
                    >
                        <label
                            htmlFor="customRole"
                            className="block text-sm font-medium text-silver-300"
                        >
                            Specify your role
                        </label>
                        <input
                            {...register('customRole')}
                            type="text"
                            id="customRole"
                            placeholder="e.g., Product Manager, Marketer"
                            className={cn(
                                'w-full px-4 py-3 rounded-lg',
                                'bg-white/5 border border-white/10',
                                'text-silver-100 placeholder:text-silver-600',
                                'focus:outline-none focus:border-silver-500',
                                'focus:shadow-[0_0_20px_rgba(161,161,170,0.15)]',
                                'transition-all duration-300',
                                'backdrop-blur-sm',
                                errors.customRole && 'border-red-500/50 focus:border-red-500'
                            )}
                        />
                        {errors.customRole && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-400 flex items-center gap-1"
                            >
                                <AlertCircle className="w-4 h-4" />
                                {errors.customRole.message}
                            </motion.p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{ scale: isPending ? 1 : 1.02 }}
                whileTap={{ scale: isPending ? 1 : 0.98 }}
                className={cn(
                    'w-full md:w-auto md:min-w-[200px] px-8 py-3 rounded-lg',
                    'bg-gradient-to-r from-silver-100 via-silver-300 to-silver-100',
                    'text-black font-semibold',
                    'shadow-lg shadow-silver-500/20',
                    'transition-all duration-300',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'hover:shadow-xl hover:shadow-silver-500/30'
                )}
            >
                {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Joining...
                    </span>
                ) : (
                    'Join Waitlist'
                )}
            </motion.button>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
                {submitStatus.type && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                            'px-4 py-3 rounded-lg flex items-start gap-3',
                            submitStatus.type === 'success'
                                ? 'bg-emerald-500/10 border border-emerald-500/20'
                                : 'bg-red-500/10 border border-red-500/20'
                        )}
                    >
                        {submitStatus.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <p
                            className={cn(
                                'text-sm',
                                submitStatus.type === 'success'
                                    ? 'text-emerald-300'
                                    : 'text-red-300'
                            )}
                        >
                            {submitStatus.message}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.form>
    );
}
