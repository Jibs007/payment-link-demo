let cart = [];
let cartTotal = 0;

function addToCart(name, price, emoji) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, emoji, quantity: 1 });
  }
  updateCartUI();
  showCartNotification(name);
}

function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCartUI();
}

function updateCartUI() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");
  const cartTotalAmount = document.getElementById("cartTotalAmount");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalAmount.textContent = `₦${cartTotal.toLocaleString()}`;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p style="color: #6b7280; text-align: center; padding: 40px 0;">Your cart is empty</p>';
    cartTotalElement.style.display = "none";
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.emoji} ${item.name}</h4>
                            <div class="cart-item-price">₦${item.price.toLocaleString()} x ${item.quantity
          }</div>
                        </div>
                        <button class="remove-item" onclick="removeFromCart('${item.name
          }')">Remove</button>
                    </div>
                `
      )
      .join("");
    cartTotalElement.style.display = "block";
  }
}

function showCartNotification(itemName) {
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1001;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
  notification.textContent = `✅ ${itemName} added to cart!`;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  cartSidebar.classList.toggle("open");
  cartOverlay.classList.toggle("active");
}

function proceedToCheckout() {
  if (cart.length === 0) return;
  toggleCart();
  showCheckout();
}

function showCheckout() {
  document.getElementById("shopPage").style.display = "none";
  document.getElementById("checkoutPage").classList.add("active");
  updateOrderSummary();
}

function showShop() {
  document.getElementById("shopPage").style.display = "block";
  document.getElementById("checkoutPage").classList.remove("active");
}

function updateOrderSummary() {
  const orderItems = document.getElementById("orderItems");
  const orderTotal = document.getElementById("orderTotal");
  const quoteAmountInput = document.getElementById("quote_amount");
  const quoteCurrencyInput = document.getElementById("quote_currency");

  orderItems.innerHTML = cart
    .map(
      (item) => `
                <div class="summary-item">
                    <span>${item.emoji} ${item.name} (x${item.quantity})</span>
                    <span>₦${(
          item.price * item.quantity
        ).toLocaleString()}</span>
                </div>
            `
    )
    .join("");

  orderTotal.textContent = `₦${cartTotal.toLocaleString()}`;
  quoteAmountInput.value = cartTotal;
  quoteCurrencyInput.value = "NGN";
}

function processRegularPayment() {
  showSuccessModal("Card/Bank Transfer");
}

function generateOrderNumber() {
  return `ORD${Date.now().toString().slice(-8)}`;
}

function showSuccessModal(paymentMethod = "Crypto") {
  const overlay = document.getElementById("successModalOverlay");
  const orderNumber = generateOrderNumber();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("successOrderNumber").textContent = orderNumber;
  document.getElementById("successItemCount").textContent = `${itemCount} item${itemCount !== 1 ? "s" : ""
    }`;
  document.getElementById("successPaymentMethod").textContent = paymentMethod;
  document.getElementById(
    "successTotalAmount"
  ).textContent = `₦${cartTotal.toLocaleString()}`;

  overlay.classList.add("active");

  console.log("Order placed:", {
    orderNumber,
    items: cart,
    total: cartTotal,
    paymentMethod,
  });
}

function closeSuccessModal() {
  const overlay = document.getElementById("successModalOverlay");
  overlay.classList.remove("active");

  cart = [];
  updateCartUI();
  showShop();
}