/* ============================================
   TokoKu - Product Data & Configuration
   ============================================ */

var STORE_CONFIG = {
  name: "TokoKu",
  phone: "6281234567890",
  currency: "Rp",
  shippingFree: 100000,
  shippingCost: 15000
};

var CATEGORIES = [
  { id: "fashion", name: "Fashion", icon: "👕" },
  { id: "elektronik", name: "Elektronik", icon: "📱" },
  { id: "makanan", name: "Makanan", icon: "🍜" },
  { id: "aksesoris", name: "Aksesoris", icon: "💍" }
];

var DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Kaos Polos Premium Cotton",
    category: "fashion",
    price: 89000,
    stock: 150,
    description: "Kaos polos premium berbahan cotton combed 30s. Nyaman dipakai sehari-hari dengan jahitan rapih dan bahan yang adem. Tersedia berbagai ukuran.",
    image: "",
    rating: 4.8,
    sold: 324
  },
  {
    id: 2,
    name: "Celana Jeans Slim Fit",
    category: "fashion",
    price: 175000,
    stock: 80,
    description: "Celana jeans slim fit dengan bahan stretch yang nyaman. Model terkini cocok untuk casual maupun semi-formal.",
    image: "",
    rating: 4.6,
    sold: 189
  },
  {
    id: 3,
    name: "Jaket Hoodie Fleece",
    category: "fashion",
    price: 145000,
    stock: 65,
    description: "Hoodie fleece tebal dan hangat. Cocok untuk musim hujan atau udara dingin. Bahan lembut dan nyaman.",
    image: "",
    rating: 4.9,
    sold: 512
  },
  {
    id: 4,
    name: "Earphone Bluetooth TWS",
    category: "elektronik",
    price: 125000,
    stock: 200,
    description: "Earphone bluetooth TWS dengan bass yang mantap. Battery tahan hingga 6 jam. Dilengkapi charging case.",
    image: "",
    rating: 4.5,
    sold: 743
  },
  {
    id: 5,
    name: "Powerbank 10000mAh Fast Charging",
    category: "elektronik",
    price: 150000,
    stock: 120,
    description: "Powerbank kapasitas besar 10000mAh dengan fitur fast charging 22.5W. Compact dan ringan untuk dibawa kemana saja.",
    image: "",
    rating: 4.7,
    sold: 456
  },
  {
    id: 6,
    name: "Kabel Data Type-C Fast Charging",
    category: "elektronik",
    price: 35000,
    stock: 500,
    description: "Kabel data USB Type-C mendukung fast charging hingga 65W. Panjang 1 meter dengan material nylon braided yang tahan lama.",
    image: "",
    rating: 4.4,
    sold: 1250
  },
  {
    id: 7,
    name: "Keripik Singkong Pedas 250g",
    category: "makanan",
    price: 25000,
    stock: 300,
    description: "Keripik singkong renyah dengan bumbu pedas khas. Cocok untuk cemilan saat santai. Kemasan resealable.",
    image: "",
    rating: 4.8,
    sold: 892
  },
  {
    id: 8,
    name: "Kopi Arabica Premium 200g",
    category: "makanan",
    price: 65000,
    stock: 90,
    description: "Kopi arabica premium dari dataran tinggi Gayo. Roasting medium, aroma harum dengan rasa yang kaya dan lembut.",
    image: "",
    rating: 4.9,
    sold: 367
  },
  {
    id: 9,
    name: "Sambal Matah Bali 200ml",
    category: "makanan",
    price: 32000,
    stock: 180,
    description: "Sambal matah khas Bali dengan bahan segar pilihan. Pedas, segar, dan cocok untuk segala makanan.",
    image: "",
    rating: 4.7,
    sold: 534
  },
  {
    id: 10,
    name: "Topi Baseball Cap Unisex",
    category: "aksesoris",
    price: 45000,
    stock: 200,
    description: "Topi baseball cap dengan bahan twill cotton. Adjustable strap untuk kenyamanan. Cocok untuk pria dan wanita.",
    image: "",
    rating: 4.5,
    sold: 278
  },
  {
    id: 11,
    name: "Tas Selempang Mini Canvas",
    category: "aksesoris",
    price: 78000,
    stock: 100,
    description: "Tas selempang mini berbahan canvas tebal. Compact tapi muat banyak. Cocok untuk jalan-jalan dan daily use.",
    image: "",
    rating: 4.6,
    sold: 445
  },
  {
    id: 12,
    name: "Gelang Kulit Handmade",
    category: "aksesoris",
    price: 55000,
    stock: 75,
    description: "Gelang kulit asli buatan tangan. Desain elegan dan cocok untuk pria maupun wanita. Kualitas premium.",
    image: "",
    rating: 4.8,
    sold: 198
  }
];

function getProducts() {
  var saved = localStorage.getItem("tokoku_products");
  if (saved) {
    return JSON.parse(saved);
  }
  localStorage.setItem("tokoku_products", JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem("tokoku_products", JSON.stringify(products));
}

function getOrders() {
  var saved = localStorage.getItem("tokoku_orders");
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

function saveOrders(orders) {
  localStorage.setItem("tokoku_orders", JSON.stringify(orders));
}

function formatPrice(price) {
  return STORE_CONFIG.currency + " " + price.toLocaleString("id-ID");
}

function generateOrderId() {
  return "TK" + Date.now().toString(36).toUpperCase();
}

function getCategoryIcon(categoryId) {
  var cat = CATEGORIES.find(function(c) { return c.id === categoryId; });
  return cat ? cat.icon : "📦";
}

function getCategoryName(categoryId) {
  var cat = CATEGORIES.find(function(c) { return c.id === categoryId; });
  return cat ? cat.name : categoryId;
}
