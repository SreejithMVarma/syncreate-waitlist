import WaitlistForm from '@/components/WaitlistForm';
import LottieBackground from '@/components/LottieBackground';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Lottie Background Animation */}
      <LottieBackground />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
        {/* Logo/Brand */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-silver-200 to-silver-500 animate-gradient">
              SphereNet
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-silver-400 font-light tracking-wide">
            An AI-powered collaboration infrastructure where ideas meet the right collaborators
          </p>
        </div>



        {/* Glassmorphic Card with Description and Waitlist Form */}
        <div className="flex justify-center pt-4 sm:pt-8">
          <div className="
                        w-full max-w-lg
                        relative
                        bg-white/[0.02]
                        backdrop-blur-2xl
                        border border-white/[0.08]
                        rounded-3xl
                        p-8 sm:p-10 md:p-12
                        shadow-2xl shadow-black/50
                        before:absolute before:inset-0
                        before:rounded-3xl
                        before:p-[1px]
                        before:bg-gradient-to-br before:from-silver-400/15 before:via-transparent before:to-silver-500/15
                        before:-z-10
                        hover:shadow-silver-500/10
                        transition-all duration-500
                        space-y-8
                    ">
            {/* Description inside card - Bold and Impressive */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-silver-100 via-white to-silver-100 leading-tight">
                Be among the first to experience the future of innovation.
              </h2>
              <p className="text-base sm:text-lg font-semibold text-silver-200 leading-relaxed">
                Join our exclusive waitlist today.
              </p>
            </div>

            <WaitlistForm />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-12 sm:pt-16 text-xs sm:text-sm text-silver-600">
          <p>© 2026 Syncreate. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
