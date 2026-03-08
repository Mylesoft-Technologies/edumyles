"use client";

import { useEffect, useCallback } from "react";

export function useAccessibility() {
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  const handleKeyboardNavigation = useCallback((
    element: HTMLElement,
    onEnter?: () => void,
    onEscape?: () => void,
    onArrowUp?: () => void,
    onArrowDown?: () => void,
    onArrowLeft?: () => void,
    onArrowRight?: () => void
  ) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          onEnter?.();
          break;
        case 'Escape':
          onEscape?.();
          break;
        case 'ArrowUp':
          onArrowUp?.();
          break;
        case 'ArrowDown':
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          onArrowRight?.();
          break;
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    element.setAttribute('tabindex', '0');

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      element.removeAttribute('tabindex');
    };
  }, []);

  const focusManagement = useCallback(() => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusable = Array.from(focusableElements) as HTMLElement[];
        const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
        const nextIndex = e.shiftKey 
          ? (currentIndex - 1 + focusable.length) % focusable.length
          : (currentIndex + 1) % focusable.length;

        focusable[nextIndex]?.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', trapFocus);

    return () => {
      document.removeEventListener('keydown', trapFocus);
    };
  }, []);

  const addAriaLabels = useCallback(() => {
    // Add missing ARIA labels to common elements
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
      const text = button.textContent?.trim();
      if (text && !button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', text);
      }
    });

    // Add proper labels to icon buttons
    const iconButtons = document.querySelectorAll('button i:not([aria-hidden])');
    iconButtons.forEach(button => {
      const icon = button.querySelector('i');
      const text = button.textContent?.trim();
      if (icon && text && !button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', text);
        icon.setAttribute('aria-hidden', 'true');
      }
    });
  }, []);

  useEffect(() => {
    addAriaLabels();
  }, [addAriaLabels]);

  return {
    announceToScreenReader,
    handleKeyboardNavigation,
    focusManagement,
    isScreenReaderActive: () => {
      // Common screen reader detection
      return window.speechSynthesis !== undefined || 
             window.navigator.userAgent.includes('JAWS') ||
             window.navigator.userAgent.includes('NVDA');
    }
  };
}
