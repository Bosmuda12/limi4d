/* ============================================
   TokoKu - Homepage Logic
   ============================================ */

document.addEventListener("DOMContentLoaded", function() {
  renderCategories();
  renderProducts("all");
});

function renderCategories() {
  var grid = document.getElementById("categoryGrid");
  if (!grid) return;

  grid.innerHTML = "";
  CATEGORIES.forEach(function(cat) {
    var card = document.createElement("div");
    card.className = "category-card";
    card.onclick = function() {
      filterProducts(cat.id);
      document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
      document.querySelectorAll(".filter-btn").forEach(function(btn) {
        btn.classList.remove("active");
        if (btn.dataset.category === cat.id) btn.classList.add("active");
      });
    };
    card.innerHTML =
      '<span class="category-icon">' + cat.icon + '</span>' +
      '<span class="category-name">' + cat.name + '</span>';
    grid.appendChild(card);
  });
}

function renderProducts(category) {
  var grid = document.getElementById("productGrid");
  var empty = document.getElementById("emptyMessage");
  if (!grid) return;

  var products = getProducts();
  if (category && category !== "all") {
    products = products.filter(function(p) { return p.category === category; });
  }

  grid.innerHTML = "";

  if (products.length === 0) {
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  products.forEach(function(product) {
    var card = document.createElement("div");
    card.className = "product-card";

    var thumbContent = product.image
      ? '<img src="' + product.image + '" alt="' + product.name + '">'
      : getCategoryIcon(product.category);

    var stars = "";
    for (var i = 0; i < 5; i++) {
      stars += i < Math.round(product.rating) ? "⭐" : "☆";
    }

    card.innerHTML =
      '<div class="product-thumb" onclick="viewProduct(' + product.id + ')">' +
        thumbContent +
        (product.stock < 10 ? '<span class="product-badge">Stok Terbatas</span>' : '') +
      '</div>' +
      '<div class="product-body" onclick="viewProduct(' + product.id + ')">' +
        '<span class="product-category-tag">' + getCategoryName(product.category) + '</span>' +
        '<h3 class="product-name">' + product.name + '</h3>' +
        '<div class="product-price">' + formatPrice(product.price) + '</div>' +
        '<div class="product-meta">' +
          '<span class="product-rating-stars">' + stars + ' ' + product.rating + '</span>' +
          '<span>' + product.sold + ' terjual</span>' +
        '</div>' +
      '</div>' +
      '<button class="product-card-btn" onclick="event.stopPropagation(); addToCart(' + product.id + ')">🛒 Tambah ke Keranjang</button>';

    grid.appendChild(card);
  });
}

function filterProducts(category, btn) {
  if (btn) {
    document.querySelectorAll(".filter-btn").forEach(function(b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
  }
  renderProducts(category);
}

function searchProducts() {
  var query = document.getElementById("searchInput").value.toLowerCase();
  var grid = document.getElementById("productGrid");
  var empty = document.getElementById("emptyMessage");
  if (!grid) return;

  var products = getProducts();
  if (query) {
    products = products.filter(function(p) {
      return p.name.toLowerCase().indexOf(query) !== -1 ||
             p.category.toLowerCase().indexOf(query) !== -1 ||
             p.description.toLowerCase().indexOf(query) !== -1;
    });
  }

  grid.innerHTML = "";

  if (products.length === 0) {
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  products.forEach(function(product) {
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
      '<button class="product-card-btn" onclick="event.stopPropagation(); addToCart(' + product.id + ')">🛒 Tambah ke Keranjang</button>';

    grid.appendChild(card);
  });
}

function viewProduct(id) {
  window.location.href = "product.html?id=" + id;
}
