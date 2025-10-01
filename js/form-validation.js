// Form Validation and Contact Form Handler
(function () {
    'use strict';

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Phone validation regex (supports international formats)
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

    // Form validation function
    function validateForm(formElement) {
        let isValid = true;
        const errors = [];

        // Get form fields
        const nameField = formElement.querySelector('[name="name"]');
        const emailField = formElement.querySelector('[name="email"]');
        const phoneField = formElement.querySelector('[name="phone"]');
        const subjectField = formElement.querySelector('[name="subject"]');
        const messageField = formElement.querySelector('[name="message"]');

        // Clear previous errors
        formElement.querySelectorAll('.error-message').forEach(el => el.remove());
        formElement.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        // Validate name
        if (nameField && (!nameField.value.trim() || nameField.value.trim().length < 2)) {
            isValid = false;
            errors.push({ field: nameField, message: 'Please enter a valid name (at least 2 characters).' });
        }

        // Validate email
        if (emailField && !emailRegex.test(emailField.value.trim())) {
            isValid = false;
            errors.push({ field: emailField, message: 'Please enter a valid email address.' });
        }

        // Validate phone (optional but if provided must be valid)
        if (phoneField && phoneField.value.trim() && !phoneRegex.test(phoneField.value.trim())) {
            isValid = false;
            errors.push({ field: phoneField, message: 'Please enter a valid phone number.' });
        }

        // Validate subject
        if (subjectField && !subjectField.value.trim()) {
            isValid = false;
            errors.push({ field: subjectField, message: 'Please enter a subject.' });
        }

        // Validate message
        if (messageField && (!messageField.value.trim() || messageField.value.trim().length < 10)) {
            isValid = false;
            errors.push({ field: messageField, message: 'Please enter a message (at least 10 characters).' });
        }

        // Display errors
        errors.forEach(error => {
            error.field.classList.add('is-invalid');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-danger small mt-1';
            errorDiv.textContent = error.message;
            error.field.parentNode.appendChild(errorDiv);
        });

        return isValid;
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(notification);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 150);
        }, 5000);
    }

    // Handle form submission
    function handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('[type="submit"]');
        
        // Validate form
        if (!validateForm(form)) {
            showNotification('Please fix the errors in the form.', 'danger');
            return;
        }

        // Disable submit button
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Success simulation
            showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            form.reset();
            
            // Re-enable button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;

            // Optional: Send to actual backend
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(result => {
            //     showNotification('Thank you! Your message has been sent successfully.', 'success');
            //     form.reset();
            // })
            // .catch(error => {
            //     showNotification('Oops! Something went wrong. Please try again.', 'danger');
            // })
            // .finally(() => {
            //     submitButton.disabled = false;
            //     submitButton.innerHTML = originalButtonText;
            // });
            
        }, 1500);
    }

    // Real-time validation
    function setupRealTimeValidation(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            field.addEventListener('blur', function() {
                // Remove previous error
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
                this.classList.remove('is-invalid');

                // Validate based on field type
                let isValid = true;
                let errorMessage = '';

                if (this.hasAttribute('required') && !this.value.trim()) {
                    isValid = false;
                    errorMessage = 'This field is required.';
                } else if (this.type === 'email' && this.value.trim() && !emailRegex.test(this.value.trim())) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                } else if (this.type === 'tel' && this.value.trim() && !phoneRegex.test(this.value.trim())) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number.';
                } else if (this.tagName === 'TEXTAREA' && this.value.trim().length > 0 && this.value.trim().length < 10) {
                    isValid = false;
                    errorMessage = 'Please enter at least 10 characters.';
                }

                if (!isValid) {
                    this.classList.add('is-invalid');
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message text-danger small mt-1';
                    errorDiv.textContent = errorMessage;
                    this.parentNode.appendChild(errorDiv);
                }
            });

            // Remove error on input
            field.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                    const errorMsg = this.parentNode.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
        });
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        // Find all contact forms
        const contactForms = document.querySelectorAll('form[name="contactForm"], .contact-form, #contactForm');
        
        contactForms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
            setupRealTimeValidation(form);
        });

        // Add floating label effect
        const formInputs = document.querySelectorAll('.form-floating input, .form-floating textarea');
        formInputs.forEach(input => {
            if (input.value) {
                input.classList.add('has-value');
            }
            
            input.addEventListener('input', function() {
                if (this.value) {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });
        });
    });

    // Export for use in other scripts
    window.FormValidator = {
        validate: validateForm,
        showNotification: showNotification
    };
})();
