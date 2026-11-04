/* ============================================
   TokoKu - Checkout Logic
   ============================================ */

document.addEventListener("DOMContentLoaded", function() {
  renderCheckoutPage();
});

function renderCheckoutPage() {
  var cart = getCart();
  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  var orderItems = document.getElementById("orderItems");
  if (orderItems) {
    orderItems.innerHTML = "";
    cart.forEach(function(item) {
      var div = document.createElement("div");
      div.className = "order-item";
      div.innerHTML =
        '<span class="order-item-name">' + item.name + ' x' + item.qty + '</span>' +
        '<span class="order-item-price">' + formatPrice(item.price * item.qty) + '</span>';
      orderItems.appendChild(div);
    });
  }

  var totals = getCartTotal();
  var subtotalEl = document.getElementById("subtotal");
  var shippingEl = document.getElementById("shipping");
  var totalPriceEl = document.getElementById("totalPrice");

  if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
  if (shippingEl) {
    shippingEl.textContent = totals.shipping === 0 ? "GRATIS" : formatPrice(totals.shipping);
    if (totals.shipping === 0) shippingEl.style.color = "#16a34a";
  }
  if (totalPriceEl) totalPriceEl.textContent = formatPrice(totals.total);
}

function placeOrder() {
  var name = document.getElementById("name").value.trim();
  var phone = document.getElementById("phone").value.trim();
  var address = document.getElementById("address").value.trim();
  var city = document.getElementById("city").value.trim();

  if (!name || !phone || !address || !city) {
    showToast("Mohon lengkapi data pengiriman!");
    return;
  }

  var cart = getCart();
  var totals = getCartTotal();
  var payment = document.querySelector('input[name="payment"]:checked').value;
  var notes = document.getElementById("notes").value.trim();
  var email = document.getElementById("email").value.trim();
  var postalCode = document.getElementById("postalCode").value.trim();

  var order = {
    id: generateOrderId(),
    customer: {
      name: name,
      phone: phone,
      email: email,
      address: address,
      city: city,
      postalCode: postalCode
    },
    items: cart.map(function(item) {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        subtotal: item.price * item.qty
      };
    }),
    payment: payment,
    notes: notes,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    total: totals.total,
    status: "pending",
    date: new Date().toISOString()
  };

  var orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  clearCart();

  document.getElementById("orderId").textContent = order.id;
  document.getElementById("successModal").classList.add("show");
}

function orderViaWhatsappCheckout() {
  var name = document.getElementById("name").value.trim();
  var phone = document.getElementById("phone").value.trim();
  var address = document.getElementById("address").value.trim();
  var city = document.getElementById("city").value.trim();

  var cart = getCart();
  var totals = getCartTotal();
  var payment = document.querySelector('input[name="payment"]:checked').value;

  var paymentLabel = {
    transfer: "Transfer Bank",
    ewallet: "E-Wallet",
    cod: "COD"
  };

  var msg = "PESANAN BARU\n";
  msg += "====================\n\n";

  if (name) msg += "Nama: " + name + "\n";
  if (phone) msg += "HP: " + phone + "\n";
  if (address) msg += "Alamat: " + address + "\n";
  if (city) msg += "Kota: " + city + "\n";
  msg += "Pembayaran: " + (paymentLabel[payment] || payment) + "\n\n";

  msg += "DAFTAR PESANAN:\n";
  cart.forEach(function(item, i) {
    msg += (i + 1) + ". " + item.name + " x" + item.qty + " = " + formatPrice(item.price * item.qty) + "\n";
  });

  msg += "\nSubtotal: " + formatPrice(totals.subtotal);
  msg += "\nOngkir: " + (totals.shipping === 0 ? "GRATIS" : formatPrice(totals.shipping));
  msg += "\nTOTAL: " + formatPrice(totals.total);
  msg += "\n\nMohon konfirmasi pesanan ini. Terima kasih!";

  var url = "https://wa.me/" + STORE_CONFIG.phone + "?text=" + encodeURIComponent(msg);
  window.open(url, "_blank");
}
