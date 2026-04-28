let cart = [];
let products = [
    { id: 1, name: 'Смартфон X', price: 599.99, category: 'Электроника' },
    { id: 2, name: 'Футболка Basic', price: 19.99, category: 'Одежда' },
    { id: 3, name: 'Ноутбук Pro', price: 1299.99, category: 'Электроника' },
    { id: 4, name: 'Роман "Война и мир"', price: 12.50, category: 'Книги' },
    { id: 5, name: 'Джинсы Premium', price: 49.95, category: 'Одежда' },
    { id: 6, name: 'Набор инструментов', price: 89.00, category: 'Дом и сад' },
    { id: 7, name: 'Наушники Wireless', price: 79.90, category: 'Электроника' },
    { id: 8, name: 'Книга рецептов', price: 22.00, category: 'Книги' },
    { id: 9, name: 'Кресло офисное', price: 199.00, category: 'Дом и сад' }
];
let currentFilter = 'all';

/* ========== НОВОЕ: работа с localStorage ========== */
// Сохранение корзины в localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Загрузка корзины из localStorage при запуске
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}
/* ================================================= */

function renderProducts() {
    const productListElement = document.getElementById('product-list');
    if (!productListElement) return;

    productListElement.innerHTML = '';
    const filteredProducts = products.filter(p => currentFilter === 'all' || p.category === currentFilter);

    if (filteredProducts.length === 0) {
        productListElement.innerHTML = '<p>Нет товаров в выбранной категории.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>Цена: $${product.price.toFixed(2)}</p>
            <p>Категория: ${product.category}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Добавить в корзину</button>
        `;
        productListElement.appendChild(productCard);
    });

    const listElement = document.getElementById('product-list');
    listElement.removeEventListener('click', handleProductListClick);
    listElement.addEventListener('click', handleProductListClick);
}

function handleProductListClick(event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
        const productId = parseInt(event.target.getAttribute('data-id'));
        if (!isNaN(productId)) {
            addToCart(productId);
        }
    }
}

function addToCart(productId) {
    const productToAdd = products.find(p => p.id === productId);
    if (productToAdd) {
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({...productToAdd, quantity: 1});
        }
        saveCartToStorage();                // <-- сохраняем в localStorage
        updateCartDisplay();
    }
}

function renderCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    if (!cartItemsElement || !totalElement) return;

    cartItemsElement.innerHTML = '';
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} (${item.quantity} x $${item.price.toFixed(2)}) = $${(item.quantity * item.price).toFixed(2)}
            <button class="remove-from-cart-btn" data-index="${index}">Удалить</button>
        `;
        cartItemsElement.appendChild(li);
    });

    const total = calculateTotal();
    totalElement.textContent = `Итого: $${total.toFixed(2)}`;
}

function updateCartDisplay() {
    renderCart();
}

const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

function clearCart() {
    cart = [];
    saveCartToStorage();   // <-- очистка в хранилище
    updateCartDisplay();
}

function handleCheckout() {
    if (cart.length === 0) {
        alert("Корзина пуста");
        return;
    }
    alert("Оплата прошла успешно!");
    clearCart();   // clearCart уже вызовет saveCartToStorage
}

function filterProducts(category) {
    currentFilter = category;
    renderProducts();
}

function populateCategoryFilter() {
    const filterSelect = document.getElementById('category-filter');
    if (!filterSelect) return;

    const categories = [...new Set(products.map(p => p.category))];
    filterSelect.innerHTML = '<option value="all">Все категории</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filterSelect.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // 1. Загружаем корзину из localStorage перед отрисовкой
    loadCartFromStorage();

    // 2. Инициализация фильтров и интерфейса
    populateCategoryFilter();

    const filterElement = document.getElementById('category-filter');
    if(filterElement) {
        filterElement.addEventListener('change', function(e) {
            filterProducts(e.target.value);
        });
    }

    const checkoutButton = document.getElementById('checkout-btn');
    if(checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }

    const clearCartButton = document.getElementById('clear-cart-btn');
    if(clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }

    // Удаление товаров из корзины (делегирование)
    const cartItemsElement = document.getElementById('cart-items');
    if(cartItemsElement) {
        cartItemsElement.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-from-cart-btn')) {
                const itemIndex = parseInt(event.target.getAttribute('data-index'));
                if (itemIndex >= 0 && itemIndex < cart.length) {
                    if(cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity -= 1;
                    } else {
                        cart.splice(itemIndex, 1);
                    }
                    saveCartToStorage();   // <-- сохраняем после удаления
                    updateCartDisplay();
                }
            }
        });
    }

    // Первичная отрисовка товаров и корзины
    renderProducts();
    updateCartDisplay();   // корзина уже загружена из хранилища
});