'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LottieBackground() {
    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
            {/* Allow overflow on mobile for better responsiveness */}
            <div className="absolute inset-0 -inset-x-[10%] sm:inset-x-0 overflow-hidden">
                <DotLottieReact
                    src="/Background looping animation.lottie"
                    loop
                    autoplay
                    className="w-full h-full min-w-[120vw] sm:min-w-full object-cover opacity-45"
                />
            </div>
            {/* Gradient overlay to blend with the dark theme */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/55" />
        </div>
    );
}
