export default function Loading({ fullScreen = true, message = "" }) {
    const containerClass = fullScreen 
        ? "fixed inset-0 bg-primary z-50 flex items-center justify-center" 
        : "flex items-center justify-center w-full h-full min-h-[50vh]"

    return (
        <div className={containerClass}>
            <div className="text-center space-y-8 animate-fade-in">
                {/* Brand Name with Animation */}
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-6xl font-bold text-secondary tracking-tight">
                        <span className="inline-block animate-fade-in" style={{ animationDelay: '0.1s' }}>Avanaa</span>
                    </h1>
                    <h1 className="text-4xl md:text-6xl font-bold text-secondary tracking-tight">
                        <span className="inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>Glowy Square</span>
                    </h1>
                </div>
                
                {/* Loading Dots */}
                <div className="flex gap-2 justify-center">
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>

                {/* Optional Message */}
                {message && (
                    <p className="text-muted text-sm animate-fade-in mt-4">{message}</p>
                )}
            </div>
        </div>
    )
}