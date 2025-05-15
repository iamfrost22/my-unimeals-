// Additional JavaScript for UniMeals functionality

// Menu filtering
if (document.querySelector('.menu-filters')) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-grid');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-category');
            
            menuItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'grid';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Order form step navigation
if (document.getElementById('orderForm')) {
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const orderSteps = document.querySelectorAll('.order-process .step');
    
    // Show first step by default
    formSteps[0].classList.add('active');
    orderSteps[0].classList.add('active');
    
    // Next button functionality
    nextButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const currentStep = document.querySelector('.form-step.active');
            const nextStep = button.getAttribute('data-next');
            
            // Validate current step before proceeding
            if (validateStep(currentStep.getAttribute('data-step'))) {
                // Hide current step
                currentStep.classList.remove('active');
                // Show next step
                document.querySelector(`.form-step[data-step="${nextStep}"]`).classList.add('active');
                
                // Update progress steps
                orderSteps.forEach(step => step.classList.remove('active'));
                document.querySelector(`.order-process .step[data-step="${nextStep}"]`).classList.add('active');
                
                // If we're on the review step, update the summary
                if (nextStep === '4') {
                    updateOrderSummary();
                }
            }
        });
    });
    
    // Previous button functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const currentStep = document.querySelector('.form-step.active');
            const prevStep = button.getAttribute('data-prev');
            
            // Hide current step
            currentStep.classList.remove('active');
            // Show previous step
            document.querySelector(`.form-step[data-step="${prevStep}"]`).classList.add('active');
            
            // Update progress steps
            orderSteps.forEach(step => step.classList.remove('active'));
            document.querySelector(`.order-process .step[data-step="${prevStep}"]`).classList.add('active');
        });
    });
    
    // Show room number field if dorm is selected
    const dormSelect = document.getElementById('dorm');
    if (dormSelect) {
        dormSelect.addEventListener('change', function() {
            const roomGroup = document.getElementById('room-group');
            if (this.value && this.value !== 'other') {
                roomGroup.style.display = 'block';
            } else {
                roomGroup.style.display = 'none';
            }
        });
    }
    
    // Payment method toggle
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            document.querySelectorAll('.payment-details').forEach(detail => {
                detail.style.display = 'none';
            });
            document.getElementById(`${this.value}-payment`).style.display = 'block';
        });
    });
    
    // Form submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would send the form data to a server here
            // For this demo, we'll just show the confirmation
            
            // Hide the form
            orderForm.style.display = 'none';
            // Show confirmation
            document.querySelector('.order-confirmation').style.display = 'flex';
            
            // Generate random order number
            document.getElementById('order-number').textContent = Math.floor(Math.random() * 90000) + 10000;
            
            // Get delivery time from form
            const deliveryTime = document.getElementById('delivery-time').value;
            const [hours, minutes] = deliveryTime.split(':');
            let displayTime = '';
            
            if (hours > 12) {
                displayTime = `${hours - 12}:${minutes} PM`;
            } else if (hours == 12) {
                displayTime = `12:${minutes} PM`;
            } else {
                displayTime = `${hours}:${minutes} AM`;
            }
            
            document.getElementById('delivery-time').textContent = displayTime;
            
            // Get email from form
            const email = document.getElementById('email').value;
            document.getElementById('confirmation-email').textContent = email;
        });
    }
    
    // Step validation
    function validateStep(step) {
        let isValid = true;
        
        if (step === '1') {
            // Validate customer info
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const dorm = document.getElementById('dorm');
            
            if (!name.value.trim()) {
                document.getElementById('name-error').textContent = 'Name is required';
                isValid = false;
            }
            
            if (!email.value.trim()) {
                document.getElementById('email-error').textContent = 'Email is required';
                isValid = false;
            } else if (!email.value.includes('@') || !email.value.includes('.edu')) {
                document.getElementById('email-error').textContent = 'Please enter a valid university email';
                isValid = false;
            }
            
            if (!phone.value.trim()) {
                document.getElementById('phone-error').textContent = 'Phone number is required';
                isValid = false;
            } else if (!/^\d{3}-\d{3}-\d{4}$/.test(phone.value)) {
                document.getElementById('phone-error').textContent = 'Please use format: 123-456-7890';
                isValid = false;
            }
            
            if (!dorm.value) {
                document.getElementById('dorm-error').textContent = 'Please select your dorm/building';
                isValid = false;
            }
        } else if (step === '2') {
            // Validate order details
            const orderType = document.getElementById('order-type');
            const deliveryTime = document.getElementById('delivery-time');
            const mealSelected = document.querySelector('input[name="breakfast"]:checked, input[name="lunch"]:checked, input[name="dinner"]:checked');
            
            if (!orderType.value) {
                document.getElementById('order-type-error').textContent = 'Please select an order type';
                isValid = false;
            }
            
            if (!deliveryTime.value) {
                document.getElementById('delivery-time-error').textContent = 'Please select a delivery time';
                isValid = false;
            }
            
            if (!mealSelected) {
                document.getElementById('meals-error').textContent = 'Please select at least one meal';
                isValid = false;
            }
        } else if (step === '4') {
            // Validate terms agreement
            const terms = document.getElementById('terms');
            
            if (!terms.checked) {
                document.getElementById('terms-error').textContent = 'You must agree to the terms';
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Update order summary
    function updateOrderSummary() {
        // Customer info
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const dorm = document.getElementById('dorm');
        const dormText = dorm.options[dorm.selectedIndex].text;
        const room = document.getElementById('room').value;
        const notes = document.getElementById('notes').value;
        
        let deliveryHtml = `
            <p><strong>${name}</strong></p>
            <p>${email}</p>
            <p>${dormText} ${room ? 'Room ' + room : ''}</p>
        `;
        
        if (notes) {
            deliveryHtml += `<p><em>Delivery notes:</em> ${notes}</p>`;
        }
        
        document.getElementById('delivery-summary').innerHTML = deliveryHtml;
        
        // Order items
        const selectedMeals = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const mealCard = checkbox.nextElementSibling;
            const mealName = mealCard.querySelector('h4').textContent;
            const mealPrice = mealCard.querySelector('p').textContent.split(' | ')[0];
            selectedMeals.push({ name: mealName, price: mealPrice });
        });
        
        let itemsHtml = '';
        let subtotal = 0;
        
        selectedMeals.forEach(meal => {
            itemsHtml += `<p>${meal.name} - ${meal.price}</p>`;
            subtotal += parseFloat(meal.price.replace('$', ''));
        });
        
        document.getElementById('order-items-summary').innerHTML = itemsHtml;
        
        // Calculate totals
        const orderType = document.getElementById('order-type').value;
        let deliveryFee = 0;
        
        if (orderType === 'single') {
            deliveryFee = 1.00;
        }
        
        const total = subtotal + deliveryFee;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('delivery-fee').textContent = deliveryFee ? `$${deliveryFee.toFixed(2)}` : 'FREE';
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        
        // Payment method
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        let paymentText = '';
        
        switch(paymentMethod) {
            case 'card':
                paymentText = 'Credit/Debit Card ending in ' + document.getElementById('card-number').value.slice(-4);
                break;
            case 'meal-plan':
                paymentText = 'Campus Meal Plan';
                break;
            case 'venmo':
                paymentText = 'Venmo to ' + document.getElementById('venmo-handle').value;
                break;
        }
        
        document.getElementById('payment-summary').textContent = paymentText;
    }
}

// Feedback form submission
if (document.getElementById('feedbackForm')) {
    const feedbackForm = document.getElementById('feedbackForm');
    
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, you would send the feedback to a server
        // For this demo, we'll just show the thank you message
        
        // Hide the form
        feedbackForm.style.display = 'none';
        // Show thank you message
        document.querySelector('.thank-you-message').style.display = 'flex';
    });
}

// Testimonial slider
if (document.querySelector('.testimonial-slider')) {
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        testimonials[index].classList.add('active');
    }
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonials.length - 1;
        showTestimonial(currentIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
        showTestimonial(currentIndex);
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
        showTestimonial(currentIndex);
    }, 5000);
}

// Update greeting based on meal times
function setGreeting() {
    const hour = new Date().getHours();
    const greetingElement = document.getElementById('greeting');
    
    if (greetingElement) {
        if (hour < 11) {
            greetingElement.textContent = 'Breakfast?';
        } else if (hour < 16) {
            greetingElement.textContent = 'Lunch?';
        } else {
            greetingElement.textContent = 'Dinner?';
        }
    }
}