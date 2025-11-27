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
                            <div class="cart-item-price">₦${item.price.toLocaleString()} x ${
          item.quantity
        }</div>
                        </div>
                        <button class="remove-item" onclick="removeFromCart('${
                          item.name
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
  console.log(cart);
}

function showShop() {
  document.getElementById("shopPage").style.display = "block";
  document.getElementById("checkoutPage").classList.remove("active");
}

function updateOrderSummary() {
  const orderItems = document.getElementById("orderItems");
  const orderTotal = document.getElementById("orderTotal");
  const localAmountInput = document.getElementById("quote_amount");
  const localCurrencyInput = document.getElementById("quote_currency");

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
  localAmountInput.value = cartTotal;
  localCurrencyInput.value = "NGN";
  // localAmountInput.value = '25'
  // localCurrencyInput.value = 'USDT'
}

function processRegularPayment() {
  const successMessage = document.getElementById("successMessage");
  successMessage.style.display = "block";
  setTimeout(() => {
    cart = [];
    updateCartUI();
    showShop();
    successMessage.style.display = "none";
  }, 3000);
}

async function openBushaPayment() {
  console.log("1000");

  // try {
  //     const response = await fetch(
  //         "https://api.sandbox.busha.so/v1/payments/links",
  //         {
  //             method: "POST",
  //             headers: {
  //                 "X-BU-PROFILE-ID": "BUS_CQr0jPzGGzmn1uW5W7OVs",
  //                 Authorization:
  //                     "Bearer RmFNQjJVVEtVVzpyT1pzT0d6RkFpOFhOekVaY2NNdHpKdFdiUHRNVVlnOVNQNHlFbmlEOXNONE0wbE8=",
  //                 "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //                 fixed: true,
  //                 one_time: true,
  //                 name: `FreshMart Order #${Date.now()}`,
  //                 title: "Complete Your FreshMart Purchase",
  //                 description: `Payment for ${cart.length} items from FreshMart`,
  //                 quote_amount: cartTotal.toString(),
  //                 quote_currency: "NGN",
  //                 target_currency: "USDT",
  //                 require_extra_info: [
  //                     {
  //                         field_name: "email",
  //                         required: true,
  //                     },
  //                 ],
  //             }),
  //         }
  //     );

  //     if (!response.ok) {
  //         throw new Error("Failed to create payment link");
  //     }

  //     const paymentLinkData = await response.json();
  //     const paymentLinkId = paymentLinkData.data.id;
  //     const queryParams = {
  //         firstName: 'John',
  //         email: 'john@example.com',
  //         lastName: 'Jibs'
  //     };

  //     const queryString = Object.keys(queryParams)
  //         .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
  //         .join('&');

  //     const paymentUrl = `https://staging.pay.busha.co/charges/${paymentLinkId}#/payment-method?${queryString}`;
  //     showPaymentModal(paymentUrl);
  // } catch (error) {
  //     console.error("Error creating payment link:", error);
  //     alert("Error creating payment link. Please try again.");
  // }
}

function showPaymentModal(paymentUrl) {
  const modal = document.createElement("div");
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

  modal.innerHTML = `
        <div style="background: white; border-radius: 16px; width: 100%; max-width: 900px; height: 95vh; display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            <div style="padding: 20px; border-bottom: 1px solid #e8e8e8; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                <h3 style="margin: 0; color: #1a1a1a;">Complete Payment with Busha</h3>
                <button onclick="closePaymentModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">×</button>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
                <div id="iframeContainer" style="flex: 1; min-height: 0;">
                    <p style="text-align: center; padding: 40px; color: #6b7280;">Loading payment page...</p>
                </div>
                <div style="padding: 15px 20px; border-top: 1px solid #e8e8e8; text-align: center; flex-shrink: 0;">
                    <button onclick="confirmPayment()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.9rem;">Mark as Paid (Demo)</button>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  setTimeout(() => {
    const container = document.getElementById("iframeContainer");
    if (container) {
      container.innerHTML = `
                <iframe 
                    src="${paymentUrl}" 
                    width="100%" 
                    height="100%" 
                    style="border: none; display: block; min-height: 100%;"
                    scrolling="yes"
                    onerror="handleIframeError()"
                ></iframe>
            `;
    }
  }, 500);

  window.currentPaymentModal = modal;
}

function closePaymentModal() {
  if (window.currentPaymentModal) {
    window.currentPaymentModal.remove();
    window.currentPaymentModal = null;
  }
}

function confirmPayment() {
  closePaymentModal();
  const successMessage = document.getElementById("successMessage");
  successMessage.innerHTML =
    "✅ Payment completed with Busha! Your order has been confirmed.";
  successMessage.style.display = "block";
  setTimeout(() => {
    cart = [];
    updateCartUI();
    showShop();
    successMessage.style.display = "none";
  }, 3000);
}

function handleIframeError() {
  const container = document.getElementById("iframeContainer");
  if (container) {
    container.innerHTML = `
            <div style="color: #dc2626; padding: 20px; border: 1px solid #fecaca; border-radius: 8px; background: #fef2f2;">
                <p><strong>Payment page couldn't load in iframe</strong></p>
                <p>Please use one of the direct links above to complete payment.</p>
            </div>
        `;
  }
}
