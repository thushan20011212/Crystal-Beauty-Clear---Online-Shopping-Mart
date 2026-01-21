import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function ImageSlider(props) {
    const images = props.images || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [thumbStartIndex, setThumbStartIndex] = useState(0);
    const thumbsPerView = 4;

    // Empty state placeholder
    if (!images || images.length === 0) {
        return (
            <div className="w-[500px] h-[600px] bg-primary rounded-3xl flex items-center justify-center">
                <img src="/placeholder.svg" className="w-full h-full object-cover rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="w-[90%] md:w-[500px] flex flex-col gap-4">
            {/* Main Image with Thumbnails Inside */}
            <div className="w-full rounded-xl md:rounded-2xl overflow-hidden shadow-lg bg-neutral">
                {/* Main Image */}
                <div className="w-full h-[400px] md:h-[500px]">
                    <img 
                        src={images[currentIndex]} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                            e.target.src = "/placeholder.svg"
                        }}
                    />
                </div>
                
                {/* Thumbnail Navigation Inside */}
                {images.length > 1 && (
                    <div className="w-full p-3 md:p-4 flex items-center gap-2 md:gap-3 bg-neutral">
                        {/* Left Arrow for Thumbnails */}
                        <button
                            onClick={() => setThumbStartIndex((prev) => Math.max(0, prev - 1))}
                            disabled={thumbStartIndex === 0}
                            className="shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-secondary text-neutral rounded-lg md:rounded-xl hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                        >
                            <IoChevronBack className="text-xl md:text-2xl" />
                        </button>

                        {/* Thumbnails in Horizontal Queue - Show only 4 */}
                        <div className="flex-1 flex gap-2 md:gap-3 overflow-hidden">
                            {images.slice(thumbStartIndex, thumbStartIndex + thumbsPerView).map((image, displayIndex) => {
                                const actualIndex = thumbStartIndex + displayIndex
                                return (
                                    <div 
                                        key={actualIndex}
                                        onClick={() => setCurrentIndex(actualIndex)}
                                        className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden border-2 md:border-3 ${actualIndex === currentIndex ? "border-secondary shadow-lg scale-105" : "border-accent hover:border-secondary opacity-75 hover:opacity-100"}`}
                                    >
                                        <img 
                                            src={image}
                                            alt={`Product view ${actualIndex + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "/placeholder.svg"
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        {/* Right Arrow for Thumbnails */}
                        <button
                            onClick={() => setThumbStartIndex((prev) => Math.min(images.length - thumbsPerView, prev + 1))}
                            disabled={thumbStartIndex >= images.length - thumbsPerView}
                            className="shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-secondary text-neutral rounded-lg md:rounded-xl hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                        >
                            <IoChevronForward className="text-xl md:text-2xl" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}