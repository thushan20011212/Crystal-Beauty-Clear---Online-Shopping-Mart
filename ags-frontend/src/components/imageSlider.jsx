import { useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { HiOutlineZoomIn } from "react-icons/hi";

export default function ImageSlider(props) {
    const images = props.images || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [thumbStartIndex, setThumbStartIndex] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const thumbsPerView = 4;

    // Reset loading state when image changes
    useEffect(() => {
        // Only show loading if image is not already cached
        setIsImageLoading(true);
        
        // Create a new image to preload and check if it's cached
        const img = new Image();
        img.src = images[currentIndex];
        
        if (img.complete) {
            // Image is already cached, no need to show loading
            setIsImageLoading(false);
        }
    }, [currentIndex, images]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (images.length <= 1) return;
            
            if (e.key === "ArrowLeft") {
                handlePrevImage();
            } else if (e.key === "ArrowRight") {
                handleNextImage();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [currentIndex, images.length]);

    // Empty state placeholder
    if (!images || images.length === 0) {
        return (
            <div className="w-full max-w-[500px] h-[400px] md:h-[500px] bg-primary rounded-3xl flex items-center justify-center shadow-lg">
                <img src="/placeholder.svg" alt="No image" className="w-full h-full object-cover rounded-3xl opacity-50" />
            </div>
        );
    }

    const handlePrevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleThumbPrev = () => {
        setThumbStartIndex((prev) => Math.max(0, prev - 1));
    };

    const handleThumbNext = () => {
        setThumbStartIndex((prev) => Math.min(images.length - thumbsPerView, prev + 1));
    };

    return (
        <div className="w-full max-w-[500px] flex flex-col gap-4">
            {/* Main Image Container */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-neutral group">
                {/* Main Image */}
                <div className="relative w-full h-[400px] md:h-[500px] bg-accent/10">
                    {/* Loading Spinner */}
                    {isImageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-accent/20">
                            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    
                    <img 
                        src={images[currentIndex]} 
                        alt={`Product view ${currentIndex + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        style={{ opacity: isImageLoading ? 0 : 1 }}
                        onLoad={() => setIsImageLoading(false)}
                        onError={(e) => {
                            e.target.src = "/placeholder.svg";
                            setIsImageLoading(false);
                        }}
                    />

                    {/* Image Counter */}
                    <div className="absolute top-4 right-4 bg-secondary/80 text-neutral px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Navigation Arrows - Show only if more than 1 image */}
                    {images.length > 1 && (
                        <>
                            {/* Left Arrow */}
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-secondary/90 text-neutral rounded-full hover:bg-secondary hover:scale-110 transition-all duration-300 shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100"
                                aria-label="Previous image"
                            >
                                <IoChevronBack className="text-2xl" />
                            </button>

                            {/* Right Arrow */}
                            <button
                                onClick={handleNextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-secondary/90 text-neutral rounded-full hover:bg-secondary hover:scale-110 transition-all duration-300 shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100"
                                aria-label="Next image"
                            >
                                <IoChevronForward className="text-2xl" />
                            </button>
                        </>
                    )}

                    {/* Dot Indicators - Show for 2-5 images */}
                    {images.length > 1 && images.length <= 5 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`transition-all duration-300 rounded-full ${
                                        index === currentIndex
                                            ? "w-8 h-2 bg-secondary"
                                            : "w-2 h-2 bg-accent hover:bg-secondary/50"
                                    }`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Thumbnail Navigation - Show only if more than 1 image */}
                {images.length > 1 && (
                    <div className="w-full px-3 py-4 md:px-4 md:py-5 flex items-center gap-2 md:gap-3 bg-neutral border-t border-accent/30">
                        {/* Left Arrow for Thumbnails */}
                        {images.length > thumbsPerView && (
                            <button
                                onClick={handleThumbPrev}
                                disabled={thumbStartIndex === 0}
                                className="shrink-0 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-secondary text-neutral rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:scale-105"
                                aria-label="Previous thumbnails"
                            >
                                <IoChevronBack className="text-lg md:text-xl" />
                            </button>
                        )}

                        {/* Thumbnails Grid */}
                        <div className="flex-1 flex gap-2 md:gap-3 overflow-visible justify-center items-center py-1">
                            {(images.length <= thumbsPerView 
                                ? images 
                                : images.slice(thumbStartIndex, thumbStartIndex + thumbsPerView)
                            ).map((image, displayIndex) => {
                                const actualIndex = images.length <= thumbsPerView 
                                    ? displayIndex 
                                    : thumbStartIndex + displayIndex;
                                return (
                                    <button
                                        key={actualIndex}
                                        onClick={() => setCurrentIndex(actualIndex)}
                                        className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden border-2 ${
                                            actualIndex === currentIndex 
                                                ? "border-secondary shadow-lg scale-105 ring-2 ring-secondary/30" 
                                                : "border-accent hover:border-secondary/50 opacity-60 hover:opacity-100 hover:scale-105"
                                        }`}
                                        aria-label={`View image ${actualIndex + 1}`}
                                    >
                                        <img 
                                            src={image}
                                            alt={`Thumbnail ${actualIndex + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "/placeholder.svg";
                                            }}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right Arrow for Thumbnails */}
                        {images.length > thumbsPerView && (
                            <button
                                onClick={handleThumbNext}
                                disabled={thumbStartIndex >= images.length - thumbsPerView}
                                className="shrink-0 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-secondary text-neutral rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:scale-105"
                                aria-label="Next thumbnails"
                            >
                                <IoChevronForward className="text-lg md:text-xl" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
