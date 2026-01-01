document.addEventListener('DOMContentLoaded', () => {
    // BMI Calculator
    const bmiBtn = document.getElementById('calculate-bmi');
    if (bmiBtn) {
        bmiBtn.addEventListener('click', calculateBMI);
    }

    // BMR Calculator
    const bmrBtn = document.getElementById('calculate-bmr');
    if (bmrBtn) {
        bmrBtn.addEventListener('click', calculateBMR);
    }

    // Water Tracker
    initWaterTracker();
});

function calculateBMI() {
    const height = parseFloat(document.getElementById('bmi-height').value);
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const resultBox = document.getElementById('bmi-result');
    const resultValue = resultBox.querySelector('.result-value');
    const resultDesc = resultBox.querySelector('.result-desc');

    if (!height || !weight) {
        alert('Please enter both height and weight.');
        return;
    }

    // Height in meters
    const hM = height / 100;
    const bmi = (weight / (hM * hM)).toFixed(1);

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 24.9) category = 'Normal Weight';
    else if (bmi < 29.9) category = 'Overweight';
    else category = 'Obese';

    resultValue.textContent = bmi;
    resultDesc.textContent = `You are in the ${category} range.`;
    resultBox.classList.add('active');
}

function calculateBMR() {
    const weight = parseFloat(document.getElementById('bmr-weight').value);
    const height = parseFloat(document.getElementById('bmr-height').value);
    const age = parseInt(document.getElementById('bmr-age').value);
    const gender = document.getElementById('bmr-gender').value;
    const resultBox = document.getElementById('bmr-result');
    const resultValue = resultBox.querySelector('.result-value');
    const resultDesc = resultBox.querySelector('.result-desc');

    if (!weight || !height || !age) {
        alert('Please fill in all fields.');
        return;
    }

    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);

    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    resultValue.textContent = Math.round(bmr) + ' kcal';
    resultDesc.textContent = 'Daily calories needed to maintain weight at rest.';
    resultBox.classList.add('active');
}

function initWaterTracker() {
    const weightInput = document.getElementById('water-weight');
    const calculateBtn = document.getElementById('calculate-water');
    const addBtn = document.getElementById('add-glass');
    const resetBtn = document.getElementById('reset-water');
    const fillEl = document.getElementById('water-fill');
    const currentEl = document.getElementById('current-water');
    const goalEl = document.getElementById('water-goal');

    let goal = 2500; // Default ml
    let current = 0;

    // Load from local storage
    const saved = JSON.parse(localStorage.getItem('waterTracker'));
    if (saved) {
        // Reset if it's a new day
        const today = new Date().toDateString();
        if (saved.date !== today) {
            current = 0;
        } else {
            current = saved.current;
            goal = saved.goal;
        }
    }

    updateDisplay();

    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const weight = parseFloat(weightInput.value);
            if (weight) {
                // Approx 35ml per kg
                goal = Math.round(weight * 35);
                saveState();
                updateDisplay();
            }
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            current += 250; // 250ml per glass
            if (current > goal) current = goal;
            saveState();
            updateDisplay();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            current = 0;
            saveState();
            updateDisplay();
        });
    }

    function updateDisplay() {
        if (goalEl) goalEl.textContent = `${goal} ml`;
        if (currentEl) currentEl.textContent = `${current} ml`;

        const percentage = Math.min(100, (current / goal) * 100);
        if (fillEl) fillEl.style.height = `${percentage}%`;
    }

    function saveState() {
        const state = {
            date: new Date().toDateString(),
            current: current,
            goal: goal
        };
        localStorage.setItem('waterTracker', JSON.stringify(state));
    }
}
