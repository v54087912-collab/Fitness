// script.js
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const planCards = document.querySelectorAll('.plan-card');

    // Filter by category
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter cards
            planCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-categories').includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Plan modal functionality
    const viewPlanButtons = document.querySelectorAll('.view-plan-btn');
    const planModal = document.getElementById('planModal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modalTitle');
    const mealPlanContent = document.getElementById('mealPlanContent');
    const daySelector = document.querySelector('.day-selector');

    // Sample meal plans data
    const mealPlans = {
        'weight-loss-veg': {
            title: '21-Day Weight Loss (Vegetarian)',
            days: 21,
            meals: {
                1: {
                    breakfast: 'Oats porridge with fruits and nuts',
                    snack1: 'Apple with peanut butter',
                    lunch: 'Vegetable pulao with raita',
                    snack2: 'Green tea with roasted chana',
                    dinner: 'Dal with roti and vegetable salad'
                },
                2: {
                    breakfast: 'Poha with vegetables',
                    snack1: 'Yogurt with berries',
                    lunch: 'Paneer bhurji with roti',
                    snack2: 'Fruit salad',
                    dinner: 'Mixed vegetable curry with brown rice'
                }
            }
        },
        'keto-fat-burn': {
            title: 'Keto Fat Burn (Non-Vegetarian)',
            days: 30,
            meals: {
                1: {
                    breakfast: 'Egg omelette with cheese and vegetables',
                    snack1: 'Handful of almonds',
                    lunch: 'Grilled chicken with green vegetables',
                    snack2: 'Greek yogurt',
                    dinner: 'Fish curry with cauliflower rice'
                },
                2: {
                    breakfast: 'Bulletproof coffee with butter',
                    snack1: 'Cheese slices',
                    lunch: 'Chicken salad with olive oil dressing',
                    snack2: 'Peanut butter',
                    dinner: 'Mutton curry with sautéed vegetables'
                }
            }
        },
        'plant-based-cleanse': {
            title: 'Plant-Based Cleanse (Vegan)',
            days: 14,
            meals: {
                1: {
                    breakfast: 'Smoothie bowl with fruits and seeds',
                    snack1: 'Mixed nuts',
                    lunch: 'Quinoa salad with vegetables',
                    snack2: 'Fruit platter',
                    dinner: 'Lentil soup with gluten-free bread'
                }
            }
        },
        'muscle-building': {
            title: 'Muscle Building (Non-Vegetarian)',
            days: 60,
            meals: {
                1: {
                    breakfast: '6 egg whites with whole wheat toast',
                    snack1: 'Protein shake',
                    lunch: 'Grilled chicken with brown rice',
                    snack2: 'Greek yogurt with honey',
                    dinner: 'Fish with sweet potato and greens'
                }
            }
        },
        // You can add other plans similarly...
        'veg-keto': {
            title: 'Vegetarian Keto',
            days: 28,
            meals: {
                1: {
                    breakfast: 'Greek yogurt with seeds',
                    snack1: 'Cheese cubes',
                    lunch: 'Paneer salad with avocado',
                    snack2: 'Olives and nuts',
                    dinner: 'Stir-fried tofu with vegetables'
                }
            }
        },
        'complete-vegan': {
            title: 'Complete Vegan Nutrition',
            days: 90,
            meals: {
                1: {
                    breakfast: 'Tofu scramble with vegetables',
                    snack1: 'Fruit and nut mix',
                    lunch: 'Lentil and quinoa bowl',
                    snack2: 'Smoothie',
                    dinner: 'Chickpea curry with brown rice'
                }
            }
        },
        'high-protein': {
            title: 'High Protein Diet',
            days: 45,
            meals: {
                1: {
                    breakfast: 'Egg white omelette',
                    snack1: 'Protein bar',
                    lunch: 'Chicken breast with veggies',
                    snack2: 'Cottage cheese',
                    dinner: 'Grilled fish with salad'
                }
            }
        },
        'weight-maintenance': {
            title: 'Weight Maintenance',
            days: 120,
            meals: {
                1: {
                    breakfast: 'Poha with peanuts',
                    snack1: 'Fruit',
                    lunch: 'Mixed dal with roti',
                    snack2: 'Buttermilk',
                    dinner: 'Grilled veggies with paneer'
                }
            }
        }
    };

    // Open modal when view plan button is clicked
    viewPlanButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planId = this.getAttribute('data-plan');
            const plan = mealPlans[planId];

            if (plan) {
                modalTitle.textContent = plan.title;

                // Generate day buttons (limit visible buttons to 7 for quick view)
                daySelector.innerHTML = '';
                for (let i = 1; i <= Math.min(plan.days, 7); i++) {
                    const dayButton = document.createElement('button');
                    dayButton.className = i === 1 ? 'day-btn active' : 'day-btn';
                    dayButton.textContent = `Day ${i}`;
                    dayButton.setAttribute('data-day', i);
                    dayButton.addEventListener('click', function() {
                        document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                        displayMealPlan(plan.meals[i] || plan.meals[1]);
                    });
                    daySelector.appendChild(dayButton);
                }

                // Display first day's meals
                displayMealPlan(plan.meals[1]);

                // Show modal
                planModal.style.display = 'block';
            } else {
                // Default plan if specific plan not found
                modalTitle.textContent = 'Diet Plan Details';
                displayDefaultMealPlan();
                planModal.style.display = 'block';
            }
        });
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        planModal.style.display = 'none';
    });

    // Close modal when clicking outside modal-content
    window.addEventListener('click', function(event) {
        if (event.target === planModal) {
            planModal.style.display = 'none';
        }
    });

    // Function to display meal plan
    function displayMealPlan(meals) {
        if (!meals) {
            displayDefaultMealPlan();
            return;
        }

        mealPlanContent.innerHTML = `
            <div class="meal-time">
                <h4>Breakfast</h4>
                <p>${meals.breakfast}</p>
            </div>
            <div class="meal-time">
                <h4>Morning Snack</h4>
                <p>${meals.snack1}</p>
            </div>
            <div class="meal-time">
                <h4>Lunch</h4>
                <p>${meals.lunch}</p>
            </div>
            <div class="meal-time">
                <h4>Evening Snack</h4>
                <p>${meals.snack2}</p>
            </div>
            <div class="meal-time">
                <h4>Dinner</h4>
                <p>${meals.dinner}</p>
            </div>
        `;
    }

    // Default meal plan display
    function displayDefaultMealPlan() {
        mealPlanContent.innerHTML = `
            <div class="meal-time">
                <h4>Breakfast</h4>
                <p>Choose a balanced breakfast with proteins and complex carbs</p>
            </div>
            <div class="meal-time">
                <h4>Morning Snack</h4>
                <p>Fruits, nuts, or yogurt for sustained energy</p>
            </div>
            <div class="meal-time">
                <h4>Lunch</h4>
                <p>Balanced meal with protein, vegetables, and healthy carbs</p>
            </div>
            <div class="meal-time">
                <h4>Evening Snack</h4>
                <p>Light snack to keep metabolism active</p>
            </div>
            <div class="meal-time">
                <h4>Dinner</h4>
                <p>Lighter meal focusing on protein and vegetables</p>
            </div>
            <p style="margin-top: 1rem; color: var(--accent); font-style: italic;">
                Full detailed meal plan coming soon!
            </p>
        `;
    }
});
