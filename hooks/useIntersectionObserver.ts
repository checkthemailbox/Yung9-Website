import { useState, useEffect, RefObject } from 'react';

interface IntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0.1, // Default threshold
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false, // Option to stop observing after visible
  }: IntersectionObserverOptions = {}, // Default options object
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const node = elementRef.current; // Get the current DOM node
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || !node) { // If no node or no IO support, do nothing
      return;
    }
    
    // If the entry is already frozen (was visible and freezeOnceVisible is true),
    // do not re-observe. The cleanup from a previous effect run would have disconnected.
    if (frozen) {
      return;
    }

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => {
      // It's important to unobserve the specific node
      observer.unobserve(node);
      // Disconnect the observer entirely when the component unmounts or dependencies change
      observer.disconnect();
    };

  // Dependencies updated to include elementRef.current.
  // This ensures the effect re-runs if the actual DOM element changes.
  // JSON.stringify(threshold) is used because threshold can be an array.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef.current, JSON.stringify(threshold), root, rootMargin, frozen, freezeOnceVisible, elementRef]);
  // Added `elementRef` back to ensure if the ref object itself somehow changes (less common), it also triggers.
  // `elementRef.current` is the primary addition for this fix.

  return entry;
}

export default useIntersectionObserver;