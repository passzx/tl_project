document.addEventListener('DOMContentLoaded', () => {

    const product = {
        id: 'diy001', category: 'diy', name: 'Popcorn Kernel Kit',
        description: 'Everything you need to pop at home.', basePrice: 0.99,
        image: 'images/product_diy1.webp',
        hasSizeSelection: false, hasQuantitySelection: true, detailPage: 'products_B.html'
    };
    const CURRENT_PRODUCT_ID = 'diy001';

    const mainImage = document.getElementById('gallery-main-image');
    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    const thumbnails = thumbnailsContainer?.querySelectorAll('.thumbnail');
    const prevButton = document.getElementById('gallery-prev');
    const nextButton = document.getElementById('gallery-next');
    const productOptionsForm = document.getElementById('product-options-form');
    const productCurrentPrice = document.getElementById('product-current-price');
    const productQuantityInput = document.getElementById('product-quantity');
    const productQtyMinus = document.getElementById('product-qty-minus');
    const productQtyPlus = document.getElementById('product-qty-plus');
    const addToCartMessage = document.getElementById('add-to-cart-message');

    const CART_KEY = 'shoppingCart';

    function getCart() {
        const cartJson = localStorage.getItem(CART_KEY);
        try { return cartJson ? JSON.parse(cartJson) : {}; }
        catch (e) { console.error("Error parsing cart JSON", e); return {}; }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function formatPrice(price) {
        const numericPrice = Number(price);
        if (isNaN(numericPrice)) return "$NaN";
        return `$${numericPrice.toFixed(2)}`;
    }

    function addToCart(productId, options = {}) {
        if (!product) { console.error("Product data missing"); return; }

        const cart = getCart();
        const quantity = options.quantity || 1;
        const pricePerItem = product.basePrice;
        const cartItemId = product.id;

        if (cart[cartItemId]) {
            cart[cartItemId].quantity += quantity;
        } else {
            cart[cartItemId] = {
                id: product.id,
                name: product.name,
                image: product.image,
                size: null,
                quantity: quantity,
                pricePerItem: pricePerItem,
                isDealComponent: false,
            };
        }
        saveCart(cart);
        console.log('Cart updated:', cart);
        displayConfirmation(`Added ${quantity} x ${product.name} to cart!`);
    }

    const galleryImages = ['images/product_diy1.webp', 'images/pB1.webp', 'images/pB2.webp', 'images/pB3.webp', 'images/pB4.webp'];
    let currentIndex = 0;

    function updateGallery(index) {
        if (!mainImage || !thumbnails || thumbnails.length === 0 || index < 0 || index >= galleryImages.length) return;
        currentIndex = index;
        mainImage.style.opacity = 0;
        setTimeout(() => {
            mainImage.src = galleryImages[currentIndex];
            mainImage.alt = `${product.name} - Image ${currentIndex + 1}`;
            mainImage.style.opacity = 1;
        }, 150);
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
        });
    }

    thumbnails?.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index, 10);
            if (!isNaN(index)) updateGallery(index);
        });
    });
    prevButton?.addEventListener('click', () => { if (galleryImages.length > 0) updateGallery((currentIndex - 1 + galleryImages.length) % galleryImages.length); });
    nextButton?.addEventListener('click', () => { if (galleryImages.length > 0) updateGallery((currentIndex + 1) % galleryImages.length); });
    if (mainImage && galleryImages.length > 0) updateGallery(0);

    function updateDisplayedPrice() {
        if (!productCurrentPrice) return;
        if (!product) { productCurrentPrice.textContent = "$Error"; return; };

        const pricePerItem = product.basePrice;
        const quantity = productQuantityInput ? Math.max(1, parseInt(productQuantityInput.value, 10) || 1) : 1;
        productCurrentPrice.textContent = formatPrice(pricePerItem * quantity);
    }

    productOptionsForm?.addEventListener('input', (e) => {
        if (e.target.id === 'product-quantity') {
            if (e.target.value < 1 && e.target.value !== '') e.target.value = 1;
             updateDisplayedPrice();
        }
    });
    productQtyMinus?.addEventListener('click', () => { if (productQuantityInput && productQuantityInput.value > 1) { productQuantityInput.value--; updateDisplayedPrice(); }});
    productQtyPlus?.addEventListener('click', () => { if (productQuantityInput) { productQuantityInput.value++; updateDisplayedPrice(); }});

    function displayConfirmation(message) {
         if (addToCartMessage) {
             addToCartMessage.textContent = message;
             addToCartMessage.className = 'form-message success';
             setTimeout(() => {
                 addToCartMessage.textContent = '';
                 addToCartMessage.className = 'form-message';
             }, 3000);
         } else {
             alert(message);
         }
     }

    productOptionsForm?.addEventListener('submit', (e) => {
         e.preventDefault();

         let options = {
             quantity: 1,
             size: null
         };

         if (product.hasQuantitySelection && productQuantityInput) {
            const qty = Math.max(1, parseInt(productQuantityInput.value, 10) || 1);
            options.quantity = qty;
         }

         addToCart(CURRENT_PRODUCT_ID, options);
     });

    updateDisplayedPrice();
    const reviewForm = document.getElementById('review-form');
    const reviewFormMessage = document.getElementById('review-form-message');

    reviewForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('review-name');
        const commentInput = document.getElementById('review-comment');

        if (nameInput.value.trim() && commentInput.value.trim()) {
            if (reviewFormMessage) {
                reviewFormMessage.textContent = 'Cảm ơn bạn đã gửi nhận xét!';
                reviewFormMessage.className = 'form-message success';
            }
            reviewForm.reset();
            setTimeout(() => {
                if (reviewFormMessage) {
                    reviewFormMessage.textContent = '';
                    reviewFormMessage.className = 'form-message';
                }
            }, 3000);
        } else {
            if (reviewFormMessage) {
                reviewFormMessage.textContent = 'Vui lòng nhập tên và nhận xét của bạn.';
                reviewFormMessage.className = 'form-message error';
            }
        }
    });
});