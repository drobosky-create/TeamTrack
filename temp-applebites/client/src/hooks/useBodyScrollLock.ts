import { useEffect } from 'react';

/**
 * Custom hook for locking/unlocking body scroll on mobile devices
 * Prevents background scroll when mobile drawer/modal is open
 * Handles iOS Safari properly with position: fixed technique
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    // Get current scroll position
    const scrollY = window.scrollY;
    
    // Store original body styles
    const original = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      overscrollBehavior: document.body.style.overscrollBehavior,
    };

    // Apply iOS-safe scroll lock
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'contain';

    // Cleanup function to restore original state
    return () => {
      document.body.style.position = original.position;
      document.body.style.top = original.top;
      document.body.style.width = original.width;
      document.body.style.overflow = original.overflow;
      document.body.style.overscrollBehavior = original.overscrollBehavior;
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}