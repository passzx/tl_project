document.addEventListener('DOMContentLoaded', () => {

    const productData = [
       { id: 'pop001', category: 'popcorn', name: 'Buttery Classic', description: 'Warm, buttery, and irresistible.', basePrice: 0.99, image: 'images/product_popcorn1.webp', hasSizeSelection: true, hasQuantitySelection: true, detailPage: 'products_A.html' },
       { id: 'pop002', category: 'popcorn', name: 'Caramel Bliss', description: 'Sweet, crunchy caramel coating.', basePrice: 0.99, image: 'images/product_popcorn2.webp', hasSizeSelection: true, hasQuantitySelection: true, detailPage: 'products_A.html' },
       { id: 'pop003', category: 'popcorn', name: 'Spicy Chili', description: 'Popcorn with a kick!', basePrice: 0.99, image: 'images/product_popcorn3.webp', hasSizeSelection: true, hasQuantitySelection: true, detailPage: 'products_A.html' },
       { id: 'pop004', category: 'popcorn', name: 'Cheesy Cheddar', description: 'Savory cheddar cheese flavor.', basePrice: 0.99, image: 'images/product_popcorn4.webp', hasSizeSelection: true, hasQuantitySelection: true, detailPage: 'products_A.html' },
       { id: 'diy001', category: 'diy', name: 'Popcorn Kernel Kit', description: 'Everything you need to pop at home.', basePrice: 0.99, image: 'images/product_diy1.webp', hasSizeSelection: false, hasQuantitySelection: true, detailPage: 'products_B.html' },
       { id: 'diy002', category: 'diy', name: 'Seasoning Sampler', description: 'Variety pack of popcorn seasonings.', basePrice: 0.99, image: 'images/product_diy2.webp', hasSizeSelection: false, hasQuantitySelection: true, detailPage: 'products_C.html' },
   ];

   const mainImage = document.getElementById('gallery-main-image');
   const thumbnailsContainer = document.getElementById('gallery-thumbnails');
   const thumbnails = thumbnailsContainer?.querySelectorAll('.thumbnail');
   const prevButton = document.getElementById('gallery-prev');
   const nextButton = document.getElementById('gallery-next');
   const productNameH1 = document.getElementById('product-name');
   const productDescriptionP = document.getElementById('product-description');
   const productOptionsForm = document.getElementById('product-options-form');
   const flavorSelect = document.getElementById('popcorn-flavor-select');
   const sizeOptionsContainer = productOptionsForm?.querySelector('.size-options');
   const productCurrentPrice = document.getElementById('product-current-price');
   const productQuantityPicker = productOptionsForm?.querySelector('.quantity-picker');
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

    function getProductById(id) {
        return productData.find(product => product.id === id) || null;
    }

    function calculatePrice(product, selectedSizeValue) {
        if (!product) return 0;
        let price = product.basePrice;
        if (product.hasSizeSelection) {
            if (selectedSizeValue === '105oz') price += 0.50;
            else if (selectedSizeValue === '170oz') price += 1.00;
        }
        return price;
    }

    function addToCart(productId, options = {}) {
        const product = getProductById(productId);
        if (!product) { console.error("Product not found:", productId); return; }

        const cart = getCart();
        const quantity = options.quantity || 1;
        let size = options.size || null;
        let pricePerItem;
        let cartItemId;

        if (product.hasSizeSelection) {
            size = options.size || '64oz';
            pricePerItem = calculatePrice(product, size);
            cartItemId = `${product.id}-${size}`;
        } else {
            pricePerItem = product.basePrice;
            size = null;
            cartItemId = product.id;
        }

        if (cart[cartItemId]) {
            cart[cartItemId].quantity += quantity;
        } else {
            cart[cartItemId] = {
                id: product.id,
                name: product.name,
                image: product.image,
                size: size,
                quantity: quantity,
                pricePerItem: pricePerItem,
                isDealComponent: false,
            };
        }
        saveCart(cart);
        console.log('Cart updated:', cart);
        displayConfirmation(`Added ${quantity} x ${product.name} (${size || 'Standard'}) to cart!`);
    }

    const imageSources = thumbnails ? Array.from(thumbnails).map(thumb => thumb.src) : [];
    let currentIndex = 0;

    function updateGallery(index) {
        if (!mainImage || !thumbnails || thumbnails.length === 0 || index < 0 || index >= imageSources.length) {
             return;
        };
        currentIndex = index;
        mainImage.style.opacity = 0;
        setTimeout(() => {
            mainImage.src = imageSources[currentIndex];
            mainImage.alt = thumbnails[currentIndex].alt;
            mainImage.style.opacity = 1;
        }, 150);
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
        });
    }

    thumbnails?.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index, 10);
            if (!isNaN(index)) {
                updateGallery(index);
            }
        });
    });

    prevButton?.addEventListener('click', () => {
        if (imageSources.length > 0) {
            const newIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
            updateGallery(newIndex);
        }
    });

    nextButton?.addEventListener('click', () => {
         if (imageSources.length > 0) {
            const newIndex = (currentIndex + 1) % imageSources.length;
            updateGallery(newIndex);
         }
    });

    if (mainImage && imageSources.length > 0) {
        updateGallery(0);
    } else if (!mainImage) {
        console.error("Main gallery image element not found.");
    } else {
         console.warn("No thumbnail images found or image sources array is empty.");
    }

    const popcornProducts = productData.filter(p => p.category === 'popcorn');
    let selectedProductId = null;

    function populateFlavorSelector() {
        if (!flavorSelect) return;
        flavorSelect.innerHTML = '<option value="">-- Select Flavor --</option>';
        popcornProducts.forEach(p => {
            const option = new Option(p.name, p.id);
            flavorSelect.add(option);
        });
    }

    function updateProductDetails(productId) {
        const product = getProductById(productId);
        if (!product) {
            selectedProductId = null;
            updateDisplayedPrice();
            return;
        }

        selectedProductId = productId;

        if (sizeOptionsContainer) {
            sizeOptionsContainer.style.display = product.hasSizeSelection ? 'block' : 'none';
             if (product.hasSizeSelection) {
                const defaultRadio = sizeOptionsContainer.querySelector('input[value="64oz"]');
                if (defaultRadio) defaultRadio.checked = true;
            }
        }
         if (productQuantityPicker) {
            productQuantityPicker.style.display = product.hasQuantitySelection ? 'flex' : 'none';
            if (productQuantityInput) productQuantityInput.value = 1;
        }

        updateDisplayedPrice();
    }

    function updateDisplayedPrice() {
        if (!productOptionsForm || !productCurrentPrice) return;
        if (!selectedProductId) {
            productCurrentPrice.textContent = "$--.--";
            return;
        }

        const product = getProductById(selectedProductId);
         if (!product) {
             productCurrentPrice.textContent = "$Error";
             return;
         };

        let pricePerItem;
        if (product.hasSizeSelection) {
            const selectedSizeInput = productOptionsForm.querySelector('input[name="size"]:checked');
            const sizeValue = selectedSizeInput ? selectedSizeInput.value : '64oz';
            pricePerItem = calculatePrice(product, sizeValue);
        } else {
             pricePerItem = calculatePrice(product, null);
        }

        const quantity = productQuantityInput ? Math.max(1, parseInt(productQuantityInput.value, 10) || 1) : 1;
        productCurrentPrice.textContent = formatPrice(pricePerItem * quantity);
    }

    flavorSelect?.addEventListener('change', (e) => {
        if (e.target.value) {
            updateProductDetails(e.target.value);
        } else {
             selectedProductId = null;
             if(sizeOptionsContainer) sizeOptionsContainer.style.display = 'none';
             if(productQuantityPicker) productQuantityPicker.style.display = 'none';
             updateDisplayedPrice();
        }
    });

    productOptionsForm?.addEventListener('change', (e) => {
        if (selectedProductId && e.target.name === 'size') {
            updateDisplayedPrice();
        }
    });
    productOptionsForm?.addEventListener('input', (e) => {
        if (selectedProductId && e.target.id === 'product-quantity') {
            if (e.target.value < 1 && e.target.value !== '') e.target.value = 1;
             updateDisplayedPrice();
        }
    });
    productQtyMinus?.addEventListener('click', () => { if (selectedProductId && productQuantityInput && productQuantityInput.value > 1) { productQuantityInput.value--; updateDisplayedPrice(); }});
    productQtyPlus?.addEventListener('click', () => { if (selectedProductId && productQuantityInput) { productQuantityInput.value++; updateDisplayedPrice(); }});

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
         if (!selectedProductId) {
             displayConfirmation("Please select a flavor/item first.");
             if(addToCartMessage) addToCartMessage.className = 'form-message error';
             return;
         }
         const product = getProductById(selectedProductId);
         if (!product) return;

         let options = {
             quantity: 1
         };

         if (product.hasSizeSelection) {
            const selectedSizeInput = productOptionsForm.querySelector('input[name="size"]:checked');
            options.size = selectedSizeInput ? selectedSizeInput.value : '64oz';
         } else {
             options.size = null;
         }

         if (product.hasQuantitySelection && productQuantityInput) {
            const qty = Math.max(1, parseInt(productQuantityInput.value, 10) || 1);
            options.quantity = qty;
         }

         addToCart(selectedProductId, options);
     });

    populateFlavorSelector();
    if(sizeOptionsContainer) sizeOptionsContainer.style.display = 'none';
    if(productQuantityPicker) productQuantityPicker.style.display = 'none';
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