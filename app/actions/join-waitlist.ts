'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

import { waitlistSchema, type WaitlistFormData } from '@/lib/schemas';

interface ActionResult {
    success: boolean;
    message: string;
    error?: string;
}

// Hash IP address for privacy
function hashIP(ip: string): string {
    return crypto.createHash('sha256').update(ip).digest('hex');
}

// Get client IP from headers
function getClientIP(headers: Headers): string {
    // Try various headers that might contain the real IP
    const forwardedFor = headers.get('x-forwarded-for');
    const realIP = headers.get('x-real-ip');
    const cfConnectingIP = headers.get('cf-connecting-ip');

    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwardedFor.split(',')[0].trim();
    }

    if (cfConnectingIP) return cfConnectingIP;
    if (realIP) return realIP;

    // Fallback to a default value (in dev environment)
    return 'unknown';
}

export async function joinWaitlist(
    formData: WaitlistFormData
): Promise<ActionResult> {
    try {
        // Validate input
        const validatedData = waitlistSchema.parse(formData);

        // Sanitize inputs
        const email = validatedData.email.trim().toLowerCase();
        const role = validatedData.role;
        const customRole = validatedData.customRole?.trim() || null;

        // Get and hash IP for rate limiting
        // Note: In server actions, we need to use headers() from next/headers
        const { headers } = await import('next/headers');
        const headersList = await headers();
        const clientIP = getClientIP(headersList);
        const ipHash = hashIP(clientIP);

        // Rate limiting: Check submissions from this IP in the last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentSubmissions = await prisma.waitlistEntry.count({
            where: {
                ipHash,
                createdAt: {
                    gte: oneHourAgo,
                },
            },
        });

        if (recentSubmissions >= 3) {
            return {
                success: false,
                message: 'Too many requests',
                error: 'You have submitted too many requests. Please try again later.',
            };
        }

        // Try to create the entry
        try {
            await prisma.waitlistEntry.create({
                data: {
                    email,
                    role,
                    customRole,
                    ipHash,
                },
            });

            return {
                success: true,
                message: "You're on the list! We'll be in touch soon.",
            };
        } catch (error: any) {
            // Check if it's a duplicate email error
            if (error.code === 'P2002') {
                return {
                    success: false,
                    message: "You're already on the list!",
                    error: "This email is already registered. We'll keep you updated!",
                };
            }

            throw error;
        }
    } catch (error) {
        console.error('Waitlist submission error:', error);

        if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            return {
                success: false,
                message: 'Validation error',
                error: firstError.message,
            };
        }

        return {
            success: false,
            message: 'Something went wrong',
            error: 'An unexpected error occurred. Please try again later.',
        };
    }
}
