document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('challenge-grid');
    const progressText = document.getElementById('progress-text');
    const resetBtn = document.getElementById('reset-challenge');

    // Generate 30 days
    const totalDays = 30;

    // Load state
    let completedDays = JSON.parse(localStorage.getItem('challengeProgress')) || [];

    function renderGrid() {
        grid.innerHTML = '';
        completedDays.forEach(day => {
             // clean up duplicates or invalid data if any
        });

        for (let i = 1; i <= totalDays; i++) {
            const dayCard = document.createElement('div');
            dayCard.classList.add('day-card');
            if (completedDays.includes(i)) {
                dayCard.classList.add('completed');
            }

            dayCard.innerHTML = `
                <h3>Day ${i}</h3>
                <p>${getDayActivity(i)}</p>
                <div class="status-check">✓</div>
            `;

            dayCard.addEventListener('click', () => toggleDay(i));
            grid.appendChild(dayCard);
        }
        updateProgress();
    }

    function getDayActivity(day) {
        // Simple rotation for demo
        const activities = ['Cardio', 'Upper Body', 'Rest', 'Lower Body', 'Core', 'Active Rest'];
        return activities[(day - 1) % activities.length];
    }

    function toggleDay(day) {
        if (completedDays.includes(day)) {
            completedDays = completedDays.filter(d => d !== day);
        } else {
            completedDays.push(day);
        }
        localStorage.setItem('challengeProgress', JSON.stringify(completedDays));
        renderGrid();
    }

    function updateProgress() {
        const percent = Math.round((completedDays.length / totalDays) * 100);
        progressText.textContent = `${percent}% Completed`;
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset your progress?')) {
                completedDays = [];
                localStorage.setItem('challengeProgress', JSON.stringify([]));
                renderGrid();
            }
        });
    }

    renderGrid();
});
