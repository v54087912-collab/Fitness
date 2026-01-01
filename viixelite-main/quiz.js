document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.quiz-step');
    const progressBar = document.getElementById('progress-fill');
    let currentStep = 0;
    const answers = {};

    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.remove('active');
            if (i === index) step.classList.add('active');
        });

        // Update Progress
        const progress = ((index + 1) / steps.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Handle Option Clicks
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const stepId = e.target.closest('.quiz-step').id;
            const value = e.target.dataset.value;
            const key = e.target.closest('.quiz-step').dataset.key;

            // Save answer
            answers[key] = value;

            // Visual feedback
            e.target.parentNode.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');

            // Auto advance after short delay
            setTimeout(() => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                } else {
                    calculateResult();
                }
            }, 300);
        });
    });

    // Navigation Buttons (Back)
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    function calculateResult() {
        const goal = answers['goal']; // 'lose', 'gain', 'maintain'
        const level = answers['level']; // 'beginner', 'intermediate', 'advanced'

        let redirectUrl = 'plans.html';

        // Logic routing
        if (goal === 'lose') {
            redirectUrl = 'CARDIO.html';
        } else if (goal === 'gain') {
            redirectUrl = 'strength.html';
        } else if (goal === 'endurance') {
            redirectUrl = 'endurance.html';
        }

        // Show loading/analyzing state then redirect
        const container = document.querySelector('.quiz-container');
        container.innerHTML = `
            <h2>Analyzing your profile...</h2>
            <div style="font-size: 3rem;">🔄</div>
            <p>Finding the perfect plan for you.</p>
        `;

        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1500);
    }

    showStep(0);
});
