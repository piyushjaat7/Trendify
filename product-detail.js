document.addEventListener('DOMContentLoaded', () => {
    // A simple "database" of products. In a real application, this would come from a server.
    const products = [
        {
            id: 'classic-denim-jacket',
            name: 'Classic Denim Jacket',
            price: 79.99,
            image: 'denim-jackets.png',
            description: 'A timeless denim jacket that is a must-have for any wardrobe. Made from 100% premium cotton, it offers both comfort and durability. Perfect for layering over a t-shirt or sweater.'
        },
        {
            id: 'striped-cotton-tee',
            name: 'Striped Cotton Tee',
            price: 29.99,
            image: 'striped-cotton-tee.png',
            description: 'A classic striped t-shirt made from soft, breathable cotton. Its versatile design makes it easy to pair with jeans, chinos, or shorts for a casual, stylish look.'
        },
        {
            id: 'leather-ankle-boots',
            name: 'Leather Ankle Boots',
            price: 120.00,
            image: 'leather-ankle-boots.png',
            description: 'Crafted from genuine leather, these ankle boots combine style and comfort. Featuring a sturdy sole and a sleek design, they are perfect for both casual and formal occasions.'
        },
        {
            id: 'minimalist-watch',
            name: 'Minimalist Watch',
            price: 99.50,
            image: 'minimalist-watch.png',
            description: 'An elegant and minimalist watch with a clean dial and a comfortable leather strap. Its understated design makes it a versatile accessory for any outfit.'
        },
        {
            id: 'slim-fit-chinos',
            name: 'Slim Fit Chinos',
            price: 65.00,
            image: 'slim-fit-chinos.png',
            description: 'Modern slim-fit chinos made from a comfortable stretch-cotton blend. A versatile staple that can be dressed up or down for any occasion.'
        },
        {
            id: 'wool-scarf',
            name: 'Wool Scarf',
            price: 35.00,
            image: 'wool-scarf.png',
            description: 'Stay warm and stylish with this soft wool scarf. Its classic design and high-quality material make it an essential accessory for colder weather.'
        },
        {
            id: 'suede-loafers',
            name: 'Suede Loafers',
            price: 85.99,
            image: 'suede-loafers.png',
            description: 'Comfortable and stylish suede loafers, perfect for a smart-casual look. The soft suede and cushioned insole provide all-day comfort.'
        },
        {
            id: 'aviator-sunglasses',
            name: 'Aviator Sunglasses',
            price: 45.50,
            image: 'aviator-sunglasses.png',
            description: 'Classic aviator sunglasses with a lightweight metal frame and UV-protective lenses. A timeless accessory for a cool and confident look.'
        },
        {
            id: 'bohemian-maxi-dress',
            name: 'Bohemian Maxi Dress',
            price: 89.99,
            image: 'bohemian-maxi-dress.png',
            description: 'A flowy and elegant bohemian maxi dress, perfect for summer days and special occasions. Features intricate patterns and a comfortable, lightweight fabric.'
        },
        {
            id: 'canvas-backpack',
            name: 'Canvas Backpack',
            price: 59.99,
            image: 'canvas-backpack.png',
            description: 'A durable and stylish canvas backpack with multiple compartments for all your essentials. Ideal for school, work, or weekend adventures.'
        },
        {
            id: 'knit-beanie',
            name: 'Knit Beanie',
            price: 24.50,
            image: 'knit-beanie.png',
            description: 'A soft and cozy knit beanie to keep you warm during the colder months. A simple, classic design that complements any winter outfit.'
        },
        {
            id: 'vintage-graphic-tee',
            name: 'Vintage Graphic Tee',
            price: 32.00,
            image: 'vintage-graphic-tee.png',
            description: 'A comfortable cotton tee with a retro-inspired graphic print. Gives a cool, worn-in feel for a perfect casual style.'
        }
    ];

    const productDetailContainer = document.getElementById('product-detail-content');
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    const product = products.find(p => p.id === productId);

    if (product) {
        document.title = `${product.name} - Trendify`; // Update page title
        productDetailContainer.innerHTML = `
            <div class="product-image-section">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info-section">
                <h1>${product.name}</h1>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="description">${product.description}</p>
                <button class="btn add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
            </div>
        `;

        // Re-attach event listener for the new "Add to Cart" button
        const addToCartBtn = productDetailContainer.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            // This addItemToCart function is available from script.js and now accepts an ID
            addItemToCart(product.id, product.name, product.price);
        });

    } else {
        productDetailContainer.innerHTML = '<p>Product not found. Please return to the <a href="index.html#shop">shop</a>.</p>';
    }
});
