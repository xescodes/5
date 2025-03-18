// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleDarkMode);

    // Expand buttons functionality
    const expandButtons = document.querySelectorAll('.expand-btn');
    expandButtons.forEach(button => {
        button.addEventListener('click', toggleExpandSection);
    });

    // Form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', handleFormSubmit);
});

/**
 * Toggles dark mode on the page
 */
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    const themeToggle = document.getElementById('theme-toggle');
    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = 'Toggle Light Mode';
    } else {
        themeToggle.textContent = 'Toggle Dark Mode';
    }
}

/**
 * Toggles the visibility of the expandable content
 * @param {Event} event - The click event
 */
function toggleExpandSection(event) {
    const targetId = event.currentTarget.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        targetElement.classList.toggle('hidden');
        
        // Update button text
        if (targetElement.classList.contains('hidden')) {
            event.currentTarget.textContent = 'Learn More';
        } else {
            event.currentTarget.textContent = 'Show Less';
        }
    }
}

/**
 * Handles form submission
 * @param {Event} event - The submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Simple validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        alert('Please fill all required fields');
        return;
    }
    
    // Create an object with form data
    const formData = {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value
    };
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formData);
    
    // Show a success message
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset the form
    event.target.reset();
} 