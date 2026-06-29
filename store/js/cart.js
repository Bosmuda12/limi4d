/* ============================================
   TokoKu - Cart Management (shared)
   ============================================ */

function getCart() {
  var saved = localStorage.getItem("tokoku_cart");
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

function saveCart(cart) {
  localStorage.setItem("tokoku_cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty) {
  var products = getProducts();
  var product = products.find(function(p) { return p.id === productId; });
  if (!product) return;

  var cart = getCart();
  var existing = cart.find(function(item) { return item.id === productId; });

  if (existing) {
    existing.qty += (qty || 1);
    if (existing.qty > product.stock) {
      existing.qty = product.stock;
    }
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      qty: qty || 1
    });
  }

  saveCart(cart);
  showToast(product.name + " ditambahkan ke keranjang!");
}

function removeFromCart(productId) {
  var cart = getCart();
  cart = cart.filter(function(item) { return item.id !== productId; });
  saveCart(cart);
}

function updateCartItemQty(productId, qty) {
  var cart = getCart();
  var item = cart.find(function(i) { return i.id === productId; });
  if (item) {
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      item.qty = qty;
      saveCart(cart);
    }
  }
}

function getCartTotal() {
  var cart = getCart();
  var subtotal = 0;
  var totalItems = 0;
  cart.forEach(function(item) {
    subtotal += item.price * item.qty;
    totalItems += item.qty;
  });
  var shipping = subtotal >= STORE_CONFIG.shippingFree ? 0 : STORE_CONFIG.shippingCost;
  return {
    subtotal: subtotal,
    shipping: shipping,
    total: subtotal + shipping,
    totalItems: totalItems
  };
}

function clearCart() {
  localStorage.removeItem("tokoku_cart");
  updateCartCount();
}

function updateCartCount() {
  var cart = getCart();
  var count = 0;
  cart.forEach(function(item) { count += item.qty; });
  var els = document.querySelectorAll("#cartCount");
  els.forEach(function(el) {
    el.textContent = count;
  });
}

function showToast(message) {
  var existing = document.querySelector(".toast");
  if (existing) existing.remove();

  var toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(function() { toast.classList.add("show"); }, 10);
  setTimeout(function() {
    toast.classList.remove("show");
    setTimeout(function() { toast.remove(); }, 300);
  }, 2500);
}

function toggleMobileMenu() {
  var menu = document.getElementById("mobileMenu");
  if (menu) {
    menu.classList.toggle("show");
  }
}

document.addEventListener("DOMContentLoaded", function() {
  updateCartCount();
});
