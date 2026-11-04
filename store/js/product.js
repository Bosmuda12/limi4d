/* ============================================
   TokoKu - Product Detail Logic
   ============================================ */

var currentProduct = null;

document.addEventListener("DOMContentLoaded", function() {
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get("id"));

  if (!id) {
    window.location.href = "index.html";
    return;
  }

  var products = getProducts();
  currentProduct = products.find(function(p) { return p.id === id; });

  if (!currentProduct) {
    window.location.href = "index.html";
    return;
  }

  renderProductDetail();
  renderRelatedProducts();
});

function renderProductDetail() {
  var p = currentProduct;

  document.title = p.name + " - TokoKu";

  document.getElementById("productNameBread").textContent = p.name;
  document.getElementById("productCategory").textContent = getCategoryName(p.category);
  document.getElementById("productCategoryBadge").textContent = getCategoryName(p.category);
  document.getElementById("productName").textContent = p.name;
  document.getElementById("productRating").textContent = p.rating;
  document.getElementById("productSold").textContent = p.sold;
  document.getElementById("productPrice").textContent = formatPrice(p.price);
  document.getElementById("productDescription").textContent = p.description;
  document.getElementById("productStock").textContent = p.stock + " tersedia";

  var imageEl = document.getElementById("productImage");
  if (p.image) {
    imageEl.innerHTML = '<img src="' + p.image + '" alt="' + p.name + '">';
  } else {
    imageEl.innerHTML = '<div class="product-placeholder-lg">' + getCategoryIcon(p.category) + '</div>';
  }

  if (p.stock === 0) {
    document.getElementById("addToCartBtn").disabled = true;
    document.getElementById("addToCartBtn").textContent = "Stok Habis";
    document.getElementById("buyNowBtn").disabled = true;
    document.getElementById("productStock").textContent = "Habis";
    document.getElementById("productStock").style.color = "#dc2626";
  }
}

function changeQty(delta) {
  var input = document.getElementById("quantity");
  var val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (currentProduct && val > currentProduct.stock) val = currentProduct.stock;
  input.value = val;
}

function addToCartDetail() {
  if (!currentProduct) return;
  var qty = parseInt(document.getElementById("quantity").value);
  addToCart(currentProduct.id, qty);
}

function buyNow() {
  if (!currentProduct) return;
  var qty = parseInt(document.getElementById("quantity").value);
  addToCart(currentProduct.id, qty);
  window.location.href = "cart.html";
}

function askViaWhatsapp() {
  if (!currentProduct) return;
  var msg = "Halo, saya tertarik dengan produk *" + currentProduct.name + "* (Harga: " + formatPrice(currentProduct.price) + "). Apakah masih tersedia?";
  var url = "https://wa.me/" + STORE_CONFIG.phone + "?text=" + encodeURIComponent(msg);
  window.open(url, "_blank");
}

function renderRelatedProducts() {
  var grid = document.getElementById("relatedProducts");
  if (!grid) return;

  var products = getProducts();
  var related = products.filter(function(p) {
    return p.category === currentProduct.category && p.id !== currentProduct.id;
  }).slice(0, 4);

  if (related.length === 0) {
    related = products.filter(function(p) { return p.id !== currentProduct.id; }).slice(0, 4);
  }

  related.forEach(function(product) {
    var card = document.createElement("div");
    card.className = "product-card";

    var thumbContent = product.image
      ? '<img src="' + product.image + '" alt="' + product.name + '">'
      : getCategoryIcon(product.category);

    card.innerHTML =
      '<div class="product-thumb" onclick="viewProduct(' + product.id + ')">' +
        thumbContent +
      '</div>' +
      '<div class="product-body" onclick="viewProduct(' + product.id + ')">' +
        '<span class="product-category-tag">' + getCategoryName(product.category) + '</span>' +
        '<h3 class="product-name">' + product.name + '</h3>' +
        '<div class="product-price">' + formatPrice(product.price) + '</div>' +
      '</div>' +
      '<button class="product-card-btn" onclick="event.stopPropagation(); addToCart(' + product.id + ')">🛒 Tambah</button>';

    grid.appendChild(card);
  });
}

function viewProduct(id) {
  window.location.href = "product.html?id=" + id;
}
