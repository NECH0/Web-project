// Пролистывание слайдов
const slides = document.querySelectorAll('.slide');
const radios = document.querySelectorAll('input[name="r"]');
let currentSlide = 0;

function nextSlide() {
  currentSlide++;
  if (currentSlide > slides.length - 1) {
    currentSlide = 0;
  }
  updateSlide();
}

function updateSlide() {
  radios[currentSlide].checked = true;
}
const autoSlideInterval = setInterval(nextSlide, 3000); // Пролистывание каждые 3 секунды

const basketButton = document.querySelector('.basket-button');
const cartOverlay = document.querySelector('.cart-overlay');
const closeButton = document.querySelector('.close-button');

basketButton.addEventListener('click', () => {
  cartOverlay.style.display = 'flex';
});

closeButton.addEventListener('click', () => {
  cartOverlay.style.display = 'none';
});

// Добавление товаров в корзину
window.onload = function () {
  const addToCartButtons = document.querySelectorAll('.choose-button');
  const cartItemsContainer = document.querySelector('.cart-items');
  const totalPriceElement = document.querySelector('.total-price');
  const cartCountElement = document.querySelector('.cart-count');
  const emptyCartElement = document.querySelector('.empty-cart');
  const checkoutButton = document.querySelector('.buy-button');
  const makeOrderContainer = document.querySelector('.make-order');
  const closeOrderButton = document.querySelector('.close-order');

  const cart = {}; // Храним данные о товарах
  updateCheckoutButton();
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const product = button.closest('.product');
      const productName = product.querySelector('h3').textContent;
      const productImgUrl = product.querySelector('img').src;
      const productPrice = parseFloat(product.querySelector('.price').textContent.replace(/От|₽/g, ''));
      const productId = product.dataset.pizzaId;

      if (cart[productId]) {
        cart[productId].quantity++;
      } else {
        cart[productId] = {
          name: productName,
          price: productPrice,
          quantity: 1,
          imageUrl: productImgUrl
        };
      }

      updateCart(); // Обновляем корзину и счетчик после добавления товара
      updateCheckoutButton();
    });
  });
  // Добавляем обработчики событий для кнопок
  checkoutButton.addEventListener('click', () => {
    // Скрываем корзину
    cartOverlay.style.display = 'none';
    // Отображаем форму оформления заказа
    makeOrderContainer.style.display = 'flex';
  });

  closeOrderButton.addEventListener('click', () => {
    // Скрываем форму оформления заказа
    makeOrderContainer.style.display = 'none';
    // Показываем корзину
    cartItemsContainer.style.display = 'block';
  });
  // Обновление корзины
  function updateCart() {
    cartItemsContainer.innerHTML = ''; // Очищаем корзину
    let totalPrice = 0; // Общая стоимость заказа
    let totalQuantity = 0; // Переменная для суммирования количества


    // Добавляем и удаляем класс "increase" для анимации
    cartCountElement.classList.add('increase');
    setTimeout(() => {
      cartCountElement.classList.remove('increase');
    }, 300);

    for (const productId in cart) {
      const item = cart[productId];
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">  
        <p>${item.name}</p>
        <span class="price">${item.price} ₽</span>
        <div class="quantity-control">
          <button class="decrease-button">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase-button">+</button>
        </div>
        <span class="remove-button">&#10006;</span>
      `;

      // Добавляем обработчики событий для кнопок
      const decreaseButton = cartItem.querySelector('.decrease-button');
      const increaseButton = cartItem.querySelector('.increase-button');
      const removeButton = cartItem.querySelector('.remove-button');

      decreaseButton.addEventListener('click', () => {
        if (item.quantity > 1) {
          item.quantity--;
          updateCart(); // Обновляем корзину после изменения количества
        } else {
          delete cart[productId]; // Удаляем товар, если количество равно 1
          updateCart();
        }
      });

      increaseButton.addEventListener('click', () => {
        item.quantity++;
        updateCart();
      });

      removeButton.addEventListener('click', () => {
        delete cart[productId]; // Удаляем товар из корзины
        updateCart();
      });

      cartItemsContainer.appendChild(cartItem);

      // Считаем сумму заказа
      totalPrice += item.price * item.quantity;
      // Суммируем количество товаров
      totalQuantity += item.quantity;
    }

    // Обновляем счетчик товаров в корзине
    cartCountElement.textContent = totalQuantity; // Обновляем счетчик
    // Отображаем сумму заказа, если товары есть
    if (totalQuantity > 0) {
      totalPriceElement.textContent = `Сумма заказа ${totalPrice} ₽`;
      emptyCartElement.style.display = "none"; // Скрываем элемент
    } else {
      totalPriceElement.textContent = ''; // Очищаем текст, если товаров нет
      emptyCartElement.style.display = "block"; // Отображаем элемент
    }
    updateCheckoutButton();
  }
  // Функция для скрытия/отображения кнопки "К оформлению"
  function updateCheckoutButton() {
    if (Object.keys(cart).length === 0) { // Проверяем, пуста ли корзина
      checkoutButton.style.display = 'none'; // Скрываем кнопку

    } else {
      checkoutButton.style.display = 'inline-block'; // Отображаем кнопку

    }
  }
};

// Отправка формы на почту
jQuery(document).ready(function () {
  jQuery('form').submit(function (event) {

    var formData = jQuery(this).serialize();

    jQuery.ajax({
      url: 'sender.php',
      type: 'POST',
      data: formData,
      beforeSend: function () {
        jQuery('.status').html('Отправка заказа...');
      },
      success: function (data) {
        jQuery('.status').html('Заказ сформирован успешно');
      },
      error: function () {
        jQuery('.status').html('Ошибка при отправке. Попробуйте снова.');
      }
    });
  });
  jQuery('.close-order').click(function (event) {
    event.preventDefault(); // Предотвращаем отправку формы
    jQuery('.status').html('Заказ отменен'); // Изменяем текст в статусе
    jQuery('.make-order').addClass('hidden'); // Скрываем форму
  });
});