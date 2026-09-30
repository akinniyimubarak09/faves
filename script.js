/* =========================
   BOLMERY KITCHEN
   MAIN JAVASCRIPT
========================= */


/* =========================
   RESTAURANT SETTINGS
========================= */

// Replace this with your actual WhatsApp number.
// Use international format without the + sign.
const restaurantNumber = "2347053979600";


/* =========================
   MENU DATA
========================= */

const menuItems = [

  {
    id: 1,
    name: "Jollof & Grilled Chicken",
    description: "Smoky Nigerian jollof rice with juicy grilled chicken.",
    price: 6500,
    category: "rice",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 2,
    name: "Creamy Chicken Pasta",
    description: "Creamy pasta tossed with tender chicken and herbs.",
    price: 7200,
    category: "mains",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 3,
    name: "Crispy Chicken Burger",
    description: "Crispy chicken, fresh vegetables and signature sauce.",
    price: 5800,
    category: "mains",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 4,
    name: "Loaded Beef Fries",
    description: "Crispy fries loaded with seasoned beef and sauce.",
    price: 5000,
    category: "sides",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 5,
    name: "Pepper Soup",
    description: "Hot and spicy Nigerian pepper soup.",
    price: 4500,
    category: "mains",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 6,
    name: "Prawn Fried Rice",
    description: "Fragrant fried rice loaded with juicy prawns.",
    price: 7500,
    category: "rice",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 7,
    name: "Plantain & Suya",
    description: "Sweet fried plantain served with spicy suya.",
    price: 4200,
    category: "sides",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 8,
    name: "Fresh Zobo Cooler",
    description: "Refreshing Nigerian hibiscus drink.",
    price: 1800,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=85"
  }

];


/* =========================
   CART
========================= */

let cart = JSON.parse(localStorage.getItem("bolmeryCart")) || [];


/* =========================
   ELEMENTS
========================= */

const menuGrid = document.getElementById("menuGrid");

const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");

const overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");

const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");

const checkoutForm = document.getElementById("checkoutForm");

const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");


/* =========================
   FORMAT PRICE
========================= */

function formatPrice(price) {
  return "₦" + price.toLocaleString("en-NG");
}


/* =========================
   DISPLAY MENU
========================= */

function displayMenu(category = "all") {

  const filteredItems =
    category === "all"
      ? menuItems
      : menuItems.filter(item => item.category === category);

  menuGrid.innerHTML = "";

  filteredItems.forEach(item => {

    const card = document.createElement("article");

    card.className = "menu-card";

    card.innerHTML = `

      <div class="menu-img">

        <img
          src="${item.image}"
          alt="${item.name}"
          loading="lazy"
        >

        <span class="menu-category">
          ${item.category}
        </span>

      </div>

      <div class="menu-info">

        <h3>${item.name}</h3>

        <p>
          ${item.description}
        </p>

        <div class="menu-bottom">

          <span class="menu-price">
            ${formatPrice(item.price)}
          </span>

          <button
            class="add-btn"
            onclick="addToCart(${item.id})"
            aria-label="Add ${item.name} to cart"
          >
            +
          </button>

        </div>

      </div>

    `;

    menuGrid.appendChild(card);

  });

}


/* =========================
   ADD TO CART
========================= */

function addToCart(id) {

  const item = menuItems.find(product => product.id === id);

  if (!item) return;

  const existing = cart.find(product => product.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...item,
      quantity: 1
    });
  }

  saveCart();
  updateCart();

  openCart();

}


/* =========================
   REMOVE FROM CART
========================= */

function removeFromCart(id) {

  cart = cart.filter(item => item.id !== id);

  saveCart();
  updateCart();

}


/* =========================
   CHANGE QUANTITY
========================= */

