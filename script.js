
let cart = []; // Массив для хранения товаров в корзине
let products = [ // Глобальный массив товаров
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
let currentFilter = 'all'; // Текущая активная категория фильтра


// Функции

// Функция для отрисовкие
function renderProducts() {
    const productListElement = document.getElementById('product-list');
    if (!productListElement) {
        console.error("Элемент с id 'product-list' не найден в DOM.");
        return; // Проверяем, существует ли элемент
    }

    // Очищаем текущий список
    productListElement.innerHTML = '';

    // Фильтруем товары перед отображением
    const filteredProducts = products.filter(p => currentFilter === 'all' || p.category === currentFilter);

    if (filteredProducts.length === 0) {
        productListElement.innerHTML = '<p>Нет товаров в выбранной категории.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        // Добавляем data-id для идентификации товара при клике
        productCard.dataset.id = product.id;
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>Цена: $${product.price.toFixed(2)}</p>
            <p>Категория: ${product.category}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Добавить в корзину</button>
        `;
        productListElement.appendChild(productCard);
    });

    // После отрисовки добавляем обработчики для новых кнопок "Добавить"
    // Используем делегирование событий на родительском элементе
    // Убедимся, что слушатель не добавляется дважды
    const listElement = document.getElementById('product-list');
    listElement.removeEventListener('click', handleProductListClick); // Удаляем старый, если был
    listElement.addEventListener('click', handleProductListClick);
}

// Вспомогательная функция для обработки клика по списку товаров
function handleProductListClick(event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
        const productId = parseInt(event.target.getAttribute('data-id'));
        if (!isNaN(productId)) { // Проверка, является ли ID числом
            addToCart(productId);
        } else {
            console.error("Неверный ID товара:", event.target.getAttribute('data-id'));
        }
    }
}


// Функция для добавления товара в корзину
function addToCart(productId) {
    const productToAdd = products.find(p => p.id === productId);
    if (productToAdd) {
        // Проверим, есть ли уже такой товар в корзине
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        if (existingItemIndex > -1) {
             // Если есть, увеличиваем количество
            cart[existingItemIndex].quantity += 1;
        } else {
             // Если нет, добавляем новый объект с количеством
            cart.push({...productToAdd, quantity: 1}); // Используем spread оператор для копирования
        }

        // console.log('Товар добавлен в корзину:', productToAdd); // Для отладки
        updateCartDisplay(); // Обновляем отображение корзины
    } else {
         console.warn(`Товар с ID ${productId} не найден в списке продуктов.`);
    }
}


// Функция для отрисовки корзины
function renderCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    if (!cartItemsElement || !totalElement) {
        console.error("Один из элементов корзины (cart-items или cart-total) не найден в DOM.");
        return; // Проверяем существование элементов
    }

    // Очищаем текущую корзину
    cartItemsElement.innerHTML = '';

    // Отрисовываем каждый товар в корзине
    cart.forEach((item, index) => { // Передаем индекс для удаления
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} (${item.quantity} x $${item.price.toFixed(2)}) = $${(item.quantity * item.price).toFixed(2)}
            <button class="remove-from-cart-btn" data-index="${index}">Удалить</button>
        `;
        cartItemsElement.appendChild(li);
    });

    // Рассчитываем и отображаем общую сумму
    const total = calculateTotal();
    totalElement.textContent = `Итого: $${total.toFixed(2)}`;
}


// Функция для обновления отображения корзины (вызывает renderCart)
function updateCartDisplay() {
    renderCart();
}


// Функция для подсчета общей суммы (использует стрелочную функцию)
const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};


// Функция для очистки корзины
function clearCart() {
    cart = [];
    updateCartDisplay();
}


// Функция для обработки оплаты
function handleCheckout() {
    if (cart.length === 0) {
        alert("Корзина пуста");
        return; // Не продолжаем, если корзина пуста
    }
    alert("Оплата прошла успешно!");
    clearCart(); // Очищаем корзину после успешной оплаты
}


// Функция для фильтрации товаров
function filterProducts(category) {
    currentFilter = category;
    renderProducts(); // Перерисовываем список с учетом фильтра
}


// Функция для заполнения опций фильтра
function populateCategoryFilter() {
    const filterSelect = document.getElementById('category-filter');
    if (!filterSelect) {
        console.error("Элемент с id 'category-filter' не найден в DOM.");
        return;
    }

    // Получаем уникальные категории
    const categories = [...new Set(products.map(p => p.category))];
    // console.log(categories); // Для отладки

    // Очищаем текущие опции (кроме "Все")
    filterSelect.innerHTML = '<option value="all">Все категории</option>';

    // Добавляем опции для каждой категории
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filterSelect.appendChild(option);
    });
}


// инициализавция

document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOM полностью загружен и обработан');

    // Заполняем фильтр категориями
    populateCategoryFilter();

    // Устанавливаем начальный слушатель для изменения фильтра
    const filterElement = document.getElementById('category-filter');
    if(filterElement) {
        filterElement.addEventListener('change', function(e) {
            filterProducts(e.target.value);
        });
    } else {
        console.error("Элемент фильтра не найден для добавления обработчика.");
    }


    // Устанавливаем слушатель для кнопки "Оплатить"
    const checkoutButton = document.getElementById('checkout-btn');
    if(checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    } else {
        console.error("Кнопка 'checkout-btn' не найд обработчика.");
    }


    // Устанавливаем слушатель для кнопки "Очистить корзину"
    const clearCartButton = document.getElementById('clear-cart-btn');
    if(clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    } else {
        console.error("Кнопка 'clear-cart-btn' не найдена для добавления обработчика.");
    }


    // Устанавливаем слушатель для удаления из корзины (делегирование)
    const cartItemsElement = document.getElementById('cart-items');
    if(cartItemsElement) {
        cartItemsElement.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-from-cart-btn')) {
                const itemIndex = parseInt(event.target.getAttribute('data-index'));
                // Удаляем элемент из массива по индексу
                if (itemIndex >= 0 && itemIndex < cart.length) {
                     // Уменьшаем количество или удаляем полностью
                     if(cart[itemIndex].quantity > 1) {
                         cart[itemIndex].quantity -= 1;
                     } else {
                         cart.splice(itemIndex, 1);
                     }
                     updateCartDisplay(); // Обновляем отображение
                } else {
                     console.warn("Попытка удалить товар с неверным индексом:", itemIndex);
                }
            }
        });
    } else {
         console.error("Элемент 'cart-items' не найден для добавления обработчика удаления.");
    }


    // Инициализируем отображение товаров и корзины
    renderProducts();
    updateCartDisplay(); // renderCart() вызывается внутри
});