// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
        // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });
    
    // Download Modal Functionality
    const downloadBtns = document.querySelectorAll('.download-btn');
    const modal = document.getElementById('downloadModal');
    const closeModal = document.querySelector('.close-modal');
    const planNameSpan = document.getElementById('planName');
    const downloadNowBtn = document.getElementById('downloadNow');
    
    let currentPlan = '';
    
    // Open modal when download button is clicked
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentPlan = this.getAttribute('data-plan');
            planNameSpan.textContent = currentPlan;
            modal.style.display = 'flex';
        });
    });
    
    // Close modal when X is clicked
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle download button in modal
    downloadNowBtn.addEventListener('click', function() {
        // In a real application, this would trigger an actual download
        // For this demo, we'll just show an alert
        alert(`Downloading: ${currentPlan}`);
        
        // Close modal after download
        modal.style.display = 'none';
        
        // Reset current plan
        currentPlan = '';
    });
    
    // Category Filtering (if implemented in future)
    const categoryCards = document.querySelectorAll('.category-card');
    const planSections = document.querySelectorAll('.plans-section');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all category cards
            categoryCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked category card
            this.classList.add('active');
            
            // Show/hide plan sections based on category
            planSections.forEach(section => {
                const sectionCategory = section.getAttribute('data-categories');
                
                if (sectionCategory.includes(category) || category === 'all') {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
            
            // Scroll to plans section
            document.getElementById('plans-container').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Add "All" category functionality
    const allCategoryCard = document.createElement('div');
    allCategoryCard.className = 'category-card active';
    allCategoryCard.setAttribute('data-category', 'all');
    allCategoryCard.innerHTML = `
        <div class="category-icon">
            <i class="fas fa-list"></i>
        </div>
        <h3>All Plans</h3>
        <p>Browse all our fitness plans</p>
    `;
    
    // Insert "All" category at the beginning
    const categoryGrid = document.querySelector('.category-grid');
    categoryGrid.insertBefore(allCategoryCard, categoryGrid.firstChild);
    
    // Add click event to the "All" category
    allCategoryCard.addEventListener('click', function() {
        // Remove active class from all category cards
        categoryCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to "All" category
        this.classList.add('active');
        
        // Show all plan sections
        planSections.forEach(section => {
            section.style.display = 'block';
        });
    });
});