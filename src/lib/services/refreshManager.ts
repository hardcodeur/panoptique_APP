
export function startProactiveTokenRefresh(): () => void {
    let refreshInterval: NodeJS.Timeout;
    let lastRefresh = Date.now();

    const refreshToken = async () => {
        try {
            const response = await fetch('/api/refresh', { method: 'POST' });
            if (response.ok) {
                lastRefresh = Date.now();
            } else {
                console.error('Proactive token refresh failed. The session might expire.');
            }
        } catch (error) {
            console.error('Error during proactive token refresh:', error);
        }
    };

    const startTimer = () => {
        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = setInterval(refreshToken, 10 * 60 * 1000);
    };

    const stopTimer = () => {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
    };

    const handleVisibilityChange = () => {
        if (document.hidden) {
            stopTimer();
        } else {
            // Refresh only if the last refresh was more than a minute ago
            if (Date.now() - lastRefresh > 60 * 1000) {
                refreshToken();
            }
            startTimer();
        }
    };

    if (typeof window !== 'undefined') {
        startTimer();
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
        if (typeof window !== 'undefined') {
            stopTimer();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
    };
}
