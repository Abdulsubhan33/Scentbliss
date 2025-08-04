// Inventory data (simulate database)
const inventory = {
  "The Royal": { quantity: 10, price: 2000 },
  "Pink Aura": { quantity: 8, price: 2000}
};

// Load or initialize inventory
const savedInventory = JSON.parse(localStorage.getItem("inventory"));
if (savedInventory) {
  for (let key in savedInventory) {
    if (inventory[key]) {
      inventory[key].quantity = savedInventory[key].quantity;
    }
  }
}

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add product to cart
function addToCart(productName) {
  const product = inventory[productName];

  if (!product || product.quantity <= 0) {
    alert("Sorry, " + productName + " is out of stock.");
    return;
  }

  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: productName, quantity: 1 });
  }

  // Update inventory
  inventory[productName].quantity -= 1;

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("inventory", JSON.stringify(inventory));

  alert(`${productName} added to cart!`);
  updateCartCount();
}

// Update cart item count in nav (if available)
function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  if (!countSpan) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  countSpan.textContent = totalItems;
}

// Display cart items on checkout page
function displayCart() {
  const cartContainer = document.getElementById("cart-container");
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;

  cartContainer.innerHTML = ""; // Clear previous
  cart.forEach(item => {
    const product = inventory[item.name];
    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      ${item.name} x ${item.quantity} — Rs. ${itemTotal}
    `;
    cartContainer.appendChild(div);
  });

  const summary = document.createElement("div");
  summary.className = "summary";
  summary.innerHTML = `<br/>Total: Rs. ${total}`;
  cartContainer.appendChild(summary);
}

// Handle order form submission
function handleOrderSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const fullName = form.fullname.value.trim();
  const address = form.address.value.trim();
  const paymentMethod = form.payment.value;

  if (!fullName || !address || !paymentMethod) {
    alert("Please fill out all required fields.");
    return;
  }

  alert(`Thank you, ${fullName}! Your order has been placed.`);

  // Clear cart
  cart = [];
  localStorage.removeItem("cart");

  // Redirect or reset UI
  window.location.href = "index.html";
}

// Initialization logic for both pages
function init() {
  updateCartCount();
  displayCart();

  const form = document.getElementById("delivery-form");
  if (form) {
    form.addEventListener("submit", handleOrderSubmit);
  }
}
function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  if (!countSpan) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  countSpan.textContent = totalItems;
}
function init() {
  updateCartCount();
  displayCart();

  const form = document.getElementById("delivery-form");
  if (form) {
    form.addEventListener("submit", handleOrderSubmit);
  }

  const clearCartBtn = document.getElementById("clear-cart-btn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear the cart?")) {
        cart = [];
        localStorage.removeItem("cart");
        updateCartCount();
        displayCart();
      }
    });
  }
}


window.addEventListener("DOMContentLoaded", init);
