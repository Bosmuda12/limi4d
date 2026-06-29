/* ============================================
   TokoKu - Admin Panel Logic
   ============================================ */

document.addEventListener("DOMContentLoaded", function() {
  renderAdminStats();
  renderProductTable();
  renderOrderTable();
});

function renderAdminStats() {
  var products = getProducts();
  var orders = getOrders();

  var totalRevenue = 0;
  orders.forEach(function(o) { totalRevenue += o.total; });

  var categories = [];
  products.forEach(function(p) {
    if (categories.indexOf(p.category) === -1) {
      categories.push(p.category);
    }
  });

  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalOrders").textContent = orders.length;
  document.getElementById("totalRevenue").textContent = formatPrice(totalRevenue);
  document.getElementById("totalCategories").textContent = categories.length;
}

function renderProductTable() {
  var products = getProducts();
  var tbody = document.getElementById("productTableBody");
  var emptyEl = document.getElementById("adminEmpty");
  var table = document.getElementById("productTable");

  if (products.length === 0) {
    if (table) table.style.display = "none";
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }

  if (table) table.style.display = "table";
  if (emptyEl) emptyEl.style.display = "none";

  if (tbody) {
    tbody.innerHTML = "";
    products.forEach(function(p) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td><strong>' + p.name + '</strong></td>' +
        '<td>' + getCategoryName(p.category) + '</td>' +
        '<td>' + formatPrice(p.price) + '</td>' +
        '<td>' + p.stock + '</td>' +
        '<td>' +
          '<div class="table-actions">' +
            '<button class="btn btn-primary btn-sm" onclick="editProduct(' + p.id + ')">Edit</button>' +
            '<button class="btn btn-danger btn-sm" onclick="deleteProduct(' + p.id + ')">Hapus</button>' +
          '</div>' +
        '</td>';
      tbody.appendChild(tr);
    });
  }
}

function renderOrderTable() {
  var orders = getOrders();
  var tbody = document.getElementById("orderTableBody");
  var emptyEl = document.getElementById("orderEmpty");
  var table = document.getElementById("orderTable");

  if (orders.length === 0) {
    if (table) table.style.display = "none";
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }

  if (table) table.style.display = "table";
  if (emptyEl) emptyEl.style.display = "none";

  if (tbody) {
    tbody.innerHTML = "";
    orders.reverse().forEach(function(order) {
      var date = new Date(order.date);
      var dateStr = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });

      var statusClass = "status-" + order.status;
      var statusLabel = {
        pending: "Menunggu",
        confirmed: "Dikonfirmasi",
        shipped: "Dikirim",
        completed: "Selesai"
      };

      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td><strong>' + order.id + '</strong></td>' +
        '<td>' + order.customer.name + '<br><small>' + order.customer.phone + '</small></td>' +
        '<td>' + formatPrice(order.total) + '</td>' +
        '<td><span class="status-badge ' + statusClass + '">' + (statusLabel[order.status] || order.status) + '</span></td>' +
        '<td>' + dateStr + '</td>';
      tbody.appendChild(tr);
    });
  }
}

function saveProduct(event) {
  event.preventDefault();

  var editId = document.getElementById("editId").value;
  var name = document.getElementById("prodName").value.trim();
  var category = document.getElementById("prodCategory").value;
  var price = parseInt(document.getElementById("prodPrice").value);
  var stock = parseInt(document.getElementById("prodStock").value);
  var desc = document.getElementById("prodDesc").value.trim();
  var image = document.getElementById("prodImage").value.trim();

  if (!name || !category || isNaN(price) || isNaN(stock)) {
    showToast("Mohon lengkapi data produk!");
    return;
  }

  var products = getProducts();

  if (editId) {
    var idx = products.findIndex(function(p) { return p.id === parseInt(editId); });
    if (idx !== -1) {
      products[idx].name = name;
      products[idx].category = category;
      products[idx].price = price;
      products[idx].stock = stock;
      products[idx].description = desc;
      products[idx].image = image;
      showToast("Produk berhasil diperbarui!");
    }
  } else {
    var maxId = 0;
    products.forEach(function(p) { if (p.id > maxId) maxId = p.id; });

    products.push({
      id: maxId + 1,
      name: name,
      category: category,
      price: price,
      stock: stock,
      description: desc || "Produk berkualitas dengan harga terjangkau.",
      image: image,
      rating: 5.0,
      sold: 0
    });
    showToast("Produk berhasil ditambahkan!");
  }

  saveProducts(products);
  resetForm();
  renderProductTable();
  renderAdminStats();
}

function editProduct(id) {
  var products = getProducts();
  var product = products.find(function(p) { return p.id === id; });
  if (!product) return;

  document.getElementById("editId").value = product.id;
  document.getElementById("prodName").value = product.name;
  document.getElementById("prodCategory").value = product.category;
  document.getElementById("prodPrice").value = product.price;
  document.getElementById("prodStock").value = product.stock;
  document.getElementById("prodDesc").value = product.description || "";
  document.getElementById("prodImage").value = product.image || "";
  document.getElementById("formTitle").textContent = "✏️ Edit Produk: " + product.name;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(id) {
  if (!confirm("Yakin ingin menghapus produk ini?")) return;

  var products = getProducts();
  products = products.filter(function(p) { return p.id !== id; });
  saveProducts(products);

  renderProductTable();
  renderAdminStats();
  showToast("Produk berhasil dihapus!");
}

function resetForm() {
  document.getElementById("productForm").reset();
  document.getElementById("editId").value = "";
  document.getElementById("formTitle").textContent = "➕ Tambah Produk Baru";
}

function searchAdminProducts() {
  var query = document.getElementById("adminSearch").value.toLowerCase();
  var products = getProducts();
  var tbody = document.getElementById("productTableBody");

  if (!query) {
    renderProductTable();
    return;
  }

  var filtered = products.filter(function(p) {
    return p.name.toLowerCase().indexOf(query) !== -1 ||
           p.category.toLowerCase().indexOf(query) !== -1;
  });

  if (tbody) {
    tbody.innerHTML = "";
    filtered.forEach(function(p) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td><strong>' + p.name + '</strong></td>' +
        '<td>' + getCategoryName(p.category) + '</td>' +
        '<td>' + formatPrice(p.price) + '</td>' +
        '<td>' + p.stock + '</td>' +
        '<td>' +
          '<div class="table-actions">' +
            '<button class="btn btn-primary btn-sm" onclick="editProduct(' + p.id + ')">Edit</button>' +
            '<button class="btn btn-danger btn-sm" onclick="deleteProduct(' + p.id + ')">Hapus</button>' +
          '</div>' +
        '</td>';
      tbody.appendChild(tr);
    });
  }
}
