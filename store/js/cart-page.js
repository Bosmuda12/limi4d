/* ============================================
   TokoKu - Cart Page Logic
   ============================================ */

document.addEventListener("DOMContentLoaded", function() {
  renderCartPage();
});

function renderCartPage() {
  var cart = getCart();
  var cartContent = document.getElementById("cartContent");
  var emptyCart = document.getElementById("emptyCart");
  var cartItems = document.getElementById("cartItems");

  if (cart.length === 0) {
    if (cartContent) cartContent.style.display = "none";
    if (emptyCart) emptyCart.style.display = "block";
    return;
  }

  if (cartContent) cartContent.style.display = "grid";
  if (emptyCart) emptyCart.style.display = "none";

  if (cartItems) {
    cartItems.innerHTML = "";
    cart.forEach(function(item) {
      var imageContent = item.image
        ? '<img src="' + item.image + '" alt="' + item.name + '">'
        : getCategoryIcon(item.category);

      var div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML =
        '<div class="cart-item-image">' + imageContent + '</div>' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-price">' + formatPrice(item.price) + '</div>' +
          '<div class="cart-item-actions">' +
            '<button class="cart-qty-btn" onclick="changeCartQty(' + item.id + ', -1)">-</button>' +
            '<span class="cart-qty">' + item.qty + '</span>' +
            '<button class="cart-qty-btn" onclick="changeCartQty(' + item.id + ', 1)">+</button>' +
            '<button class="cart-remove" onclick="removeCartItem(' + item.id + ')">Hapus</button>' +
          '</div>' +
        '</div>';
      cartItems.appendChild(div);
    });
  }

  updateCartSummary();
}

function changeCartQty(productId, delta) {
  var cart = getCart();
  var item = cart.find(function(i) { return i.id === productId; });
  if (item) {
    var newQty = item.qty + delta;
    if (newQty <= 0) {
      removeCartItem(productId);
      return;
    }
    updateCartItemQty(productId, newQty);
  }
  renderCartPage();
}

function removeCartItem(productId) {
  removeFromCart(productId);
  renderCartPage();
  showToast("Produk dihapus dari keranjang");
}

function updateCartSummary() {
  var totals = getCartTotal();

  var totalItemsEl = document.getElementById("totalItems");
  var subtotalEl = document.getElementById("subtotal");
  var shippingEl = document.getElementById("shipping");
  var totalPriceEl = document.getElementById("totalPrice");

  if (totalItemsEl) totalItemsEl.textContent = totals.totalItems + " barang";
  if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
  if (shippingEl) {
    shippingEl.textContent = totals.shipping === 0 ? "GRATIS" : formatPrice(totals.shipping);
    if (totals.shipping === 0) shippingEl.style.color = "#16a34a";
  }
  if (totalPriceEl) totalPriceEl.textContent = formatPrice(totals.total);
}

function goToCheckout() {
  var cart = getCart();
  if (cart.length === 0) {
    showToast("Keranjang masih kosong!");
    return;
  }
  window.location.href = "checkout.html";
}

function orderViaWhatsapp() {
  var cart = getCart();
  if (cart.length === 0) {
    showToast("Keranjang masih kosong!");
    return;
  }

  var totals = getCartTotal();
  var msg = "Halo, saya ingin memesan:\n\n";

  cart.forEach(function(item, i) {
    msg += (i + 1) + ". " + item.name + " x" + item.qty + " = " + formatPrice(item.price * item.qty) + "\n";
  });

  msg += "\nSubtotal: " + formatPrice(totals.subtotal);
  msg += "\nOngkir: " + (totals.shipping === 0 ? "GRATIS" : formatPrice(totals.shipping));
  msg += "\nTotal: " + formatPrice(totals.total);
  msg += "\n\nMohon konfirmasi pesanan ini. Terima kasih!";

  var url = "https://wa.me/" + STORE_CONFIG.phone + "?text=" + encodeURIComponent(msg);
  window.open(url, "_blank");
}
