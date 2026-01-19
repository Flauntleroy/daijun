"use client";

import React, { useEffect, useState } from "react";

export function SparklesBackground() {
    const [elements, setElements] = useState<{ id: number; x: number; size: number; duration: number; delay: number; type: 'sparkle' | 'snowflake' }[]>([]);

    useEffect(() => {
        // Fewer elements but more "falling" feel
        const newElements = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 15 + 10, // Much slower
            delay: Math.random() * 20,
            type: (Math.random() > 0.5 ? 'sparkle' : 'snowflake') as 'sparkle' | 'snowflake',
        }));
        setElements(newElements);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {elements.map((el) => (
                <div
                    key={el.id}
                    className={cn(
                        "absolute rounded-full opacity-30",
                        el.type === 'sparkle' ? "bg-white shadow-[0_0_8px_2px_rgba(56,189,248,0.4)]" : "bg-sky-200/40"
                    )}
                    style={{
                        left: `${el.x}%`,
                        top: `-20px`, // Start above
                        width: `${el.size}px`,
                        height: `${el.size}px`,
                        animation: `fall-and-drift ${el.duration}s linear infinite`,
                        animationDelay: `${el.delay}s`,
                    }}
                />
            ))}
            <style jsx global>{`
        @keyframes fall-and-drift {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(50vh) translateX(30px) scale(1.1);
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(110vh) translateX(-20px) scale(1);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
}

// Add cn helper since it's used in components usually but this is in UI
import { cn } from "@/lib/utils";
