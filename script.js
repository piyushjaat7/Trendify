console.log("Welcome to Trendify!");

// --- Theme (Day/Night Mode) Functionality ---
// This is placed outside DOMContentLoaded to run immediately and prevent theme flashing.
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const currentTheme = localStorage.getItem('theme');

// Function to apply the theme
const applyTheme = (theme) => {
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    } else {
        document.body.classList.remove('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
};

// Apply the saved theme on initial page load
applyTheme(currentTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

// --- Global Cart Functionality ---
// We define these functions in the global scope so they can be called from other scripts like product-detail.js

// Load cart from sessionStorage or initialize as an empty array
let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

function addItemToCart(id, name, price, quantity = 1) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const item = {
            id: id,
            name: name,
            price: price,
            quantity: quantity
        };
        cart.push(item);
    }
    updateCart();
}

function updateCart() {
    // Save cart to sessionStorage
    const cartToSave = cart.filter(item => item.quantity > 0);
    sessionStorage.setItem('cart', JSON.stringify(cartToSave));

    // The rest of the update logic will run inside DOMContentLoaded
    // to ensure the elements are available.
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}


document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // --- Login & Logout Functionality ---
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const profileLink = document.getElementById('profile-link');
    const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';

    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline'; // Or 'block' depending on your CSS
        profileLink.style.display = 'inline';
    } else {
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
        profileLink.style.display = 'none';
    }

    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('loggedIn');
        window.location.href = 'index1.html'; // Redirect to the lamp login page
    });

    // --- Welcome Message Functionality ---
    const welcomeMessage = document.getElementById('welcome-message');
    if (isLoggedIn && welcomeMessage) {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user && (user.firstName || user.username)) {
            const heroTitle = document.querySelector('.hero-content h1');
            welcomeMessage.textContent = `Welcome, ${user.firstName || user.username}!`;
            welcomeMessage.style.display = 'block';
            // Optional: Change the main title as well
            if(heroTitle) heroTitle.textContent = "Your Fashion Journey Continues";
        }
    }

    // --- Cart Functionality ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountElement = document.getElementById('cart-count');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartBtn = document.getElementById('cart-btn');

    // Event listener for buttons on the main shop page
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            addItemToCart(id, name, price);
        });
    });

    function removeItemFromCart(itemId) {
        // itemId is the product name (our unique identifier)
        cart = cart.filter(item => item.id !== itemId.toString());
        updateCart();
    }

    function updateItemQuantity(itemId, action) {
        const item = cart.find(item => item.id === itemId.toString());
        if (item) {
            if (action === 'increase') {
                item.quantity++;
            } else if (action === 'decrease' && item.quantity > 0) {
                item.quantity--;
            } else if (action === 'set') {
                const newQuantity = arguments[2]; // Get the third argument
                item.quantity = newQuantity > 0 ? newQuantity : 0;
            }
        }
        updateCart(); // This will handle removing the item if quantity is 0
    }

    function renderCart() {
        // Update cart count in header (total number of items)
        if(cartCountElement) cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update items in sidebar
        cartItemsContainer.innerHTML = ''; // Clear current items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="0" data-id="${item.id}" aria-label="Item quantity">
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                        <button class="remove-item-btn" data-id="${item.id}" title="Remove item"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }

        // Add event listeners to new "remove" and "quantity" buttons
        cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                removeItemFromCart(itemId);
            });
        });

        cartItemsContainer.querySelectorAll('.cart-item-controls .quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                const action = e.target.dataset.action;
                updateItemQuantity(itemId, action);
            });
        });

        cartItemsContainer.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const itemId = e.target.dataset.id;
                const newQuantity = parseInt(e.target.value, 10);
                // Use the 'set' action we created
                updateItemQuantity(itemId, 'set', newQuantity);
            });
        });

        // Update total price
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }    

    // Listen for the custom event to re-render the cart UI
    document.addEventListener('cartUpdated', renderCart);

    // Initial cart update on page load
    renderCart();
    
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }

    // --- Header Icon Functionality (Placeholder) ---
    const searchBtn = document.getElementById('search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevents jumping to top of page
            alert('Search functionality coming soon!');
        });
    }

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }

    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // --- Product Search/Filter Functionality ---
    const searchInput = document.getElementById('product-search');
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchInput) {
        const productCards = document.querySelectorAll('.product-card');
        const noProductsMessage = document.getElementById('no-products-message');

        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            let visibleProductsCount = 0;

            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    card.style.display = 'flex'; // Use flex to respect the card layout
                    visibleProductsCount++;
                } else {
                    card.style.display = 'none'; // Hide non-matching cards
                }
            });

            if (noProductsMessage) {
                // Show or hide the "No products found" message
                if (visibleProductsCount === 0 && searchTerm !== '') {
                    noProductsMessage.style.display = 'block';
                } else {
                    noProductsMessage.style.display = 'none';
                }
            }
        };

        searchInput.addEventListener('input', performSearch);

        if (searchIcon) searchIcon.addEventListener('click', performSearch);
    }

    // --- Mobile Navigation Toggle ---
    const menuBtn = document.getElementById('menu-btn');
    const navigation = document.querySelector('.navigation');

    if (menuBtn && navigation) {
        menuBtn.addEventListener('click', () => {
            navigation.classList.toggle('active');
            menuBtn.classList.toggle('fa-times'); // Optional: change icon to an 'X'
        });
    }

    // --- Back to Top Button Functionality ---
    const backToTopBtn = document.getElementById('back-to-top-btn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Initialize Product Detail Page Logic ---
    if (typeof initializeProductDetailPage === 'function') {
        initializeProductDetailPage();
    }
});