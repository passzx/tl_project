document.addEventListener('DOMContentLoaded', () => {

    const productData = [
        { id: 'deal001', category: 'deals', name: 'Night For 2', description: 'Gói bao gồm: 2x Bắp rang 105oz (chọn vị) + 1x Nước 42oz (chọn loại).', basePrice: 2.99, image: 'images/deal_night.webp', hasSizeSelection: false, hasQuantitySelection: false, hasPopcornChoice: true, hasDrinkChoice: true, popcornCount: 2, popcornSize: '105oz', drinkCount: 1, drinkSize: '42oz' },
        { id: 'deal002', category: 'deals', name: 'Solo Watcher', description: 'Gói bao gồm: 1x Bắp rang 105oz (chọn vị) + 1x Nước 30oz (chọn loại).', basePrice: 1.99, image: 'images/deal_solo.webp', hasSizeSelection: false, hasQuantitySelection: false, hasPopcornChoice: true, hasDrinkChoice: true, popcornCount: 1, popcornSize: '105oz', drinkCount: 1, drinkSize: '30oz' },
        { id: 'deal003', category: 'deals', name: 'Seasoned Popcorn Maker', description: 'Gói bao gồm: 1x Bộ Hạt Bắp + 1x Bộ Gia Vị Thử.', basePrice: 1.49, image: 'images/deal_diy.webp', hasSizeSelection: false, hasQuantitySelection: true, hasPopcornChoice: false, hasDrinkChoice: false },
        { id: 'pop001', category: 'popcorn', name: 'Buttery Classic', description: 'Ấm áp, béo ngậy mùi bơ, không thể cưỡng lại.', basePrice: 0.99, image: 'images/product_popcorn1.webp', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'pop002', category: 'popcorn', name: 'Caramel Bliss', description: 'Lớp phủ caramen ngọt ngào, giòn tan.', basePrice: 0.99, image: 'images/product_popcorn2.webp', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'pop003', category: 'popcorn', name: 'Spicy Chili', description: 'Bắp rang bơ với một cú hích cay nồng!', basePrice: 0.99, image: 'images/product_popcorn3.webp', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'pop004', category: 'popcorn', name: 'Cheesy Cheddar', description: 'Hương vị phô mai cheddar đậm đà.', basePrice: 0.99, image: 'images/product_popcorn4.webp', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'drk001', category: 'drinks', name: 'Coca-Cola', description: 'Sự sảng khoái sủi bọt tiêu chuẩn.', basePrice: 0.75, image: 'images/product_drink1.webp', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'drk002', category: 'drinks', name: 'Lipton Iced Tea', description: 'Trà đá cổ điển sảng khoái.', basePrice: 0.75, image: 'images/product_drink2.webp', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'drk003', category: 'drinks', name: 'Tropicana Twister', description: 'Vitamin C tươi vắt.', basePrice: 0.75, image: 'images/product_drink3.webp', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'drk004', category: 'drinks', name: 'Aquafina', description: 'Sự hydrat hóa tinh khiết và đơn giản.', basePrice: 0.75, image: 'images/product_drink4.webp', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'diy001', category: 'diy', name: 'Popcorn Kernel Kit', description: 'Mọi thứ bạn cần để tự nổ bắp tại nhà.', basePrice: 0.99, image: 'images/product_diy1.webp', hasSizeSelection: false, hasQuantitySelection: true },
        { id: 'diy002', category: 'diy', name: 'Seasoning Sampler', description: 'Gói tổng hợp các loại gia vị bắp rang bơ.', basePrice: 0.99, image: 'images/product_diy2.webp', hasSizeSelection: false, hasQuantitySelection: true },
    ];

    const cartItemsDetailedList = document.getElementById('cart-items-detailed-list');
    const cartDetailedEmptyMessage = document.getElementById('cart-detailed-empty-message');
    const suggestionsList = document.getElementById('suggestions-list');
    const checkoutBtnDetailed = document.getElementById('checkout-btn-detailed');

    const cartSubtotalPriceDetailed = document.getElementById('cart-subtotal-price-detailed');
    const cartTotalPriceDetailed = document.getElementById('cart-total-price-detailed');
    const discountCodeInput = document.getElementById('discount-code-input');
    const applyDiscountBtn = document.getElementById('apply-discount-btn');
    const discountMessage = document.getElementById('discount-message');
    const discountRow = document.querySelector('.discount-row');
    const cartDiscountAmountDetailed = document.getElementById('cart-discount-amount-detailed');
    
    const paypalCheckoutBtn = document.getElementById('paypal-checkout-btn');

    const CART_KEY = 'shoppingCart';
    let currentDiscountPercent = 0;

    function getCart() {
        const cartJson = localStorage.getItem(CART_KEY);
        try { return cartJson ? JSON.parse(cartJson) : {}; }
        catch (e) { console.error("Lỗi phân tích JSON của giỏ hàng", e); return {}; }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function formatPrice(price) {
        const numericPrice = Number(price);
        if (isNaN(numericPrice)) {
            return "$NaN";
        }
        return `$${numericPrice.toFixed(2)}`;
    }

    function getProductById(id) {
        return productData.find(product => product.id === id) || null;
    }

    function updateCartTotalDetailed() {
        const cart = getCart();
        let subtotal = 0;
        for (const cartItemId in cart) {
            const item = cart[cartItemId];
            const price = Number(item.pricePerItem) || 0;
            const quantity = Number(item.quantity) || 0;
            subtotal += price * quantity;
        }

        const discountAmount = subtotal * currentDiscountPercent;
        const total = subtotal - discountAmount;

        if (cartSubtotalPriceDetailed) {
            cartSubtotalPriceDetailed.textContent = formatPrice(subtotal);
        }

        if (discountRow && cartDiscountAmountDetailed) {
            if (discountAmount > 0) {
                cartDiscountAmountDetailed.textContent = `-${formatPrice(discountAmount)}`;
                discountRow.style.display = 'flex';
            } else {
                discountRow.style.display = 'none';
            }
        }
        
        if (cartTotalPriceDetailed) {
            cartTotalPriceDetailed.textContent = formatPrice(total);
        }
    }

    function renderDetailedCart() {
        if (!cartItemsDetailedList || !cartDetailedEmptyMessage) {
            console.error("Không tìm thấy danh sách giỏ hàng hoặc phần tử tin nhắn trống");
            return;
        };

        const cart = getCart();
        cartItemsDetailedList.innerHTML = '';
        const cartItemIds = Object.keys(cart);

        if (cartItemIds.length === 0) {
            cartDetailedEmptyMessage.style.display = 'block';
        } else {
            cartDetailedEmptyMessage.style.display = 'none';
            cartItemIds.forEach(cartItemId => {
                const item = cart[cartItemId];
                const product = getProductById(item.id);
                if (!product) {
                    console.warn(`Không tìm thấy ID sản phẩm ${item.id} cho mặt hàng ${cartItemId} trong giỏ. Bỏ qua hiển thị.`);
                    return;
                }

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item-detailed';
                itemElement.dataset.id = cartItemId;

                let customization = '';
                if (item.size && !item.isDealComponent) {
                    customization = `Kích cỡ: ${item.size}`;
                } else if (item.popcornChoice || item.drinkChoice) {
                     customization = [item.popcornChoice, item.drinkChoice].filter(Boolean).join(', ');
                }

                const pricePerItem = Number(item.pricePerItem) || 0;
                const quantity = Number(item.quantity) || 0;
                const itemTotalPrice = pricePerItem * quantity;

                itemElement.innerHTML = `
                    <img src="${item.image || product.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        ${customization ? `<span class="cart-item-customization">${customization}</span>` : ''}
                        <span class="cart-item-price-each">(${formatPrice(pricePerItem)} / sản phẩm)</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn-cart minus" data-id="${cartItemId}" type="button" ${quantity <= 1 ? 'disabled' : ''}>-</button>
                        <input type="number" class="quantity-input-cart" value="${quantity}" min="1" data-id="${cartItemId}" aria-label="Số lượng mặt hàng">
                        <button class="quantity-btn-cart plus" data-id="${cartItemId}" type="button">+</button>
                    </div>
                    <div class="cart-item-total-price">
                        ${formatPrice(itemTotalPrice)}
                    </div>
                    <button class="cart-item-delete-detailed" data-id="${cartItemId}" type="button" aria-label="Xóa mặt hàng">&times;</button>
                `;
                cartItemsDetailedList.appendChild(itemElement);
            });
        }
        updateCartTotalDetailed();
    }

    function updateCartItemQuantity(cartItemId, newValue) {
        const cart = getCart();
        if (cart[cartItemId]) {
            const qty = Math.max(1, parseInt(newValue, 10) || 1);
            cart[cartItemId].quantity = qty;
            saveCart(cart);
            renderDetailedCart();
        }
    }

    function increaseQuantity(cartItemId) {
        const cart = getCart();
        if (cart[cartItemId]) {
            cart[cartItemId].quantity++;
            saveCart(cart);
            renderDetailedCart();
        }
    }

    function decreaseQuantity(cartItemId) {
        const cart = getCart();
        if (cart[cartItemId]) {
            cart[cartItemId].quantity--;
            if (cart[cartItemId].quantity <= 0) {
                delete cart[cartItemId];
            }
            saveCart(cart);
            renderDetailedCart();
        }
    }

    function removeFromCartAndRender(cartItemId) {
        const cart = getCart();
        if (cart[cartItemId]) {
            delete cart[cartItemId];
            saveCart(cart);
            renderDetailedCart();
        }
    }

    function renderSuggestions() {
        if (!suggestionsList) {
            console.error("Không tìm thấy phần tử danh sách gợi ý trong cart.html");
            return;
        }
        if (typeof productData === 'undefined' || !productData || productData.length === 0) {
             console.error("productData bị thiếu hoặc trống trong cart.js!");
             suggestionsList.innerHTML = '<p>Lỗi tải gợi ý.</p>';
             return;
        }

        const cart = getCart();
        const cartProductIds = Object.values(cart).map(item => item.id);

        const potentialSuggestions = productData.filter(p =>
            p.category !== 'deals' && !cartProductIds.includes(p.id)
        );

        potentialSuggestions.sort(() => 0.5 - Math.random());

        const suggestions = potentialSuggestions.slice(0, 3);

        suggestionsList.innerHTML = '';
        if (suggestions.length > 0) {
            suggestions.forEach(product => {
                const suggestionElement = document.createElement('div');
                suggestionElement.className = 'suggestion-item';
                suggestionElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <span class="suggestion-name">${product.name}</span>
                    <a href="catalogue.html#category-${product.category}" class="button suggestion-add-btn">Xem</a>
                `;
                suggestionsList.appendChild(suggestionElement);
            });
        } else {
            suggestionsList.innerHTML = '<p>Hiện không có gợi ý nào!</p>';
        }
    }

    cartItemsDetailedList?.addEventListener('click', (e) => {
        const target = e.target;
        const cartItem = target.closest('.cart-item-detailed');
        if (!cartItem) return;
        const cartItemId = cartItem.dataset.id;
        if (!cartItemId) return;

        if (target.classList.contains('cart-item-delete-detailed')) {
            removeFromCartAndRender(cartItemId);
        } else if (target.classList.contains('quantity-btn-cart')) {
            if (target.classList.contains('plus')) {
                increaseQuantity(cartItemId);
            } else if (target.classList.contains('minus')) {
                decreaseQuantity(cartItemId);
            }
        }
    });

    cartItemsDetailedList?.addEventListener('change', (e) => {
        const target = e.target;
        const cartItem = target.closest('.cart-item-detailed');
        if (!cartItem) return;
        const cartItemId = cartItem.dataset.id;

        if (target.classList.contains('quantity-input-cart')) {
             if (!cartItemId) return;
            updateCartItemQuantity(cartItemId, target.value);
        }
    });

    applyDiscountBtn?.addEventListener('click', () => {
        const code = discountCodeInput.value.trim().toUpperCase();
        
        if (code === 'SALE10') {
            currentDiscountPercent = 0.10;
            if(discountMessage) {
                discountMessage.textContent = 'Đã áp dụng giảm giá 10%!';
                discountMessage.className = 'form-message success';
            }
        } else if (code === 'POPCORN') {
            currentDiscountPercent = 0.05;
            if(discountMessage) {
                discountMessage.textContent = 'Đã áp dụng giảm giá 5%!';
                discountMessage.className = 'form-message success';
            }
        } else {
            currentDiscountPercent = 0;
            if(discountMessage) {
                discountMessage.textContent = 'Mã giảm giá không hợp lệ.';
                discountMessage.className = 'form-message error';
            }
        }
        updateCartTotalDetailed();
    });

    paypalCheckoutBtn?.addEventListener('click', () => {
        const cart = getCart();
        if (Object.keys(cart).length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }
        const totalText = cartTotalPriceDetailed ? cartTotalPriceDetailed.textContent : '$?.??';
        alert(`Chuyển đến PayPal để thanh toán... (Mô phỏng). Tổng: ${totalText}`);
    });

    checkoutBtnDetailed?.addEventListener('click', () => {
        const cart = getCart();
        if (Object.keys(cart).length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }
        const totalText = cartTotalPriceDetailed ? cartTotalPriceDetailed.textContent : '$?.??';
        alert(`Tiến hành thanh toán (Mô phỏng). Tổng: ${totalText}`);
    });

    if (typeof productData !== 'undefined' && productData.length > 0) {
        renderDetailedCart();
        renderSuggestions();
    } else {
        console.error("Không thể hiển thị trang: productData bị thiếu!");
         if(cartItemsDetailedList) cartItemsDetailedList.innerHTML = '<p style="color: red;">Lỗi tải dữ liệu sản phẩm. Không thể hiển thị giỏ hàng.</p>';
         if(suggestionsList) suggestionsList.innerHTML = '<p style="color: red;">Lỗi tải dữ liệu sản phẩm. Không thể hiển thị gợi ý.</p>';
    }
});