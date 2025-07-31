
/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { startProactiveTokenRefresh } from './refreshManager';

describe('startProactiveTokenRefresh', () => {
    let cleanup: (() => void) | null = null;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));
        Object.defineProperty(document, 'hidden', { value: false, writable: true });
    });

    afterEach(() => {
        if (cleanup) {
            cleanup();
            cleanup = null;
        }
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should start the timer and refresh the token periodically', () => {
        cleanup = startProactiveTokenRefresh();

        // Fast-forward time by 10 minutes
        vi.advanceTimersByTime(10 * 60 * 1000);
        expect(fetch).toHaveBeenCalledWith('/api/refresh', { method: 'POST' });
        expect(fetch).toHaveBeenCalledTimes(1);

        // Fast-forward time by another 10 minutes
        vi.advanceTimersByTime(10 * 60 * 1000);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should stop the timer when the page is hidden', () => {
        cleanup = startProactiveTokenRefresh();
        vi.mocked(fetch).mockClear();

        // Simulate page becoming hidden
        Object.defineProperty(document, 'hidden', { value: true });
        document.dispatchEvent(new Event('visibilitychange'));

        // Fast-forward time
        vi.advanceTimersByTime(10 * 60 * 1000);

        // Fetch should not have been called
        expect(fetch).not.toHaveBeenCalled();
    });

    it('should refresh immediately when page becomes visible after a delay', () => {
        const now = Date.now();
        vi.setSystemTime(now);

        cleanup = startProactiveTokenRefresh();
        vi.mocked(fetch).mockClear();

        // Simulate page becoming hidden
        Object.defineProperty(document, 'hidden', { value: true });
        document.dispatchEvent(new Event('visibilitychange'));

        // Fast-forward time by more than a minute
        vi.advanceTimersByTime(2 * 60 * 1000);

        // Simulate page becoming visible
        Object.defineProperty(document, 'hidden', { value: false });
        document.dispatchEvent(new Event('visibilitychange'));

        // Fetch should have been called immediately
        expect(fetch).toHaveBeenCalledWith('/api/refresh', { method: 'POST' });
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should not refresh immediately if the last refresh was recent', () => {
        cleanup = startProactiveTokenRefresh();
        vi.mocked(fetch).mockClear();

        // Simulate page becoming hidden
        Object.defineProperty(document, 'hidden', { value: true });
        document.dispatchEvent(new Event('visibilitychange'));

        // Fast-forward time by less than a minute
        vi.advanceTimersByTime(30 * 1000);

        // Simulate page becoming visible
        Object.defineProperty(document, 'hidden', { value: false });
        document.dispatchEvent(new Event('visibilitychange'));

        // Fetch should not have been called immediately
        expect(fetch).not.toHaveBeenCalled();
    });


    it('should clean up event listeners and timers', () => {
        const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
        const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

        const localCleanup = startProactiveTokenRefresh();
        localCleanup();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
        expect(clearIntervalSpy).toHaveBeenCalled();
    });
});