function changeQuantity(id, amount) {

  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart();
  updateCart();

}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );


  cartCount.textContent = totalItems;

  cartTotal.textContent = formatPrice(totalPrice);


  if (cart.length === 0) {

    cartItems.innerHTML = `

      <div class="empty-cart">

        <div>🛒</div>

        <h3>Your cart is empty</h3>

        <p>
          Add something delicious from our menu.
        </p>

      </div>

    `;

    return;
  }


  cartItems.innerHTML = "";


  cart.forEach(item => {

    const element = document.createElement("div");

    element.className = "cart-item";

    element.innerHTML = `

      <img
        src="${item.image}"
        alt="${item.name}"
      >

      <div class="cart-item-info">

        <h4>${item.name}</h4>

        <p>
          ${formatPrice(item.price * item.quantity)}
        </p>

        <div class="quantity">

          <button
            onclick="changeQuantity(${item.id}, -1)"
          >
            −
          </button>

          <span>${item.quantity}</span>

          <button
            onclick="changeQuantity(${item.id}, 1)"
          >
            +
          </button>

        </div>

      </div>

      <button
        class="remove-item"
        onclick="removeFromCart(${item.id})"
      >
        ×
      </button>

    `;

    cartItems.appendChild(element);

  });

}


/* =========================
   LOCAL STORAGE
========================= */

function saveCart() {

  localStorage.setItem(
    "bolmeryCart",
    JSON.stringify(cart)
  );

}


/* =========================
   OPEN CART
========================= */

function openCart() {

  cartDrawer.classList.add("open");
  overlay.classList.add("show");

  document.body.style.overflow = "hidden";

}


/* =========================
   CLOSE CART
========================= */

function closeCartDrawer() {

  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");

  document.body.style.overflow = "";

}


/* =========================
   CART EVENTS
========================= */

cartBtn.addEventListener(
  "click",
  openCart
);

closeCart.addEventListener(
  "click",
  closeCartDrawer
);

overlay.addEventListener(
  "click",
  closeCartDrawer
);


/* =========================
   MENU FILTERS
========================= */

document.querySelectorAll(".filter").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll(".filter")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    displayMenu(
      button.dataset.category
    );

  });

});


/* =========================
   CHECKOUT
========================= */

checkoutBtn.addEventListener("click", () => {

  if (cart.length === 0) {

    alert("Your cart is empty. Add a meal first.");

    return;
  }

  checkoutModal.classList.add("show");

});


closeCheckout.addEventListener("click", () => {

  checkoutModal.classList.remove("show");

});


checkoutModal.addEventListener("click", event => {

  if (event.target === checkoutModal) {

    checkoutModal.classList.remove("show");

  }

});


/* =========================
   WHATSAPP ORDER
========================= */

checkoutForm.addEventListener("submit", event => {

  event.preventDefault();


  const name =
    document.getElementById("customerName").value.trim();

  const phone =
    document.getElementById("customerPhone").value.trim();

  const address =
    document.getElementById("customerAddress").value.trim();

  const note =
    document.getElementById("customerNote").value.trim();


  let message = `🍽️ *NEW ORDER - BOLMERY KITCHEN*%0A%0A`;

  message += `👤 *Name:* ${name}%0A`;
  message += `📞 *Phone:* ${phone}%0A`;
  message += `📍 *Address:* ${address}%0A%0A`;

  message += `🛒 *ORDER:*%0A`;


  cart.forEach(item => {

    message +=
      `• ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}%0A`;

  });


  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );


  message += `%0A💰 *TOTAL: ${formatPrice(total)}*%0A`;


  if (note) {

    message +=
      `%0A📝 *Note:* ${note}%0A`;

  }


  message += `%0AThank you!`;


  const whatsappURL =
    `https://wa.me/${restaurantNumber}?text=${message}`;


  window.open(
    whatsappURL,
    "_blank"
  );

});


/* =========================
   MOBILE MENU
========================= */

menuBtn.addEventListener("click", () => {

  mobileNav.classList.toggle("show");

});


document.querySelectorAll(".mobile-nav a").forEach(link => {

  link.addEventListener("click", () => {

    mobileNav.classList.remove("show");

  });

});


/* =========================
   HEADER SCROLL
========================= */

window.addEventListener("scroll", () => {

  const header =
    document.getElementById("header");

  if (window.scrollY > 30) {

    header.classList.add("scrolled");

  } else {

    header.classList.remove("scrolled");

  }

});


/* =========================
   SCROLL REVEAL
========================= */

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

        }

      });

    },
    {
      threshold: 0.12
    }
  );


document
  .querySelectorAll(".reveal")
  .forEach(element => {

    observer.observe(element);

  });


/* =========================
   LOADER
========================= */

window.addEventListener("load", () => {

  setTimeout(() => {

    document
      .getElementById("loader")
      .classList.add("hide");

  }, 700);

});


/* =========================
   INITIALIZE
========================= */

displayMenu();

updateCart();
