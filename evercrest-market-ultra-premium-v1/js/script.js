
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("show");
      mainNav.classList.toggle("open");
    });
  }

  const modal = document.getElementById("quickViewModal");
  const closeBtn = document.getElementById("quickViewClose");
  const quickViewBtns = document.querySelectorAll(".quick-view-btn");
  const quickViewImage = document.getElementById("quickViewImage");
  const quickViewTitle = document.getElementById("quickViewTitle");
  const quickViewPrice = document.getElementById("quickViewPrice");
  const quickViewText = document.getElementById("quickViewText");
  const quickViewAdd = document.getElementById("quickViewAdd");
  const quickViewProductLink = document.getElementById("quickViewProductLink");

  quickViewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      if (!card || !modal) return;
      const image = card.dataset.image || card.querySelector("img")?.getAttribute("src") || "";
      const title = card.dataset.title || card.querySelector("h4")?.textContent || "Product";
      const price = card.dataset.priceLabel || card.querySelector(".product-meta span")?.textContent || "$0.00";
      const desc = card.dataset.description || card.querySelector(".product-info p")?.textContent || "Product description preview goes here.";
      if (quickViewImage) { quickViewImage.src = image; quickViewImage.alt = title; }
      if (quickViewTitle) quickViewTitle.textContent = title;
      if (quickViewPrice) quickViewPrice.textContent = price;
      if (quickViewText) quickViewText.textContent = desc;
      const productId = card.dataset.productId || "minimal-lamp";
      if (quickViewAdd) quickViewAdd.dataset.productId = productId;
      if (quickViewProductLink) quickViewProductLink.href = `product.html?id=${productId}`;
      modal.classList.add("show");
    });
  });
  if (closeBtn && modal) closeBtn.addEventListener("click", () => modal.classList.remove("show"));
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal) modal.classList.remove("show"); });
});
