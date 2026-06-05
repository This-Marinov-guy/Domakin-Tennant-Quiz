"use client";

import { useRef, useState, type PointerEvent } from "react";

interface SwipeCardProps {
  progressLabel: string;
  text: string;
  /** answer === true  -> swiped right (YES); false -> swiped left (NO). */
  onSwipe: (answer: boolean) => void;
  disabled?: boolean;
}

// Drag distance (px) past which the swipe is committed instead of snapping back.
const COMMIT_THRESHOLD = 110;
// How far the card flies off-screen when committed. Large enough to clear any
// viewport without reading `window` (keeps this SSR-safe).
const FLY_DISTANCE = 1000;
const MAX_ROTATE = 16;

export default function SwipeCard({
  progressLabel,
  text,
  onSwipe,
  disabled = false,
}: SwipeCardProps) {
  const [dx, setDx] = useState(0);
  // null = interactive; true/false = committing in that direction (flying out).
  const [leaving, setLeaving] = useState<boolean | null>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const fired = useRef(false);

  const commit = (answer: boolean) => {
    if (leaving !== null) return;
    setLeaving(answer);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || leaving !== null) return;
    dragging.current = true;
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setDx(e.clientX - startX.current);
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dx > COMMIT_THRESHOLD) commit(true);
    else if (dx < -COMMIT_THRESHOLD) commit(false);
    else setDx(0); // snap back
  };

  const onTransitionEnd = () => {
    if (leaving !== null && !fired.current) {
      fired.current = true;
      onSwipe(leaving);
    }
  };

  // Visual intent for the YES/NO overlays — driven by the live drag or the
  // committed direction.
  const intent =
    leaving !== null ? leaving : dx > 30 ? true : dx < -30 ? false : null;

  const offset =
    leaving === true
      ? FLY_DISTANCE
      : leaving === false
      ? -FLY_DISTANCE
      : dx;
  const rotate = Math.max(-MAX_ROTATE, Math.min(MAX_ROTATE, offset * 0.05));
  const hasTransform = leaving !== null || dx !== 0;

  const overlayOpacity = Math.min(1, Math.abs(offset) / COMMIT_THRESHOLD);

  return (
    <div className="swipe-card-frame swipe-card-enter">
      <div
        className={`swipe-card swipe-card-slot bg-white border rounded-3 ${
          leaving !== null ? "swipe-card--leaving" : ""
        }`}
        style={
          hasTransform
            ? {
                transform: `translateX(${offset}px) rotate(${rotate}deg)`,
                transition: dragging.current
                  ? "none"
                  : "transform 0.35s ease, opacity 0.35s ease",
                opacity: leaving !== null ? 0 : 1,
                touchAction: "pan-y",
              }
            : { touchAction: "pan-y" }
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTransitionEnd={onTransitionEnd}
      >
        <span
          className="swipe-card__badge swipe-card__badge--yes"
          style={{ opacity: intent === true ? overlayOpacity : 0 }}
          aria-hidden="true"
        >
          YES
        </span>
        <span
          className="swipe-card__badge swipe-card__badge--no"
          style={{ opacity: intent === false ? overlayOpacity : 0 }}
          aria-hidden="true"
        >
          NO
        </span>

        <div className="text-uppercase fs-14 fw-500 opacity-75 mb-15">
          {progressLabel}
        </div>
        <p className="swipe-card__text fs-22 fw-500 m0">{text}</p>
      </div>

      <div className="swipe-card__actions d-flex justify-content-center gap-4 mt-40">
        <button
          type="button"
          className="swipe-card__btn swipe-card__btn--no"
          onClick={() => commit(false)}
          disabled={disabled || leaving !== null}
          aria-label="No"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <button
          type="button"
          className="swipe-card__btn swipe-card__btn--yes"
          onClick={() => commit(true)}
          disabled={disabled || leaving !== null}
          aria-label="Yes"
        >
          <i className="fa-solid fa-check"></i>
        </button>
      </div>
    </div>
  );
}
