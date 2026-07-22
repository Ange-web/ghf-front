import '@testing-library/jest-dom';

// jsdom does not implement IntersectionObserver, which framer-motion's
// `whileInView` relies on. Provide a minimal stub so components using it
// (EventCard, TestimonialCard, ...) can render in tests.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = global.IntersectionObserver || MockIntersectionObserver;

// jsdom does not implement matchMedia either, used by some UI libs
// (next-themes, framer-motion reduced-motion checks, Radix UI...).
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
