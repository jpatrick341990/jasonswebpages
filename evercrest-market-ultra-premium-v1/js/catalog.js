(function () {
  const MANAGED_PRODUCTS_KEY = "evercrestManagedProducts";
  const CUSTOM_PRODUCTS_KEY = "evercrestCustomProducts";
  const CART_KEY = "evercrestCart";
  const WISHLIST_KEY = "evercrestWishlist";
  const ORDERS_KEY = "evercrestOrders";

  const defaultProducts = [
    {id:"minimal-lamp",title:"Minimal Lamp",category:"home",price:49.99,stock:12,image:"images/product-1.jpg",gallery:["images/product-1.jpg","images/product-9.jpg","images/product-13.jpg"],description:"Modern desk lamp with warm ambient lighting and a clean, elevated look for any room.",rating:4.9,reviews:284,featured:true,onSale:true,badge:"Best Seller",keywords:["lamp","lighting","desk","home"]},
    {id:"premium-hoodie",title:"Premium Hoodie",category:"fashion",price:64.00,stock:18,image:"images/product-2.jpg",gallery:["images/product-2.jpg","images/product-10.jpg","images/product-14.jpg"],description:"Soft heavyweight hoodie with a modern fit and clean boutique styling.",rating:4.8,reviews:193,featured:true,onSale:true,badge:"New",keywords:["hoodie","fashion","apparel","streetwear"]},
    {id:"wireless-earbuds",title:"Wireless Earbuds",category:"tech",price:89.99,stock:22,image:"images/product-3.jpg",gallery:["images/product-3.jpg","images/product-11.jpg","images/product-15.jpg"],description:"Premium wireless earbuds with rich sound, deep bass, and a sleek everyday design.",rating:4.9,reviews:241,featured:true,onSale:true,badge:"Top Rated",keywords:["earbuds","audio","wireless","tech"]},
    {id:"travel-bag",title:"Travel Bag",category:"accessories",price:129.99,stock:8,image:"images/product-4.jpg",gallery:["images/product-4.jpg","images/product-12.jpg","images/product-16.jpg"],description:"Structured travel bag with a premium look, organized storage, and everyday carry comfort.",rating:4.7,reviews:167,featured:true,onSale:true,badge:"Sale",keywords:["bag","travel","accessory","carry"]},
    {id:"ceramic-planter",title:"Ceramic Planter",category:"home",price:39.00,stock:16,image:"images/product-5.jpg",gallery:["images/product-5.jpg","images/product-1.jpg","images/product-13.jpg"],description:"Minimal ceramic planter for modern interiors, shelves, and window-side styling.",rating:4.8,reviews:118,featured:false,onSale:false,badge:"Featured",keywords:["planter","decor","home","ceramic"]},
    {id:"leather-wallet",title:"Leather Wallet",category:"accessories",price:59.00,stock:26,image:"images/product-6.jpg",gallery:["images/product-6.jpg","images/product-8.jpg","images/product-14.jpg"],description:"Slim premium wallet made from full grain leather with a clean profile.",rating:4.7,reviews:142,featured:false,onSale:false,badge:"New",keywords:["wallet","leather","accessories"]},
    {id:"desk-organizer",title:"Desk Organizer",category:"home",price:44.00,stock:14,image:"images/product-7.jpg",gallery:["images/product-7.jpg","images/product-1.jpg","images/product-15.jpg"],description:"Clean wooden desk organizer for workspace setups, shelves, and office essentials.",rating:4.8,reviews:126,featured:false,onSale:false,badge:"Top Pick",keywords:["desk","organizer","workspace","home"]},
    {id:"minimal-watch",title:"Minimal Watch",category:"accessories",price:149.00,stock:6,image:"images/product-8.jpg",gallery:["images/product-8.jpg","images/product-6.jpg","images/product-16.jpg"],description:"Premium minimalist watch with stainless case and everyday luxury appeal.",rating:4.9,reviews:98,featured:false,onSale:false,badge:"Luxury",keywords:["watch","minimal","accessories","timepiece"]},
    {id:"accent-chair",title:"Modern Lamp",category:"home",price:219.00,stock:7,image:"images/product-9.jpg",gallery:["images/product-9.jpg","images/product-1.jpg","images/product-5.jpg"],description:"Refined modern lamp with a sculptural silhouette and warm boutique-style glow.",rating:4.8,reviews:84,featured:true,onSale:false,badge:"Editor Pick",keywords:["lamp","lighting","home","living room"]},
    {id:"oversized-jacket",title:"Oversized Jacket",category:"fashion",price:98.00,stock:11,image:"images/product-10.jpg",gallery:["images/product-10.jpg","images/product-2.jpg","images/product-14.jpg"],description:"Clean-cut oversized jacket built for layering and elevated casual wear.",rating:4.7,reviews:75,featured:false,onSale:true,badge:"Trending",keywords:["jacket","fashion","outerwear"]},
    {id:"noise-cancel-headphones",title:"Noise Cancel Headphones",category:"tech",price:179.00,stock:13,image:"images/product-11.jpg",gallery:["images/product-11.jpg","images/product-3.jpg","images/product-15.jpg"],description:"Immersive over-ear headphones with premium detail and strong daily comfort.",rating:4.9,reviews:211,featured:true,onSale:false,badge:"Top Rated",keywords:["headphones","audio","noise cancelling","tech"]},
    {id:"commuter-backpack",title:"Commuter Backpack",category:"accessories",price:94.00,stock:17,image:"images/product-12.jpg",gallery:["images/product-12.jpg","images/product-4.jpg","images/product-16.jpg"],description:"Organized commuter backpack with a streamlined shape and travel-ready storage.",rating:4.8,reviews:132,featured:false,onSale:true,badge:"Popular",keywords:["backpack","travel","commute","bag"]},
    {id:"stoneware-dinner-set",title:"3 Piece Ceramic Planters",category:"home",price:86.00,stock:15,image:"images/product-13.jpg",gallery:["images/product-13.jpg","images/product-5.jpg","images/product-9.jpg"],description:"Three coordinated ceramic planters designed to elevate shelves, desks, and window-side styling.",rating:4.6,reviews:67,featured:false,onSale:true,badge:"Dining",keywords:["planters","ceramic","home","decor"]},
    {id:"linen-shirt",title:"Dark Leather Wallet",category:"accessories",price:54.00,stock:20,image:"images/product-14.jpg",gallery:["images/product-14.jpg","images/product-6.jpg","images/product-10.jpg"],description:"Dark leather wallet with a polished finish, slim profile, and everyday carry appeal.",rating:4.7,reviews:109,featured:false,onSale:false,badge:"Fresh Drop",keywords:["wallet","leather","accessories"]},
    {id:"smart-desk-speaker",title:"Smart Desk Speaker",category:"tech",price:119.00,stock:9,image:"images/product-15.jpg",gallery:["images/product-15.jpg","images/product-3.jpg","images/product-11.jpg"],description:"Compact desk speaker with crisp sound and a premium look for modern setups.",rating:4.8,reviews:95,featured:false,onSale:true,badge:"Desk Tech",keywords:["speaker","desk","audio","tech"]},
    {id:"weekender-duffel",title:"Weekender Duffel",category:"accessories",price:139.00,stock:10,image:"images/product-16.jpg",gallery:["images/product-16.jpg","images/product-4.jpg","images/product-12.jpg"],description:"Premium weekender duffel for road trips, carry-ons, and sharp everyday travel.",rating:4.9,reviews:121,featured:true,onSale:false,badge:"Travel Pick",keywords:["duffel","travel","weekender","accessories"]}
  ];

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getManagedProducts() {
    const existing = readJson(MANAGED_PRODUCTS_KEY, null);
    if (existing && existing.length) {
      const migrated = migrateManagedProducts(existing);
      if (migrated.changed) saveManagedProducts(migrated.products);
      return migrated.products;
    }
    const seeded = defaultProducts.map((item) => ({ ...item, isCustom: false }));
    writeJson(MANAGED_PRODUCTS_KEY, seeded);
    return seeded;
  }

  function saveManagedProducts(products) {
    writeJson(MANAGED_PRODUCTS_KEY, products);
    writeJson(CUSTOM_PRODUCTS_KEY, products.filter((item) => item.isCustom));
  }

  function migrateManagedProducts(products) {
    let changed = false;
    const next = (products || []).map((item) => {
      if (!item || item.isCustom) return item;
      if (item.id === "accent-chair") {
        changed = true;
        return { ...item, title: "Modern Lamp", category: "home", image: "images/product-9.jpg", description: "Refined modern lamp with a sculptural silhouette and warm boutique-style glow.", keywords: ["lamp","lighting","home","living room"] };
      }
      if (item.id === "stoneware-dinner-set") {
        changed = true;
        return { ...item, title: "3 Piece Ceramic Planters", category: "home", image: "images/product-13.jpg", description: "Three coordinated ceramic planters designed to elevate shelves, desks, and window-side styling.", keywords: ["planters","ceramic","home","decor"] };
      }
      if (item.id === "linen-shirt") {
        changed = true;
        return { ...item, title: "Dark Leather Wallet", category: "accessories", image: "images/product-14.jpg", gallery: ["images/product-14.jpg","images/product-6.jpg","images/product-10.jpg"], description: "Dark leather wallet with a polished finish, slim profile, and everyday carry appeal.", keywords: ["wallet","leather","accessories"] };
      }
      return item;
    });
    return { products: next, changed };
  }

  function getCustomProducts() {
    return getManagedProducts().filter((item) => item.isCustom);
  }

  function saveCustomProducts(products) {
    const baseProducts = getManagedProducts().filter((item) => !item.isCustom);
    saveManagedProducts([...baseProducts, ...products.map((item) => ({ ...item, isCustom: true }))]);
  }

  function getAllProducts() {
    return getManagedProducts();
  }

  function findProduct(id) {
    return getManagedProducts().find((item) => item.id === id);
  }

  function addProduct(product) {
    const next = [{ ...product, isCustom: true }, ...getManagedProducts()];
    saveManagedProducts(next);
    return product;
  }

  function updateProduct(productId, updates) {
    const next = getManagedProducts().map((item) => item.id === productId ? { ...item, ...updates } : item);
    saveManagedProducts(next);
    return next.find((item) => item.id === productId) || null;
  }

  function deleteCustomProduct(productId) {
    const next = getManagedProducts().filter((item) => item.id !== productId);
    saveManagedProducts(next);
    const wishlist = getWishlist().filter((id) => id !== productId);
    saveWishlist(wishlist);
    const cart = getCart().filter((item) => item.id !== productId);
    saveCart(cart);
    return next;
  }

  function resetProducts() {
    const seeded = defaultProducts.map((item) => ({ ...item, isCustom: false }));
    saveManagedProducts(seeded);
    return seeded;
  }

  function getCart() {
    return readJson(CART_KEY, []);
  }

  function saveCart(items) {
    writeJson(CART_KEY, items);
  }

  function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === productId);
    if (existing) existing.quantity += quantity;
    else cart.push({ id: productId, quantity });
    saveCart(cart);
    return cart;
  }

  function updateCartQuantity(productId, quantity) {
    const cart = getCart().map((item) => item.id === productId ? { ...item, quantity } : item).filter((item) => item.quantity > 0);
    saveCart(cart);
    return cart;
  }

  function removeFromCart(productId) {
    const cart = getCart().filter((item) => item.id !== productId);
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function getWishlist() {
    return readJson(WISHLIST_KEY, []);
  }

  function saveWishlist(items) {
    writeJson(WISHLIST_KEY, items);
  }

  function toggleWishlist(productId) {
    const wishlist = getWishlist();
    const exists = wishlist.includes(productId);
    const next = exists ? wishlist.filter((id) => id !== productId) : [productId, ...wishlist];
    saveWishlist(next);
    return { wishlist: next, saved: !exists };
  }

  function removeFromWishlist(productId) {
    const next = getWishlist().filter((id) => id !== productId);
    saveWishlist(next);
    return next;
  }

  function getOrders() {
    return readJson(ORDERS_KEY, []);
  }

  function saveOrders(items) {
    writeJson(ORDERS_KEY, items);
  }

  function placeOrder(customer = {}) {
    const cart = getCart();
    if (!cart.length) return null;
    const lines = cart.map((item) => {
      const product = findProduct(item.id);
      return product ? { ...item, product } : null;
    }).filter(Boolean);
    const subtotal = lines.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal >= 100 ? 0 : 12;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    const orderNumber = `NM-${Date.now().toString().slice(-6)}`;
    const order = {
      id: orderNumber,
      createdAt: new Date().toISOString(),
      status: "Confirmed",
      customer,
      items: lines.map((item) => ({ id: item.id, quantity: item.quantity, title: item.product.title, price: item.product.price })),
      subtotal,
      shipping,
      tax,
      total,
    };
    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    clearCart();
    return order;
  }

  function getCartDetailed() {
    return getCart().map((item) => {
      const product = findProduct(item.id);
      return product ? { ...item, product } : null;
    }).filter(Boolean);
  }

  function getWishlistDetailed() {
    return getWishlist().map((id) => findProduct(id)).filter(Boolean);
  }

  window.NovaCatalog = {
    MANAGED_PRODUCTS_KEY,
    CUSTOM_PRODUCTS_KEY,
    CART_KEY,
    WISHLIST_KEY,
    ORDERS_KEY,
    defaultProducts,
    getCustomProducts,
    saveCustomProducts,
    getAllProducts,
    getManagedProducts,
    saveManagedProducts,
    resetProducts,
    findProduct,
    addProduct,
    updateProduct,
    deleteCustomProduct,
    slugify,
    getCart,
    getCartDetailed,
    saveCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getWishlist,
    getWishlistDetailed,
    saveWishlist,
    toggleWishlist,
    removeFromWishlist,
    getOrders,
    saveOrders,
    placeOrder,
  };
})();
