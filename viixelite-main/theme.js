document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle-btn');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme == 'light') {
        document.body.setAttribute('data-theme', 'light');
    } else {
        // Default is dark (no attribute or explicit 'dark')
        document.body.removeAttribute('data-theme');
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            let theme = document.body.getAttribute('data-theme');
            if (theme === 'light') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});
