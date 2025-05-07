"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";

export const ThreeDMarquee = ({
  images,
  className
}) => {
  const [loaded, setLoaded] = useState(false);
  
  // Ensure we have enough images - duplicate if needed
  const safeImages = [...images, ...images].slice(0, Math.max(16, images.length));
  
  // Preload images to avoid rendering issues
  useEffect(() => {
    const imagePromises = safeImages.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // Resolve even on error to continue
      });
    });
    
    Promise.all(imagePromises).then(() => {
      setLoaded(true);
    });
  }, [safeImages]);
  
  // Split the images array into 4 equal parts
  const chunkSize = Math.ceil(safeImages.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return safeImages.slice(start, Math.min(start + chunkSize, safeImages.length));
  });
  
  return (
    <div
      className={cn(
        "w-full h-full overflow-hidden rounded-xl relative",
        className
      )}
    >
      {loaded && (
        <div className="w-full h-full flex items-center justify-center">
          {/* Scale up container to fill blank spaces */}
          <div className="w-[120%] h-[120%] transform-gpu origin-center -mt-10">
            <div
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(20deg) rotateZ(-15deg) scale(1.2)",
                transformOrigin: "center center",
              }}
              className="grid grid-cols-4 gap-4 h-full w-full"
            >
              {chunks.map((columnImages, colIndex) => (
                <motion.div
                  key={`col-${colIndex}`}
                  className="flex flex-col gap-4"
                  animate={{ 
                    y: colIndex % 2 === 0 ? [0, -100, 0] : [0, 100, 0] 
                  }}
                  transition={{
                    duration: 15 + colIndex * 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {columnImages.map((image, imgIndex) => (
                    <motion.div 
                      key={`img-${colIndex}-${imgIndex}`} 
                      className="relative overflow-hidden rounded-lg transform-gpu"
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={image}
                        alt={`Construction ${colIndex}-${imgIndex}`}
                        className="w-full h-auto object-cover rounded-lg aspect-video shadow-md ring-1 ring-gray-950/5 dark:ring-white/5"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};