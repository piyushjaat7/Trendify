// This file can be used for client-side validation,
// handling form submission, or integrating with payment gateways.
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';

    // --- Check if user is logged in ---
    if (!isLoggedIn) {
        const checkoutContainer = document.querySelector('.checkout-container');
        const orderSummary = document.querySelector('.order-summary');

        if (checkoutContainer && orderSummary) {
            // Hide the order summary
            orderSummary.style.display = 'none';

            // Replace the checkout form with a login prompt
            checkoutContainer.innerHTML = `
                <h1>Please Log In</h1>
                <p style="text-align: center; font-size: 1.1em; margin-bottom: 30px;">You need to be logged in to proceed with your order.</p>
                <a href="index1.html" class="btn" style="display: block; text-align: center; max-width: 200px; margin: 0 auto;">Login Now</a>
            `;
        }
        // Stop the rest of the script from executing
        return;
    }

    // --- Define fields and their validation rules ---
    const fields = [
        { id: 'fullName', name: 'Full Name' },
        { id: 'address1', name: 'Address' },
        { id: 'city', name: 'City' },
        { id: 'state', name: 'State' },
        { id: 'postalCode', name: 'Postal Code' },
        { id: 'country', name: 'Country' },
        { id: 'phone', name: 'Phone Number' },
        { id: 'cardName', name: 'Cardholder Name' },
    ];

    // Fields specific to card payment
    const cardFields = [
        { id: 'cardNumber', name: 'Card Number', pattern: /^[0-9]{13,16}$/, message: 'Enter a valid card number.' },
        { id: 'expiryDate', name: 'Expiry Date', pattern: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/, message: 'Enter a valid date in MM/YY format.' },
        { id: 'cvv', name: 'CVV', pattern: /^[0-9]{3,4}$/, message: 'Enter a valid 3 or 4 digit CVV.' }
    ];

    // Combine all fields for attaching listeners
    const allFields = fields.concat(cardFields);

    // --- Attach real-time validation listeners ---
    addRealTimeValidation();

    populateOrderSummary();
    const checkoutForm = document.getElementById('checkout-form');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission
            if (validateForm()) {
                // In a real application, you would send this data to a backend server
                // for processing (e.g., payment gateway integration, order creation).
                const cart = sessionStorage.getItem('cart');
                if (cart) {
                    sessionStorage.setItem('lastOrderCart', cart); // Temporarily save cart for the thank-you page
                }

                // for processing (e.g., payment gateway integration, order creation).
                console.log('Order placed successfully! (This is a demo, no actual order was processed.)');
                sessionStorage.removeItem('cart'); // Clear cart on successful order
                // Redirect to the thank you page
                window.location.href = 'thank-you.html';
            }
        });
    }

    // Helper function to show an error message
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorDiv = formGroup.querySelector('.error-message');
        input.classList.add('invalid');
        errorDiv.textContent = message;
    }

    // Helper function to clear an error message for a single input
    function clearError(input) {
        const formGroup = input.parentElement;
        const errorDiv = formGroup.querySelector('.error-message');
        input.classList.remove('invalid');
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    }

    // Helper function to clear all error messages
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(errorDiv => {
            errorDiv.textContent = '';
        });
        document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
            input.classList.remove('invalid');
        });
    }

    function validateField(input) {
        const fieldConfig = allFields.find(f => f.id === input.id);
        if (!fieldConfig) return true; // No validation rules for this field

        clearError(input);

        // Required field validation
        if (!input.value.trim()) {
            showError(input, `${fieldConfig.name} is required.`);
            return false;
        }

        // Pattern validation
        if (fieldConfig.pattern && !fieldConfig.pattern.test(input.value)) {
            showError(input, fieldConfig.message || `Please enter a valid ${fieldConfig.name.toLowerCase()}.`);
            return false;
        }

        // Special check for expiry date to ensure it's not in the past
        if (input.id === 'expiryDate' && /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(input.value)) {
            const [month, year] = input.value.split('/');
            const expiryDate = new Date(`20${year}`, month - 1);
            const lastDayOfMonth = new Date(expiryDate.getFullYear(), expiryDate.getMonth() + 1, 0);
            if (lastDayOfMonth < new Date()) {
                showError(input, 'Card has expired.');
                return false;
            }
        }

        return true; // Field is valid
    }

    function addRealTimeValidation() {
        allFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                input.addEventListener('input', () => validateField(input));
            }
        });
    }

    function validateForm() {
        let isFormValid = true;
        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        // Validate common fields
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && !validateField(input)) {
                isFormValid = false;
            }
        });

        // Validate card fields only if 'card' is the selected payment method
        if (selectedPaymentMethod === 'card') {
            cardFields.forEach(field => {
                const input = document.getElementById(field.id);
                if (input && !validateField(input)) isFormValid = false;
            });
        }
        return isFormValid;
    }

    function populateOrderSummary() {
        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const summaryItemsContainer = document.getElementById('summary-items');
        const subtotalEl = document.getElementById('summary-subtotal');
        const totalEl = document.getElementById('summary-total');

        summaryItemsContainer.innerHTML = ''; // Clear previous items

        if (cart.length === 0) {
            summaryItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            subtotalEl.textContent = '$0.00';
            totalEl.textContent = '$0.00';
            return;
        }

        let subtotal = 0;
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('summary-item');
            itemElement.innerHTML = `
                <span class="summary-item-name">${item.name}</span>
                <div class="summary-item-controls">
                    <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                </div>
                <span class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            summaryItemsContainer.appendChild(itemElement);
            subtotal += item.price * item.quantity;
        });

        // Add event listeners to the new quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const action = e.target.dataset.action;
                updateItemQuantity(index, action);
            });
        });

        // For now, shipping is free. This could be a calculated value.
        const shippingCost = 0;
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
    }

    function updateItemQuantity(index, action) {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        if (cart[index]) {
            if (action === 'increase') {
                cart[index].quantity++;
            } else if (action === 'decrease') {
                cart[index].quantity--;
            }
            // Remove item from cart if quantity drops to 0 or less
            cart = cart.filter(item => item.quantity > 0);
            sessionStorage.setItem('cart', JSON.stringify(cart));
            populateOrderSummary(); // Re-render the entire summary
        }
    }
});