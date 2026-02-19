import { z } from 'zod';

export const waitlistSchema = z.object({
    email: z.email({ message: 'Please enter a valid email address' }).max(255),
    role: z.enum(['student', 'developer', 'founder', 'designer', 'other']),
    customRole: z.string().max(100).optional(),
}).refine(
    (data) => {
        // If role is 'other', customRole must be provided and at least 2 characters
        if (data.role === 'other') {
            return !!data.customRole && data.customRole.trim().length >= 2;
        }
        return true;
    },
    {
        message: 'Please specify your role (minimum 2 characters)',
        path: ['customRole'],
    }
);

export type WaitlistFormData = z.infer<typeof waitlistSchema>;
