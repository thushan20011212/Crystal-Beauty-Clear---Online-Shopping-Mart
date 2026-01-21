import { useEffect } from "react";

export default function Splash({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-primary z-50 flex items-center justify-center">
            <div className="text-center space-y-8 animate-fade-in">
                {/* Brand Name with Animation */}
                <div className="space-y-2">
                    <h1 className="text-6xl md:text-8xl font-bold text-secondary tracking-tight">
                        <span className="inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>Avanaa</span>
                    </h1>
                    <h1 className="text-6xl md:text-8xl font-bold text-secondary tracking-tight">
                        <span className="inline-block animate-fade-in" style={{ animationDelay: '0.4s' }}>Glowy Square</span>
                    </h1>
                </div>
                
                {/* Loading Dots */}
                <div className="flex gap-2 justify-center">
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
}
