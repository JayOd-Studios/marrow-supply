/* Marrow Supply — sample storefront behaviour.
   A cart that actually adds up, filters, a drawer, a toast and a sample form. */

(function () {
  "use strict";

  var FREE_SHIPPING = 60;
  var cart = [];

  var countEl = document.getElementById("cartCount");
  var itemsEl = document.getElementById("cartItems");
  var emptyEl = document.getElementById("cartEmpty");
  var totalEl = document.getElementById("cartTotal");
  var shipEl = document.getElementById("shipNote");
  var drawer = document.getElementById("cart");
  var scrim = document.getElementById("scrim");
  var cartBtn = document.getElementById("cartBtn");
  var closeBtn = document.getElementById("closeCart");
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function money(value) {
    return "$" + value.toFixed(value % 1 === 0 ? 0 : 2);
  }

  function announce(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }

  /* ---------- Cart state ---------- */

  function findItem(id) {
    for (var i = 0; i < cart.length; i += 1) {
      if (cart[i].id === id) return cart[i];
    }
    return null;
  }

  function subtotal() {
    return cart.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
  }

  function renderCart() {
    var totalQty = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    countEl.textContent = String(totalQty);

    itemsEl.textContent = "";
    cart.forEach(function (item) {
      var row = document.createElement("li");
      row.className = "cart-item";

      var thumb = document.createElement("div");
      thumb.className = "cart-thumb";
      thumb.setAttribute("aria-hidden", "true");

      var info = document.createElement("div");
      var name = document.createElement("h3");
      name.textContent = item.name;
      var unit = document.createElement("p");
      unit.className = "unit";
      unit.textContent = money(item.price) + " each";
      var qty = document.createElement("div");
      qty.className = "qty";

      var minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.setAttribute("aria-label", "One fewer " + item.name);
      minus.setAttribute("data-act", "minus");
      minus.setAttribute("data-id", item.id);

      var amount = document.createElement("span");
      amount.textContent = String(item.qty);
      amount.setAttribute("aria-live", "polite");

      var plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.setAttribute("aria-label", "One more " + item.name);
      plus.setAttribute("data-act", "plus");
      plus.setAttribute("data-id", item.id);

      qty.append(minus, amount, plus);
      info.append(name, unit, qty);

      var line = document.createElement("p");
      line.className = "line-total";
      line.textContent = money(item.price * item.qty);

      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove";
      remove.textContent = "Remove";
      remove.setAttribute("data-act", "remove");
      remove.setAttribute("data-id", item.id);

      row.append(thumb, info, line, remove);
      itemsEl.appendChild(row);
    });

    var empty = cart.length === 0;
    emptyEl.hidden = !empty;
    itemsEl.hidden = empty;
    totalEl.textContent = money(subtotal());

    if (empty || subtotal() >= FREE_SHIPPING) {
      shipEl.hidden = empty;
      shipEl.textContent = empty ? "" : "Free shipping applied.";
    } else {
      shipEl.hidden = false;
      shipEl.textContent = "You're " + money(FREE_SHIPPING - subtotal()) + " from free shipping.";
    }
  }

  function addItem(button) {
    var id = button.getAttribute("data-id");
    var existing = findItem(id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: id,
        name: button.getAttribute("data-name"),
        price: Number(button.getAttribute("data-price")),
        qty: 1
      });
    }
    renderCart();
    announce(button.getAttribute("data-name") + " added to your bag.");
    openCart();
  }

  /* ---------- Drawer ---------- */

  var lastFocus = null;

  function openCart() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    scrim.hidden = false;
    cartBtn.setAttribute("aria-expanded", "true");
    closeBtn.focus();
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    if (drawer.hidden) return;
    drawer.hidden = true;
    scrim.hidden = true;
    cartBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  cartBtn.addEventListener("click", function () {
    if (drawer.hidden) openCart(); else closeCart();
  });
  closeBtn.addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeCart();
  });

  /* Keep focus inside the drawer while it is open. */
  drawer.addEventListener("keydown", function (event) {
    if (event.key !== "Tab") return;
    var focusable = drawer.querySelectorAll("button, [href], input");
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ---------- Add to bag + quantity controls ---------- */

  Array.prototype.forEach.call(document.querySelectorAll(".add"), function (button) {
    button.addEventListener("click", function () { addItem(button); });
  });

  itemsEl.addEventListener("click", function (event) {
    var button = event.target.closest("button[data-act]");
    if (!button) return;
    var item = findItem(button.getAttribute("data-id"));
    if (!item) return;
    var act = button.getAttribute("data-act");

    if (act === "plus") item.qty += 1;
    if (act === "minus") item.qty -= 1;
    if (act === "remove" || item.qty < 1) {
      cart = cart.filter(function (other) { return other.id !== item.id; });
      announce(item.name + " removed from your bag.");
    }
    renderCart();
  });

  document.getElementById("checkout").addEventListener("click", function () {
    announce(cart.length ? "This is a sample — no payment is taken." : "Your bag is empty.");
  });

  var shopLink = document.getElementById("shopLink");
  if (shopLink) shopLink.addEventListener("click", closeCart);

  /* ---------- Shop filter + search ---------- */

  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-filter]"));
  var products = Array.prototype.slice.call(document.querySelectorAll(".product"));
  var search = document.getElementById("q");
  var emptyShop = document.getElementById("shopEmpty");
  var resetShop = document.getElementById("resetShop");
  var category = "all";

  function filterShop() {
    var term = (search && search.value ? search.value : "").trim().toLowerCase();
    var shown = 0;

    products.forEach(function (product) {
      var matchesCat = category === "all" || product.getAttribute("data-cat") === category;
      var matchesTerm = !term || product.textContent.toLowerCase().indexOf(term) !== -1;
      var visible = matchesCat && matchesTerm;
      product.hidden = !visible;
      if (visible) shown += 1;
    });

    emptyShop.hidden = shown !== 0;
    chips.forEach(function (chip) {
      chip.setAttribute("aria-pressed", String(chip.getAttribute("data-filter") === category));
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      category = chip.getAttribute("data-filter");
      filterShop();
    });
  });

  if (search) search.addEventListener("input", filterShop);
  if (resetShop) {
    resetShop.addEventListener("click", function () {
      category = "all";
      if (search) search.value = "";
      filterShop();
    });
  }

  /* ---------- Mobile nav ---------- */

  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("siteNav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.querySelector(".sr").textContent = open ? "Close menu" : "Open menu";
    });
    nav.addEventListener("click", function (event) {
      if (!event.target.closest("a")) return;
      nav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.querySelector(".sr").textContent = "Open menu";
    });
  }

  /* ---------- Signup ---------- */

  var form = document.getElementById("signupForm");
  var email = document.getElementById("email");
  var error = document.getElementById("emailError");
  var fine = form ? form.querySelector(".fine") : null;

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        error.textContent = "That address looks incomplete — try name@example.com.";
        email.setAttribute("aria-invalid", "true");
        email.focus();
        return;
      }
      error.textContent = "";
      email.removeAttribute("aria-invalid");
      email.value = "";
      if (fine) fine.textContent = "Thank you — a live shop would send a confirmation. This sample sends nothing.";
    });
    email.addEventListener("input", function () {
      if (email.getAttribute("aria-invalid") === "true") {
        error.textContent = "";
        email.removeAttribute("aria-invalid");
      }
    });
  }

  renderCart();
})();
