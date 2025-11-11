// StylishSingleCarousel.responsive.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react"; // replace if you use another icon set

export default function StylishSingleCarousel({
  items = [],
  autoplay = true,
  interval = 4,
  // default responsive heights: small / md / lg
  heightClass = "h-48 md:h-64 lg:h-96",
  showDots = true,
  showArrows = true,
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const isPausedRef = useRef(false);
  const containerRef = useRef(null);
  const count = items.length;

  // autoplay timer
  useEffect(() => {
    if (!autoplay || count <= 1) return;
    startTimer();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, autoplay, count]);

  function startTimer() {
    stopTimer();
    if (isPausedRef.current) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, interval * 1000);
  }
  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function goTo(i) {
    setIndex(((i % count) + count) % count);
  }
  function prev() {
    goTo(index - 1);
  }
  function next() {
    goTo(index + 1);
  }

  function handleMouseEnter() {
    isPausedRef.current = true;
    stopTimer();
  }
  function handleMouseLeave() {
    isPausedRef.current = false;
    if (autoplay) startTimer();
  }

  // Touch / swipe: use container width to detect swipe threshold
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let currentX = 0;
    let dragging = false;

    function onTouchStart(e) {
      stopTimer();
      isPausedRef.current = true;
      dragging = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
    }
    function onTouchMove(e) {
      if (!dragging) return;
      currentX = e.touches ? e.touches[0].clientX : e.clientX;
    }
    function onTouchEnd() {
      if (!dragging) return;
      const delta = currentX - startX;
      const threshold = Math.max(20, el.offsetWidth * 0.12); // 12% or min 20px
      if (delta > threshold) prev();
      else if (delta < -threshold) next();
      dragging = false;
      isPausedRef.current = false;
      if (autoplay) startTimer();
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    // also support mouse events for desktop drag fallback
    el.addEventListener("mousedown", onTouchStart);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("mouseup", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mousedown", onTouchStart);
      window.removeEventListener("mousemove", onTouchMove);
      window.removeEventListener("mouseup", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items, autoplay]);

  if (!items || items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides wrapper */}
      <div className="overflow-hidden rounded-2xl border shadow-lg bg-gray-50">
        <motion.div
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: "tween", ease: "anticipate", duration: 0.7 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragStart={() => {
            isPausedRef.current = true;
            stopTimer();
          }}
          onDragEnd={() => {
            isPausedRef.current = false;
            if (autoplay) startTimer();
          }}
          style={{ width: `${count * 100}%` }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-full ${heightClass} p-4 md:p-6 flex items-center justify-center`}
            >
              <div
                className={`relative w-full h-full rounded-xl overflow-hidden border transition-all duration-300 ease-out ${
                  i === index
                    ? "scale-100 shadow-2xl ring-2 ring-primary/25"
                    : "scale-95 opacity-90 shadow-md"
                }`}
                style={{ willChange: "transform, box-shadow, opacity" }}
              >
                {/* Image */}
                <img
                  src={it.image}
                  alt={it.title ?? `slide-${i}`}
                  className="absolute inset-0  object-cover"
                  loading="lazy"
                />

                {/* Dark overlay for text (responsive intensity) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 sm:from-black/45 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-4 md:p-6 flex flex-col h-full justify-end">
                  {it.title && (
                    <h3 className="text-white text-lg md:text-2xl font-semibold drop-shadow">
                      {it.title}
                    </h3>
                  )}
                  {it.subtitle && (
                    <p className="text-white/90 mt-1 text-xs md:text-sm drop-shadow-sm">
                      {it.subtitle}
                    </p>
                  )}

                  {/* CTA / small meta chip */}
                  <div className="mt-3 inline-flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">
                      {i + 1} / {count}
                    </span>
                    <button
                      onClick={() => {
                        /* placeholder for action (e.g., go to recipe) */
                      }}
                      className="ml-2 px-3 py-1 rounded-md bg-gradient-to-r from-primary to-accent text-white text-xs shadow-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Arrows (hidden on very small screens for clean UI) */}
      {showArrows && count > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={prev}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            aria-label="Next"
            onClick={next}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Small touch-friendly arrow buttons for mobile (overlay bottom corners) */}
          <button
            aria-label="Previous mobile"
            onClick={prev}
            className="sm:hidden absolute left-3 bottom-6 z-20 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center shadow"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            aria-label="Next mobile"
            onClick={next}
            className="sm:hidden absolute right-3 bottom-6 z-20 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center shadow"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-20 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === index
                  ? "bg-white scale-110 shadow-lg"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
